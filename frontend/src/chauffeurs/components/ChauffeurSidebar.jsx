// src/chauffeurs/components/ChauffeurSidebar.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faCar,
  faTools,
  faGasPump,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
//import { useAuth } from "../../context/AuthContext";

const ChauffeurSidebar = ({ openModal, closeSidebar, sidebarOpen }) => {
  //const { logout } = useAuth() || {};

  return (
    <aside
      className={`bg-indigo-800 text-white w-64 px-4 py-8 flex flex-col min-h-screen shadow-xl
        ${sidebarOpen ? "fixed z-50 top-0 left-0 h-full" : "hidden"}
        md:relative md:block md:w-64 md:h-full md:z-auto
      `}
      style={{ maxWidth: '16rem' }}
      id="chauffeur-sidebar"
    >
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCar} className="text-2xl mr-2 text-indigo-300" />
          <h1 className="text-xl font-bold">AIRFAWERS AUTO</h1>
        </div>
        <button className="md:hidden text-white" onClick={closeSidebar}>✕</button>
      </div>

      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <NavLink
              to="/chauffeur"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg ${isActive ? "bg-indigo-900 text-white" : "hover:bg-indigo-700 text-indigo-100"}`
              }
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <button
              onClick={() => openModal("vehicule")}
              className="w-full text-left flex items-center px-4 py-3 rounded-lg hover:bg-indigo-700 text-indigo-100"
            >
              <FontAwesomeIcon icon={faCar} className="mr-3" />
              <span>Véhicule</span>
            </button>
          </li>

          <li className="mb-2">
            <button
              onClick={() => openModal("entretien")}
              className="w-full text-left flex items-center px-4 py-3 rounded-lg hover:bg-indigo-700 text-indigo-100"
            >
              <FontAwesomeIcon icon={faTools} className="mr-3" />
              <span>Entretien</span>
            </button>
          </li>

          <li className="mb-2">
            <button
              onClick={() => openModal("carburant")}
              className="w-full text-left flex items-center px-4 py-3 rounded-lg hover:bg-indigo-700 text-indigo-100"
            >
              <FontAwesomeIcon icon={faGasPump} className="mr-3" />
              <span>Carburant</span>
            </button>
          </li>

          <li className="mb-2">
            <button
              //onClick={logout}
              className="w-full text-left flex items-center px-4 py-3 rounded-lg hover:bg-red-600 text-red-200"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
              <span>Déconnexion</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default ChauffeurSidebar;
