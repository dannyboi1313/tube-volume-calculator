import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const HintIcon = ({ text, hint, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div className='col-item-hint' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <FontAwesomeIcon icon={icon} />
      </div>
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '-100%',
            left: '150%',
            width:'15em',
            
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '10px',
            borderRadius: '4px',
            zIndex: 9999,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default HintIcon;