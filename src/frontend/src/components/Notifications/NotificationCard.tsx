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

import { Notification, NotificationType } from "../../types/notification"

export function NotificationCard({ notification } : { notification: Notification }) {
    return (
        <div
            className="
                px-8 py-2 text-sm
                text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700
                [&+div]:border-t border-gray-100 dark:border-gray-600
                ">
            {(() => {
                switch (notification.type) {
                    case NotificationType.createdAccount:
                        return (
                            <p>
                                Felicidades <b>{notification.author.name}</b> por haber creado tu cuenta,
                                ahora formas parte de la comunidad de oportunidades mas grande de <b>Tangamandapio</b>.
                            </p>
                        );
                    case NotificationType.Unknown:
                        return (
                            <p>
                                Notificación Desconocida {notification.type}.
                            </p>
                        );
                    default:
                        return (
                            <p>
                                Tipo de Notificación Desconocida {notification.type}.
                            </p>
                        );
                }
            })()}
        </div>
    )
}