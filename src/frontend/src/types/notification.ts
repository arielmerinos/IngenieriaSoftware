/*
Nombre del programa: Impulsa tu futuro
Copyright (C) 2025 - Autores:
Merino Peña Kevin Ariel
Ortíz Montiel Diego Iain
Rodríguez Dimayuga Laura Itzel
Sosa Romo Juan Mario
Vargas Campos Miguel Angel

Este programa es software libre: puede redistribuirlo y/o modificarlo
bajo los términos de la Licencia Pública General de GNU v3 publicada por
la Free Software Foundation.

Este programa se distribuye con la esperanza de que sea útil,
pero SIN NINGUNA GARANTÍA; sin incluso la garantía implícita de
COMERCIABILIDAD o IDONEIDAD PARA UN PROPÓSITO PARTICULAR.
Consulte la Licencia Pública General de GNU para más detalles.

Debería haber recibido una copia de la Licencia Pública General de GNU
junto con este programa. Si no, consulte <https://www.gnu.org/licenses/>.
*/

/**
 * Contenido de la notificación
 */
export interface Notification {
    /** Id de la notificacion */
    id: number,
    /** Quien efectua la notificacion */
    author: NotificationActor,
    /** A quien le llega la notificacion */
    target: NotificationActor,
    /** Tipo de la notificacion */
    type: NotificationType,
    date: Date,
}

/**
 * Que es lo que se esta notificando
 */
export enum NotificationType {
    createdAccount = "createdAccount",
    Unknown = "Unknown",
}

export interface NotificationActor {
    id: number,
    type: NotificationActorType,
    name: string,
}

/**
 * Que clase de actor esta invloucrado en la notificación
 */
export enum NotificationActorType {
    User = "User",
    Organization = "Organization",
    Unknown = "Unknown",
}

/**
 * 
 * @param data JSON recibido del backend
 * @returns Tipo Notification para su uso en el frontend
 */
export function parseNotification(data: any): Notification {
    return {
        id: data.id,
        author: parseNotificationActor(data.actor),
        target: parseNotificationActor(data.target),
        type: parseNotificationType(data),
        date: new Date(data.timestamp),
    }
}

export function parseNotificationType(data: any): NotificationType {
    switch (data.verb) {
        case "createdAccount":
            return NotificationType.createdAccount;
        default:
            return NotificationType.Unknown;
    }
}

export function parseNotificationActor(data: any): NotificationActor {
    return {
        id: data.id,
        type: data.type || NotificationActorType.Unknown,
        name: data.name || "Unknown",
    };
}

// Ejemplo de notificaciones del backend
// [
//   {
//     "id": 5,
//     "actor": {
//       "id": 14,
//       "type": "User",
//       "name": "owo@owo.com"
//     },
//     "target": {
//       "id": 14,
//       "type": "User",
//       "name": "owo@owo.com"
//     },
//     "verb": "OwO",
//     "timestamp": "2025-06-04T07:07:33.983786Z"
//   },
//   {
//     "id": 4,
//     "actor": {
//       "id": 14,
//       "type": "User",
//       "name": "owo@owo.com"
//     },
//     "target": {
//       "id": 14,
//       "type": "User",
//       "name": "owo@owo.com"
//     },
//     "verb": "createdAccount",
//     "timestamp": "2025-06-04T07:07:33.979938Z"
//   }
// ]