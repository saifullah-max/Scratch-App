import React from 'react';
import Timer from '../timer/Timer'; // Adjust the path if needed
import './style.css'; // Import CSS in the same folder

const HomePage = () => {
  return (
    <div className="container-xxl">
      {/* Insert the image with an id */}
      <img 
        src="https://images.squarespace-cdn.com/content/v1/59371b611e5b6cbaaa211ff9/80ebd3a5-6406-4e1c-9248-226b86bb9f64/ScratchDayLogo_HighRes.png" 
        alt="Scratch Day" 
        id="scratch-day-logo" 
        className="img-fluid mt-5" 
      />
      
      <p className="welcome fs-3 text-justify">
        
      </p>
      
      {/* Integrated Timer Component */}
      <Timer />
    </div>
  );
};

export default HomePage;
