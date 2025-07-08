import React from 'react';
import { useGame } from '../hooks/useGame';

const GameView = () => {
  // 只需一行，即可獲取所有狀態和操作
  const { pet, inventory, shopItems, isLoading, error, actions } = useGame();

  // 處理初始載入和錯誤狀態
  if (isLoading && !pet.name) { // 初始載入中
    return <div>正在載入遊戲...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>我的寵物：{pet.name}</h1>
      <p>飽食度: {pet.hunger}</p>
      <p>清潔度: {pet.cleanliness}</p>
      <p>心情: {pet.happiness}</p>
      
      {/* 即使在操作進行中，isLoading 也會是 true，
        可以用來禁用按鈕或顯示載入指示器
      */}
      <button onClick={actions.cleanPet} disabled={isLoading}>
        {isLoading ? '清潔中...' : '幫牠洗澡'}
      </button>

      <button 
        onClick={() => actions.updatePetStats({ happiness: pet.happiness + 10 })}
        disabled={isLoading}
      >
        {isLoading ? '更新中...' : '增加心情'}
      </button>
      
      <hr />
      
      <h2>我的庫存</h2>
      <ul>
        {inventory.map(item => (
          <li key={item.id}>{item.name} x {item.quantity}</li>
        ))}
      </ul>
      
      <hr />

      <h2>商店</h2>
      <ul>
        {shopItems.map(item => (
          <li key={item.id}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default GameView;