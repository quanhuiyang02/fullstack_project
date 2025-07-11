// src/utils/notificationUtils.js

export const showNotificationMessage = (message, setShowNotification) => {
  setShowNotification(message);
  setTimeout(() => setShowNotification(''), 3000);
};