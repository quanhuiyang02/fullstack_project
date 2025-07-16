// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Utensils, Gamepad2, Bath, Coins, Star, Clock, Trophy, Home, User, Settings } from 'lucide-react';
import background from './assets/bg.gif';
import petGif from './assets/ch.gif';
import eat from './assets/eat.gif';
import shopbackground from './assets/shopbg.gif';
import statsbackground from './assets/statsbg.gif';
// 元件
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import StatsView from './components/StatsView';
import { showNotificationMessage } from './utils/notificationUtils';
import { handleLevelUp } from './utils/expUtils';
import useSoundEffects from './hooks/useSoundEffect';

const VirtualPetGame = () => {
  // 遊戲狀態
  const [pet, setPet] = useState({
    name: "臭屁星人",
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
  const { playClick, playMagic, playCoin, playStatsMusic, stopStatsMusic } = useSoundEffects();

  useEffect(() => {
  if (currentView === 'stats') {
    playStatsMusic();
  } else {
    stopStatsMusic();
  }
}, [currentView]);



  // 啟用通知函數
  const notify = (message) => showNotificationMessage(message, setShowNotification);

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
        setPet((prev) => {
          const newPet = {
            ...prev,
            hunger: Math.max(0, prev.hunger - 0.5),
            happiness: Math.max(0, prev.happiness - 0.3),
            energy: Math.max(0, prev.energy - 0.2),
            cleanliness: Math.max(0, prev.cleanliness - 0.4),
            totalPlayTime: prev.totalPlayTime + 1,
          };

          // 健康值根據其他狀態計算
          const avgStatus =
            (newPet.hunger + newPet.happiness + newPet.energy + newPet.cleanliness) / 4;
          newPet.health = Math.min(100, Math.max(0, avgStatus));
          return newPet;
        });
      }, 30000);// 每30秒更新一次

      return () => clearInterval(intervalRef.current);
    }, []);

  // 經驗值和等級系統
  const addExp = (amount) => {
    setPet(prev => handleLevelUp(prev, amount, notify));
  };

  const feedPet = () => {
    if (inventory.food > 0) {
      playMagic();
      setPet(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 25),
        happiness: Math.min(100, prev.happiness + 10),
        lastFed: Date.now()
      }));
      setInventory(prev => ({ ...prev, food: prev.food - 1 }));
      addExp(10);
      notify(`${pet.name}很開心地吃完了食物！`);
    } else {
      notify('沒有食物了！去商店購買吧！');
    }
  };

  const playWithPet = () => {
    if (pet.energy > 20) {
      playMagic();
      setPet(prev => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 20),
        energy: Math.max(0, prev.energy - 15),
        lastPlayed: Date.now()
      }));
      addExp(15);
      const earnedCoins = Math.floor(Math.random() * 10) + 5;
      setPet(prev => ({ ...prev, coins: prev.coins + earnedCoins }));
      notify(`和${pet.name}玩得很開心！獲得了${earnedCoins}金幣！`);
    } else {
      notify(`${pet.name}太累了，讓它休息一下吧！`);
    }
  };

  const cleanPet = () => {
    if (inventory.soap > 0) {
      playMagic();
      setPet(prev => ({
        ...prev,
        cleanliness: Math.min(100, prev.cleanliness + 30),
        happiness: Math.min(100, prev.happiness + 5),
        lastCleaned: Date.now()
      }));
      setInventory(prev => ({ ...prev, soap: prev.soap - 1 }));
      addExp(8);
      notify(`${pet.name}現在乾乾淨淨的！`);
    } else {
      notify('沒有肥皂了！去商店購買吧！');
    }
  };

  const restPet = () => {
    playMagic();
    setPet(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      health: Math.min(100, prev.health + 10)
    }));
    notify(`${pet.name}睡了個好覺！`);
  };

  const buyItem = (item, cost) => {
    if (pet.coins >= cost) {
      setPet(prev => ({ ...prev, coins: prev.coins - cost }));
      setInventory(prev => ({ ...prev, [item]: prev[item] + 1 }));
      notify(`購買了${item === 'food' ? '食物' : item === 'soap' ? '肥皂' : '玩具'}！`);
    } else {
      notify('金幣不足！');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-200 overflow-hidden">
      {/* 📱 手機框 */}
      <div
        className="w-[434px] h-[651px] rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-indigo-300/60 bg-white/10 backdrop-blur-md flex flex-col"
        style={{
          backgroundImage: 
          currentView === 'home' ? `url(${background})` 
          : currentView === 'shop' ? `url(${shopbackground})` 
          : currentView === 'stats' ? `url(${statsbackground})` : 'none',
          backgroundSize: 'cover',           // 滿版不留白
          backgroundRepeat: 'no-repeat',
           backgroundPosition: 'center center'   // 垂直水平置中
        }}
      >
      {/* 通知 */}
      {showNotification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          {showNotification}
        </div>
      )}
       {/* 頂部欄 */}
      <div className="relative bg-white/80 p-4 shadow-sm flex justify-center">
        {/* 只有非 shop 頁面才顯示標題 */}
        {currentView !== 'shop' && (
          <h1 className="text-xl font-bold text-gray-800">心寵生活</h1>
        )}

        {/* 金幣顯示區 */}
        <div
          className="absolute top-8 flex items-center space-x-1"
          style={{ right: '5%' }}
        >
          <Coins style={{ color: '#eab308' }} size={32} className="text-yellow-600 mr-2" />
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#eab308',
            }}
          >
            金幣: {pet.coins}
          </span>
        </div>
      </div>
      {/* 主要內容區 */}
      <div className="flex-1 overflow-y-auto p-4">
        {currentView === 'home' && <HomeView pet={pet} inventory={inventory} feedPet={feedPet} playWithPet={playWithPet} cleanPet={cleanPet} restPet={restPet} />}
        {currentView === 'shop' && <ShopView pet={pet} buyItem={buyItem} playCoin={playCoin}/>}
        {currentView === 'stats' && <StatsView pet={pet} achievements={achievements} />}
      </div>
      {/*  底部導航 */}
      <div className="shadow-lg"style={{backgroundColor:"#FFEBAC", borderTop: '0px solid rgb(0, 0, 0)'}}>
        <div style={{ display: 'flex', width: '100%',gap: '0px' }}>
          <button
            onClick={() => { playClick(); setCurrentView('home')}}
            className="bg-white flex flex-col items-center py-2 px-4 rounded-lg transition-colors"
              style={{flex: 1,
                backgroundColor: currentView === 'home' ? '#FFEBAC' : '#FFEBAC', // 激活時#F7B100，不激活時#C89600
                color: currentView === 'home' ? '#000000' : '#000000',            
                border: '1px solid #FFEBAC'                                         // 加個#C89600邊框（可選）
              }}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs mt-1">首頁</span>
          </button>

          <button
            onClick={() => { playClick(); setCurrentView('shop')}}
            className="bg-white flex flex-col items-center py-2 px-4 rounded-lg transition-colors"
              style={{flex: 1,
                backgroundColor: currentView === 'shop' ? '#FFEBAC' : '#FFEBAC', // 激活時#F7B100，不激活時#C89600
                color: currentView === 'shop' ? '#000000' : '#0000000',           
                border: '1px solid #FFEBAC'                                         // 加個#C89600邊框（可選）
              }}
          >
            <Coins className="w-5 h-5" />
            <span className="text-xs mt-1">商店</span>
          </button>

          <button
            onClick={() => { playClick(); setCurrentView('stats')}}
            className="bg-white flex flex-col items-center py-2 px-4 rounded-lg transition-colors"
            style={{flex: 1,
              backgroundColor: currentView === 'stats' ? '#FFEBAC' : '#FFEBAC', // 激活時#F7B100，不激活時#C89600
              color: currentView === 'stats' ? '#000000' : '#000000',          
              border: '1px solid #FFEBAC'                                         // 加個#C89600邊框（可選）
            }}
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