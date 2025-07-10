// src/utils/expUtils.js

export const calculateLevel = (exp) => {
  return Math.floor(exp / 100) + 1;
};

export const handleLevelUp = (prevPet, expGain, notify) => {
  const newExp = prevPet.exp + expGain;
  const newLevel = calculateLevel(newExp);
  const leveledUp = newLevel > prevPet.level;

  if (leveledUp) {
    notify(`恭喜！${prevPet.name}升到了等級${newLevel}！`);
  }

  return {
    ...prevPet,
    exp: newExp,
    level: newLevel,
    coins: leveledUp ? prevPet.coins + 50 : prevPet.coins
  };
};