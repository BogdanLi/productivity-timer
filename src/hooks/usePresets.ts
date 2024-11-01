import { useState, useEffect } from "react";
import { TimerPreset } from "../types/timer";

const DEFAULT_PRESETS: TimerPreset[] = [
  {
    id: "1",
    name: "Default Pomodoro",
    times: {
      focusTime: 25,
      breakTime: 5,
      longBreakTime: 15,
    },
  },
];

export const usePresets = () => {
  const [presets, setPresets] = useState<TimerPreset[]>(() => {
    const saved = localStorage.getItem("timerPresets");
    if (!saved) return DEFAULT_PRESETS;

    try {
      const parsedPresets = JSON.parse(saved);
      return parsedPresets.map((preset: any) => ({
        ...preset,
        times: {
          focusTime: preset.times?.focusTime || 25,
          breakTime: preset.times?.breakTime || 5,
          longBreakTime: preset.times?.longBreakTime || 15,
        },
      }));
    } catch (error) {
      console.error("Error parsing timer presets:", error);
      return DEFAULT_PRESETS;
    }
  });

  useEffect(() => {
    localStorage.setItem("timerPresets", JSON.stringify(presets));
  }, [presets]);

  const addPreset = (preset: TimerPreset) => {
    setPresets((prev) => [...prev, preset]);
  };

  const deletePreset = (id: string) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== id));
  };

  return {
    presets,
    addPreset,
    deletePreset,
  };
};
