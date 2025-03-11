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