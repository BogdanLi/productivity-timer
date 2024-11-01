export interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
}

export interface TimerPresetTimes {
  focusTime: number;
  breakTime: number;
  longBreakTime: number;
}

export interface TimerPreset {
  id: string;
  name: string;
  times: TimerPresetTimes;
}

export type TimerMode = 'focus' | 'break' | 'longBreak';

export interface TimerSession {
  id: string;
  presetId: string;
  mode: TimerMode;
  duration: number;
  startedAt: string;
  completedAt: string;
}

export interface TimerStatistics {
  totalSessions: number;
  totalMinutes: number;
  sessionsPerMode: {
    focus: number;
    break: number;
    longBreak: number;
  };
  minutesPerMode: {
    focus: number;
    break: number;
    longBreak: number;
  };
}

export interface DailyStatistics {
  date: string;
  stats: TimerStatistics;
}
