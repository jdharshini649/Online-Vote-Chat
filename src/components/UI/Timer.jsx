import React, { useState, useEffect } from 'react';
import { formatTime } from '../../utils/formatDate';

const Timer = ({ duration, endTime, onEnd, isActive }) => {
  // timeLeft in seconds
  const computeTimeLeft = () => {
    if (endTime) {
      const diff = Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000));
      return diff;
    }
    return duration * 60;
  };

  const [timeLeft, setTimeLeft] = useState(computeTimeLeft());

  useEffect(() => {
    setTimeLeft(computeTimeLeft());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, endTime]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const next = computeTimeLeft();
      setTimeLeft(next);
      if (next <= 0) {
        clearInterval(interval);
        if (onEnd) onEnd();
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, endTime]);

  const baseSeconds = duration * 60 || Math.max(1, timeLeft);
  const percentage = (timeLeft / baseSeconds) * 100;
  const isLowTime = timeLeft < 60;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Time Remaining</h3>
          <div className={`text-5xl font-bold ${isLowTime ? 'text-red-500' : 'text-primary-600'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ${
              isLowTime ? 'bg-red-500' : 'bg-primary-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Timer;
