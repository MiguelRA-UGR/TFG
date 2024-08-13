import React, { useState } from "react";
import DestinationSearch from "./DestinationSearch.js";
import UserSearch from "./UserSearch.js";
import { createRequest } from "../actions/request.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const RequestForm = () => {
  const [type, setType] = useState(0);
  const [comment, setComment] = useState("");
  const [destination, setDestination] = useState("");
  const [user] = useState(JSON.parse(localStorage.getItem("profile")));
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const requestData = {
      type,
      comment,
      user: user.result._id,
      ...(type === 1 && selectedDestination ? { destination: selectedDestination._id } : {}),
      ...(type === 2 && selectedUser ? { reported: selectedUser._id } : {}),
    };

    try {
      dispatch(createRequest(requestData));
      alert("Your request has been registered in the system");
      navigate("/");
    } catch (error) {
      alert(
        "An error occurred while processing your request. Please try again."
      );
    }
  };

  const handleDestinationSelect = (destination) => {
    setDestination(destination);
    setSelectedDestination(destination);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
    setSelectedDestination(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Request Type
          </label>
          <select
            className="form-control"
            id="type"
            value={type}
            onChange={(e) => setType(Number(e.target.value))}
          >
            <option value={0}>Destination Request</option>
            <option value={1}>Destination Change Request</option>
            <option value={2}>Report</option>
            <option value={3}>Other</option>
          </select>
        </div>
        {type === 1 && (
          <div className="mb-3">
            <label htmlFor="destination" className="form-label">
              Destination
            </label>
            {selectedDestination ? (
              <input
                type="text"
                className="form-control"
                value={selectedDestination.name}
                onChange={handleDestinationChange}
                readOnly
              />
            ) : (
              <DestinationSearch
                onDestinationSelect={handleDestinationSelect}
              />
            )}
          </div>
        )}
        {type === 2 && (
          <div className="mb-3">
            <label htmlFor="user" className="form-label">
              User
            </label>
            <UserSearch onUserSelect={handleUserSelect} />
            {selectedUser && (
              <input
                type="text"
                className="form-control mt-2"
                value={selectedUser.userName}
                readOnly
              />
            )}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Comment
          </label>
          <textarea
            className="form-control"
            id="message"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button
          type="submit"
          style={{
            fontWeight: "bold",
            backgroundColor: "#f5973d",
            color: "#ffffff",
          }}
          className="btn btn-warning"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default RequestForm;
