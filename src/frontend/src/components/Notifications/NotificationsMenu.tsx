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
import { Notification } from "../../types/notification"
import { NotificationCard } from "./NotificationCard"
export function NotificationsMenu({ notifications } : { notifications: Notification[] }) {
    
    return (
        <div className="relative">
            <div
                className="absolute left-1/2 -translate-x-1/2 mt-2 w-96 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-100 dark:border-gray-700">
                    {   notifications.length === 0 ?
                        <div className="px-8 py-2 text-sm text-gray-700 dark:text-gray-200">
                            No tienes notificaciones
                        </div>
                        :
                        notifications.map((notification) => (
                            <NotificationCard notification={notification} />
                        ))
                    }
            </div>
        </div>
    )
}