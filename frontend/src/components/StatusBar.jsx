// src/components/StatusBar.jsx

import React from 'react';
import { getStatusColor } from '../utils/petStatus'; // Adjust the import path as necessary

const StatusBar = ({ label, value, icon, color }) => {

  return (
    <div /* 原來整串 className 改成 inline style */
      style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        padding:        '4px 6px',
        gap:            '1px',
        borderRadius:   '8px',
        fontSize:       '14px',
        backgroundColor:getStatusColor(value),  // 半透明綠/黃/紅
        //border:         '1px solid rgba(255,255,255,0.7)',
        backdropFilter: 'blur(6px)',
        boxShadow:      '0 1px 3px rgba(0,0,0,0.15)',
      }}
    >
      {/* 左側：icon + 標籤 */}
      <div className="flex items-center space-x-1"style={{ whiteSpace:'nowrap',flexShrink:0,marginRight:'8px',}}>{/*禁止豎排 */}
        {icon}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>

      {/* 右側：百分比 */}
      <span className="text-sm font-bold">{Math.round(value)}%</span>
    </div>
  );
};

export default StatusBar;