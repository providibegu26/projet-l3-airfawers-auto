// src/chauffeurs/components/HeaderChauffeur.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faChevronDown, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const HeaderChauffeur = ({ onMenuClick }) => {
  return (
    <header className="bg-white z-10 sticky top-0 shadow px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Burger button mobile */}
        <button className="md:hidden p-2 mr-2 text-gray-700" onClick={onMenuClick} aria-label="Ouvrir le menu">
          <FontAwesomeIcon icon={faBars} className="text-2xl" />
        </button>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Link
            to="/chauffeur/notifications"
            className="p-2 text-gray-500 hover:text-gray-700 relative"
            title="Notifications"
          >
            <FontAwesomeIcon icon={faBell} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Link>

          {/* Profil chauffeur */}
          <Link
            to="profile"
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1"
          >
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="Profil"
            />
            <span className="text-sm font-medium text-gray-700">Chauffeur</span>
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-xs" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderChauffeur;
