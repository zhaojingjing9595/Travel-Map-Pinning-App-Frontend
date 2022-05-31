import React,{useState, useEffect} from "react";
import Map, { Marker, Popup } from "react-map-gl";
import StarIcon from "@mui/icons-material/Star";
import RoomIcon from "@mui/icons-material/Room";
import "mapbox-gl/dist/mapbox-gl.css";
import './app.css'
import axios from "axios";
import {format} from 'timeago.js'


function App() {
   const currentUser = "Jingjing";
   const [pins, setPins] = useState([]);
   const [currentPlaceId, setCurrentPlaceId] = useState(null);
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
  }, [])
  
   function handleMarkerClick(id) {
     setCurrentPlaceId(id);
   }
  
  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ width: "100vw", height: "100vh" }}
      //  mapStyle="mapbox://styles/mapbox/streets-v9"
      mapStyle="mapbox://styles/safak/cknndpyfq268f17p53nmpwira"
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
    >

      {pins.length > 0 &&
        pins.map((p) => (
          <div key={p._id}>
            <Marker longitude={p.long} latitude={p.lat}>
              <RoomIcon
                style={{
                  fontSize: viewState.zoom * 7,
                  color: p.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id)}
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
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
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
    </Map>
  );
}

export default App;
