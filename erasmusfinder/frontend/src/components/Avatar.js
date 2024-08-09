import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import axios from "axios";
import { stateColors } from "./utils";

const Avatar = ({ userId, outerSize, innerSize, flagSize }) => {
  const [user, setUser] = useState(null);
  const [userToken] = useState(JSON.parse(localStorage.getItem('profile')));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!user) {
    return <div class="spinner-border" role="status">
    <span class="visually-hidden">Getting Avatar...</span>
  </div>;
  }

  const color = 
    user.state === 0
      ? stateColors.zero
      : user.state === 1
      ? stateColors.one
      : user.state === 2
      ? stateColors.two
      : user.state === 3
      ? stateColors.three
      : "#ffffff";

  const outerStyles = {
    backgroundColor: color,
    width: outerSize,
    height: outerSize,
  };

  const innerStyles = {
    width: innerSize,
    height: innerSize,
    border: "2px solid white",
  };

  const flagStyles = {
    width: flagSize,
    height: flagSize,
    objectFit: "cover",
    border: "3px solid white",
    borderRadius: "50%",
  };

  const placeholderStyles = {
    fontSize: "18px",
    color: "white",
    width: innerSize,
    height: innerSize,
    border: "3px solid white",
    backgroundColor: color,
  };

  return (
    <div className="d-flex justify-content-center h-100">
      <Link
        to={userToken.result._id === userId? `/Profile` : `/User/${userId}`}
        className="nav-link ml-3"
        key={userId}
      >
        <div className="image_outer_container" style={outerStyles}>
          <div className="flag_icon" style={{ zIndex: 1 }}>
            <img
              src={`https://flagcdn.com/${user.badge}.svg`}
              alt="User's Flag"
              style={flagStyles}
            />
          </div>
          <div className="image_inner_container">
            {user.photo ? (
              <img
                src={`http://localhost:4000/imgs/users/${userId}.png`}
                alt={user.userName}
                className="rounded-circle"
                style={innerStyles}
              />
            ) : (
              <div
                className="text-center rounded-circle d-flex align-items-center justify-content-center"
                style={placeholderStyles}
              >
                {user.userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

Avatar.propTypes = {
  userId: PropTypes.string.isRequired,
  outerSize: PropTypes.string.isRequired,
  innerSize: PropTypes.string.isRequired,
  flagSize: PropTypes.string.isRequired,
};

export default Avatar;
