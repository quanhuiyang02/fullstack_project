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

