import { FaUserTie, FaTimes, FaFilePdf, FaCar } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const ChauffeurDetailsModal = ({ chauffeur, onClose, vehicles }) => {
  // Utiliser les données du backend qui incluent déjà les véhicules assignés
  const vehiculeAssigne = chauffeur.vehiculeAssigne || vehicles?.find(v => v.chauffeurId === chauffeur.id);
  
  // Récupérer la catégorie avec fallback
  const getVehiculeCategorie = () => {
    if (vehiculeAssigne?.categorie) {
      return vehiculeAssigne.categorie;
    }
    // Fallback : chercher dans les véhicules des props
    const vehiculeFromProps = vehicles?.find(v => v.chauffeurId === chauffeur.id);
    return vehiculeFromProps?.categorie || 'N/A';
  };

  // Export PDF
  const handleExportPdf = async () => {
    const modal = document.getElementById('chauffeur-details-modal');
    if (!modal) return;
    // Masquer les éléments à ne pas exporter
    const noExportEls = modal.querySelectorAll('.no-export');
    noExportEls.forEach(el => el.style.display = 'none');
    const canvas = await html2canvas(modal, { scale: 2 });
    noExportEls.forEach(el => el.style.display = '');
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(`chauffeur-${chauffeur.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div id="chauffeur-details-modal" className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-3">
          <h3 className="text-lg font-bold flex items-center">
            <FaUserTie className="text-indigo-500 mr-2" />
            Détails du chauffeur
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {/* Colonne 1 */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3">Informations personnelles</h4>
              <div className="space-y-2 text-xs text-gray-700">
                <div><span className="text-gray-600 font-medium">ID:</span> {chauffeur.id}</div>
                <div><span className="text-gray-600 font-medium">Nom:</span> {chauffeur.nom}</div>
                <div><span className="text-gray-600 font-medium">Post-nom:</span> {chauffeur.postnom}</div>
                <div><span className="text-gray-600 font-medium">Prénom:</span> {chauffeur.prenom}</div>
                <div><span className="text-gray-600 font-medium">Sexe:</span> {chauffeur.sexe}</div>
                <div><span className="text-gray-600 font-medium">Téléphone:</span> {chauffeur.telephone}</div>
                <div><span className="text-gray-600 font-medium">Email:</span> <span className="text-blue-600">{chauffeur.user?.email || 'Non défini'}</span></div>
              </div>
            </div>
            {/* Colonne 2 : Véhicule attribué */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center"><FaCar className="mr-2 text-blue-500" />Véhicule attribué</h4>
              {vehiculeAssigne ? (
                <div className="space-y-2 text-xs text-gray-700">
                  <div><span className="text-gray-600 font-medium">Immatriculation:</span> {vehiculeAssigne.immatriculation}</div>
                  <div><span className="text-gray-600 font-medium">Marque:</span> {vehiculeAssigne.marque}</div>
                  <div><span className="text-gray-600 font-medium">Modèle:</span> {vehiculeAssigne.modele}</div>
                  <div><span className="text-gray-600 font-medium">Catégorie:</span> <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getVehiculeCategorie() === 'HEAVY' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{getVehiculeCategorie()}</span></div>
                </div>
              ) : (
                <div className="text-gray-400 text-xs">Aucun véhicule attribué</div>
              )}
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
}