import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import mapStyles from '../mapStyles.json';
import { Link } from "react-router-dom";
import { getColorForScore } from './utils';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MapComponent = ({ pinData }) => {
  const navigate = useNavigate();
  const [hoveredPin, setHoveredPin] = useState(null);

  const mapOptions = {
    minZoom: 2,
    maxZoom: 10,
    styles: mapStyles, 
  };

  const handleMarkerMouseOver = (pin) => {
    setHoveredPin(pin);
  };

  const handleMarkerMouseOut = () => {};

  const handleInfoWindowMouseOver = () => {};

  const handleInfoWindowMouseOut = () => {
    setHoveredPin(null);
  };

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: "50vh", borderRadius: "10%" }}>
        <Map
          options={mapOptions}
          defaultCenter={{ lat: 50.6872, lng: 13.405 }}
          defaultZoom={4}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        />
        {pinData.map((pin, index) => (
          <Marker
            key={index}
            position={pin.position}
            icon={pin.icon}
            onMouseOver={() => handleMarkerMouseOver(pin)}
            onMouseOut={handleMarkerMouseOut}
          />
        ))}
        {hoveredPin && (
          <InfoWindow
            position={hoveredPin.position}
            onCloseClick={() => setHoveredPin(null)}
          >
              <Link
                to={hoveredPin.link}
                className="nav-link"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex flex-column align-items-start">
                    <h5 style={{ marginBottom: '5px' }}>{hoveredPin.name}</h5>
                    <div className="d-flex align-items-center">
                      <p style={{ fontSize: '14px', margin: '0' }}>{hoveredPin.country}</p>
                      <img
                        src={`https://flagcdn.com/${hoveredPin.iso}.svg`}
                        alt={hoveredPin.country}
                        style={{ height: "20px", width: "20px", marginLeft: "5px", borderRadius: "50%", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      marginLeft: "10px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: getColorForScore(hoveredPin.score),
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{ fontSize: "25px", color: "#ffffff", fontWeight: "bold" }}
                    >
                      {hoveredPin.score === -1 ? "-" : hoveredPin.score}
                    </span>
                  </div>
                </div>
              </Link>
          </InfoWindow>
        )}
      </div>
    </APIProvider>
  );
};

export default MapComponent;
