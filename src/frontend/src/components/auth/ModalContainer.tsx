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

import React from 'react';
import ReactDOM from 'react-dom';

interface ModalContainerProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
    isOpen,
    onClose,
    children,
    title
}) => {
    if (!isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-96 max-w-full my-8 border border-gray-300 dark:border-gray-600"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                    {title}
                </h2>
                {children}
            </div>
        </div>
    );

    return ReactDOM.createPortal(
        modalContent,
        document.getElementById('modal-root')!
    );
};

export default ModalContainer;