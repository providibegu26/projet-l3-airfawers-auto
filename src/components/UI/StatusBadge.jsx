import React from 'react';

const statusClasses = {
  pending: 'text-red-500 bg-red-100',
  progress: 'text-orange-500 bg-orange-100',
  resolved: 'text-green-500 bg-green-100'
};

const statusLabels = {
  pending: 'En attente',
  progress: 'En cours',
  resolved: 'Résolue'
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;