// src/components/HomeView.jsx
import React from 'react';
import { Heart, Utensils, Star, Clock, Bath, Gamepad2 } from 'lucide-react';
import StatusBar from './StatusBar';
import ActionButton from './ActionButton';
import petGif from '../assets/ch.gif';
import { getPetEmoji } from '../utils/petStatusUtils'; // 若要處理 emoji，可保留

const HomeView = ({ pet, inventory, actions }) => {
  const { feedPet, playWithPet, cleanPet, restPet } = actions;

  const emoji = getPetEmoji(pet); // 傳入 pet

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      <img
        src={petGif}
        alt="寵物"
        className="w-[192px] h-[192px] object-contain absolute z-10 pointer-events-none"
        style={{ right: '1rem', bottom: '6rem' }}
      />

      <div className="flex-1 overflow-x-hidden overflow-y-auto space-y-6 pb-2 max-h-[calc(100%-100px)]">
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 text-center shadow-lg relative">
          <div className="text-8xl mb-4 animate-bounce">{emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{pet.name}</h2>
          <p className="text-gray-600">等級 {pet.level} • 經驗值 {pet.exp}/100</p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(pet.exp % 100)}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <StatusBar label="健康" value={pet.health} icon={<Heart className="w-4 h-4 text-red-500" />} />
          <StatusBar label="飢餓" value={pet.hunger} icon={<Utensils className="w-4 h-4 text-orange-500" />} />
          <StatusBar label="快樂" value={pet.happiness} icon={<Star className="w-4 h-4 text-yellow-500" />} />
          <StatusBar label="精力" value={pet.energy} icon={<Clock className="w-4 h-4 text-blue-500" />} />
          <StatusBar label="清潔" value={pet.cleanliness} icon={<Bath className="w-4 h-4 text-cyan-500" />} />
        </div>
      </div>

      <div className="mt-auto px-4 pb-2">
        <div className="w-full flex justify-between items-center gap-x-2">
          <ActionButton onClick={feedPet} disabled={inventory.food === 0} color="bg-orange-500">
            <div className="flex flex-col items-center text-xs">
              <Utensils className="w-5 h-5 mb-1" /> 餵食
            </div>
          </ActionButton>
          <ActionButton onClick={playWithPet} disabled={pet.energy < 20} color="bg-green-500">
            <div className="flex flex-col items-center text-xs">
              <Gamepad2 className="w-5 h-5 mb-1" /> 遊戲
            </div>
          </ActionButton>
          <ActionButton onClick={cleanPet} disabled={inventory.soap === 0} color="bg-cyan-500">
            <div className="flex flex-col items-center text-xs">
              <Bath className="w-5 h-5 mb-1" /> 清潔
            </div>
          </ActionButton>
          <ActionButton onClick={restPet} color="bg-purple-500">
            <div className="flex flex-col items-center text-xs">
              <Clock className="w-5 h-5 mb-1" /> 休息
            </div>
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
