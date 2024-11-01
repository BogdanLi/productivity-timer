import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import { TimerSession, TimerPreset, TimerStatistics } from "../types/timer";
import { formatDateTime, formatRelativeTime, isDateInRange } from "../utils/dateUtils";

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: TimerSession[];
  presets: TimerPreset[];
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  sessions,
  presets,
}) => {
  const [dateFilter, setDateFilter] = useState("all");
  const [startDate, setStartDate] = useState(
    dayjs().subtract(7, 'day').format('YYYY-MM-DD')
  );
  const [endDate, setEndDate] = useState(
    dayjs().format('YYYY-MM-DD')
  );

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const sessionDate = dayjs(session.completedAt);

      switch (dateFilter) {
        case "today":
          return sessionDate.isAfter(dayjs().startOf('day'));
        case "week":
          return sessionDate.isAfter(dayjs().subtract(7, 'day'));
        case "custom":
          return isDateInRange(session.completedAt, startDate, endDate);
        default:
          return true;
      }
    });
  }, [sessions, dateFilter, startDate, endDate]);

  if (!isOpen) return null;

  const calculateStatistics = (presetId: string) => {
    const presetSessions = filteredSessions.filter(
      (session) => session.presetId === presetId
    );

    const stats: TimerStatistics = {
      totalSessions: presetSessions.length,
      totalMinutes: presetSessions.reduce(
        (acc, session) => acc + session.duration,
        0
      ),
      sessionsPerMode: {
        focus: 0,
        break: 0,
        longBreak: 0,
      },
      minutesPerMode: {
        focus: 0,
        break: 0,
        longBreak: 0,
      },
    };

    presetSessions.forEach((session) => {
      stats.sessionsPerMode[session.mode]++;
      stats.minutesPerMode[session.mode] += session.duration;
    });

    return { stats, sessions: presetSessions };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Timer Statistics</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="mb-4">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border rounded mr-2"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateFilter === "custom" && (
            <div className="mt-2 flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded"
              />
              <span className="self-center">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded"
              />
            </div>
          )}
        </div>

        {presets.map((preset) => {
          const { stats, sessions: presetSessions } = calculateStatistics(
            preset.id
          );
          return (
            <div key={preset.id} className="mb-8">
              <h3 className="text-xl font-semibold mb-2">{preset.name}</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-100 p-4 rounded">
                  <h4 className="font-medium mb-2">Sessions</h4>
                  <p>Total: {stats.totalSessions}</p>
                  <p>Focus: {stats.sessionsPerMode.focus}</p>
                  <p>Break: {stats.sessionsPerMode.break}</p>
                  <p>Long Break: {stats.sessionsPerMode.longBreak}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded">
                  <h4 className="font-medium mb-2">Minutes</h4>
                  <p>Total: {stats.totalMinutes}</p>
                  <p>Focus: {stats.minutesPerMode.focus}</p>
                  <p>Break: {stats.minutesPerMode.break}</p>
                  <p>Long Break: {stats.minutesPerMode.longBreak}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded">
                <h4 className="font-medium mb-2">Session History</h4>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left p-2">Date & Time</th>
                        <th className="text-left p-2">Mode</th>
                        <th className="text-left p-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {presetSessions
                        .sort((a, b) => dayjs(b.completedAt).diff(dayjs(a.completedAt)))
                        .map((session) => (
                          <tr key={session.id} className="border-b">
                            <td className="p-2">
                              {formatDateTime(session.completedAt)}
                              <span className="text-sm text-gray-500 ml-2">
                                ({formatRelativeTime(session.completedAt)})
                              </span>
                            </td>
                            <td className="p-2 capitalize">{session.mode}</td>
                            <td className="p-2">{session.duration} minutes</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatisticsModal;
