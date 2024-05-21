import React from 'react';
import PropTypes from 'prop-types';

const Avatar = ({ user, outerSize, innerSize, flagSize}) => {
    const color =
    user.state === 0
      ? "#969696"
      : user.state === 1
      ? "#f5973d" // Naranja
      : user.state === 2
      ? "#6691c3" // Azul
      : user.state === 3
      ? "#61bdb8" // Aguamarina
      : "#969696"; // Gris
  
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
      <div className="image_outer_container" style={outerStyles}>
        <div className="flag_icon" style={{ zIndex: 1}}>
          <img
            src={`https://flagcdn.com/${user.badge}.svg`}
            alt="User's Flag"
            style={flagStyles}
          />
        </div>
        <div className="image_inner_container">
          {user.photo ? (
            <img
              src={`http://localhost:4000/imgs/users/${user._id}.png`}
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
};

Avatar.propTypes = {
  user: PropTypes.shape({
    state: PropTypes.number.isRequired,
    badge: PropTypes.string.isRequired,
    photo: PropTypes.bool.isRequired,
    _id: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
  }).isRequired,
  outerSize: PropTypes.string.isRequired,
  innerSize: PropTypes.string.isRequired,
  flagSize: PropTypes.string.isRequired,
};

export default Avatar;
