import React, { useEffect, useState } from 'react';

const Timer = ({ duration, onFinish, finish }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (finish) {
      setTimeLeft(0);
      onFinish();
      return;
    }

    if (timeLeft === 0) {
      onFinish();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, finish]);

  return (
    <div className="bg-gray-900 flex items-start justify-center">
      <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-md">
        <div className="text-white text-center mb-4 text-2xl" id="timer">
          {timeLeft === 0 ? "Finish" : timeLeft}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-500 h-4 rounded-full"
            style={{ width: `${finish ? 100 : (duration - timeLeft) / duration * 100}%`, transition: 'width 1s linear' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
