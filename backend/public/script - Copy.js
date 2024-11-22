const socket = io();

// Timer functionality
document.getElementById("start").addEventListener("click", () => {
  const duration = parseInt(document.getElementById("duration").value, 10);
  if (!isNaN(duration) && duration > 0) {
    socket.emit("startTimer", duration);
  } else {
    alert("Please enter a valid duration.");
  }
});

document.getElementById("stop").addEventListener("click", () => {
  socket.emit("stopTimer");
});

document.getElementById("reset").addEventListener("click", () => {
  socket.emit("resetTimer");
});

// Sync timer state with the server
socket.on("sync", ({ endTime, isRunning }) => {
  const timerDisplay = document.getElementById("timer-display");
  if (isRunning && endTime) {
    const updateTimer = () => {
      const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      timerDisplay.textContent = `Time left: ${timeLeft}s`;
      if (timeLeft === 0) {
        clearInterval(interval);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
  } else {
    timerDisplay.textContent = "Timer is not running.";
  }
});

// Leaderboard functionality
function updateLeaderboard() {
  fetch("/api/leaderboard")
    .then((response) => response.json())
    .then((data) => {
      const leaderboardList = document.getElementById("leaderboard-list");
      leaderboardList.innerHTML = "";
      data.forEach((team) => {
        const entry = document.createElement("div");
        entry.classList.add("entry");
        entry.innerHTML = `
          <span class="team-id">ID: ${team.id}</span>
          <span class="team-name">Name: ${team.name}</span>
          <span class="team-score">Score: ${team.score}</span>
        `;
        leaderboardList.appendChild(entry);
      });
    });
}

// Listen for real-time leaderboard updates from the server
socket.on("leaderboardUpdate", updateLeaderboard);

// Add new team
document.getElementById("add-team").addEventListener("click", () => {
  const name = document.getElementById("new-team-name").value;
  const score = parseInt(document.getElementById("new-team-score").value, 10);
  if (name && !isNaN(score)) {
    fetch("/api/leaderboard/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score }),
    }).then(updateLeaderboard);
  } else {
    alert("Please enter valid team details.");
  }
});

// Edit team name
document.getElementById("edit-team-name-btn").addEventListener("click", () => {
  const id = parseInt(document.getElementById("edit-team-id").value, 10);
  const newName = document.getElementById("edit-team-name").value;
  if (id && newName) {
    fetch("/api/leaderboard/updateName", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, newName }),
    }).then(updateLeaderboard);
  } else {
    alert("Please enter valid team ID and new name.");
  }
});

// Update team score
document.getElementById("update-score").addEventListener("click", () => {
  const id = parseInt(document.getElementById("update-team-id").value, 10);
  const scoreChange = parseInt(document.getElementById("score-change").value, 10);
  if (id && !isNaN(scoreChange)) {
    fetch("/api/leaderboard/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, scoreChange }),
    }).then(updateLeaderboard);
  } else {
    alert("Please enter valid team ID and score change.");
  }
});

// Remove team
document.getElementById("remove-team").addEventListener("click", () => {
  const id = parseInt(document.getElementById("remove-team-id").value, 10);
  if (id) {
    fetch("/api/leaderboard/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    }).then(updateLeaderboard);
  } else {
    alert("Please enter a valid team ID.");
  }
});

// Initial leaderboard fetch
updateLeaderboard();
