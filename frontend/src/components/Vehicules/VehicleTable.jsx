import { useState } from 'react';
import { VehicleRow } from './VehicleRow';
import { VehicleDetailsModal } from './VehicleDetailsModal';
import { EditVehicleModal } from './EditVehicleModal';
import { AssignDriverModal } from './AssignDriverModal';

export const VehicleTable = ({ vehicles, onUpdateVehicle, onDeleteVehicle, onAssignDriver }) => {
  const [modalState, setModalState] = useState({
    details: { show: false, vehicle: null },
    edit: { show: false, vehicle: null },
    assign: { show: false, vehicle: null }
  });

  const handleViewDetails = (vehicle, e) => {
    e?.stopPropagation();
    setModalState({
      ...modalState,
      details: { show: true, vehicle }
    });
  };

  const handleEdit = (vehicle, e) => {
    e?.stopPropagation();
    setModalState({
      ...modalState,
      edit: { show: true, vehicle }
    });
  };

  const handleAssignDriver = (vehicle, e) => {
    e?.stopPropagation();
    setModalState({
      ...modalState,
      assign: { show: true, vehicle }
    });
  };

  const handleCloseModals = () => {
    setModalState({
      details: { show: false, vehicle: null },
      edit: { show: false, vehicle: null },
      assign: { show: false, vehicle: null }
    });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marque</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modèle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chauffeur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider action-buttons">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <VehicleRow 
                key={vehicle.id} 
                vehicle={vehicle}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onAssignDriver={handleAssignDriver}
                onDeleteVehicle={onDeleteVehicle}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <VehicleDetailsModal 
        isOpen={modalState.details.show}
        vehicle={modalState.details.vehicle}
        onClose={handleCloseModals}
      />

      <EditVehicleModal 
        isOpen={modalState.edit.show}
        vehicle={modalState.edit.vehicle}
        onClose={handleCloseModals}
        onSave={(updatedVehicle) => {
          onUpdateVehicle(updatedVehicle.id, updatedVehicle);
          handleCloseModals();
        }}
      />

      <AssignDriverModal 
        isOpen={modalState.assign.show}
        vehicle={modalState.assign.vehicle}
        onClose={handleCloseModals}
        onAssign={async (driverId) => {
          try {
            await onAssignDriver(modalState.assign.vehicle.id, driverId);
          handleCloseModals();
          } catch (error) {
            console.error('Erreur assignation:', error);
          }
        }}
      />
    </div>
  );
};