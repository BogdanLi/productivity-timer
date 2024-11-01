import { useState } from "react";
import { TimerMode } from "../types/timer";
import TimerCircle from "./TimerCircle";
import TimerControls from "./TimerControls";
import PresetManager from "./PresetManager";
import StatisticsModal from "./StatisticsModal";
import { useTimer } from "../hooks/useTimer";
import { usePresets } from "../hooks/usePresets";
import { useNotifications } from "../hooks/useNotifications";
import { useTimerSessions } from "../hooks/useTimerSessions";

const Timer = () => {
  const [activePreset, setActivePreset] = useState<number>(0);
  const [activeMode, setActiveMode] = useState<TimerMode>("focus");
  const [showStats, setShowStats] = useState(false);

  const { presets, addPreset, deletePreset } = usePresets();
  const { notificationsEnabled, setNotificationsEnabled } = useNotifications();
  const { sessions } = useTimerSessions();

  const {
    timer,
    initialMinutes,
    startTimer,
    pauseTimer,
    resetTimer,
    adjustTime,
    updateTimerForNewPreset,
  } = useTimer(presets[activePreset], activeMode, setActiveMode);

  const switchTimer = (presetIndex: number) => {
    if (!timer.isRunning) {
      setActivePreset(presetIndex);
      updateTimerForNewPreset(presets[presetIndex], activeMode);
    }
  };

  const switchMode = (mode: TimerMode) => {
    if (!timer.isRunning) {
      setActiveMode(mode);
      updateTimerForNewPreset(presets[activePreset], mode);
    }
  };

  const totalSeconds = timer.minutes * 60 + timer.seconds;
  const totalInitialSeconds = initialMinutes * 60;
  const progress =
    ((totalInitialSeconds - totalSeconds) / totalInitialSeconds) * 100;

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-white shadow-md">
      {!notificationsEnabled && (
        <button
          onClick={() =>
            requestNotificationPermission().then(setNotificationsEnabled)
          }
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
        >
          Enable Notifications
        </button>
      )}

      <button
        onClick={() => setShowStats(true)}
        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
      >
        View Statistics
      </button>

      <PresetManager
        presets={presets}
        activePreset={activePreset}
        activeMode={activeMode}
        onPresetSelect={switchTimer}
        onModeSelect={switchMode}
        onPresetAdd={addPreset}
        onPresetDelete={deletePreset}
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

      <StatisticsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        sessions={sessions}
        presets={presets}
      />
    </div>
  );
};

export default Timer;
