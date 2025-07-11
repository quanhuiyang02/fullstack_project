// hooks/usePetActions.js
import { performPetAction } from '../utils/petActions';

export const usePetActions = ({
  pet,
  setPet,
  inventory,
  setInventory,
  addExp,
  notify
}) => {
  const feedPet = () => {
    performPetAction({
      pet,
      setPet,
      inventory,
      setInventory,
      addExp,
      notify,
      config: {
        condition: inventory.food > 0,
        conditionFailMessage: '沒有食物了！去商店購買吧！',
        inventoryItem: 'food',
        inventoryCost: 1,
        petUpdates: {
          hunger: prev => prev.hunger + 25,
          happiness: prev => prev.happiness + 10,
          lastFed: () => Date.now()
        },
        expGain: 10,
        successMessage: `${pet.name}很開心地吃完了食物！`
      }
    });
  };

  const playWithPet = () => {
    const earnedCoins = Math.floor(Math.random() * 10) + 5;
    performPetAction({
      pet,
      setPet,
      inventory,
      setInventory,
      addExp,
      notify,
      config: {
        condition: pet.energy > 20,
        conditionFailMessage: `${pet.name}太累了，讓它休息一下吧！`,
        petUpdates: {
          happiness: prev => prev.happiness + 20,
          energy: prev => prev.energy - 15,
          lastPlayed: () => Date.now()
        },
        expGain: 15,
        coinsGain: earnedCoins,
        successMessage: `和${pet.name}玩得很開心！獲得了${earnedCoins}金幣！`
      }
    });
  };

  const cleanPet = () => {
    performPetAction({
      pet,
      setPet,
      inventory,
      setInventory,
      addExp,
      notify,
      config: {
        condition: inventory.soap > 0,
        conditionFailMessage: '沒有肥皂了！去商店購買吧！',
        inventoryItem: 'soap',
        inventoryCost: 1,
        petUpdates: {
          cleanliness: prev => prev.cleanliness + 30,
          happiness: prev => prev.happiness + 5,
          lastCleaned: () => Date.now()
        },
        expGain: 8,
        successMessage: `${pet.name}現在乾乾淨淨的！`
      }
    });
  };

  const restPet = () => {
    performPetAction({
      pet,
      setPet,
      inventory,
      setInventory,
      addExp,
      notify,
      config: {
        petUpdates: {
          energy: prev => prev.energy + 40,
          health: prev => prev.health + 10
        },
        successMessage: `${pet.name}睡了個好覺！`
      }
    });
  };

  return {
    feedPet,
    playWithPet,
    cleanPet,
    restPet
  };
};