import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import '../index.css';


const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const getDestinations = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/dests', {
          method: 'GET',
        });
        if (!res.ok) {
          throw new Error('Error al obtener los destinos');
        }
        const data = await res.json();
        setDestinations(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    getDestinations();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filteredDestinations = destinations.filter(destination =>
      destination.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults(filteredDestinations);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  const DropdownResults = () => {
    if (searchTerm === '') {
      return null;
    }

    return (
      <div className="dropdown-menu show">
        {searchResults.map(destination => (
          <Link key={destination._id} to={`/Destination/${destination._id}`} className="dropdown-item">
            {destination.name}
          </Link>
        ))}
      </div>
    );
  };

  const users = [
    { id: 1, name: 'Martina', country: 'Italia', status: 'Buscando destino', status_color:"#f5973d", avatar: "martina", flag: "italia" },
    { id: 2, name: 'Agnes', country: 'Suecia', status: 'Próximamente en Madrid', status_color:"#6691c3", avatar: "agnes", flag: "suecia" },
    { id: 3, name: 'Eric', country: 'Francia', status: 'Viviendo en Viena', status_color:"#61bdb8", avatar: "eric", flag: "francia" }
  ];

  return (
    <div className="container text-center">

        <div className="input-group mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Buscar destinos"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="btn btn-outline-dark" type="button" onClick={clearSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
        </button>
      </div>
      {searchTerm && (
        <div className="dropdown">
          <ul className="dropdown-menu" style={{ display: 'block', position: 'absolute', width: '100%' }}>
            {searchResults.map(destination => (
               <Link key={destination._id} to={`/Destination/${destination._id}`} className="list-group-item d-flex align-items-center mb-2">
               <svg style={{ marginLeft: '10px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo me-2" viewBox="0 0 16 16">
                 <path fillRule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
               </svg>
               {destination.name}
             </Link>
            ))}
          </ul>
        </div>
      )}


      <span className="mb-5" style={{ fontSize: "35px", color: "#595959", fontFamily: "Cambria, serif", fontWeight: "bold" }}>Descubre...</span>

      <div id="carouselExampleAutoplaying" className="carousel slide d-flex justify-content-center align-items-center" data-bs-ride="carousel">
        <div className="carousel-inner">
          {destinations.map((destination, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <Link to={`/Destination/${destination._id}`}>
                  <img src={require(`../imgs/frontpages/${destination.name.toLowerCase()}.png`)} style={{maxHeight: "700px", objectFit: 'cover' }} alt={destination.name} />
              </Link>
              <div className="carousel-caption d-flex justify-content-center align-items-center" style={{ position: "absolute", bottom: "0", left: "0", right: "0", backgroundColor: "rgba(0, 0, 0, 0.6)"}}>
                <div className="text-center">
                  <h5 style={{fontSize: "25px", fontFamily: "Cambria, serif", fontWeight: "bold"}}>{destination.name}</h5>
                  <p style={{ maxWidth: "60%", margin: "0 auto" }}>{destination.description}</p>
                </div>
              </div>
            </div>
         
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      <div className="mt-4">
        <span style={{ fontSize: "35px", color: "#595959", fontFamily: "Cambria, serif", fontWeight: "bold"}}>Conecta con gente que busca lo mismo que tú</span>
      </div>
      <div className="row text-center justify-content-center mt-4">
        {users.map(user => (
          <div key={user.id} className="col-md-3 mb-4">
            <div id= "custom_card" className="card">
              <img src={require(`../imgs/users/${user.avatar}.png`)} className="card-img-top" alt={user.name} style={{ height: "200px", objectFit: 'cover' }}/>
              <div className="card-body">
                <h5 className="card-title">{user.name}</h5>
                <div className="d-flex align-items-center justify-content-center">
                  <img src={require(`../imgs/flags/${user.flag}.png`)} alt={user.country} style={{ height: "20px", marginRight: "5px"}} />
                  <p className="card-text mb-0">{user.country}</p>
                </div>
                <div className="btn btn-link mt-2 form-control" style={{ fontWeight: "bold", fontSize: `${18 - user.status.length * 0.3}px`, background: user.status_color, color: 'white',textDecoration: 'none'}} >{user.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
