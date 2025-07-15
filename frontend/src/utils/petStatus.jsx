// src/utils/petStatus.jsx

export const getStatusColor = (value) => {
  if (value >= 70) return 'rgba(99, 224, 166, 0.68)';
  if (value >= 40) return 'rgba(156, 226, 200, 0.68)';
  return 'rgba(  6,  95,  70, 0.45)';
};
