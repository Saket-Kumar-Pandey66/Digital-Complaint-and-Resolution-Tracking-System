import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Pending':
      case 'Submitted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStyle()} flex items-center w-fit shadow-sm`}>
      {status === 'Pending' || status === 'Submitted' ? <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span> : null}
      {status === 'In Progress' ? <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span> : null}
      {status === 'Resolved' ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> : null}
      {status}
    </span>
  );
};

export default StatusBadge;
