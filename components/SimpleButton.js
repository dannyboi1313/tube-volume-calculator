import React, { useState, useEffect } from "react";

const SimpleButton = ({ content, link }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Call the function passed from the parent component
    let l = link;
    location.href = link;
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div>
      <button
        className={
          isHovered ? "simple-button simple-button-hover" : "simple-button"
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {content}
      </button>
    </div>
  );
};

export default SimpleButton;
