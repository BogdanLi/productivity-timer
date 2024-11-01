import { useState, useEffect } from 'react';
import { TimerSession, TimerMode } from '../types/timer';
import dayjs from 'dayjs';

export const useTimerSessions = () => {
  const [sessions, setSessions] = useState<TimerSession[]>(() => {
    const saved = localStorage.getItem('timerSessions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('timerSessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (presetId: string, mode: TimerMode, duration: number) => {
    const completedAt = dayjs();
    const startedAt = completedAt.subtract(duration, 'minute');

    const newSession: TimerSession = {
      id: Date.now().toString(),
      presetId,
      mode,
      duration,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
    };

    setSessions(prev => [...prev, newSession]);
  };

  return { sessions, addSession };
};
