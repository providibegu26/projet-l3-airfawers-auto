import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTools, faCar, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const NotificationsChauffeur = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: faTools,
      message: "Entretien prévu pour le 05/07/2025.",
      date: "Il y a 2h",
      read: false
    },
    {
      id: 2,
      icon: faCar,
      message: "Votre véhicule a été mis à jour.",
      date: "Hier",
      read: true
    },
    {
      id: 3,
      icon: faExclamationTriangle,
      message: "Nouvelle panne signalée sur votre trajet précédent.",
      date: "Il y a 3 jours",
      read: false
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FontAwesomeIcon icon={faBell} className="text-indigo-600 mr-2" />
        Notifications
      </h1>

      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">Aucune notification.</p>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 flex items-start justify-between ${notif.read ? "bg-white" : "bg-indigo-50"}`}
            >
              <div className="flex items-start gap-4">
                <FontAwesomeIcon
                  icon={notif.icon}
                  className={`text-xl mt-1 ${
                    notif.read ? "text-gray-400" : "text-indigo-600"
                  }`}
                />
                <div>
                  <p className={`text-sm ${notif.read ? "text-gray-500" : "text-gray-800 font-semibold"}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400">{notif.date}</p>
                </div>
              </div>
              {!notif.read && (
                <button
                  onClick={() => markAsRead(notif.id)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  Marquer comme lu
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsChauffeur;
