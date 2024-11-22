import React, { useState, useEffect } from "react";
import "./Leaderboard.css"; // Import the CSS file
import { io } from "socket.io-client"; // Import socket.io-client

const TeamLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);

  // Initialize socket.io client
  useEffect(() => {
    const socket = io("http://localhost:3536/"); // Connect to the server

    // Listen for the 'leaderboardUpdate' event from the server
    socket.on("leaderboardUpdate", (data) => {
      setLeaderboard(data); // Update the leaderboard state with the new data
    });

    // Fetch the initial leaderboard data when the component mounts
    fetchLeaderboard();

    // Set an interval to auto-refresh leaderboard every 5 seconds
    const intervalId = setInterval(() => {
      fetchLeaderboard();
    }, 500); // Refresh every 5 seconds

    // Clean up socket connection and interval on component unmount
    return () => {
      socket.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:3536/api/leaderboard");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setLeaderboard(data); // Set the leaderboard state with fetched data
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError("Failed to fetch leaderboard. Please try again later.");
    }
  };

  // Sort the leaderboard by score in descending order
  const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score);

  return (
    <div className="container">
      <h1>Leaderboard</h1>
      {error && <div className="error">{error}</div>}
      <div className="leaderboard-bg">
        <div className="leaderboard">
          {sortedLeaderboard.length > 0 ? (
            sortedLeaderboard.map((team, index) => (
              <div
                key={team.id}
                className={`entry ${
                  index === 0
                    ? "gold"
                    : index === 1
                    ? "silver"
                    : index === 2
                    ? "bronze"
                    : "default"
                }`}
              >
                <span className="rank">
                  #{index + 1}
                </span>
                <span className="medal">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : ""}
                </span>
                <span className="name">{team.name}</span>
                <span className="score">{team.score}</span>
              </div>
            ))
          ) : (
            <div>No teams found in the leaderboard.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamLeaderboard;
