import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import "./timer.css";

const Timer = () => {
  const [timeInSeconds, setTimeInSeconds] = useState(0); // Current countdown time in seconds
  const [isRunning, setIsRunning] = useState(false); // Timer running state
  const socket = useRef(null); // Ref to store the socket connection
  const intervalRef = useRef(null); // Ref to store the interval ID for clearing

  // Sync from the server every 500ms
  useEffect(() => {
    socket.current = io("http://192.168.0.85:3536", {
      transports: ["websocket", "polling"],
    });

    // On connection, get the initial timer state
    socket.current.on("sync", ({ endTime, isRunning, serverTime }) => {
      if (isRunning && endTime) {
        setIsRunning(true);
        const remainingTime = Math.max(0, Math.floor((endTime - serverTime) / 1000));
        setTimeInSeconds(remainingTime);
      } else {
        setIsRunning(false);
        setTimeInSeconds(0);
      }
    });

    return () => {
      socket.current.disconnect();
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Clean up the interval when component unmounts
      }
    };
  }, []);

  // Update the timer every second if running
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeInSeconds((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false); // Stop the timer when it reaches 0
            return 0;
          }
          return newTime;
        });
      }, 1000); // Update every second

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current); // Clean up the interval on unmount or when stopped
        }
      };
    }
  }, [isRunning]); // Only run when the timer starts

  // Function to format the time
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const { minutes, seconds } = formatTime(timeInSeconds);

  return (
    <div className="countdown-container">
      <h1>Timer</h1>
      <div className="countdown-box">
        <div className="countdown-item">
          <h1 className="countdown-value">{minutes}</h1>
          <span className="countdown-unit">Minutes</span>
        </div>
        <div className="countdown-item">
          <h1 className="countdown-value">{seconds}</h1>
          <span className="countdown-unit">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default Timer;
