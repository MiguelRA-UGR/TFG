import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Destination = () => {
  const { id } = useParams();
  
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const getDestination = async () => {
      try {
        const destinationId = window.location.pathname.split('/').pop();
        
        const res = await fetch(`http://localhost:4000/api/dests/${destinationId}`, {
          method: 'GET',
        });
        if (!res.ok) {
          throw new Error('Error al obtener el destino');
        }
        const data = await res.json();
        setDestination(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getDestination();
  }, []);

  if (!destination) {
    return <div>Cargando destino...</div>;
  }

  return (
    <div>
      <div className="d-flex align-items-center">
        <h1 className="mt-4" style={{ fontSize: "50px",fontFamily: "Cambria, serif", fontWeight: "bold" }}>{destination.name}</h1>
        <img src={require(`../imgs/flags/${destination.country.toLowerCase()}.png`)} alt={destination.country} style={{ height: "40px",marginTop: "20px", marginLeft: "5px"}} />
      </div>
      
      <img src={require(`../imgs/frontpages/${destination.name.toLowerCase()}.png`)} style={{maxHeight: "700px", objectFit: 'cover' }} alt={destination.name} />
    </div>
  );
};

export default Destination;
