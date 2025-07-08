// src/hooks/usePetStatus.js

export const usePetStatus = ({ pet, setPet, inventory, setInventory, notify }) => {
  const addExp = (amount) => {
    setPet((prev) => {
      const newExp = prev.exp + amount;
      const newLevel = Math.floor(newExp / 100) + 1;
      const leveledUp = newLevel > prev.level;
      if (leveledUp) notify(`恭喜！${prev.name}升到了等級${newLevel}！`);
      return {
        ...prev,
        exp: newExp,
        level: newLevel,
        coins: leveledUp ? prev.coins + 50 : prev.coins,
      };
    });
  };

  const feedPet = () => {
    if (inventory.food > 0) {
      setPet((prev) => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 25),
        happiness: Math.min(100, prev.happiness + 10),
        lastFed: Date.now(),
      }));
      setInventory((prev) => ({ ...prev, food: prev.food - 1 }));
      addExp(10);
      notify(`${pet.name}很開心地吃完了食物！`);
    } else {
      notify('沒有食物了！去商店購買吧！');
    }
  };

  const playWithPet = () => {
    if (pet.energy > 20) {
      setPet((prev) => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 20),
        energy: Math.max(0, prev.energy - 15),
        lastPlayed: Date.now(),
      }));
      addExp(15);
      const earnedCoins = Math.floor(Math.random() * 10) + 5;
      setPet((prev) => ({ ...prev, coins: prev.coins + earnedCoins }));
      notify(`和${pet.name}玩得很開心！獲得了${earnedCoins}金幣！`);
    } else {
      notify(`${pet.name}太累了，讓它休息一下吧！`);
    }
  };

  const cleanPet = () => {
    if (inventory.soap > 0) {
      setPet((prev) => ({
        ...prev,
        cleanliness: Math.min(100, prev.cleanliness + 30),
        happiness: Math.min(100, prev.happiness + 5),
        lastCleaned: Date.now(),
      }));
      setInventory((prev) => ({ ...prev, soap: prev.soap - 1 }));
      addExp(8);
      notify(`${pet.name}現在乾乾淨淨的！`);
    } else {
      notify('沒有肥皂了！去商店購買吧！');
    }
  };

  const restPet = () => {
    setPet((prev) => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      health: Math.min(100, prev.health + 10),
    }));
    notify(`${pet.name}睡了個好覺！`);
  };

  const buyItem = (item, cost) => {
    if (pet.coins >= cost) {
      setPet((prev) => ({ ...prev, coins: prev.coins - cost }));
      setInventory((prev) => ({ ...prev, [item]: prev[item] + 1 }));
      notify(`購買了${item === 'food' ? '食物' : item === 'soap' ? '肥皂' : '玩具'}！`);
    } else {
      notify('金幣不足！');
    }
  };

  return {
    feedPet,
    playWithPet,
    cleanPet,
    restPet,
    buyItem,
  };
};