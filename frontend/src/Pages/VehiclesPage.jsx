import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { VehicleTable } from '../components/Vehicules/VehicleTable';
import { VehicleDetailsModal } from '../components/Vehicules/VehicleDetailsModal';
import { AddVehicleModal } from '../components/Vehicules/AddVehicleModal';
import { SuccessModal } from '../components/UI/SuccessModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaFilePdf, FaSearch } from 'react-icons/fa';

export const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    details: ''
  });
  const itemsPerPage = 10;

  // Charger la liste des véhicules depuis l'API au montage
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        console.log('🔄 Chargement des véhicules...');
        const res = await fetch('http://localhost:4000/api/admin/vehicules');
        console.log('📡 Réponse reçue:', res.status, res.statusText);
        const data = await res.json();
        console.log('📦 Données reçues:', data);
        if (res.ok) {
          setVehicles(data.vehicules || []);
          console.log('✅ Véhicules chargés:', data.vehicules?.length || 0);
        } else {
          console.error('❌ Erreur lors du chargement des véhicules:', data.error);
        }
      } catch (error) {
        console.error('❌ Erreur réseau:', error);
      }
    };
    fetchVehicles();
  }, []); // Recharger seulement au montage du composant

  // Recherche filtrée
  const filteredVehicles = vehicles.filter(v => {
    const q = search.toLowerCase();
    return (
      v.marque?.toLowerCase().includes(q) ||
      v.modele?.toLowerCase().includes(q) ||
      v.immatriculation?.toLowerCase().includes(q) ||
      v.categorie?.toLowerCase().includes(q)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Export PDF de la liste
  const handleExportListPdf = async () => {
    // Masquer temporairement les boutons d'actions
    const actionButtons = document.querySelectorAll('.action-buttons');
    actionButtons.forEach(btn => btn.style.display = 'none');
    
    const table = document.getElementById('vehicle-table-pdf');
    if (!table) return;
    
    try {
      const canvas = await html2canvas(table, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      
      // Ajouter le titre
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Liste des véhicules', 20, 40);
      
      // Ajouter la date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const date = new Date().toLocaleDateString('fr-FR');
      pdf.text(`Généré le ${date}`, 20, 60);
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Positionner le tableau en dessous du titre
      pdf.addImage(imgData, 'PNG', 20, 80, imgWidth, imgHeight);
      pdf.save('liste-vehicules.pdf');
    } finally {
      // Restaurer l'affichage des boutons d'actions
      actionButtons.forEach(btn => btn.style.display = '');
    }
  };

  // Ajouter un véhicule
  const handleAddVehicle = async (vehicleData) => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/vehicules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      });
      const data = await response.json();
      if (response.ok) {
        setVehicles(prev => [...prev, data.vehicule]);
        setShowAddModal(false);
        setSuccessModal({
          isOpen: true,
          title: 'Véhicule créé',
          message: 'Véhicule créé avec succès !',
          details: `Marque: ${data.vehicule.marque}, Modèle: ${data.vehicule.modele}, Immatriculation: ${data.vehicule.immatriculation}`
        });
      } else {
        setSuccessModal({
          isOpen: true,
          title: 'Erreur de création',
          message: data.error || 'Erreur lors de la création',
          details: ''
        });
      }
    } catch (err) {
      console.error(err);
      setSuccessModal({
        isOpen: true,
        title: 'Erreur réseau',
        message: 'Erreur réseau lors de la création du véhicule.',
        details: ''
      });
    }
  };

  // Mettre à jour un véhicule
  const handleUpdateVehicle = async (id, vehicleData) => {
    try {
      console.log('🔄 Mise à jour véhicule:', { id, vehicleData });
      const response = await fetch(`http://localhost:4000/api/admin/vehicules/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      });
      console.log('📡 Réponse mise à jour:', response.status, response.statusText);
      const data = await response.json();
      console.log('📦 Données reçues:', data);
      if (response.ok) {
        setVehicles(prev => prev.map(v => v.id === id ? data.vehicule : v));
        console.log('✅ Véhicule mis à jour avec succès');
        setSuccessModal({
          isOpen: true,
          title: 'Véhicule mis à jour',
          message: 'Véhicule mis à jour avec succès !',
          details: `Marque: ${data.vehicule.marque}, Modèle: ${data.vehicule.modele}, Immatriculation: ${data.vehicule.immatriculation}`
        });
      } else {
        console.error('❌ Erreur mise à jour:', data.error);
        setSuccessModal({
          isOpen: true,
          title: 'Erreur de modification',
          message: data.error || 'Erreur lors de la modification',
          details: ''
        });
      }
    } catch (err) {
      console.error('❌ Erreur réseau mise à jour:', err);
      setSuccessModal({
        isOpen: true,
        title: 'Erreur réseau',
        message: 'Erreur réseau lors de la mise à jour du véhicule.',
        details: ''
      });
    }
  };

  // Assigner un chauffeur à un véhicule
  const handleAssignDriver = async (vehicleId, driverId) => {
    try {
      console.log('👤 Assignation chauffeur:', { vehicleId, driverId });
      const response = await fetch(`http://localhost:4000/api/admin/vehicules/${vehicleId}/assign-driver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chauffeurId: Number(driverId) })
      });
      const data = await response.json();
      console.log('📡 Réponse assignation:', response.status, response.statusText);
      console.log('📦 Données reçues:', data);
      
      if (response.ok) {
        setVehicles(prev => prev.map(v => v.id === vehicleId ? data.vehicule : v));
        console.log('✅ Chauffeur assigné avec succès');
        setSuccessModal({
          isOpen: true,
          title: 'Chauffeur assigné',
          message: data.message || 'Chauffeur assigné avec succès !',
          details: data.vehicule.chauffeur ? 
            `Véhicule: ${data.vehicule.marque} ${data.vehicule.modele} (${data.vehicule.immatriculation}) - Chauffeur: ${data.vehicule.chauffeur.prenom} ${data.vehicule.chauffeur.nom}` :
            `Véhicule: ${data.vehicule.marque} ${data.vehicule.modele} (${data.vehicule.immatriculation})`
        });
      } else {
        console.error('❌ Erreur assignation:', data.error);
        setSuccessModal({
          isOpen: true,
          title: 'Erreur d\'assignation',
          message: data.error || 'Erreur lors de l\'assignation',
          details: ''
        });
      }
    } catch (err) {
      console.error('❌ Erreur réseau assignation:', err);
      setSuccessModal({
        isOpen: true,
        title: 'Erreur réseau',
        message: 'Erreur réseau lors de l\'assignation du chauffeur.',
        details: ''
      });
    }
  };

  // Supprimer un véhicule
  const handleDeleteVehicle = async (id) => {
    try {
      console.log('🗑️ Suppression véhicule:', id);
      const response = await fetch(`http://localhost:4000/api/admin/vehicules/${id}`, {
        method: 'DELETE'
      });
      console.log('📡 Réponse suppression:', response.status, response.statusText);
      if (response.ok) {
        setVehicles(prev => prev.filter(v => v.id !== id));
        console.log('✅ Véhicule supprimé avec succès');
        setSuccessModal({
          isOpen: true,
          title: 'Véhicule supprimé',
          message: 'Véhicule supprimé avec succès !',
          details: `ID du véhicule supprimé: ${id}`
        });
      } else {
        const data = await response.json();
        console.error('❌ Erreur suppression:', data.error);
        setSuccessModal({
          isOpen: true,
          title: 'Erreur de suppression',
          message: data.error || 'Erreur lors de la suppression',
          details: ''
        });
      }
    } catch (err) {
      console.error('❌ Erreur réseau suppression:', err);
      setSuccessModal({
        isOpen: true,
        title: 'Erreur réseau',
        message: 'Erreur réseau lors de la suppression du véhicule.',
        details: ''
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
        <div className="flex-1 overflow-auto relative  transition-colors duration-300 [-ms-overflow-style:none] [scrollbar-width:none]">
    <main className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Véhicules</h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher un véhicule..."
              className="pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          </div>
          <button
            onClick={handleExportListPdf}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            <FaFilePdf className="mr-2" />
            Exporter la liste
          </button>
        <button 
          onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
        >
          <i className="fas fa-plus mr-2"></i> Ajouter un véhicule
        </button>
        </div>
      </div>

      <div id="vehicle-table-pdf">
      <VehicleTable 
          vehicles={paginatedVehicles} 
        onRowClick={setSelectedVehicle}
        onAddVehicle={() => setShowAddModal(true)}
          onUpdateVehicle={handleUpdateVehicle}
          onDeleteVehicle={handleDeleteVehicle}
          onAssignDriver={handleAssignDriver}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Précédent
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'} font-medium`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}

      {selectedVehicle && (
        <VehicleDetailsModal 
          vehicle={selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
        />
      )}

      {showAddModal && (
        <AddVehicleModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleAddVehicle}
        />
      )}

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        title={successModal.title}
        message={successModal.message}
        details={successModal.details}
        />
    </main>
        </div>
      </div>
  );
};
export default VehiclesPage;