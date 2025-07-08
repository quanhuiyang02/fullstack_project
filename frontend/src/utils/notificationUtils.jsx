// src/utils/notificationUtils.js

export const showTempNotification = (setNotification, message, duration = 3000) => {
  setNotification(message);
  setTimeout(() => {
    setNotification('');
  }, duration);
};
