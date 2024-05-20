import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { createContact, breakContact } from "../actions/usersContact";

const initialState = {
  snd: "",
  rcv: "",
};

const ContactRequest = ({ user, userRequest }) => {
  const dispatch = useDispatch();
  const [dataContact] = useState(initialState);

  const handleAccept = async () => {
    dataContact.snd = userRequest;
    dataContact.rcv = user;

    try {
      dispatch(createContact(dataContact));
      window.location.reload();
    } catch (error) {
      console.error(
        "Error al manejar la aceptación de la solicitud de contacto:",
        error
      );
    }
  };

  const handleDecline = async () => {
    dataContact.snd = userRequest;
    dataContact.rcv = user;

    try {
      dispatch(breakContact(dataContact));
      window.location.reload();
    } catch (error) {
      console.error(
        "Error al rechazar la solicitud de contacto:",
        error
      );
    }
  };

  return (
    <li className="card mb-2" style={{ maxWidth: "300px" }}>
      <div className="card-body">
        <div className="d-flex align-items-center mb-2">
          <div className="d-flex justify-content-center h-100">
          <Link to={`/User/${userRequest._id}`} className="nav-link ml-3" >
            <div
              className="image_outer_container"
              style={{
                backgroundColor:
                userRequest.state === 0
                    ? "#969696"
                    : userRequest.state === 1
                    ? "#f5973d" // Naranja
                    : userRequest.state === 2
                    ? "#6691c3" // Azul
                    : userRequest.state === 3
                    ? "#61bdb8" // Aguamarina
                    : "#969696", //Gris
              }}
            >
              <div className="flag_icon">
                <img
                  src={`https://flagcdn.com/${userRequest.badge}.svg`}
                  alt="User's Flag"
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "cover",
                    border: "3px solid white",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div className="image_inner_container">
                {userRequest.photo ? (
                  <img
                    src={`http://localhost:4000/imgs/users/${userRequest._id}.png`}
                    alt={userRequest.userName}
                    className="rounded-circle"
                    style={{
                      width: "45px",
                      height: "45px",
                      border: "2px solid white",
                    }}
                  />
                ) : (
                  <div
                    className="text-center rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      fontSize: "18px",
                      color: "white",
                      width: "45px",
                      height: "45px",
                      border: "3px solid white",
                      backgroundColor: "969696",
                    }}
                  >
                    {userRequest.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            </Link>
          </div>
          <h5 className="mt-0" style={{ marginLeft: "10px" }}>
            {userRequest.userName}
          </h5>
        </div>
        <div className="justify-content-center">
          <button
            className="btn btn-warning"
            style={{
              width: "90px",
              fontWeight: "bold",
              backgroundColor: "#f5973d",
              color: "#ffffff",
              marginRight: "5px",
            }}
            onClick={handleAccept}
          >
            Accept
          </button>

          <button
            className="btn btn-warning"
            style={{
              width: "90px",
              fontWeight: "bold",
              backgroundColor: "#696969",
              color: "#ffffff",
            }}
            onClick={handleDecline}
          >
            Decline
          </button>
        </div>
      </div>
    </li>
  );
};

ContactRequest.propTypes = {
  user: PropTypes.string.isRequired,
  userRequest: PropTypes.object.isRequired,
};

export default ContactRequest;
