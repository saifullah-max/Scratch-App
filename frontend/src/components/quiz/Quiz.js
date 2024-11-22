import React, { useState } from "react";

const Quiz = () => {
  const [timestamp, setTimestamp] = useState(null); // To store the local timestamp
  const [isBuzzed, setIsBuzzed] = useState(false); // To track if the buzzer has been pressed

  // Handle buzzer press
  const handleBuzz = () => {
    if (!isBuzzed) {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-US", { hour12: true }); // Includes hours, minutes, and seconds
      setTimestamp(formattedTime); // Update the timestamp state
      setIsBuzzed(true); // Mark as buzzed
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: isBuzzed ? "darkred" : "white",
        color: isBuzzed ? "white" : "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "background-color 0.3s ease",
      }}
    >
      <h1>Quiz Buzzer</h1>
      {timestamp && <p>Buzzer pressed at: {timestamp}</p>}
      <button
        onClick={handleBuzz}
        disabled={isBuzzed}
        style={{
          padding: "10px 20px",
          margin: "10px",
          backgroundColor: isBuzzed ? "gray" : "blue",
          color: "white",
          border: "none",
          cursor: isBuzzed ? "not-allowed" : "pointer",
        }}
      >
        Buzz!
      </button>
    </div>
  );
};

export default Quiz;