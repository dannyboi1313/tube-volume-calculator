import React, { useState, useEffect } from "react";

const ButtonWithIcon = ({
  display,
  onButtonClick,
  idP,
  imageUrl,
  text,
  hint,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  let timeoutId;

  useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const handleClick = () => {
    // Call the function passed from the parent component
    onButtonClick();
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
    timeoutId = setTimeout(() => {
      setShowHint(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowHint(false);
    clearTimeout(timeoutId);
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block", height: "100%" }}
    >
      <button
        className={display ? "menu-icon-active" : "menu-icon"}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <img id={idP} src={imageUrl} alt="My SVG file" />
      </button>
      {isHovered && showHint && (
        <div className="icon-hover">
          <div className="triangle"></div>
          <div className="icon-hover-hint">{hint}</div>
        </div>
      )}
    </div>
  );
};

export default ButtonWithIcon;
