import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DestinationSearch = ({ onDestinationSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const history = useNavigate();
  
  useEffect(() => {
    const getDestinations = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/dests");
        setDestinations(res.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getDestinations();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filteredDestinations = destinations.filter((destination) =>
      destination.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults(filteredDestinations);
  };

  const handleDestinationSelect = (destination) => {
    setSearchTerm("");
    setSearchResults([]);
    onDestinationSelect(destination);
  };
  
  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search destinations"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="btn btn-outline-dark"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
          </svg>
        </button>
      </div>
      {searchTerm && (
        <div className="dropdown">
          <ul
            className="dropdown-menu"
            style={{ display: "block", position: "absolute", width: "100%" }}
          >
            {searchResults.map((destination) => (
              <li
                key={destination._id}
                className="list-group-item d-flex align-items-center mb-2"
                onClick={() => handleDestinationSelect(destination)}
                style={{ cursor: "pointer" }}
              >
                <svg
                  style={{ marginLeft: "10px" }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-geo me-2"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"
                  />
                </svg>
                {destination.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DestinationSearch;
