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

  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);

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

  // Function to fetch the votes from MongoDB
  const fetchVoteCounts = async () => {
    const config = {
      method: "post",
      url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-xrfvv/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        collection: "votes",
        database: "cse400",
        dataSource: "minframe",
        filter: {}, // Fetch all documents
      }),
    };

    try {
      const response = await axios(config);
      const votes = response.data.documents;

      // Count the number of yes (true) and no (false) votes
      const yesVotes = votes.filter((vote) => vote.voteAnswer === true).length;
      const noVotes = votes.filter((vote) => vote.voteAnswer === false).length;

      setYesCount(yesVotes);
      setNoCount(noVotes);
    } catch (err) {
      console.error("Error fetching vote counts", err);
    }
  };

  // Fetch vote counts when the component mounts
  useEffect(() => {
    if (token) {
      fetchVoteCounts();
    }
  }, [token]);

  const fetchImageFromDatabase = (index) => {
    setImage(`./floorPlans/${names[index]}`);
  };

  useEffect(() => {
    fetchImageFromDatabase(imageIndex); // Fetch the first image on load
  }, [imageIndex]); // Refetch image whenever imageIndex changes

  useEffect(() => {
    loginEmailPassword("newcpalead2@gmail.com", "#AT22u3^sNn@ud").then((user) =>
      setToken(user.accessToken)
    );
  }, []);

  const imageName = image ? image.split("/").pop() : "";

  async function loginEmailPassword(email, password) {
    const credentials = Realm.Credentials.emailPassword(email, password);
    const user = await app.logIn(credentials);
    console.assert(user.id === app.currentUser.id);
    return user;
  }

  const createOne = async (voteAnswer) => {
    const config = {
      method: "post",
      url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-xrfvv/endpoint/data/v1/action/insertOne",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
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
      console.error(err);
      return { err: err };
    }
  };

  const handleVote = async (voteAnswer) => {
    if (!userName) {
      alert("Please enter a username before voting.");
      return;
    }
    await createOne(voteAnswer);
    setImageIndex((prevIndex) => (prevIndex + 1) % names.length);
    // Refetch the vote counts to update the UI with the latest data
    await fetchVoteCounts();
  };

  // Handle the change in username and store it in localStorage
  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUserName(newUsername);
    localStorage.setItem("userName", newUsername); // Save the username locally
  };

  return (
    <div className="main-container">
      <div className="left-container">
        {/* Left Container */}
        <div className="name-container">
          <h2>Username</h2>
          <input
            type="text"
            value={userName}
            onChange={handleUsernameChange} // Handle change
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
          {/* Directly access the image from the public folder */}
          <img src={image} alt="Uploaded" className="uploaded-image" />
        </div>
        <h3>{imageName}</h3>
        <div className="button-group">
          <button
            className="yes-button"
            onClick={async () => await handleVote(true)}
          >
            Yes
          </button>
          <button
            className="no-button"
            onClick={async () => await handleVote(false)}
          >
            No
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
          <h3>
            <u>Vote Counts</u>
          </h3>
          <h4>
            Yes: {yesCount} / {yesCount + noCount}
          </h4>
          <h4>
            No: {noCount} / {yesCount + noCount}
          </h4>
          <h3>Pending: {names.length - (yesCount + noCount)}</h3>
        </div>
      </div>
    </div>
  );
};

export default App;
