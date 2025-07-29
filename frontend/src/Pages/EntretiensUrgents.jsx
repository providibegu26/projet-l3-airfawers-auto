import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';
import MaintenanceTable from '../components/Entretiens/MaintenanceTable';
import ConfirmationModal from '../components/UI/ConfirmationModal';
import { 
  fetchVehicles,
  getUrgentMaintenance, 
  formatMaintenanceData,
  validateMaintenance,
  calculateFleetAverage,
  calculateMaintenanceForVehicle,
  refreshMaintenanceEstimations,
  forceGlobalRecalculation
} from '../services/maintenanceService';
import ToastNotification from '../components/UI/ToastNotification';

const EntretiensUrgents = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingValidation, setPendingValidation] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const vehiclesData = await fetchVehicles();
        setVehicles(vehiclesData);
      } catch (err) {
        setError(err.message);
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Recalculer la liste à chaque changement de véhicules
  useEffect(() => {
    const urgentMaintenance = getUrgentMaintenance(vehicles);
    const formattedData = formatMaintenanceData(urgentMaintenance);
    setMaintenanceData(formattedData);
  }, [vehicles]);

  const handleExportPDF = () => {
    // Logique d'export PDF
    console.log('Export PDF pour entretiens urgents');
  };

  // Valider un entretien urgent
  const handleMaintenanceValidation = async (vehiclePlate, maintenanceType) => {
    console.log('🚀 Demande de validation:', { vehiclePlate, maintenanceType });
    
    // Stocker les informations de validation en attente
    setPendingValidation({ vehiclePlate, maintenanceType });
    setShowConfirmation(true);
    
    console.log('✅ Modal de confirmation ouvert');
  };

  // Confirmer la validation
  const confirmValidation = async () => {
    console.log('🔧 confirmValidation appelée');
    
    if (!pendingValidation) {
      console.error('❌ Aucune validation en attente');
      return;
    }

    try {
      console.log('🔧 Confirmation de validation...', pendingValidation);
      
      // Trouver le véhicule
      const vehicle = vehicles.find(v => v.immatriculation === pendingValidation.vehiclePlate);
      if (!vehicle) {
        console.error('❌ Véhicule non trouvé:', pendingValidation.vehiclePlate);
        console.log('📋 Véhicules disponibles:', vehicles.map(v => v.immatriculation));
        setNotification({
          type: 'error',
          message: 'Véhicule non trouvé',
          isVisible: true
        });
        return;
      }

      console.log('✅ Véhicule trouvé:', vehicle);

      // 1. Valider l'entretien
      const validationData = {
        vehiculeId: vehicle.id,
        type: pendingValidation.maintenanceType,
        kilometrage: vehicle.kilometrage,
        description: `Entretien ${pendingValidation.maintenanceType} validé`
      };
      
      console.log('📋 Données de validation:', validationData);
      
      const response = await fetch('http://localhost:4000/api/admin/entretiens/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validationData)
      });

      console.log('📊 Status de la réponse:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Erreur API:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la validation');
      }

      const result = await response.json();
      console.log('✅ Entretien validé:', result);

      // 2. Recharger TOUTES les données depuis le serveur
      console.log('🔄 Rechargement complet des données...');
      const vehiclesResponse = await fetch('http://localhost:4000/api/admin/vehicules');
      const vehiclesData = await vehiclesResponse.json();
      
      // 3. Mettre à jour les véhicules avec les nouvelles estimations
      setVehicles(vehiclesData.vehicules);
      
      // 4. Recalculer les entretiens urgents avec les nouvelles données
      const urgentMaintenance = getUrgentMaintenance(vehiclesData.vehicules);
      const formattedData = formatMaintenanceData(urgentMaintenance);
      setMaintenanceData(formattedData);
      
      console.log('✅ Synchronisation terminée:', {
        vehiclesCount: vehiclesData.vehicules.length,
        urgentCount: formattedData.length,
        validatedType: pendingValidation.maintenanceType,
        validatedVehicle: pendingValidation.vehiclePlate
      });

      // 5. Fermer le modal et afficher la notification
      setShowConfirmation(false);
      setPendingValidation(null);
      
      setNotification({
        type: 'success',
        message: `Entretien ${pendingValidation.maintenanceType} validé avec succès ! Nouvelle estimation calculée.`,
        isVisible: true
      });

    } catch (error) {
      console.error('❌ Erreur validation:', error);
      setNotification({
        type: 'error',
        message: error.message || 'Erreur lors de la validation',
        isVisible: true
      });
    }
  };

  // Annuler la validation
  const cancelValidation = () => {
    console.log('❌ Validation annulée');
    setShowConfirmation(false);
    setPendingValidation(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Chargement des données...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-600">Erreur: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/entretiens')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition"
          >
            <FaArrowLeft />
            Retour
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">Entretiens Urgents</h1>
        </div>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <FaFilePdf />
          Exporter en PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow">
        <MaintenanceTable 
          data={maintenanceData}
          title="Entretiens Urgents (≤ 7 jours)"
          onComplete={handleMaintenanceValidation}
        />
      </div>
      {notification && (
        <ToastNotification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)}
        />
      )}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={cancelValidation}
        onConfirm={confirmValidation}
        title="Confirmer la validation"
        message={`Voulez-vous valider l'entretien ${pendingValidation?.maintenanceType} pour le véhicule ${pendingValidation?.vehiclePlate} ?`}
        confirmText="Valider"
        cancelText="Annuler"
      />
    </div>
  );
};

export default EntretiensUrgents; 