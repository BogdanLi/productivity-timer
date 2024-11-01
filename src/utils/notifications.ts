export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === "granted") {
    new Notification(title, options);
  }
};
