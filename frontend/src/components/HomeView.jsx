// src/components/HomeView.jsx
// @ts-nocheck
import React, { useState } from 'react';
import { Heart, Utensils, Gamepad2, Bath, Star, Clock } from 'lucide-react';
import petGif from '../assets/ch.gif';
import eat from'../assets/eat.gif';
import play from '../assets/play.gif';
import bathGif from '../assets/bath.gif';
import restGif from '../assets/rest.gif';
import StatusBar from './StatusBar';
import ActionButton from './ActionButton';
import { getPetEmoji } from '../utils/petEmoji';
import ExpBar from './ExpBar';

const HomeView = ({ pet, inventory, feedPet, playWithPet, cleanPet, restPet }) => {
  //新增動畫狀態
  const [isActing, setIsActing] = useState(false); // ★ 新增動作鎖
  const [petAnim, setPetAnim] = useState('idle');
  /* ③ 包一層 handleFeed：先切動畫再呼叫父層 feedPet */
  const animSrc = {
    idle  : petGif,
    eating: eat,
    playing: play,
    cleaning: bathGif,
    resting: restGif,
  };
  
  /* ② 通用觸發器：給動畫 key、動作函式、時長 */
  const triggerAnim = (key, action, ms = 4000) => {
    if (isActing) return;        // 已鎖 → 不可再觸發
    setIsActing(true);           // 上鎖
    setPetAnim(key);             // 播動畫
    action();                    // 呼叫父層
    setTimeout(() => {
      setPetAnim('idle');        // 動畫恢復
      setIsActing(false);        // 解鎖
    }, ms);
  };
  
  /* ③ 各動作 handler，只佔一行 */
  const handleFeed  = () => triggerAnim('eating',  feedPet);
  const handlePlay  = () => triggerAnim('playing', playWithPet);
  const handleClean = () => triggerAnim('cleaning', cleanPet);
  const handleRest  = () => triggerAnim('resting', restPet, 5000); // 休息久一點
 
  {/*const handleFeed = () => { 
    setPetAnim('eating');   // 顯示吃飯 GIF
    feedPet();              // 執行原本餵食
    setTimeout(() => setPetAnim('idle'), 4000); // 2.5秒後切回
  };*/}

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      <img
        //刪除src={petAnim === 'eating' ? eat : petGif}改為以下
        src={animSrc[petAnim] ?? petGif}
        alt="寵物"
        className="absolute bottom-4 right-4 w-[192px] h-[192px] object-contain z-10 pointer-events-none"
        style={{ right: '1rem', bottom: '6rem' }}
      />
      <ExpBar level={pet.level} exp={pet.exp}
      
      style={{
        position: 'absolute',
        right:    '1rem',    // 與圖片同行
        bottom:   '4.6rem',    // 圖片底是 6rem → 往上 2rem
        height:     '19px'
      }}
    />
      <div className="flex-1 overflow-x-hidden overflow-y-auto space-y-6 pb-2 max-h-[calc(100%-100px)]">
        <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 text-center shadow-lg relative">
          <div className="text-8xl mb-4 animate-bounce">{getPetEmoji(pet)}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{pet.name}</h2>
          {/*<ExpBar level={pet.level} exp={pet.exp} />整段換成經驗條*/}
        </div>

        <div className="absolute top-40 flex flex-col z-50"style={{ bottom: '4.5rem',left: '4px',gap: '3px', width: '110px' }}>
          <StatusBar label="健康" value={pet.health} icon={<Heart size={17} className="w-4 h-4 text-red-500" />} />
          <StatusBar label="飢餓" value={pet.hunger} icon={<Utensils size={17} className="w-4 h-4 text-orange-500" />} />
          <StatusBar label="快樂" value={pet.happiness} icon={<Star size={17} className="w-4 h-4 text-yellow-500" />} />
          <StatusBar label="精力" value={pet.energy} icon={<Clock size={17} className="w-4 h-4 text-blue-500" />} />
          <StatusBar label="清潔" value={pet.cleanliness} icon={<Bath size={17} className="w-4 h-4 text-cyan-500" />} />
        </div>
      </div>

      <div className="mt-auto pb-2">
       <div style={{ display: 'flex', gap: '2px',width: '100%' }}>
          <ActionButton onClick={handleFeed} disabled={inventory.food === 0|| isActing} color="bg-transparent"style={{ flex: 1 }}>
            <div className="flex flex-col items-center text-xs">
              <Utensils className="w-5 h-5 mb-1" />
              餵食
            </div>
          </ActionButton>
          <ActionButton onClick={handlePlay} disabled={pet.energy < 20|| isActing} color="bg-transparent"style={{ flex: 1 }}>
            <div className="flex flex-col items-center text-xs">
              <Gamepad2 className="w-5 h-5 mb-1" />
              遊戲
            </div>
          </ActionButton>
          <ActionButton onClick={handleClean} disabled={inventory.soap === 0|| isActing} color="bg-transparent"style={{ flex: 1 }}>
            <div className="flex flex-col items-center text-xs">
              <Bath className="w-5 h-5 mb-1" />
              清潔
            </div>
          </ActionButton>
          <ActionButton onClick={handleRest} disabled={isActing} color="bg-transparent"style={{ flex: 1 }}>
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