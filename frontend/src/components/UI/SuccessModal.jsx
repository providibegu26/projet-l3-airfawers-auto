import { FaCheckCircle, FaTimes } from 'react-icons/fa';

export const SuccessModal = ({ isOpen, onClose, title, message, details }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 text-2xl mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">{message}</p>
        
        {details && (
          <div className="bg-gray-50 rounded p-3 mb-4">
            <p className="text-sm text-gray-700 font-medium">Détails :</p>
            <p className="text-sm text-gray-600 mt-1">{details}</p>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}; 