import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// Connect to Socket.IO server
const socket = io("http://localhost:8000");

const Admin = () => {
  const [buzzerState, setBuzzerState] = useState({
    activeTeam: null,
    isDisabled: false,
  });

  // Listening for buzzer state updates from the server
  useEffect(() => {
    // Listen for buzzer state updates from the server
    socket.on("buzzerStateUpdate", (state) => {
      setBuzzerState(state);
    });

    // Cleanup on unmount
    return () => {
      socket.off("buzzerStateUpdate");
    };
  }, []);

  // Reset buzzers
  const handleResetBuzzers = () => {
    socket.emit("resetBuzzers"); // Emit reset event to reset buzzer state
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f0f0",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Admin Panel</h1>
      <button
        onClick={handleResetBuzzers}
        style={{
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        Reset Buzzers
      </button>

      {/* Display active team */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <h2>
          {buzzerState.activeTeam
            ? `Team ${buzzerState.activeTeam} has buzzed!`
            : "No team has buzzed yet."}
        </h2>
      </div>
    </div>
  );
};

export default Admin;
