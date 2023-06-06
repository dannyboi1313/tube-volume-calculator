import React, { useState } from "react";

const BulletList = ({ list }) => {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState("");

  const handleInputChange = (event) => {
    setCurrentItem(event.target.value);
  };

  const handleAddItem = () => {
    if (currentItem.trim() !== "") {
      setItems([...items, currentItem]);
      setCurrentItem("");
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  return (
    <div>
      <ul className="bullet-list">
        {list.map((item, index) => (
          <li key={index} className="bullet-list-item">
            <div className="custom-bullet"></div>
            <p className="bullet-list-p">{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BulletList;
