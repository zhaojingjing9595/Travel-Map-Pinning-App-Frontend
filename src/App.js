import React, { useState, useEffect } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import StarIcon from "@mui/icons-material/Star";
import RoomIcon from "@mui/icons-material/Room";
import "mapbox-gl/dist/mapbox-gl.css";
import "./app.css";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("user")? localStorage.getItem("user"):null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [ rating, setRating ] = useState(0);
  const [ showRegister, setShowRegister ] = useState(false);
  const [ showLogin, setShowLogin ] = useState(false);
  const [viewState, setViewState] = React.useState({
    longitude: 35,
    latitude: 31.6,
    zoom: 6.5,
  });

  useEffect(() => {
    async function getPins() {
      try {
        const response = await axios.get("http://localhost:8080/api/pins");
        setPins(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getPins();
  }, []);

  function handleMarkerClick(id, lat, long) {
    setCurrentPlaceId(id);
    setViewState({ ...viewState, latitude: lat, longitude: long });
  }

  function handleAddClick(e) {
    setNewPlace({
      lat: e.lngLat.lat,
      long: e.lngLat.lng,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating: parseInt(rating),
      lat: newPlace.lat,
      long: newPlace.long,
    };
    console.log(newPin);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/pins",
        newPin
      );
      setPins([...pins, response.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  }

  function handleLogout() {
    myStorage.removeItem('user');
    setCurrentUser(null);
  }

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100vw", height: "100vh" }}
      //  mapStyle="mapbox://styles/mapbox/streets-v9"
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      onDblClick={handleAddClick}
      transitionDuration="1000"
    >
      {pins.length > 0 &&
        pins.map((p) => (
          <div key={p._id}>
            <Marker
              longitude={p.long}
              latitude={p.lat}
              offsetLeft={-viewState.zoom * 3.5}
              offsetRight={-viewState.z}
            >
              <RoomIcon
                style={{
                  fontSize: viewState.zoom * 7,
                  color: p.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="right"
                closeButton={true}
                closeOnClick={false}
                onClose={() => {
                  setCurrentPlaceId(null);
                }}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<StarIcon className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    created By <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </div>
        ))}
      {newPlace && (
        <>
          <Marker longitude={newPlace.long} latitude={newPlace.lat}>
            <RoomIcon
              style={{
                fontSize: viewState.zoom * 7,
                color: "green",
                cursor: "pointer",
              }}
              // onClick={() => handleMarkerClick(newPlace._id)}
            />
          </Marker>
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            anchor="right"
            closeButton={true}
            closeOnClick={false}
            onClose={() => {
              setNewPlace(null);
            }}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="say something about this place"
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        </>
      )}
      {currentUser ? (
        <button className="button logout" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <div className="buttons">
          <button
            className="button login"
            onClick={() => {
              setShowLogin(true);
              setShowRegister(false);
            }}
          >
            Login
          </button>
          <button
            className="button register"
            onClick={() => {
              setShowRegister(true);
              setShowLogin(false);
            }}
          >
            Register
          </button>
        </div>
      )}
      {showRegister && (
        <Register
          setShowRegister={setShowRegister}
          setCurrentUser={setCurrentUser}
        />
      )}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          setCurrentUser={setCurrentUser}
        />
      )}
    </Map>
  );
}

export default App;
