import React from "react";

interface ModalProps {
  isOpen: boolean; // Controla si el modal está abierto o no
  onClose: () => void; // Función para cerrar el modal
  message: string; // Mensaje para mostrar dentro del modal
  title: string;
  btnLabel: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  btnLabel,
}) => {
  if (!isOpen) return null; // No renderizar el modal si no está abierto

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-96 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>
        <p className="text-center text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          {btnLabel}
        </button>
      </div>
    </div>
  );
};

export default Modal;
