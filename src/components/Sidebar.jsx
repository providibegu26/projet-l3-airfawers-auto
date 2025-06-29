import React from 'react';
import { NavLink } from 'react-router-dom';
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

const Sidebar = () => {
  return (
    <aside className="bg-indigo-800 text-white w-64 px-4 py-8 flex flex-col min-h-screen shadow-xl z-10">
      <div className="flex items-center justify-center mb-8">
        <FontAwesomeIcon icon={faCar} className="text-2xl mr-2 text-indigo-300" />
        <h1 className="text-xl font-bold">AIRFAWERS AUTO</h1>
      </div>
      <nav className="flex-1">
        <ul>
          <li className="mb-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg ${
                  isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="mr-3" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink
              to="/vehicles"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg ${
                  isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faCar} className="mr-3" />
              <span>Véhicules</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink
              to="/chauffeurs"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg ${
                  isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faUserTie} className="mr-3" />
              <span>Chauffeurs</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink
              to="/entretiens"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg ${
                  isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faTools} className="mr-3" />
              <span>Entretiens</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink
              to="/carburants"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg ${
                  isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faGasPump} className="mr-3" />
              <span>Carburant</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink
              to="/pannes"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg ${
                  isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-3" />
              <span>Pannes</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <NavLink
              to="/statistiques"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg ${
                  isActive ? 'bg-indigo-900 text-white' : 'hover:bg-indigo-700 text-indigo-100'
                }`
              }
            >
              <FontAwesomeIcon icon={faChartLine} className="mr-3" />
              <span>Statistiques</span>
            </NavLink>
          </li>

          <li className="mb-2">
            <a
              href="#"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-indigo-700 text-indigo-100"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
              <span>Déconnexion</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
