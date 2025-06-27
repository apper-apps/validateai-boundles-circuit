import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: 'Clock',
      classes: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    validated: {
      label: 'Validated',
      icon: 'CheckCircle',
      classes: 'bg-green-100 text-green-800 border-green-200'
    },
    rejected: {
      label: 'Rejected',
      icon: 'XCircle',
      classes: 'bg-red-100 text-red-800 border-red-200'
    },
    'in-review': {
      label: 'In Review',
      icon: 'Eye',
      classes: 'bg-blue-100 text-blue-800 border-blue-200'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`status-badge border ${config.classes} ${className}`}>
      <ApperIcon name={config.icon} className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

export default StatusBadge;