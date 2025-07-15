// src/components/ShopView.jsx
// @ts-nocheck
import React from 'react';
import ActionButton from './ActionButton';

const ShopView = ({ pet, buyItem, playCoin }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">商店</h2>

    {/* 商品清單 */}
    <div className="space-y-4">
      {/* 食物 */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🍖</div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">寵物食物</h3>
            <p className="text-sm text-gray-500">恢復25點飢餓值</p>
          </div>
        </div>
        <ActionButton onClick={() => { playCoin(); buyItem('food', 20); }} disabled={pet.coins < 20} padding="px-3 py-2">20金幣</ActionButton>
      </div>

      {/* 肥皂 */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🧼</div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">清潔用品</h3>
            <p className="text-sm text-gray-500">恢復30點清潔值</p>
          </div>
        </div>
        <ActionButton onClick={() => { playCoin(); buyItem('soap', 15); }} disabled={pet.coins < 15} padding="px-3 py-2">15金幣</ActionButton>
      </div>

      {/* 玩具 */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">🎾</div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">玩具</h3>
            <p className="text-sm text-gray-500">增加遊戲樂趣</p>
          </div>
        </div>
        <ActionButton onClick={() => { playCoin(); buyItem('toys', 25); }} disabled={pet.coins < 25} padding="px-3 py-2">25金幣</ActionButton>
      </div>
    </div>
  </div>
);

export default ShopView;
