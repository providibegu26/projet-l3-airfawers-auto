import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ show, onClose, onConfirm, actionType }) => {
  if (!show) return null;

  const isResolve = actionType === 'resolve';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
            {isResolve ? (
              <FaCheckCircle className="h-6 w-6 text-indigo-600" />
            ) : (
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            )}
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">
            {isResolve ? 'Confirmer la résolution' : 'Confirmer la suppression'}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {isResolve
                ? 'Voulez-vous vraiment marquer cette panne comme résolue ?'
                : 'Cette action supprimera définitivement la déclaration de panne. Voulez-vous continuer ?'}
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-white ${
              isResolve ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {isResolve ? 'Confirmer' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;