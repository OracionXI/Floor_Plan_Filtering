import { useEffect, useState } from "react";
import "./App.css";

import names from "./imageFiles.json";

const App = () => {
  const [image, setImage] = useState(null);

  // Define the colors in RGB format
  const colors1 = [
    { name: "front door", rgb: "rgb(230, 25, 75)" }, // Strong Red
    { name: "interior door", rgb: "rgb(60, 180, 75)" }, // Strong Green
    { name: "Living Room", rgb: "rgb(255, 225, 25)" }, // Bright Yellow
    { name: "Master Room", rgb: "rgb(0, 130, 200)" }, // Strong Blue
    { name: "Kitchen", rgb: "rgb(245, 130, 48)" }, // Orange
    { name: "Bathroom", rgb: "rgb(145, 30, 180)" }, // Violet
    { name: "Dining Room", rgb: "rgb(70, 240, 240)" }, // Cyan
    { name: "Child Room", rgb: "rgb(240, 50, 230)" }, // Magenta
  ];
  const colors2 = [
    { name: "Study Room", rgb: "rgb(250, 190, 190)" }, // Pink
    { name: "Second Room", rgb: "rgb(255, 215, 180)" }, // Apricot
    { name: "Guest Room", rgb: "rgb(0, 128, 128)" }, // Teal
    { name: "Balcony", rgb: "rgb(170, 110, 40)" }, // Brown
    { name: "Entrance", rgb: "rgb(128, 0, 0)" }, // Maroon
    { name: "Storage", rgb: "rgb(128, 128, 0)" }, // Olive
    { name: "External wall", rgb: "rgb(0, 0, 128)" }, // Navy
    { name: "Exterior Area", rgb: "rgb(255, 255, 255)" }, // Gray
  ];

  const fetchImageFromDatabase = () => {
    setImage(`/floorPlans/${names[3]}`);

    console.log(names);
  };

  useEffect(() => {
    fetchImageFromDatabase();
  }, []);

  const imageName = image ? image.split("/").pop() : "";

  return (
    <div className="main-container">
      <div className="left-container">
        {/* Left Container */}
        <div className="name-container">
          <h2>Username</h2>
          <input type="text" className="uid"></input>
        </div>
        <h2>Floor Design</h2>
        <div className="image-box">
          {/* Directly access the image from the public folder */}
          <img src={image} alt="Uploaded" className="uploaded-image" />
        </div>
        <h3>{imageName}</h3>
        <div className="button-group">
          <button className="yes-button">Yes</button>
          <button className="no-button">No</button>
        </div>
      </div>

      <div className="right-container">
        {/* Right Container */}
        <div className="top-container">
          <div className="title-container">
            <h2>Rooms and Features</h2>
          </div>
          {/* First Column of Colors */}
          <div className="top1-container">
            <div className="color-group">
              {/* Map through colors array to generate color items */}
              {colors1.map((color, index) => (
                <div className="color-item" key={index}>
                  <div
                    className="color-circle"
                    style={{ backgroundColor: color.rgb }}
                  ></div>
                  <span>{color.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Second Column of Colors */}
          <div className="top1-container">
            <div className="color-group">
              {/* Map through colors array to generate color items */}
              {colors2.map((color, index) => (
                <div className="color-item" key={index}>
                  <div
                    className="color-circle"
                    style={{ backgroundColor: color.rgb }}
                  ></div>
                  <span>{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-container"> hola </div>
      </div>
    </div>
  );
};

export default App;
