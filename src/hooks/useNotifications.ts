import { useState, useEffect } from 'react';
import { TimerMode } from '../types/timer';
import { requestNotificationPermission, sendNotification } from '../utils/notifications';

const audioElement = new Audio('/notification.mp3');

export const useNotifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const setupNotifications = async () => {
      const permitted = await requestNotificationPermission();
      setNotificationsEnabled(permitted);
    };
    setupNotifications();
  }, []);

  const sendTimerNotification = (mode: TimerMode) => {
    audioElement.play().catch(error => {
      console.error('Error playing sound:', error);
    });

    if (notificationsEnabled) {
      const messages = {
        focus: 'Focus time is over! Take a break.',
        break: 'Break time is over! Ready to focus?',
        longBreak: 'Long break is over! Time to get back to work!',
      };

      sendNotification('Timer Complete!', {
        body: messages[mode],
        icon: '/timer-icon.png',
        silent: true,
      });
    }
  };

  return {
    notificationsEnabled,
    setNotificationsEnabled,
    sendTimerNotification,
  };
};
