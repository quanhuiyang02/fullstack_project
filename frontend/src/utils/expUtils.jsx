// src/utils/petStatusUtils.js

export const calculateLevel = (exp) => {
  return Math.floor(exp / 100) + 1;
};

export const gainExp = (currentExp, gain) => {
  return currentExp + gain;
};