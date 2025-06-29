const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Affichage <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à{' '}
        <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> sur{' '}
        <span className="font-medium">{totalItems}</span> résultats
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Précédent
        </button>
        <button 
          className="px-3 py-1 border border-indigo-600 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {currentPage}
        </button>
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Pagination;