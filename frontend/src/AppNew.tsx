// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Utensils, Gamepad2, Bath, Coins, Star, Clock, Trophy, Home, User, Settings } from 'lucide-react';
import background from './assets/bg.gif';
import petGif from './assets/ch.gif';
import eat from './assets/eat.gif'; 
// 元件
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import StatsView from './components/StatsView';
import { getPetEmoji } from './utils/petStatusUtils';
import { showNotificationMessage } from './utils/notificationUtils';
import { usePetStatus } from './hooks/usePetStatus';

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
    soap: 4,
  });

  const intervalRef = useRef();

// 成就系統(已搬移achievements)


// 自動狀態衰減()
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPet((prev) => {
        const newPet = {
          ...prev,
          hunger: Math.max(0, prev.hunger - 0.5),
          happiness: Math.max(0, prev.happiness - 0.3),
          energy: Math.max(0, prev.energy - 0.2),
          cleanliness: Math.max(0, prev.cleanliness - 0.4),
          totalPlayTime: prev.totalPlayTime + 1,
        };
        const avgStatus =
          (newPet.hunger + newPet.happiness + newPet.energy + newPet.cleanliness) / 4;
        newPet.health = Math.min(100, Math.max(0, avgStatus));
        return newPet;
      });
    }, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

// 經驗值和等級系統
  const notify = (msg) => {
    showNotificationMessage(msg, setShowNotification);
  };

  const petActions = usePetStatus({ pet, setPet, inventory, setInventory, notify });

  // 已搬移 addExp, feedPet, playWithPet, cleanPet, restPet, buyItem
  // 已搬移 getStatusColor, getPetEmoji

  // 已搬移 StatusBar, ActionButton
  // 已搬移 HomeView, ShopView, StatsView

return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-200 overflow-hidden">
    {/* 手機框 */}
      <div
        className="w-[484px] h-[726px] rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-indigo-300/60 bg-white/10 backdrop-blur-md flex flex-col"
        // 只在首頁顯示背景，其餘 view 傳 'none'
        style={{
          backgroundImage: currentView === 'home' ? `url(${background})` : 'none',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
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

        {/* 中間內容 */}
        <div className="flex-1 overflow-y-auto p-4">
          {currentView === 'home' && (
            <HomeView pet={pet} inventory={inventory} actions={petActions} />
          )}
          {currentView === 'shop' && (
            <ShopView pet={pet} buyItem={petActions.buyItem} />
          )}
          {currentView === 'stats' && <StatsView pet={pet} />}
        </div>
        
         {/* 底部導航*/}
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