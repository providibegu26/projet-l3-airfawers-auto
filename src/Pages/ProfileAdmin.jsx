import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCamera, 
  faSave, 
  faUser, 
  faEnvelope, 
  faPhone,
  faShieldAlt,
  faCog
} from '@fortawesome/free-solid-svg-icons';

const ProfileAdmin = () => {
  const [profile, setProfile] = useState({
    name: 'Admin Principal',
    email: 'admin@airfawers.com',
    phone: '+33 6 12 34 56 78',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    role: 'Administrateur Système'
  });

  const [editMode, setEditMode] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (previewAvatar) {
      setProfile(prev => ({ ...prev, avatar: previewAvatar }));
    }
    setEditMode(false);
    // Sauvegarde API ici
  };

  return (
    
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          <FontAwesomeIcon icon={faShieldAlt} className="mr-2 text-indigo-600" />
          Profil Administrateur
        </h1>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo de profil */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <img 
                  src={previewAvatar || profile.avatar} 
                  alt="Profil Admin" 
                  className="h-32 w-32 rounded-full object-cover border-4 border-indigo-100"
                />
                {editMode && (
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700"
                    title="Changer la photo"
                  >
                    <FontAwesomeIcon icon={faCamera} />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
              <div className="flex items-center mt-1">
                <FontAwesomeIcon icon={faCog} className="text-gray-400 mr-1" />
                <span className="text-gray-500">{profile.role}</span>
              </div>
            </div>

            {/* Informations */}
            <div className="flex-1">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                        Nom complet
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-400" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setPreviewAvatar(null);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                      >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Enregistrer
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                      Nom complet
                    </h3>
                    <p className="mt-1 text-gray-800">{profile.name}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-gray-400" />
                      Email
                    </h3>
                    <p className="mt-1 text-gray-800">{profile.email}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
                      Téléphone
                    </h3>
                    <p className="mt-1 text-gray-800">{profile.phone}</p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Modifier le profil
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default ProfileAdmin;