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
                className="bg-white rounded-xl shadow-2xl p-8 w-96 max-w-full my-8"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
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