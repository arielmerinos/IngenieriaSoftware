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
import { BellIcon } from "@heroicons/react/outline";
import { useRef, useState, useEffect } from "react";
import { NotificationsMenu } from "./NotificationsMenu";
import { Notification, parseNotification } from "../../types/notification";
import { useAuth } from "../../contexts/AuthContext";
import apiInstance from "../../services/axiosInstance";

export function NotificationsButton() {

    const authContext = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const menuRef = useRef<HTMLDivElement>(null);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {

            // Boton
            const handleClickOutside = (event: MouseEvent) => {
                if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                    setIsOpen(false);
                }
            };
    
            document.addEventListener('mousedown', handleClickOutside);

            // Cargar Notificaciones

            const fetchData = async () => {
                apiInstance.get(
                    'user/notifications/',
                    { headers: { 'Authorization': `Bearer ${authContext.authToken}` } }
                )
                    .then(response => {
                        let parsedNotifications = response.data.map((notification: any) => parseNotification(notification));
                        setNotifications(parsedNotifications);
                    })
                    .catch(error => {
                        console.error('Error al obtener las notificaciones:', error);
                    });
            }

            fetchData(); // Primera carga de notificaciones

        // Polling desactivado para la paz mental del autor.

        //     // Polling notificaciones
        //     setInterval(() => {
        //         console.log("Cargando notificaciones...");
        //         fetchData();
        //     }, 10000); // Cada 10 segundos
        // }, []);

    return (
        <div ref={ menuRef }>
            <button
            onClick={ toggleMenu }
            className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                        <BellIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                        {/* <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full">
                            3
                        </span> */}
                    </button>
            {isOpen && 
                    <NotificationsMenu notifications={notifications} />
            }
        </div>
    )
}