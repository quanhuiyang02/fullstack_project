import React from 'react';

const ExpBar = ({ level, exp, style }) => {
  const prog = exp % 100;                     // 0–99

  return (
    <div
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '8px',
        width:        '192px',                // 跟寵物圖同寬
        padding:      '4px 6px',
        borderRadius: '8px',
        background:   'rgba(34,197,94,0.25)', // 淡綠底
        backdropFilter:'blur(4px)',
        boxShadow:    '0 1px 3px rgba(0,0,0,0.15)',
        ...style,
      }}
    >
      {/* LV 文字 */}
      <span
        style={{ minWidth:'48px', fontWeight:700, color:'#22c55e' }}
      >
        LV&nbsp;{level}
      </span>

      {/* 綠色條 */}
      <div
        style={{
          position:   'relative',
          flexGrow:   1,
          display: 'flex',
          alignItems: 'center',
          height:     '8px',
          borderRadius:'6px',
          background: 'rgba(34,197,94,0.15)',
          overflow:   'hidden',
        }}
      >
        <div
          style={{
            width: `${prog}%`,
            height: '6px',
            background:'#22c55e',
            transition:'width 0.3s',
          }}
        />
      </div>

      {/* EXP 字 */}
      <span
        style={{ minWidth:'60px', fontSize:'12px', fontWeight:600, color:'#22c55e', textAlign:'right' }}
      >
        {exp}/100
      </span>
    </div>
  );
};

export default ExpBar;