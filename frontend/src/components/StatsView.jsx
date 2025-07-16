// src/components/StatsView.jsx
// @ts-nocheck
import React from 'react';
import { Trophy } from 'lucide-react';
import statsBg from '../assets/statsbg.gif';
import handup from '../assets/handup.webp'; // <-- 載入 WebP 動畫

const StatsView = ({ pet, achievements }) => (
  <div className="relative space-y-4">
    {/* WebP 動畫背景圖（右下角） */}
    <img
      src={handup}
      alt="Pet waving"
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '150px',          // 可根據實際需求調整
        height: 'auto',
        pointerEvents: 'none',   // 不攔截滑鼠事件
        zIndex: 0,               // 確保在背景
      }}
    />

    {/* 主內容容器加上 padding 防止被遮住 */}
    <div className="relative z-10">
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

      <div className="bg-white rounded-lg p-4 shadow-sm mt-4">
        <h3 className="font-bold mb-3 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          成就
        </h3>
        <div className="space-y-2">
          {achievements.map((achievement) => (
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
  </div>
);

export default StatsView;
