import React from 'react';
import {createRoot} from 'react-dom/client';
import {APIProvider, Map, Pin} from '@vis.gl/react-google-maps';
import mapStyles from '../mapStyles.json'; 

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MapComponent = () => {
  const mapOptions = {
    minZoom: 2,
    maxZoom: 10,
    styles: mapStyles, 
  };
  
  return(
    <APIProvider apiKey={API_KEY}>
    <div style={{height: "50vh", borderRadius: "10%"}}>
      <Map
        options={mapOptions}
        defaultCenter={{lat: 50.6872, lng: 13.405}}
        defaultZoom={4}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      />
    </div> 
  </APIProvider>
  );
};

export default MapComponent;