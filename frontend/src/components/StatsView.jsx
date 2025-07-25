// src/components/StatsView.jsx
// @ts-nocheck
import React from 'react';
import { Trophy } from 'lucide-react';
import statsBg from '../assets/statsbg.gif';
import handup from '../assets/hu.gif';
import parchment from '../assets/parchment.png';

const StatsView = ({ pet, achievements }) => (
  
  <div className="space-y-4">
    {/* 主內容容器 */}
    <div className="z-10">
        {/* 左下角 PNG 圖 */}
        <img
          src={parchment}
          alt="Parchment background"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '300px',
            height: '300px',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.7,
          }}
        />

        {/* 右下角角色動畫圖 */}
        <img
          src={handup}
          alt="Pet waving"
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '150px',
            height: 'auto',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      
      {/* 統計區塊 */}
      <div className="mt-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-blue-500" />
          統計
        </h2>

        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-4 w-fit">
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-blue-600">{pet.level}</div>
              <div className="text-sm text-gray-600">等級</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-green-600">{pet.coins}</div>
              <div className="text-sm text-gray-600">金幣</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(pet.totalPlayTime / 60)}
              </div>
              <div className="text-sm text-gray-600">遊戲時間(分)</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-orange-600">{pet.exp}</div>
              <div className="text-sm text-gray-600">總經驗值</div>
            </div>
          </div>
        </div>
      </div>

      {/* 成就區塊 */}
      <div className="bg-white rounded-lg p-4 shadow-sm mt-8">
        
        <h3 className="font-bold mb-3 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
          成就 ({achievements.length}個)
        </h3>
        <div className="relative rounded-lg p-3 w-[280px] mx-auto backdrop-blur-sm bg-white/80">
          {achievements.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>還沒有解鎖任何成就</p>
              <p className="text-sm mt-1">繼續照顧你的寵物來獲得成就吧！</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center p-2 bg-gray-50 rounded">
                  <span className="text-2xl mr-3">{achievement.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default StatsView;
