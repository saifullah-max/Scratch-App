const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Timer Logic
let countdownEndTime = null;
let isRunning = false;

// Leaderboard Logic
let leaderboard = [
  { id: 1, name: "Team Alpha", score: 100 },
  { id: 2, name: "Team Beta", score: 90 },
  { id: 3, name: "Team Gamma", score: 80 },
];

// Socket.io communication
io.on("connection", (socket) => {
  console.log("A user connected");

  // Sync timer state with client and send the server's current time
  socket.emit("sync", { endTime: countdownEndTime, isRunning, serverTime: Date.now() });

  // Timer commands
  socket.on("startTimer", (durationInSeconds) => {
    if (!isRunning) {
      countdownEndTime = Date.now() + durationInSeconds * 1000;
      isRunning = true;
      console.log(`Timer started for ${durationInSeconds} seconds`);
      io.emit("sync", { endTime: countdownEndTime, isRunning, serverTime: Date.now() });
    }
  });

  socket.on("stopTimer", () => {
    isRunning = false;
    countdownEndTime = null;
    console.log("Timer stopped");
    io.emit("sync", { endTime: countdownEndTime, isRunning, serverTime: Date.now() });
  });

  socket.on("resetTimer", () => {
    countdownEndTime = null;
    isRunning = false;
    console.log("Timer reset");
    io.emit("sync", { endTime: null, isRunning, serverTime: Date.now() });
  });

  // Notify clients of leaderboard updates
  socket.emit("leaderboardUpdate", leaderboard);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Leaderboard routes
app.get("/api/leaderboard", (req, res) => {
  res.json(leaderboard);
});

app.post("/api/leaderboard/add", (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== "number") {
    return res.status(400).json({ message: "Invalid team data." });
  }
  const newId = leaderboard.length > 0 ? leaderboard[leaderboard.length - 1].id + 1 : 1;
  const newTeam = { id: newId, name, score };
  leaderboard.push(newTeam);
  io.emit("leaderboardUpdate", leaderboard);
  res.status(201).json(newTeam);
});

app.post("/api/leaderboard/updateName", (req, res) => {
  const { id, newName } = req.body;
  const team = leaderboard.find((team) => team.id === id);
  if (!team || !newName) {
    return res.status(400).json({ message: "Invalid team ID or name." });
  }
  team.name = newName;
  io.emit("leaderboardUpdate", leaderboard);
  res.json(team);
});

app.post("/api/leaderboard/update", (req, res) => {
  const { id, scoreChange } = req.body;
  const team = leaderboard.find((team) => team.id === id);
  if (!team || typeof scoreChange !== "number") {
    return res.status(400).json({ message: "Invalid team ID or score change." });
  }
  team.score += scoreChange;
  io.emit("leaderboardUpdate", leaderboard);
  res.json(team);
});

app.post("/api/leaderboard/remove", (req, res) => {
  const { id } = req.body;
  const teamIndex = leaderboard.findIndex((team) => team.id === id);
  if (teamIndex === -1) {
    return res.status(404).json({ message: "Team not found." });
  }
  const removedTeam = leaderboard.splice(teamIndex, 1);
  io.emit("leaderboardUpdate", leaderboard);
  res.json(removedTeam);
});

// Serve HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 3536;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
