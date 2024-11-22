import React from 'react';
import Timer from '../timer/Timer'; // Adjust the path if needed
import './style.css'; // Import CSS in the same folder

const HomePage = () => {
  return (
    <div className="container-xxl">
      <h1 className="text-uppercase mt-5 welcome fw-bolder display-2">
        Welcome to Scratch Day!
      </h1>
      <p className="welcome fs-3 text-justify">
        Enjoy your time with our interactive countdown timer.
      </p>
      
      {/* Integrated Timer Component */}
      <Timer />
    </div>
  );
};

export default HomePage;
