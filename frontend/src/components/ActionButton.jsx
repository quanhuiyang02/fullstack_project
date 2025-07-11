// src/components/ActionButton.jsx

import React from 'react';

//自定義顏色與寬度
const ActionButton = ({ onClick, disabled, children, color = "bg-blue-500", padding = "px-2 py-2" }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${color} text-white ${padding} rounded-lg font-medium transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg`}
  >
    {children}
  </button>
);

export default ActionButton;