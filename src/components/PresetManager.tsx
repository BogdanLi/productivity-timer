import React, { useState } from 'react';
import { TimerPreset, TimerMode } from '../types/timer';

interface PresetManagerProps {
  presets: TimerPreset[];
  activePreset: number;
  activeMode: TimerMode;
  onPresetSelect: (index: number) => void;
  onModeSelect: (mode: TimerMode) => void;
  onPresetAdd: (preset: TimerPreset) => void;
  onPresetDelete: (id: string) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  activePreset,
  activeMode,
  onPresetSelect,
  onModeSelect,
  onPresetAdd,
  onPresetDelete,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetTimes, setNewPresetTimes] = useState({
    focusTime: 25,
    breakTime: 5,
    longBreakTime: 15,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPreset: TimerPreset = {
      id: Date.now().toString(),
      name: newPresetName,
      times: newPresetTimes,
    };
    onPresetAdd(newPreset);
    setShowForm(false);
    setNewPresetName('');
    setNewPresetTimes({
      focusTime: 25,
      breakTime: 5,
      longBreakTime: 15,
    });
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex gap-2 mb-4 flex-wrap">
        {presets.map((preset, index) => (
          <div key={preset.id} className="flex items-center">
            <button
              onClick={() => onPresetSelect(index)}
              className={`px-4 py-2 rounded-md transition-colors ${
                activePreset === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {preset.name}
            </button>
            <button
              onClick={() => onPresetDelete(preset.id)}
              className="ml-1 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          + New Preset
        </button>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => onModeSelect('focus')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeMode === 'focus'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Focus ({presets[activePreset].times.focusTime}m)
        </button>
        <button
          onClick={() => onModeSelect('break')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeMode === 'break'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Break ({presets[activePreset].times.breakTime}m)
        </button>
        <button
          onClick={() => onModeSelect('longBreak')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeMode === 'longBreak'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Long Break ({presets[activePreset].times.longBreakTime}m)
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div>
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="Preset Name"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm text-gray-600">Focus Time</label>
              <input
                type="number"
                value={newPresetTimes.focusTime}
                onChange={(e) => setNewPresetTimes(prev => ({
                  ...prev,
                  focusTime: parseInt(e.target.value)
                }))}
                min="1"
                max="60"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Break Time</label>
              <input
                type="number"
                value={newPresetTimes.breakTime}
                onChange={(e) => setNewPresetTimes(prev => ({
                  ...prev,
                  breakTime: parseInt(e.target.value)
                }))}
                min="1"
                max="60"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Long Break</label>
              <input
                type="number"
                value={newPresetTimes.longBreakTime}
                onChange={(e) => setNewPresetTimes(prev => ({
                  ...prev,
                  longBreakTime: parseInt(e.target.value)
                }))}
                min="1"
                max="60"
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PresetManager;
