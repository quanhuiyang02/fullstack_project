// src/utils/expUtils.js

export const getStatusColor = (value) => {
  if (value >= 70) return 'bg-green-500';
  if (value >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getPetEmoji = (pet) => {
  if (pet.health < 30) return '😵';
  if (pet.hunger < 30) return '😋';
  if (pet.happiness < 30) return '😢';
  if (pet.energy < 30) return '😴';
  if (pet.cleanliness < 30) return '🤢';
  return '😊';
};