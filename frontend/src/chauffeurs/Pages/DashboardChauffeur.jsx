// src/chauffeurs/Pages/DashboardChauffeur.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar,
  faGasPump,
  faTools,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const DashboardChauffeur = () => {
  const { openModal } = useOutletContext();

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Bienvenue Chauffeur 👋</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* VEHICULE */}
        <div
          className="bg-indigo-100 hover:bg-indigo-200 transition cursor-pointer p-6 rounded-xl shadow-md flex justify-between items-center"
          onClick={() => openModal("vehicule")}
        >
          <div>
            <p className="text-gray-600 text-sm">Véhicule</p>
            <h2 className="text-xl font-semibold text-indigo-800">Détails</h2>
          </div>
          <FontAwesomeIcon icon={faCar} className="text-indigo-700 text-3xl" />
        </div>

        {/* CARBURANT */}
        <div
          className="bg-green-100 hover:bg-green-200 transition cursor-pointer p-6 rounded-xl shadow-md flex justify-between items-center"
          onClick={() => openModal("carburant")}
        >
          <div>
            <p className="text-gray-600 text-sm">Carburant</p>
            <h2 className="text-xl font-semibold text-green-800">Cette semaine</h2>
          </div>
          <FontAwesomeIcon icon={faGasPump} className="text-green-700 text-3xl" />
        </div>

        {/* ENTRETIEN */}
        <div
          className="bg-yellow-100 hover:bg-yellow-200 transition cursor-pointer p-6 rounded-xl shadow-md flex justify-between items-center"
          onClick={() => openModal("entretien")}
        >
          <div>
            <p className="text-gray-600 text-sm">Entretien</p>
            <h2 className="text-xl font-semibold text-yellow-800">Prévu</h2>
          </div>
          <FontAwesomeIcon icon={faTools} className="text-yellow-700 text-3xl" />
        </div>

        {/* PANNE */}
        <div
          className="bg-red-100 hover:bg-red-200 transition cursor-pointer p-6 rounded-xl shadow-md flex justify-between items-center"
          onClick={() => openModal("panne")}
        >
          <div>
            <p className="text-gray-600 text-sm">Panne</p>
            <h2 className="text-xl font-semibold text-red-800">Signaler</h2>
          </div>
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-700 text-3xl" />
        </div>
      </div>
    </>
  );
};

export default DashboardChauffeur;
