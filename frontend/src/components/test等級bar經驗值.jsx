const ExpBar = ({ level, exp }) => {
    const prog = exp % 100;        // 0–99
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', marginBottom:'8px' }}>
        {/* 外框 */}
        <div
          style={{
            position:'relative',
            width :'220px',          // 你想多寬自己改
            height:'10px',
            imageRendering:'pixelated',
  
            /* 黑色邊框 + 1px 內距模擬像素描邊 */
            background:'#000',
            padding:'2px',
            boxSizing:'content-box',
          }}
        >
          {/* 內框（白底） */}
          <div style={{
            position:'absolute',
            inset : 0,
            background:'#fff',
          }} />
  
          {/* 綠色進度條 */}
          <div style={{
            position:'absolute',
            top : 0,
            left: 0,
            width:`${prog}%`,
            height:'100%',
            background:'#8bc34a',   // 你想換顏色就改這裡
          }} />
  
          {/* 文字 EXP */}
          <span style={{
            position:'absolute',
            left :'6px',
            top  :'50%',
            transform:'translateY(-50%)',
            fontFamily:'"Press Start 2P", monospace',
            fontSize:'10px',
            color:'#000',
            pointerEvents:'none',
          }}>
            EXP
          </span>
  
          {/* 右下階梯效果：用 ::after 疊一格一格的白塊 */}
          <span style={{ }} />
        </div>
  
        {/* LV + 數字 */}
        <span style={{
          fontFamily:'"Press Start 2P", monospace',
          fontSize  :'12px',
          color     :'#ec4899',
        }}>
          LV {level}  •  {exp}/100
        </span>
      </div>
    );
  };
  
  const StatusBox = ({ label, value, icon }) => (
    <div
      /* 外框樣式 */
      style={{
        display        : 'flex',
        alignItems     : 'center',
        justifyContent : 'space-between',
  
        /* 框線 + 半透明底做毛玻璃感 */
        backgroundColor: 'rgba(194, 202, 77, 0.44)',
        backdropFilter : 'blur(6px)',
        WebkitBackdropFilter : 'blur(6px)',
        border         : '1.5px solid rgb(250, 245, 245)',
        borderRadius   : '0.5rem',
        padding        : '0.3rem 0.6rem',
      }}
    >
      {/* 左側：圖示 + 標籤 */}
      <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
        {icon}
        <span style={{ fontSize:'0.75rem', fontWeight:600 }}>{label}</span>
      </div>
  
      {/* 右側：百分比數字 */}
      <span style={{ fontSize:'0.8rem', fontWeight:700 }}>
        {Math.round(value)}%
      </span>
    </div>
  );