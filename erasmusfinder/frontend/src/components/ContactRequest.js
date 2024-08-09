import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "./Avatar"

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
           
          <Avatar userId={userRequest._id}
            outerSize="60px"
            innerSize="50px"
            flagSize="20px">
          </Avatar>

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
