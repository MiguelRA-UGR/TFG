import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { stateColors } from "./utils";

const Avatar = ({
  userId,
  outerSize,
  innerSize,
  flagSize,
  userName,
  disabled = false,
}) => {
  const [user, setUser] = useState(null);
  const [userToken] = useState(JSON.parse(localStorage.getItem("profile")));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}`
        );
        setUser(response.data);
        if (userName) {
          userName(response.data.userName);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser({
          userName: "Usuario eliminado",
          state: 0,
          photo: null,
          nationality: "us",
          deleted: true,
        });
        if (userName) {
          userName("Usuario eliminado");
        }
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, userName]);

  if (!user) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Getting Avatar...</span>
      </div>
    );
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

  const defaultImage = "https://via.placeholder.com/150";

  const content = (
    <div className="d-flex flex-column align-items-center">
      <div className="image_outer_container" style={outerStyles}>
        <div className="flag_icon" style={{ zIndex: 1 }}>
          <img
            src={`https://flagcdn.com/${user.nationality}.svg`}
            alt="User's Flag"
            style={flagStyles}
          />
        </div>
        <div className="image_inner_container">
          {user.deleted ? (
            <img
              src={defaultImage}
              alt="Placeholder"
              className="rounded-circle"
              style={innerStyles}
            />
          ) : user.photo ? (
            <img
              src={`${process.env.REACT_APP_API_URL}/imgs/users/${userId}.png`}
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
    </div>
  );

  if (disabled || user.deleted) {
    return <div className="text-center">{content}</div>;
  }

  return (
    <Link
      to={userToken.result._id === userId ? `/Profile` : `/User/${userId}`}
      className="nav-link"
      key={userId}
    >
      {content}
    </Link>
  );
};

export default Avatar;
