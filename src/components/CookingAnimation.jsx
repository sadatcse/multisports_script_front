import React from 'react';
import './CookingAnimation.scss'; // Make sure to import the SCSS file

const CookingAnimation = () => {
  return (
    <div className="cooking-container">
      <h1>Resturant Data Loading...</h1>
      <div id="cooking">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bubble"></div>
        ))}
        <div id="area">
          <div id="sides">
            <div id="pan"></div>
            <div id="handle"></div>
          </div>
          <div id="pancake">
            <div id="pastry"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingAnimation;
