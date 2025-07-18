// src/hooks/usePetActions.jsx
import { useCallback } from 'react';
import { handleLevelUp } from '../utils/expUtils';
import { showNotificationMessage } from '../utils/notificationUtils';

const usePetActions = ({
  pet,
  setPet,
  inventory,
  setInventory,
  notify,
  playMagic,
  addExp,
}) => {

  const feedPet = useCallback(() => {
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
  }, [inventory, pet.name]);

  const playWithPet = useCallback(() => {
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
  }, [pet.energy, pet.name]);

  const cleanPet = useCallback(() => {
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
  }, [inventory, pet.name]);

  const restPet = useCallback(() => {
    playMagic();
    setPet(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      health: Math.min(100, prev.health + 10)
    }));
    notify(`${pet.name}睡了個好覺！`);
  }, [pet.name]);

  return {
    feedPet,
    playWithPet,
    cleanPet,
    restPet
  };
};

export default usePetActions;