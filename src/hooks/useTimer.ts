import { useState, useEffect, useCallback } from 'react';
import { TimerState, TimerMode, TimerPreset } from '../types/timer';
import { useNotifications } from './useNotifications';
import { useTimerSessions } from './useTimerSessions';

export const useTimer = (
  activePreset: TimerPreset,
  activeMode: TimerMode,
  onModeSwitch: (mode: TimerMode) => void
) => {
  const { sendTimerNotification } = useNotifications();
  const { addSession } = useTimerSessions();

  const getCurrentTime = (preset: TimerPreset, mode: TimerMode) => {
    switch (mode) {
      case 'focus':
        return preset.times.focusTime;
      case 'break':
        return preset.times.breakTime;
      case 'longBreak':
        return preset.times.longBreakTime;
    }
  };

  const [timer, setTimer] = useState<TimerState>({
    minutes: getCurrentTime(activePreset, activeMode),
    seconds: 0,
    isRunning: false,
  });

  const [initialMinutes, setInitialMinutes] = useState(
    getCurrentTime(activePreset, activeMode)
  );

  const handleTimerComplete = useCallback(() => {
    setTimer(prev => ({ ...prev, isRunning: false }));

    addSession(activePreset.id, activeMode, initialMinutes);
    sendTimerNotification(activeMode);

    // Switch to next mode
    const nextMode = activeMode === 'focus' ? 'break' : 'focus';
    onModeSwitch(nextMode);
  }, [activeMode, activePreset.id, initialMinutes, onModeSwitch, addSession, sendTimerNotification]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning) {
      interval = setInterval(() => {
        if (timer.seconds === 0) {
          if (timer.minutes === 0) {
            handleTimerComplete();
            return;
          }
          setTimer(prev => ({
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59,
          }));
        } else {
          setTimer(prev => ({
            ...prev,
            seconds: prev.seconds - 1,
          }));
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.minutes, timer.seconds, handleTimerComplete]);

  const startTimer = () => setTimer(prev => ({ ...prev, isRunning: true }));
  const pauseTimer = () => setTimer(prev => ({ ...prev, isRunning: false }));

  const resetTimer = () => {
    setTimer({
      minutes: initialMinutes,
      seconds: 0,
      isRunning: false,
    });
  };

  const adjustTime = (change: number) => {
    if (!timer.isRunning) {
      const newMinutes = Math.max(1, initialMinutes + change);
      setInitialMinutes(newMinutes);
      setTimer(prev => ({
        ...prev,
        minutes: newMinutes,
        seconds: 0,
      }));
    }
  };

  const updateTimerForNewPreset = useCallback((preset: TimerPreset, mode: TimerMode) => {
    const newTime = getCurrentTime(preset, mode);
    setInitialMinutes(newTime);
    setTimer({
      minutes: newTime,
      seconds: 0,
      isRunning: false,
    });
  }, []);

  return {
    timer,
    initialMinutes,
    startTimer,
    pauseTimer,
    resetTimer,
    adjustTime,
    updateTimerForNewPreset,
  };
};
