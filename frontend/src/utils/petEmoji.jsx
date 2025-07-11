// src/utils/petEmoji.jsx

export const getPetEmoji = (pet) => {
  if (pet.health < 30) return '😵';
  if (pet.hunger < 30) return '😋';
  if (pet.happiness < 30) return '😢';
  if (pet.energy < 30) return '😴';
  if (pet.cleanliness < 30) return '🤢';
  return '😊';
};