import React from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import "./App.css";
import LoginPage from "./components/Login";
import Leaderboard from "./components/leaderboard/Leaderboard";
import HomePage from "./components/home/HomePage";
import Quiz from "./components/quiz/Quiz";
import TeamLeaderboard from "./components/leaderboard/Leaderboard";
// import Timer from "./components/home/Timer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/home" element={<HomePage/>} />
        <Route path="/quiz" element={<Quiz/>} />
        <Route path="/leaderboard" element={<TeamLeaderboard/>} />
      </Routes>
    </Router>
  );
}

export default App;
