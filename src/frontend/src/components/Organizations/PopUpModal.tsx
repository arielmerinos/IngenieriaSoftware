import React from 'react';

interface PopUpModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const PopUpModal: React.FC<PopUpModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg p-6 z-10">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">X</button>
        {children}
      </div>
    </div>
  );
};

export default PopUpModal;
