import React from 'react';

const MAX_LEVEL = 30;

// 每個等級的經驗值需求：LV1=100, LV2=150, ..., LV30=1550
const getMaxExpForLevel = (level) => {
  return 100 + (level - 1) * 50;
};

// 根據總經驗計算目前等級與該等級的起始經驗
const getLevelFromExp = (exp) => {
  let level = 1;
  let accumulated = 0;

  for (let i = 1; i < MAX_LEVEL; i++) {
    const need = getMaxExpForLevel(i);
    if (exp >= accumulated + need) {
      accumulated += need;
      level++;
    } else {
      break;
    }
  }

  return { level, expBeforeLevel: accumulated };
};

const ExpBar = ({ exp, style }) => {
  const { level, expBeforeLevel } = getLevelFromExp(exp);
  const isMaxLevel = level >= MAX_LEVEL;
  const maxExp = isMaxLevel ? 0 : getMaxExpForLevel(level);
  const currExpInLevel = isMaxLevel ? 0 : exp - expBeforeLevel;
  const progress = isMaxLevel ? 100 : Math.min((currExpInLevel / maxExp) * 100, 100);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '192px',
        padding: '4px 6px',
        borderRadius: '8px',
        background: 'rgba(34,197,94,0.25)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        ...style,
      }}
    >
      {/* 等級文字 */}
      <span style={{ minWidth: '48px', fontWeight: 700, color: '#22c55e' }}>
        LV&nbsp;{level}
      </span>

      {/* 經驗條背景 */}
      <div
        style={{
          position: 'relative',
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          height: '8px',
          borderRadius: '6px',
          background: 'rgba(34,197,94,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* 綠色進度條 */}
        <div
          style={{
            width: `${progress}%`,
            height: '6px',
            background: '#22c55e',
            transition: 'width 0.3s',
          }}
        />
      </div>

      {/* 經驗數字文字 */}
      <span
        style={{
          minWidth: '60px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#22c55e',
          textAlign: 'right',
        }}
      >
        {isMaxLevel ? 'MAX' : `${currExpInLevel}/${maxExp}`}
      </span>
    </div>
  );
};

export default ExpBar;