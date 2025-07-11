// src/components/HomeView.jsx
// @ts-nocheck
import React, { useState } from 'react';                 // ←① 加上 useState
import { Heart, Utensils, Gamepad2, Bath, Star, Clock } from 'lucide-react';
import petGif from '../assets/ch.gif';
import { getPetEmoji } from '../utils/petStatusUtils';
import { getStatusColor } from '../utils/petStatusUtils';
import StatusBar from './StatusBar';
import ActionButton from './ActionButton';

/* ---------- HomeView ---------- */
const HomeView = ({ pet, inventory, feedPet, playWithPet, cleanPet, restPet }) => {
  
  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* ④ 根據 petAnim 決定顯示哪張 GIF */}
      <img
        src={petAnim === 'eating' ? eat : petGif}
        alt="寵物"
        className="absolute bottom-4 right-4 w-[192px] h-[192px] object-contain z-10 pointer-events-none"
        style={{ right: '1rem', bottom: '6rem' }}
      />

      {/* --------- 上半：角色資訊 --------- */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto space-y-6 pb-2 max-h-[calc(100%-100px)]">
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 text-center shadow-lg relative">
          <div className="text-8xl mb-4 animate-bounce">{getPetEmoji(pet)}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{pet.name}</h2>
          <p className="text-[2rem] font-bold text-pink-500">
            Lv: {pet.level} • EXP: {pet.exp}/100
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${pet.exp % 100}%` }}
            />
          </div>
        </div>

        {/* --------- 狀態條 --------- */}
        <div className="grid grid-cols-1 gap-3">
          <StatusBar label="健康"  value={pet.health}      icon={<Heart    className="w-4 h-4 text-red-500"    />} />
          <StatusBar label="飢餓"  value={pet.hunger}      icon={<Utensils className="w-4 h-4 text-orange-500" />} />
          <StatusBar label="快樂"  value={pet.happiness}   icon={<Star     className="w-4 h-4 text-yellow-500" />} />
          <StatusBar label="精力"  value={pet.energy}      icon={<Clock    className="w-4 h-4 text-blue-500"   />} />
          <StatusBar label="清潔"  value={pet.cleanliness} icon={<Bath     className="w-4 h-4 text-cyan-500"   />} />
        </div>
      </div>

      {/* --------- 下半：操作按鈕 --------- */}
      <div className="mt-auto px-4 pb-2">
        <div className="w-full flex justify-between items-center gap-x-2">
          {/* ⑤ 餵食按鈕用 handleFeed */}
          <ActionButton onClick={handleFeed} disabled={inventory.food === 0} color="bg-orange-500">
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
};

export default HomeView;
