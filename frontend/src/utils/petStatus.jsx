// src/utils/statusColor.js

export const getStatusColor = (value) => {
  if (value >= 70) return 'bg-green-500';
  if (value >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};
