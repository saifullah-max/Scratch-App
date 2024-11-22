import React, { useState, useEffect } from "react";
import './style.css'; // Import CSS in the same folder

const Timer = () => {
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeInSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds } = formatTime(timeInSeconds);

  return (
    <div className="countdown-container">
      <h1>Countdown</h1>
      <div className="countdown-box">
        <div className="countdown-item">
          <h1 className="countdown-value">{hours}</h1>
          <span className="countdown-unit">Hours</span>
        </div>
        <div className="countdown-item">
          <h1 className="countdown-value">{minutes}</h1>
          <span className="countdown-unit">Minutes</span>
        </div>
        <div className="countdown-item">
          <h1 className="countdown-value">{seconds}</h1>
          <span className="countdown-unit">Seconds</span>
        </div>
      </div>
      <button onClick={() => setIsRunning(true)} disabled={isRunning}>
        Start
      </button>
      <button onClick={() => setIsRunning(false)} disabled={!isRunning}>
        Stop
      </button>
    </div>
  );
};

// export default Timer;
