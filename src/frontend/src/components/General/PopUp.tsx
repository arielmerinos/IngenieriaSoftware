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

import { useEffect } from "react";
import { XIcon } from "@heroicons/react/outline";
import { usePopUp } from "../../contexts/PopUpContext";

/**
 * PopUp component - enhanced with dark mode support and animations
 * This component should only be used via PopUpProvider from the context folder.
 */
export function PopUp() {
    const context = usePopUp();

    // Add keyboard support for Escape key to close the popup
    useEffect(() => {
        const handleEscapeKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && context?.isOpen) {
                context.setOpen(false);
            }
        };

        // Add event listener when popup is open
        if (context?.isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            // Prevent scrolling on the body when popup is open
            document.body.style.overflow = 'hidden';
        }

        // Cleanup function to remove event listener and restore scrolling
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            if (context?.isOpen) {
                document.body.style.overflow = 'auto';
            }
        };
    }, [context?.isOpen]);

    if (!context?.isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop with blur effect */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                onClick={() => context.setOpen(false)}
            ></div>
            
            {/* Modal container with animation */}
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div 
                    className="
                        relative
                        inline-block
                        align-bottom
                        bg-white dark:bg-gray-800
                        rounded-xl
                        text-left
                        shadow-xl
                        transform transition-all
                        sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full
                        overflow-visible overflow-y-auto
                        max-h-[85vh]
                        animate-popup-appear
                    "
                >
                    <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                        <button
                            type="button"
                            className="
                                bg-white dark:bg-gray-800
                                rounded-full
                                p-1
                                text-gray-400 dark:text-gray-500
                                hover:text-gray-500 dark:hover:text-gray-400
                                hover:bg-gray-100 dark:hover:bg-gray-700
                                focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                transition-colors
                            "
                            onClick={() => context.setOpen(false)}
                        >
                            <span className="sr-only">Cerrar</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    
                    <div className="p-6">
                        {context?.content}
                    </div>
                </div>
            </div>
        </div>
    );
}