import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ForumPreview from "./ForumPreview";

const ForumSearch = ({ onTopicSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [forums, setTopics] = useState([]);

  useEffect(() => {
    const getTopics = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/forums`);
        setTopics(res.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getTopics();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filteredForums = forums.filter((forum) =>
      forum.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults(filteredForums);
  };

  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search forum topics"
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
            {searchResults.map((forumObj) => (
              <li
                key={forumObj._id}
                className="list-group-item d-flex align-items-center mb-2"
                style={{ cursor: "pointer" }}
              >
                <ForumPreview forum={forumObj}/>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ForumSearch;
