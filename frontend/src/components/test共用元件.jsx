// src/utils/petStatusUtils.js

export const getStatusColor = (value) => {
  if (value >= 70) return 'bg-green-500';
  if (value >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getPetEmoji = (pet) => {
  if (pet.health < 30) return '😵';
  if (pet.hunger < 30) return '😋';
  if (pet.happiness < 30) return '😢';
  if (pet.energy < 30) return '😴';
  if (pet.cleanliness < 30) return '🤢';
  return '😊';
};

// src/utils/notificationUtils.js

export const showNotificationMessage = (message, setShowNotification) => {
  setShowNotification(message);
  setTimeout(() => setShowNotification(''), 3000);
};

// src/components/common/StatusBar.jsx
import React from 'react';
import { getStatusColor } from '../../utils/petStatusUtils';

const StatusBar = ({ label, value, icon }) => (
  <div className="bg-white rounded-lg p-3 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
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

export default StatusBar;

// src/components/common/ActionButton.jsx
import React from 'react';

const ActionButton = ({ onClick, disabled, children, color = "bg-blue-500" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${color} text-white px-2 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg`}
  >
    {children}
  </button>
);

export default ActionButton;

// ✅ 修改 App.jsx 載入 showNotificationMessage
// import { showNotificationMessage } from './utils/notificationUtils';

// ✅ 修改 HomeView.jsx 引入 StatusBar、ActionButton、getPetEmoji
// import StatusBar from './common/StatusBar';
// import ActionButton from './common/ActionButton';
// import { getPetEmoji } from '../utils/petStatusUtils';