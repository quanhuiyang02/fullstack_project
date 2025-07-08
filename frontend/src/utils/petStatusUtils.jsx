// src/utils/expUtils.js

export const getStatusColor = (value) => {
  if (value >= 70) return 'bg-green-500';
  if (value >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getPetEmoji = ({ health, hunger, happiness, energy, cleanliness }) => {
  if (health < 30) return '😵';
  if (hunger < 30) return '😋';
  if (happiness < 30) return '😢';
  if (energy < 30) return '😴';
  if (cleanliness < 30) return '🤢';
  return '😊';
};