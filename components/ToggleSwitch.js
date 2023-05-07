import React, { useState } from 'react';

const ToggleSwitch = () => {
  const [leftSelected, setLeftSelected] = useState(true);

  const handleToggle = () => {
    setLeftSelected(!leftSelected);
  };

  return (
    <div class="btn-container">
      <label class="switch btn-color-mode-switch">
            <input type="checkbox" name="color_mode" id="color_mode" value="1"/>
            <label for="color_mode" data-on="Right" data-off="Left" class="btn-color-mode-switch-inner"></label>
        </label>
      
  </div>
  );
};

export default ToggleSwitch;
