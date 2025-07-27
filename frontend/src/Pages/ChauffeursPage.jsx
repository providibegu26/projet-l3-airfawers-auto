import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { ChauffeurTable } from '../components/Chauffeurs/ChauffeurTable';
import { ChauffeurDetailsModal } from '../components/Chauffeurs/ChauffeurDetailsModal';
import { AddChauffeurModal } from '../components/Chauffeurs/AddChauffeurModal';
import { EditChauffeurModal } from '../components/Chauffeurs/EditChauffeurModal';
import { SuccessModal } from '../components/UI/SuccessModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FaFilePdf, FaSearch } from 'react-icons/fa';

export const ChauffeursPage = () => {
  const [chauffeurs, setChauffeurs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Charger la liste des chauffeurs
  const fetchChauffeurs = async () => {
    const res = await fetch('http://localhost:4000/api/admin/chauffeurs');
    const data = await res.json();
    setChauffeurs(data.chauffeurs || []);
  };

  useEffect(() => {
    fetchChauffeurs();
  }, []);

  // Charger la liste des véhicules
  const fetchVehicles = async () => {
    const res = await fetch('http://localhost:4000/api/admin/vehicules');
    const data = await res.json();
    setVehicles(data.vehicules || []);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Recharger les données après une assignation de véhicule
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChauffeurs();
      fetchVehicles();
    }, 5000); // Recharger toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  // Ajoute le nouveau chauffeur à la liste après création
  const handleSaveChauffeur = async (chauffeurData) => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/chauffeurs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chauffeurData)
      });
      const data = await response.json();
      if (response.ok) {
        setShowAddModal(false);
        
        // Ajouter le chauffeur à la liste avec les données complètes
        const newChauffeur = {
          ...data.user,
          user: {
            email: data.user.email,
            motDePasseDefini: false
          }
        };
        setChauffeurs(prev => [...prev, newChauffeur]);
        
        // Afficher le modal de succès avec les détails
        setSuccessData({
          title: 'Chauffeur créé avec succès',
          message: 'Le chauffeur a été enregistré dans le système.',
          details: {
            'Email': data.user.email,
            'Mot de passe temporaire': data.user.motDePasseTemporaire
          }
        });
        setShowSuccessModal(true);
      } else {
        alert(data.error || 'Erreur lors de la création');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    }
  };

  // Met à jour un chauffeur dans la liste
  const handleUpdateChauffeur = async (updatedChauffeur) => {
    // Ouvrir le modal d'édition
    setSelectedChauffeur(updatedChauffeur);
    setShowEditModal(true);
  };

  // Sauvegarde les modifications d'un chauffeur
  const handleSaveChauffeurUpdate = async (updatedChauffeur) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/chauffeurs/${updatedChauffeur.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: updatedChauffeur.nom,
          postnom: updatedChauffeur.postnom,
          prenom: updatedChauffeur.prenom,
          sexe: updatedChauffeur.sexe,
          telephone: updatedChauffeur.telephone
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Mettre à jour la liste avec les données retournées par l'API
        setChauffeurs(prev => prev.map(c => c.id === updatedChauffeur.id ? data.chauffeur : c));
        setShowEditModal(false);
        
        // Afficher le modal de succès
        setSuccessData({
          title: 'Chauffeur modifié avec succès',
          message: 'Les informations du chauffeur ont été mises à jour.',
          details: {
            'Nom': data.chauffeur.nom,
            'Post-Nom': data.chauffeur.postnom,
            'Prénom': data.chauffeur.prenom,
            'Email': data.chauffeur.user.email
          }
        });
        setShowSuccessModal(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de la modification');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    }
  };

  // Supprime un chauffeur de la liste
  const handleDeleteChauffeur = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/admin/chauffeurs/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setChauffeurs(prev => prev.filter(c => c.id !== id));
        
        // Afficher le modal de succès
        setSuccessData({
          title: 'Chauffeur supprimé avec succès',
          message: 'Le chauffeur a été supprimé du système.'
        });
        setShowSuccessModal(true);
      } else {
        const data = await response.json();
        alert(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur réseau');
    }
  };

  // Fonction d'export PDF
  const handleExportPdf = async () => {
    const modal = document.getElementById('chauffeur-details-modal');
    if (!modal) return;
    const canvas = await html2canvas(modal, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    const fileName = selectedChauffeur ? `chauffeur-${selectedChauffeur.id}.pdf` : 'chauffeur.pdf';
    pdf.save(fileName);
  };

  // Recherche filtrée
  const filteredChauffeurs = chauffeurs.filter(c => {
    const q = search.toLowerCase();
    return (
      c.nom?.toLowerCase().includes(q) ||
      c.postnom?.toLowerCase().includes(q) ||
      c.prenom?.toLowerCase().includes(q) ||
      c.sexe?.toLowerCase().includes(q) ||
      c.user?.email?.toLowerCase().includes(q) ||
      c.telephone?.toLowerCase().includes(q)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredChauffeurs.length / itemsPerPage);
  const paginatedChauffeurs = filteredChauffeurs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Export PDF de la liste
  const handleExportListPdf = async () => {
    // Masquer temporairement les boutons d'actions
    const actionButtons = document.querySelectorAll('.action-buttons');
    actionButtons.forEach(btn => btn.style.display = 'none');
    
    const table = document.getElementById('chauffeur-table-pdf');
    if (!table) return;
    
    try {
      const canvas = await html2canvas(table, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
      
      // Ajouter le titre
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Liste des chauffeurs', 20, 40);
      
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
      pdf.save('liste-chauffeurs.pdf');
    } finally {
      // Restaurer l'affichage des boutons d'actions
      actionButtons.forEach(btn => btn.style.display = '');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden w-full">
        <div className="flex-1 overflow-auto relative  transition-colors duration-300 [-ms-overflow-style:none] [scrollbar-width:none]">
          
    <main className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des Chauffeurs</h2>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher un chauffeur..."
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
            <i className="fas fa-plus mr-2"></i> Ajouter un chauffeur
          </button>
        </div>
      </div>

      <div id="chauffeur-table-pdf">
        <ChauffeurTable 
          chauffeurs={paginatedChauffeurs} 
          vehicles={vehicles}
          onChauffeurClick={setSelectedChauffeur}
          onUpdate={handleUpdateChauffeur}
          onDelete={handleDeleteChauffeur}
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

      {selectedChauffeur && (
        <ChauffeurDetailsModal 
          chauffeur={selectedChauffeur}
          onClose={() => setSelectedChauffeur(null)}
          onExportPdf={handleExportPdf}
          vehicles={vehicles}
        />
      )}

      {showAddModal && (
        <AddChauffeurModal 
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveChauffeur}
        />
      )}

      {showEditModal && (
        <EditChauffeurModal
          chauffeur={selectedChauffeur}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleSaveChauffeurUpdate}
        />
      )}

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successData.title}
        message={successData.message}
        details={successData.details}
      />
    </main>
        </div>
    </div>
  );
};
export default ChauffeursPage;