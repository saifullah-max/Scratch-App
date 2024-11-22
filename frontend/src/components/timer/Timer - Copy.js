import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client"; // Import socket.io-client
import './timer.css'; // Import your CSS
import { Navigate, useNavigate } from 'react-router-dom'

const Timer = () => {
  const [timeInSeconds, setTimeInSeconds] = useState(0); // Current countdown time
  const [isRunning, setIsRunning] = useState(false); // Timer running state
  const [countdownEndTime, setCountdownEndTime] = useState(null); // End time for countdown
  const socket = useRef(null); // Ref to store the socket connection
  const logoRef = useRef(null); // Ref for the Scratch logo

  // Bouncing logic
  useEffect(() => {
    const logo = logoRef.current;
    const container = document.querySelector(".countdown-container");

    let x = 0, y = 0;
    let dx = 2, dy = 2; // Speed of the logo
    const moveLogo = () => {
      const containerRect = container.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();

      // Update position
      x += dx;
      y += dy;

      // Bounce off edges
      if (x + logoRect.width > containerRect.width || x < 0) dx = -dx;
      if (y + logoRect.height > containerRect.height || y < 0) dy = -dy;

      // Update logo position
      logo.style.transform = `translate(${x}px, ${y}px)`;

      requestAnimationFrame(moveLogo); // Keep the animation running
    };

    moveLogo(); // Start the animation
  }, []);

  // Socket connection logic
  useEffect(() => {
    socket.current = io("http://localhost:3536", {
      transports: ["websocket", "polling"], // Ensure fallback options for connection
    });

    socket.current.on("connect", () => {
      console.log("Connected to the server.");
    });

    socket.current.on("sync", ({ endTime, isRunning }) => {
      setCountdownEndTime(endTime);
      if (isRunning && endTime) {
        const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
        setTimeInSeconds(remainingTime);
        setIsRunning(true);
      } else {
        setIsRunning(false);
        setTimeInSeconds(0);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isRunning && countdownEndTime) {
      const intervalId = setInterval(() => {
        const remainingTime = Math.max(0, Math.floor((countdownEndTime - Date.now()) / 1000));
        setTimeInSeconds(remainingTime);
        if (remainingTime <= 0) {
          clearInterval(intervalId);
          setIsRunning(false);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isRunning, countdownEndTime]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
    };
  };

  const { minutes, seconds } = formatTime(timeInSeconds);
  const Navigate = useNavigate();
  const navigateToLeaderBoard = (e) => {
    e.preventDefault();
    window.open("/leaderboard", "_blank"); 
  }
  return (
    <div className="countdown-container">
      <img
        src="https://seeklogo.com/images/S/scratch-cat-logo-7F652C6253-seeklogo.com.png"
        alt="Scratch Logo"
        className="scratch-logo"
        ref={logoRef}
      />
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
      <div className="button-container"></div>
    </div>
  );
};

export default Timer;
