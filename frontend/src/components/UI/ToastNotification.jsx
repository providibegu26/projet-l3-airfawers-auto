import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ToastNotification = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500 text-2xl" />;
      case 'error':
        return <FaTimesCircle className="text-red-500 text-2xl" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500 text-2xl" />;
      default:
        return <FaInfoCircle className="text-blue-500 text-2xl" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`modal-notification bg-white rounded-xl shadow-lg border-2 p-6 max-w-md mx-4 ${getStyles()}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {type === 'success' ? 'Succès' : 
               type === 'error' ? 'Erreur' : 
               type === 'warning' ? 'Attention' : 'Information'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'success' ? 'bg-green-600 text-white hover:bg-green-700' :
              type === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
              type === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
              'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToastNotification; 