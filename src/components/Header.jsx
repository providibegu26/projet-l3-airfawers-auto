import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Header = ({ userRole = 'admin' }) => { 
  return (
    <header className="bg-white !bg-opacity-100 z-10 sticky top-0">
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 max-w-md">
          {/* Espace pour contenu futur */}
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/notifications" 
            className="p-2 text-gray-500 hover:text-gray-700 relative"
            title="Notifications"
          >
            <FontAwesomeIcon icon={faBell} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
          </Link>
          
          <Link 
            to={userRole === 'admin' ? "/profile-admin" : "/profile-chauffeur"} 
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-full p-1"
          >
            <img 
              className="h-8 w-8 rounded-full object-cover" 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
              alt="Profil"
            />
            <span className="text-sm font-medium text-gray-700">
              {userRole === 'admin' ? 'Admin' : 'Chauffeur'}
            </span>
            <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-xs" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;