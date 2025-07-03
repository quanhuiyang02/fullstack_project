// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Utensils, Gamepad2, Bath, Coins, Star, Clock, Trophy, Home, User, Settings } from 'lucide-react';
import background from './assets/bg.gif';
import petGif from './assets/ch.gif';  
import eat from './assets/eat.gif';  
const VirtualPetGame = () => {
  // 遊戲狀態
  const [pet, setPet] = useState({
    name: "小貓咪",
    type: "cat",
    level: 1,
    exp: 0,
    health: 80,
    hunger: 60,
    happiness: 70,
    energy: 85,
    cleanliness: 75,
    coins: 100,
    totalPlayTime: 0,
    achievements: [],
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    lastCleaned: Date.now()
  });

  const [currentView, setCurrentView] = useState('home');
  const [showNotification, setShowNotification] = useState('');
  const [inventory, setInventory] = useState({
    food: 5,
    toys: 3,
    medicine: 2,
    soap: 4
  });

  const intervalRef = useRef();

  // 成就系統
  const achievements = [
    { id: 'first_feed', name: '第一次餵食', description: '餵食寵物一次', icon: '🍖', unlocked: false },
    { id: 'first_play', name: '第一次遊戲', description: '和寵物玩耍一次', icon: '🎾', unlocked: false },
    { id: 'reach_level_5', name: '成長達人', description: '達到等級5', icon: '⭐', unlocked: false },
    { id: 'earn_500_coins', name: '小富翁', description: '累積500金幣', icon: '💰', unlocked: false }
  ];

  // 自動狀態衰減
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPet(prev => {
        const now = Date.now();
        const timeDiff = (now - prev.lastFed) / (1000 * 60); // 分鐘
        
        const newPet = {
          ...prev,
          hunger: Math.max(0, prev.hunger - 0.5),
          happiness: Math.max(0, prev.happiness - 0.3),
          energy: Math.max(0, prev.energy - 0.2),
          cleanliness: Math.max(0, prev.cleanliness - 0.4),
          totalPlayTime: prev.totalPlayTime + 1
        };

        // 健康值根據其他狀態計算
        const avgStatus = (newPet.hunger + newPet.happiness + newPet.energy + newPet.cleanliness) / 4;
        newPet.health = Math.min(100, Math.max(0, avgStatus));

        return newPet;
      });
    }, 30000); // 每30秒更新一次

    return () => clearInterval(intervalRef.current);
  }, []);

  // 經驗值和等級系統
  const addExp = (amount) => {
    setPet(prev => {
      const newExp = prev.exp + amount;
      const newLevel = Math.floor(newExp / 100) + 1;
      const leveledUp = newLevel > prev.level;
      
      if (leveledUp) {
        showNotificationMessage(`恭喜！${prev.name}升到了等級${newLevel}！`);
      }
      
      return {
        ...prev,
        exp: newExp,
        level: newLevel,
        coins: leveledUp ? prev.coins + 50 : prev.coins
      };
    });
  };

  const showNotificationMessage = (message) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(''), 3000);
  };

  const feedPet = () => {
    if (inventory.food > 0) {
      setPet(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 25),
        happiness: Math.min(100, prev.happiness + 10),
        lastFed: Date.now()
      }));
      setInventory(prev => ({ ...prev, food: prev.food - 1 }));
      addExp(10);
      showNotificationMessage(`${pet.name}很開心地吃完了食物！`);
    } else {
      showNotificationMessage('沒有食物了！去商店購買吧！');
    }
  };

  const playWithPet = () => {
    if (pet.energy > 20) {
      setPet(prev => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 20),
        energy: Math.max(0, prev.energy - 15),
        lastPlayed: Date.now()
      }));
      addExp(15);
      const earnedCoins = Math.floor(Math.random() * 10) + 5;
      setPet(prev => ({ ...prev, coins: prev.coins + earnedCoins }));
      showNotificationMessage(`和${pet.name}玩得很開心！獲得了${earnedCoins}金幣！`);
    } else {
      showNotificationMessage(`${pet.name}太累了，讓它休息一下吧！`);
    }
  };

  const cleanPet = () => {
    if (inventory.soap > 0) {
      setPet(prev => ({
        ...prev,
        cleanliness: Math.min(100, prev.cleanliness + 30),
        happiness: Math.min(100, prev.happiness + 5),
        lastCleaned: Date.now()
      }));
      setInventory(prev => ({ ...prev, soap: prev.soap - 1 }));
      addExp(8);
      showNotificationMessage(`${pet.name}現在乾乾淨淨的！`);
    } else {
      showNotificationMessage('沒有肥皂了！去商店購買吧！');
    }
  };

  const restPet = () => {
    setPet(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      health: Math.min(100, prev.health + 10)
    }));
    showNotificationMessage(`${pet.name}睡了個好覺！`);
  };

  const buyItem = (item, cost) => {
    if (pet.coins >= cost) {
      setPet(prev => ({ ...prev, coins: prev.coins - cost }));
      setInventory(prev => ({ ...prev, [item]: prev[item] + 1 }));
      showNotificationMessage(`購買了${item === 'food' ? '食物' : item === 'soap' ? '肥皂' : '玩具'}！`);
    } else {
      showNotificationMessage('金幣不足！');
    }
  };

  const getStatusColor = (value) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPetEmoji = () => {
    if (pet.health < 30) return '😵';
    if (pet.hunger < 30) return '😋';
    if (pet.happiness < 30) return '😢';
    if (pet.energy < 30) return '😴';
    if (pet.cleanliness < 30) return '🤢';
    return '😊';
  };

  const StatusBar = ({ label, value, icon, color }) => (
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

  const ActionButton = ({ onClick, disabled, children, color = "bg-blue-500" }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${color} text-white px-2 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg`}
    >
      {children}
    </button>
  );

  const HomeView = () => (
    <div className="flex flex-col flex-1 overflow-hidden relative">
       <img
          src={petGif}
          alt="寵物"
          className="w-[192px] h-[192px] object-contain absolute z-10 pointer-events-none"
          style={{ right: '1rem', bottom: '6rem' }}  
          />
      {/* 上半部：寵物顯示區域 + 狀態條 */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto space-y-6 pb-2 max-h-[calc(100%-100px)]">
        {/* 寵物顯示區域 */}
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 text-center shadow-lg relative">
          <div className="text-8xl mb-4 animate-bounce">
            {getPetEmoji()}
          </div>
         
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h2>
          <p className="text-gray-600">等級 {pet.level} • 經驗值 {pet.exp}/100</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(pet.exp % 100)}%` }}
            />
          </div>
        </div>
  
        {/* 狀態欄 */}
        <div className="grid grid-cols-1 gap-3">
          <StatusBar label="健康" value={pet.health} icon={<Heart className="w-4 h-4 text-red-500" />} />
          <StatusBar label="飢餓" value={pet.hunger} icon={<Utensils className="w-4 h-4 text-orange-500" />} />
          <StatusBar label="快樂" value={pet.happiness} icon={<Star className="w-4 h-4 text-yellow-500" />} />
          <StatusBar label="精力" value={pet.energy} icon={<Clock className="w-4 h-4 text-blue-500" />} />
          <StatusBar label="清潔" value={pet.cleanliness} icon={<Bath className="w-4 h-4 text-cyan-500" />} />
        </div>
      </div>
  
      {/* 下半部：操作按鈕固定在底部上方 */}
      <div className="mt-auto px-4 pb-2">
        <div className="w-full flex justify-between items-center gap-x-2">
          <ActionButton onClick={feedPet} disabled={inventory.food === 0} color="bg-orange-500">
            <div className="flex flex-col items-center text-xs">
              <Utensils className="w-5 h-5 mb-1" />
              餵食
            </div>
          </ActionButton>
          <ActionButton onClick={playWithPet} disabled={pet.energy < 20} color="bg-green-500">
            <div className="flex flex-col items-center text-xs">
              <Gamepad2 className="w-5 h-5 mb-1" />
              遊戲
            </div>
          </ActionButton>
          <ActionButton onClick={cleanPet} disabled={inventory.soap === 0} color="bg-cyan-500">
            <div className="flex flex-col items-center text-xs">
              <Bath className="w-5 h-5 mb-1" />
              清潔
            </div>
          </ActionButton>
          <ActionButton onClick={restPet} color="bg-purple-500">
            <div className="flex flex-col items-center text-xs">
              <Clock className="w-5 h-5 mb-1" />
              休息
            </div>
          </ActionButton>
        </div>
      </div>
    </div>
  );
  

  const ShopView = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">商店</h2>
      <div className="bg-yellow-100 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <Coins className="w-5 h-5 text-yellow-600 mr-2" />
          <span className="font-bold text-yellow-800">金幣: {pet.coins}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-medium">🍖 寵物食物</h3>
            <p className="text-sm text-gray-600">恢復25點飢餓值</p>
          </div>
          <ActionButton onClick={() => buyItem('food', 20)} disabled={pet.coins < 20}>
            20金幣
          </ActionButton>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-medium">🧼 清潔用品</h3>
            <p className="text-sm text-gray-600">恢復30點清潔值</p>
          </div>
          <ActionButton onClick={() => buyItem('soap', 15)} disabled={pet.coins < 15}>
            15金幣
          </ActionButton>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-medium">🎾 玩具</h3>
            <p className="text-sm text-gray-600">增加遊戲樂趣</p>
          </div>
          <ActionButton onClick={() => buyItem('toys', 25)} disabled={pet.coins < 25}>
            25金幣
          </ActionButton>
        </div>
      </div>
    </div>
  );

  const StatsView = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">統計</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{pet.level}</div>
          <div className="text-sm text-gray-600">等級</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">{pet.coins}</div>
          <div className="text-sm text-gray-600">金幣</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-purple-600">{Math.floor(pet.totalPlayTime / 60)}</div>
          <div className="text-sm text-gray-600">遊戲時間(分)</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-orange-600">{pet.exp}</div>
          <div className="text-sm text-gray-600">總經驗值</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-3 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          成就
        </h3>
        <div className="space-y-2">
          {achievements.map(achievement => (
            <div key={achievement.id} className="flex items-center p-2 bg-gray-50 rounded">
              <span className="text-2xl mr-3">{achievement.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{achievement.name}</div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
              </div>
              <div className={`w-4 h-4 rounded-full ${achievement.unlocked ? 'bg-green-500' : 'bg-gray-300'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-200 overflow-hidden">
      {/* 📱 手機框 */}
      <div
  className="w-[484px] h-[726px] rounded-[2rem] overflow-hidden shadow-xl
             ring-4 ring-indigo-300/60 bg-white/10 backdrop-blur-md flex flex-col"
  style={{
    // 只在首頁顯示背景，其餘 view 傳 'none'
    backgroundImage: currentView === 'home' ? `url(${background})` : 'none',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  }}
>

        {/* 通知 */}
        {showNotification && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
            {showNotification}
          </div>
        )}
  
        {/* 頂部欄 */}
        <div className="bg-white/80 p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">虛擬寵物</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Coins className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-medium">{pet.coins}</span>
              </div>
            </div>
          </div>
        </div>
  
        {/* 中間內容，讓它佔滿剩下高度，避免溢出 */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentView === 'home' && <HomeView />}
          {currentView === 'shop' && <ShopView />}
          {currentView === 'stats' && <StatsView />}
        </div>
  
        {/* ✅ 底部導航「放在 flex 結構的最下層」，不使用 fixed/absolute */}
        <div className="bg-white border-t shadow-lg">
          <div className="flex justify-around py-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                currentView === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs mt-1">首頁</span>
            </button>
  
            <button
              onClick={() => setCurrentView('shop')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                currentView === 'shop' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
              }`}
            >
              <Coins className="w-5 h-5" />
              <span className="text-xs mt-1">商店</span>
            </button>
  
            <button
              onClick={() => setCurrentView('stats')}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                currentView === 'stats' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="text-xs mt-1">統計</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  
  
};

export default VirtualPetGame;

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
