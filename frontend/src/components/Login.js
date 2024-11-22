import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './Login.css'; // Import the provided CSS for styling
import HomePage from './home/HomePage';

const csvFile = '/users.csv'; // Path to your CSV file

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [characterPosition, setCharacterPosition] = useState('-50px');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch(`${csvFile}?timestamp=${Date.now()}`); // Avoid cache issues
      if (!response.ok) {
        throw new Error('Failed to fetch CSV file');
      }
  
      const data = await response.text();
      const rows = data
        .split("\n")
        .map((row) => row.split(",").map((col) => col.trim()));
  
      console.log("Raw CSV Data:", rows); // Debug: Log parsed rows
  
      // Skip header row and validate credentials
      const [header, ...userRows] = rows; // Destructure to separate header
  
      const isAuthenticated = userRows.some(
        ([csvUsername, csvPassword]) =>
          username.trim() === csvUsername && password.trim() === csvPassword
      );
  
      if (isAuthenticated) {
        alert("Login Successful!");
        navigate('/home'); // Uncomment if navigation is required
      } else {
        setError(true);
        setCharacterPosition("0px"); // Trigger jump animation
        setTimeout(() => setCharacterPosition("-50px"), 300); 
      }
    } catch (error) {
      console.error("Error reading CSV file:", error);
      alert("Error reading CSV file. Check console for details.");
    }
  };
  

  return (
    <div className="login-container">
      <h1>Scratch Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      {error && <div className="error">Invalid Username or Password!</div>}
      <img
        className="character"
        src={require('../components/assets/scratch-img1.png')} // Adjust path if needed
        alt="Scratch Character"
        style={{ bottom: characterPosition }}
      />
    </div>
  );
};

export default LoginPage;
