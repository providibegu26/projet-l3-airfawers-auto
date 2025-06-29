import React from 'react';

const ViewLocationModal = ({ show, onClose, location }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Localisation du véhicule</h3>
          <div className="mt-4 h-96">
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${location}&zoom=15&size=800x400&markers=color:red%7C${location}&key=VOTRE_CLE_API`}
              alt="Carte de localisation"
              className="w-full h-full object-cover border rounded-md"
            />
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewLocationModal;