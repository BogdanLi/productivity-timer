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
