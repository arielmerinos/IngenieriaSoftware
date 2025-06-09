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

import React, { useEffect, useRef } from 'react';

interface PopUpModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const PopUpModal: React.FC<PopUpModalProps> = ({ onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = modalRef.current;
    if (!container) return;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    if (
      (scrollTop === 0 && e.deltaY < 0) ||
      (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div 
        ref={modalRef}
        onWheel={handleWheel}
        className="relative w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto rounded-lg shadow-xl transition-colors duration-200 scroll-smooth"
      >
        {children}
      </div>
    </div>
  );
};

export default PopUpModal;