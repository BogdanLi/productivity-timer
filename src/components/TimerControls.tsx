import React from 'react';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="flex gap-4">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Start
        </button>
      ) : (
        <button
          onClick={onPause}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Pause
        </button>
      )}
      <button
        onClick={onReset}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Reset
      </button>
    </div>
  );
};

export default TimerControls;
