// src/utils/expUtils.js

export const applyExpGain = (pet, amount) => {
  const newExp = pet.exp + amount;
  const newLevel = Math.floor(newExp / 100) + 1;
  const leveledUp = newLevel > pet.level;
  const updatedPet = {
    ...pet,
    exp: newExp,
    level: newLevel,
    coins: leveledUp ? pet.coins + 50 : pet.coins,
  };
  return { updatedPet, leveledUp };
};