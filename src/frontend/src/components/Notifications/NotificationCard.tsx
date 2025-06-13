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
import { ClockIcon } from '@heroicons/react/outline';

export function NotificationCard({ notification } : { notification: Notification }) {

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

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
                                <b>{notification.type}</b>, <b>{notification.author.name}</b>, <b>{notification.target.name}</b>.
                            </p>
                        );
                    case NotificationType.newComment:
                        return (
                            <p>
                                <b>{notification.author.name}</b> ha comentado en tu oportunidad <b>{notification.target.name}</b>.
                            </p>
                        );
                    case NotificationType.addFollower:
                        return (
                            <p>
                                <b>{notification.author.name}</b> ahora sigue a tu organización <b>{notification.target.name}</b>.
                            </p>
                        );
                    case NotificationType.dropFollower:
                        return (
                            <p>
                                <b>{notification.author.name}</b> ha dejado de seguir a tu organización <b>{notification.target.name}</b>.
                            </p>
                        )
                    case NotificationType.givenAdmin:
                        return (
                            <p>
                                <b>{notification.author.name}</b> te ha convertido en administrador de la organización <b>{notification.object.name}</b>.
                            </p>
                        )
                    case NotificationType.lostAdmin:
                        return (
                            <p>
                                El usuario <b>{notification.author.name}</b> te ha retirado privilegios de administrador de la organización <b>{notification.object.name}</b>.
                            </p>
                        )
                    default:
                        return (
                            <p>
                                <b>{notification.type}</b>, <b>{notification.author.name}</b>, <b>{notification.target.name}</b>.
                            </p>
                        );
                }
            })()}
            <div className="text-xs flex gap-1 w-full justify-end mt-1">
                {formatDate(notification.date)}
                <ClockIcon className="h-4 w-4"/>
            </div>
        </div>
    )
}