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

import { useState, useEffect } from 'react';

export const useModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isModalOpen) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '0';
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0';
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0';
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isModalOpen]);

    return { isModalOpen, setIsModalOpen };
};