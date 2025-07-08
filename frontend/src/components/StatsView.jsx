// src/components/StatsView.jsx

import React from 'react';
import { Trophy } from 'lucide-react';

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
    <div className="space-y-4">
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
  );
};

export default StatsView;
