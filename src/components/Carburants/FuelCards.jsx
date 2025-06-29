const FuelCards = () => {
  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
            <i className="fas fa-car text-xl"></i>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Véhicules en service</p>
            <p className="text-2xl font-bold">24</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <i className="fas fa-gas-pump text-xl"></i>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Coût mensuel carburant</p>
            <p className="text-2xl font-bold">2,480.50 $</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FuelCards;
