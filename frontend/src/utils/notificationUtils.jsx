// src/utils/notificationUtils.js

export const showNotificationMessage = (message, setNotification) => {
  setNotification(message);
  setTimeout(() => setNotification(''), 3000);
};