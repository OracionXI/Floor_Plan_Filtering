import axios from "axios";
import { useEffect, useState } from "react";
import * as Realm from "realm-web";
import "./App.css";
import names from "./imageFiles.json";

const app = new Realm.App({ id: "data-xrfvv" });

const App = () => {
  const [image, setImage] = useState(null);
  const [imageIndex, setImageIndex] = useState(0); // Track the current image index
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  ); // Load username from localStorage
  const [token, setToken] = useState("");
  const [error, setError] = useState(false);

  const [lastThreeIndices, setLastThreeIndices] = useState(
    JSON.parse(localStorage.getItem("lastThreeIndices")) || []
  );

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState("success");

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

  const createOne = async (voteAnswer) => {
    const config = {
      method: "post",
      url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-xrfvv/endpoint/data/v1/action/insertOne",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        collection: "votes",
        database: "cse400",
        dataSource: "minframe",
        document: {
          username: userName,
          imageName: imageName,
          voteAnswer: voteAnswer,
        },
      }),
    };

    try {
      const resp = await axios(config);
      return resp;
    } catch (err) {
      setError(true);
      console.error("Error inserting vote", err);
      return { err: err };
    }
  };

  const handleVote = async (voteAnswer) => {
    if (!userName) {
      alert(`Please enter a username before voting.`);
      return;
    }
    const response = await createOne(voteAnswer);
    if (response?.err || error) {
      alert("Vote was not recorded. Please try again. ");
      setOverlayType("error");
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 1000); // Hide overlay after 1 second
      return;
    }

    if (!error) {
      setOverlayType("success");
      setShowOverlay(true);
      setTimeout(() => setShowOverlay(false), 1000); // Hide overlay after 1 second

      setImageIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % names.length;
        const updatedIndices = [newIndex, ...lastThreeIndices].slice(0, 3);
        setLastThreeIndices(updatedIndices);
        localStorage.setItem(
          "lastThreeIndices",
          JSON.stringify(updatedIndices)
        );
        return newIndex;
      });
    }
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUserName(newUsername);
    localStorage.setItem("userName", newUsername);
  };

  const imageName = image ? image.split("/").pop() : "";

  async function loginEmailPassword(email, password) {
    const credentials = Realm.Credentials.emailPassword(email, password);
    try {
      const user = await app.logIn(credentials);
      console.assert(user.id === app.currentUser.id);
      return user;
    } catch (err) {
      console.error("Error logging in:", err);
      setError(true);
    }
  }

  const fetchImageFromDatabase = (index) => {
    const imagePath = `./floorPlans/${names[index]}`;
    setImage(imagePath);
  };

  useEffect(() => {
    fetchImageFromDatabase(imageIndex);
  }, [imageIndex]);

  useEffect(() => {
    console.log(error);
  }, []);

  useEffect(() => {
    loginEmailPassword("newcpalead2@gmail.com", "#AT22u3^sNn@ud").then((user) =>
      setToken(user.accessToken)
    );
  }, []);

  return (
    <div className="main-container">
      <div className="left-container">
        {/* Left Container */}
        <div className="name-container">
          <h2>Username</h2>
          <input
            type="text"
            value={userName}
            onChange={handleUsernameChange}
            className="uid"
          ></input>
          <h2>Image index</h2>
          <input
            type="number"
            value={imageIndex}
            className="uid"
            onChange={(e) => setImageIndex(parseInt(e.target.value))}
          ></input>
        </div>
        <h2>Floor Design</h2>
        <div className="image-box">
          <img src={image} alt="Uploaded" className="uploaded-image" />
        </div>
        <div className="legend-seg">
          <h3>Name: {imageName}</h3>
          <div className="legend-container">
            <div
              className={`overlay ${
                showOverlay
                  ? overlayType === "error"
                    ? "error show-overlay"
                    : "show-overlay"
                  : ""
              }`}
            ></div>
          </div>
        </div>
        <div className="button-group">
          <button
            className="A-button"
            onClick={async () => await handleVote("A")}
            disabled={error}
          >
            High B
          </button>
          <button
            className="B-button"
            onClick={async () => await handleVote("B")}
            disabled={error}
          >
            Low B
          </button>
          <button
            className="C-button"
            onClick={async () => await handleVote("C")}
            disabled={error}
          >
            C
          </button>
          <button
            className="no-button"
            onClick={async () => await handleVote("D")}
            disabled={error}
          >
            <img className="poop" src={"/poop.svg"} alt="poop" />
          </button>
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

        <div className="bottom-container">
          <div className="br-container">
            <h3>
              <u>User Data</u>
            </h3>
            <h4>Username: {userName}</h4>
            <h4>Last 3 Entries:</h4>
            <ul>
              {lastThreeIndices.map((entry, index) => (
                <li key={index}>Index: {entry - 1}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
