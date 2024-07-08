import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import mapStyles from '../mapStyles.json'; 

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MapComponent = ({ pinData }) => {
  const navigate = useNavigate();
  const [selectedPin, setSelectedPin] = useState(null);
  const [hoveredPin, setHoveredPin] = useState(null);

  const mapOptions = {
    minZoom: 2,
    maxZoom: 10,
    styles: mapStyles, 
  };

  const handleMarkerClick = (pin) => {
    navigate(pin.link);
  };

  const handleMarkerMouseOver = (pin) => {
    setHoveredPin(pin);
  };

  const handleMarkerMouseOut = () => {
    setTimeout(() => {
      if (hoveredPin === null) {
        setSelectedPin(null);
      }
    }, 100);
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
            onClick={() => handleMarkerClick(pin)}
            onMouseOver={() => handleMarkerMouseOver(pin)}
            onMouseOut={() => handleMarkerMouseOut()}
          />
        ))}
        {(selectedPin || hoveredPin) && (
          <InfoWindow
            position={(selectedPin || hoveredPin).position}
            onCloseClick={() => handleMarkerMouseOut}
          >
            <div>
              <h2>{"Hola"}</h2>
              <p>{"Description"}</p>
            </div>
          </InfoWindow>
        )}
      </div>
    </APIProvider>
  );
};

export default MapComponent;
