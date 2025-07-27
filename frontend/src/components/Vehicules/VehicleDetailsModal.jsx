import { FaCar, FaTimes, FaFilePdf, FaUserTie, FaWrench } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const VehicleDetailsModal = ({ isOpen, vehicle, onClose }) => {
  if (!isOpen || !vehicle) return null;

  // Chauffeur attribué
  const chauffeur = vehicle.chauffeur;

  // Dernier entretien (mock)
  const lastMaintenance = vehicle.entretiens && vehicle.entretiens.length > 0
    ? vehicle.entretiens[vehicle.entretiens.length - 1]
    : null;

  // Historique entretiens (mock)
  const maintenanceHistory = vehicle.entretiens || [];

  // Export PDF
  const handleExportPdf = async () => {
    const modal = document.getElementById('vehicle-details-modal');
    if (!modal) return;
    // Masquer les éléments à ne pas exporter
    const noExportEls = modal.querySelectorAll('.no-export');
    noExportEls.forEach(el => el.style.display = 'none');
    const canvas = await html2canvas(modal, { scale: 2 });
    // Réafficher les éléments
    noExportEls.forEach(el => el.style.display = '');
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(`vehicule-${vehicle.immatriculation}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div id="vehicle-details-modal" className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-3">
          <h3 className="text-lg font-bold flex items-center">
            <FaCar className="text-indigo-500 mr-2" />
            Détails du véhicule
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {/* Infos véhicule */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">Informations générales</h4>
              <div className="space-y-2 text-xs text-gray-700">
                <div><span className="text-gray-600">Immatriculation:</span> {vehicle.immatriculation}</div>
                <div><span className="text-gray-600">Marque:</span> {vehicle.marque}</div>
                <div><span className="text-gray-600">Modèle:</span> {vehicle.modele}</div>
                <div><span className="text-gray-600">Catégorie:</span> {vehicle.categorie}</div>
                <div><span className="text-gray-600">Statut:</span> <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vehicle.chauffeur ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{vehicle.chauffeur ? 'Attribué' : 'Non attribué'}</span></div>
              </div>
            </div>

            {/* Infos chauffeur attribué */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center"><FaUserTie className="mr-2 text-indigo-500" />Chauffeur attribué</h4>
              {chauffeur ? (
                <div className="space-y-2 text-xs text-gray-700">
                  <div><span className="text-gray-600 font-medium">Nom:</span> {chauffeur.nom} {chauffeur.prenom}</div>
                  <div><span className="text-gray-600 font-medium">Téléphone:</span> {chauffeur.telephone}</div>
                  <div><span className="text-gray-600 font-medium">Email:</span> <span className="text-blue-600">{chauffeur.user?.email || chauffeur.email || 'Non défini'}</span></div>
                </div>
              ) : (
                <div className="text-gray-400 text-xs">Aucun chauffeur attribué</div>
              )}
            </div>

            {/* Informations techniques */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">Informations techniques</h4>
              <div className="space-y-2 text-xs text-gray-700">
                <div><span className="text-gray-600 font-medium">Kilométrage actuel:</span> {vehicle.kilometrage} km</div>
                <div><span className="text-gray-600 font-medium">Date d'ajout:</span> {new Date(vehicle.dateAjout).toLocaleDateString('fr-FR')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-3 py-2 flex justify-end space-x-2 no-export">
          <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700" onClick={handleExportPdf}>
            <FaFilePdf className="mr-2" />
            Exporter en PDF
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};