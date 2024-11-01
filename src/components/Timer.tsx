import { useState, useEffect } from "react";
import { TimerState, TimerPreset, TimerMode } from "../types/timer";
import TimerCircle from "./TimerCircle";
import TimerControls from "./TimerControls";
import PresetManager from "./PresetManager";

const DEFAULT_PRESETS: TimerPreset[] = [
  {
    id: "1",
    name: "Default",
    times: {
      focusTime: 25,
      breakTime: 5,
      longBreakTime: 15,
    },
  },
  {
    id: "2",
    name: "Long Focus",
    times: {
      focusTime: 50,
      breakTime: 10,
      longBreakTime: 30,
    },
  },
];

const Timer = () => {
  const [presets, setPresets] = useState<TimerPreset[]>(() => {
    const saved = localStorage.getItem("timerPresets");
    if (!saved) return DEFAULT_PRESETS;

    try {
      const parsedPresets = JSON.parse(saved);
      // Migrate old presets or validate existing ones
      const migratedPresets = parsedPresets.map((preset: any) => {
        if (!preset.times) {
          // Handle old format
          return {
            ...preset,
            times: {
              focusTime: preset.minutes || 25,
              breakTime: 5,
              longBreakTime: 15,
            },
          };
        }
        // Ensure all required time properties exist
        return {
          ...preset,
          times: {
            focusTime: preset.times.focusTime || 25,
            breakTime: preset.times.breakTime || 5,
            longBreakTime: preset.times.longBreakTime || 15,
          },
        };
      });
      return migratedPresets;
    } catch (error) {
      console.error("Error parsing timer presets:", error);
      return DEFAULT_PRESETS;
    }
  });

  const [activePreset, setActivePreset] = useState<number>(0);
  const [activeMode, setActiveMode] = useState<TimerMode>("focus");

  const getCurrentTime = (preset: TimerPreset, mode: TimerMode) => {
    switch (mode) {
      case "focus":
        return preset.times.focusTime;
      case "break":
        return preset.times.breakTime;
      case "longBreak":
        return preset.times.longBreakTime;
    }
  };

  const [timer, setTimer] = useState<TimerState>({
    minutes: getCurrentTime(presets[0], "focus"),
    seconds: 0,
    isRunning: false,
  });

  const [initialMinutes, setInitialMinutes] = useState(
    getCurrentTime(presets[0], "focus")
  );

  useEffect(() => {
    localStorage.setItem("timerPresets", JSON.stringify(presets));
  }, [presets]);

  const handlePresetAdd = (newPreset: TimerPreset) => {
    setPresets([...presets, newPreset]);
  };

  const handlePresetDelete = (id: string) => {
    setPresets(presets.filter((preset) => preset.id !== id));
  };

  const switchTimer = (presetIndex: number) => {
    if (!timer.isRunning) {
      const newTime = getCurrentTime(presets[presetIndex], activeMode);
      setActivePreset(presetIndex);
      setInitialMinutes(newTime);
      setTimer({
        minutes: newTime,
        seconds: 0,
        isRunning: false,
      });
    }
  };

  const switchMode = (mode: TimerMode) => {
    if (!timer.isRunning) {
      const newTime = getCurrentTime(presets[activePreset], mode);
      setActiveMode(mode);
      setInitialMinutes(newTime);
      setTimer({
        minutes: newTime,
        seconds: 0,
        isRunning: false,
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning) {
      interval = setInterval(() => {
        if (timer.seconds === 0) {
          if (timer.minutes === 0) {
            // Timer completed
            setTimer((prev) => ({ ...prev, isRunning: false }));
            // You can add a sound notification here
            return;
          }
          setTimer((prev) => ({
            ...prev,
            minutes: prev.minutes - 1,
            seconds: 59,
          }));
        } else {
          setTimer((prev) => ({
            ...prev,
            seconds: prev.seconds - 1,
          }));
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.minutes, timer.seconds]);

  const startTimer = () => {
    setTimer((prev) => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    setTimer((prev) => ({ ...prev, isRunning: false }));
  };

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
      setTimer((prev) => ({
        ...prev,
        minutes: newMinutes,
        seconds: 0,
      }));
    }
  };

  const totalSeconds = timer.minutes * 60 + timer.seconds;
  const totalInitialSeconds = initialMinutes * 60;
  const progress =
    ((totalInitialSeconds - totalSeconds) / totalInitialSeconds) * 100;

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-white shadow-md">
      <PresetManager
        presets={presets}
        activePreset={activePreset}
        activeMode={activeMode}
        onPresetSelect={switchTimer}
        onModeSelect={switchMode}
        onPresetAdd={handlePresetAdd}
        onPresetDelete={handlePresetDelete}
      />

      <TimerCircle
        minutes={timer.minutes}
        seconds={timer.seconds}
        progress={progress}
      />

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => adjustTime(-1)}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          disabled={timer.isRunning}
        >
          -
        </button>
        <button
          onClick={() => adjustTime(1)}
          className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
          disabled={timer.isRunning}
        >
          +
        </button>
      </div>

      <TimerControls
        isRunning={timer.isRunning}
        onStart={startTimer}
        onPause={pauseTimer}
        onReset={resetTimer}
      />
    </div>
  );
};

export default Timer;
