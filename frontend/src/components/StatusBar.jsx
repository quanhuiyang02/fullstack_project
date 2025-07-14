// src/components/StatusBar.jsx

import React from 'react';
import { getStatusColor } from '../utils/petStatus'; // Adjust the import path as necessary

const StatusBar = ({ label, value, icon, color }) => {

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm">
      <div className="flex items-center space-x-2 mb-2"> {/*刪除justify-between*/}
        {/*刪除<div className="flex items-center space-x-2">*/}
          {icon}
          <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold">{Math.round(value)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStatusColor(value)}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
};

export default StatusBar;