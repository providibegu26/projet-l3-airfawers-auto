// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCar,
  faTachometerAlt,
  faUserTie,
  faTools,
  faGasPump,
  faExclamationTriangle,
  faChartLine,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
//import { useAuth } from '../context/AuthContext';

const Sidebar = ({ closeSidebar, sidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <aside
      className={`bg-indigo-800 text-white w-64 px-4 py-8 flex flex-col min-h-screen shadow-xl
        ${sidebarOpen ? "fixed z-50 top-0 left-0 h-full" : "hidden"}
        md:relative md:block md:w-64 md:h-full md:z-auto
      `}
      style={{ maxWidth: '16rem' }}
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
            <NavLink to="/" end className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg ${isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'}`
            }>
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink to="/vehicles" className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg ${isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'}`
            }>
              <FontAwesomeIcon icon={faCar} className="mr-3" />
              <span>Véhicules</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink to="/chauffeurs" className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg ${isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'}`
            }>
              <FontAwesomeIcon icon={faUserTie} className="mr-3" />
              <span>Chauffeurs</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink to="/entretiens" className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg ${isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'}`
            }>
              <FontAwesomeIcon icon={faTools} className="mr-3" />
              <span>Entretiens</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink to="/carburants" className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg ${isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'}`
            }>
              <FontAwesomeIcon icon={faGasPump} className="mr-3" />
              <span>Carburant</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink to="/pannes" className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg ${isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'}`
            }>
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
              <span>Pannes</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink to="/statistiques" className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg ${isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'}`
            }>
              <FontAwesomeIcon icon={faChartLine} className="mr-3" />
              <span>Statistiques</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-red-600 text-red-200"
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

export default Sidebar;
