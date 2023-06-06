import React, { useState, useEffect } from "react";

const RotatingImage = ({ imageUrl, angleStart, angleEnd, speed }) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [rotationDirection, setRotationDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationAngle(rotationAngle + rotationDirection);

      if (rotationAngle > angleEnd) {
        setRotationDirection(-rotationDirection);
        setRotationAngle(angleEnd);
      } else if (rotationAngle < -angleStart) {
        setRotationDirection(-rotationDirection);
        setRotationAngle(-angleStart);
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  }, [rotationAngle, rotationDirection]);
  const handleMouseEnter = () => {
    setIsHovered(true);
    console.log("HOVERING");
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <div
      className={
        isHovered ? "banner-image banner-image-hovered" : "banner-image"
      }
    >
      <img
        src={imageUrl}
        alt="Rotating Image"
        style={{ transform: `rotate(${rotationAngle}deg)` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default RotatingImage;
