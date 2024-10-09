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

  const [ACount, setACount] = useState(0);
  const [BCount, setBCount] = useState(0);
  const [CCount, setCCount] = useState(0);
  const [DCount, setDCount] = useState(0);
  const [error, setError] = useState(false);

  const [userTotalVotes, setUserTotalVotes] = useState(0);
  const [lastThreeEntries, setLastThreeEntries] = useState([]);
  const [lastThreeIndices, setLastThreeIndices] = useState(
    JSON.parse(localStorage.getItem("lastThreeIndices")) || []
  );

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState("success");
  const [pendingCount, setPendingCount] = useState(0);
  const [previousPendingCount, setPreviousPendingCount] = useState(null);
  const [notUp, setNotup] = useState(false);
  const [showCounts, setShowCounts] = useState(false);
  const [ownCounts, setOwnCounts] = useState(false);

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

  const fetchVoteCounts = async () => {
    if (!token) return;
    const config = {
      method: "post",
      url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-xrfvv/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        collection: "votes1",
        database: "cse400",
        dataSource: "minframe",
        filter: {},
        limit: 10000,
      }),
    };

    try {
      const response = await axios(config);
      const votes = response.data.documents;

      const AVotes = votes.filter((vote) => vote.voteAnswer === "A").length;
      const BVotes = votes.filter((vote) => vote.voteAnswer === "B").length;
      const CVotes = votes.filter((vote) => vote.voteAnswer === "C").length;
      const DVotes = votes.filter((vote) => vote.voteAnswer === "D").length;

      setACount(AVotes);
      setBCount(BVotes);
      setCCount(CVotes);
      setDCount(DVotes);

      const totalVotes = AVotes + BVotes + CVotes + DVotes;
      setPendingCount(names.length - totalVotes);
      setError(false);
    } catch (err) {
      console.error("Error fetching vote counts", err);
      setError(true);
    }
  };

  const fetchUserData = async () => {
    if (!token || !userName) return;
    const config = {
      method: "post",
      url: "https://ap-south-1.aws.data.mongodb-api.com/app/data-xrfvv/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Headers": "*",
        Authorization: `Bearer ${token}`,
      },
      data: JSON.stringify({
        collection: "votes1",
        database: "cse400",
        dataSource: "minframe",
        filter: { username: userName }, // Filter by username
        sort: { _id: -1 }, // Sort by most recent
        limit: 10000,
      }),
    };

    try {
      const response = await axios(config);
      const userVotes = response.data.documents;
      setUserTotalVotes(userVotes.length);

      // Get the last 3 entries
      const lastThree = userVotes.slice(0, 3).map((vote) => vote.imageName);
      setLastThreeEntries(lastThree);
    } catch (err) {
      console.error("Error fetching user data", err);
    }
  };

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
        collection: "votes1",
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
      setTimeout(() => setShowOverlay(false), 500); // Hide overlay after 1 second

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
      await fetchVoteCounts();
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
    setImage(`./floorPlans/${names[index]}`);
  };

  useEffect(() => {
    if (token && userName) {
      fetchUserData();
    }
  }, [token, userName, imageIndex]);

  useEffect(() => {
    if (token && !error) {
      fetchVoteCounts();
    }
  }, [token, error]);

  useEffect(() => {
    fetchImageFromDatabase(imageIndex); // Fetch the first image on load
  }, [imageIndex]); // Refetch image whenever imageIndex changes

  useEffect(() => {
    loginEmailPassword("newcpalead2@gmail.com", "#AT22u3^sNn@ud").then((user) =>
      setToken(user.accessToken)
    );
  }, []);

  useEffect(() => {
    if (
      previousPendingCount !== null &&
      previousPendingCount === pendingCount
    ) {
      setNotup(true);
      alert(
        "Refresh the page. And REMEMBER THE INDEX NUMBER! BHULE GELE MAIR!"
      );
    }
    setPreviousPendingCount(pendingCount);
  }, [pendingCount]);

  const handleShowCounts = async () => {
    setShowCounts(true);
    await fetchVoteCounts();
    setTimeout(() => {
      setShowCounts(false);
    }, 3000);
  };

  const handleOwnCounts = async () => {
    setOwnCounts(true);
    await fetchUserData();
    setTimeout(() => {
      setOwnCounts(false);
    }, 3000);
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
            disabled={pendingCount === 0 || notUp}
          >
            High B
          </button>
          <button
            className="B-button"
            onClick={async () => await handleVote("B")}
            disabled={pendingCount === 0 || notUp}
          >
            Low B
          </button>
          <button
            className="C-button"
            onClick={async () => await handleVote("C")}
            disabled={pendingCount === 0 || notUp}
          >
            C
          </button>
          <button
            className="no-button"
            onClick={async () => await handleVote("D")}
            disabled={pendingCount === 0 || notUp}
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
          <div className="bl-container">
            <h3>
              <u>Vote Counts</u>
            </h3>
            {showCounts && (
              <>
                <h4>
                  High B: {ACount} / {ACount + BCount + CCount + DCount}
                </h4>
                <h4>
                  Low B: {BCount} / {ACount + BCount + CCount + DCount}
                </h4>
                <h4>
                  C: {CCount} / {ACount + BCount + CCount + DCount}
                </h4>
                <h4>
                  Shit: {DCount} / {ACount + BCount + CCount + DCount}
                </h4>
                <h4>Pending: {pendingCount}</h4>
              </>
            )}
            <button className="show-count" onClick={handleShowCounts}>
              Show Counts
            </button>
          </div>

          <div className="br-container">
            <h3>
              <u>User Data</u>
            </h3>
            <h4>Username: {userName}</h4>
            <h4>Total Votes: {ownCounts ? userTotalVotes : "Dekhamu na"}</h4>
            <button className="show-count" onClick={handleOwnCounts}>
              Own Counts
            </button>
            <h4>Last 3 Entries:</h4>
            <ul>
              {lastThreeEntries.map((entry, index) => (
                <li key={index}>
                  Index: {lastThreeIndices[index] - 1 || "N/A"} (Image: {entry})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
