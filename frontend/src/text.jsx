  // APP.jsx
import shopbackground from './assets/shopbg.png';
import statsbackground from './assets/statsbg.gif';


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
      className="w-[434px] h-[651px] rounded-[2rem] overflow-hidden shadow-xl
                 ring-4 ring-indigo-300/60 bg-white/10 backdrop-blur-md flex flex-col"
      style={{
        backgroundImage:
          currentView === 
          'home' ? `url(${background})` : currentView === 'shop'
            ? `url(${shopbackground})`: currentView === 'stats'
            ? `url(${statsbackground})`
            : 'none',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      {/* 子元件放這裡 */}
    </div>
  </div>
);


// src/components/ShopView.jsx

import React from 'react';
import { Coins } from 'lucide-react';
import ActionButton from './ActionButton';
import shopBg from '../assets/shopbg.png'; // ✅ 匯入圖片

const ShopView = ({ pet, buyItem }) => {
  return (
    <div
      className="space-y-4 bg-cover bg-center bg-no-repeat min-h-screen p-4"
      style={{ backgroundImage: `url(${shopBg})` }} // ✅ 設定背景圖
    >
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
          <ActionButton onClick={() => buyItem('food', 20)} disabled={pet.coins < 20}>20金幣</ActionButton>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-medium">🧼 清潔用品</h3>
            <p className="text-sm text-gray-600">恢復30點清潔值</p>
          </div>
          <ActionButton onClick={() => buyItem('soap', 15)} disabled={pet.coins < 15}>15金幣</ActionButton>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
          <div>
            <h3 className="font-medium">🎾 玩具</h3>
            <p className="text-sm text-gray-600">增加遊戲樂趣</p>
          </div>
          <ActionButton onClick={() => buyItem('toys', 25)} disabled={pet.coins < 25}>25金幣</ActionButton>
        </div>
      </div>
    </div>
  );
};

export default ShopView;

// frontend/src/components/StatsView.jsx
// src/components/StatsView.jsx

import React from 'react';
import { Trophy } from 'lucide-react';
import statsBg from '../assets/statsbg.gif'; // 匯入背景圖

const StatCard = ({ value, label, color }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const AchievementItem = ({ icon, name, description, unlocked }) => (
  <div className="flex items-center p-2 bg-gray-50 rounded">
    <span className="text-2xl mr-3">{icon}</span>
    <div className="flex-1">
      <div className="font-medium">{name}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
    <div className={`w-4 h-4 rounded-full ${unlocked ? 'bg-green-500' : 'bg-gray-300'}`} />
  </div>
);

const StatsView = ({ pet, achievements }) => {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${statsBg})` }}
    >
      {/* 遮罩層 */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-0" />

      {/* 主要內容層 */}
      <div className="relative z-10 space-y-4 p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">統計</h2>

        <div className="grid grid-cols-2 gap-4">
          <StatCard value={pet.level} label="等級" color="text-blue-600" />
          <StatCard value={pet.coins} label="金幣" color="text-green-600" />
          <StatCard value={Math.floor(pet.totalPlayTime / 60)} label="遊戲時間(分)" color="text-purple-600" />
          <StatCard value={pet.exp} label="總經驗值" color="text-orange-600" />
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-bold mb-3 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" /> 成就
          </h3>
          <div className="space-y-2">
            {achievements.map((achievement) => (
              <AchievementItem
                key={achievement.id}
                icon={achievement.icon}
                name={achievement.name}
                description={achievement.description}
                unlocked={achievement.unlocked}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
