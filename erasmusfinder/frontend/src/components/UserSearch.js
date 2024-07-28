import React, { useEffect, useState } from "react";
import axios from "axios";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserSearch = ({ onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem("profile")));
  
  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/users");
        setUsers(res.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filteredUsers = users.filter((user) =>
      user.userName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSearchResults(filteredUsers);
  };

  const handleUserSelect = (user) => {
    setSearchTerm("");
    setSearchResults([]);
    onUserSelect(user);
  };

  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="search"
          className="form-control"
          placeholder="Search users"
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
            {searchResults.map((userObj) => (
              <li
                key={userObj._id}
                className="list-group-item d-flex align-items-center mb-2"
                style={{ cursor: "pointer" }}
              >

                <Link   to={user.result._id === userObj._id ? `/Profile` : `/User/${userObj._id}`}
                        className="nav-link ml-3"
                        key={userObj._id}
                        >
                    <Avatar
                    user={userObj}
                    outerSize="50px"
                    innerSize="40px"
                    flagSize="25px"
                    />

                    {userObj.userName}
                </Link>
                
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
