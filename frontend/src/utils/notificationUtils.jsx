// src/utils/notificationUtils.js

export const showNotificationMessage = (setNotification, message) => {
  setNotification(message);
  setTimeout(() => setNotification(''), 3000);
};