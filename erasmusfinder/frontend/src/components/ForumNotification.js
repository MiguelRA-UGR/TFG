import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteNotification } from "../actions/notification";
import { stateColors } from "./utils";

const Notification = ({ notification }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();

  const backColor =
    notification.type === 1
      ? stateColors.one
      : notification.type === 2
      ? stateColors.two
      : stateColors.zero;

  const formattedDate = new Date(notification.createdAt).toLocaleString();

  const handleDelete = () => {
    dispatch(deleteNotification(notification._id));
    window.location.reload();
  };

  return (
    <div
      className="card m-1"
      style={{ backgroundColor: backColor, position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/Forum/${notification.forum}`}
        style={{ textDecoration: "none" }}
      >
        <div
          className="card-body"
          style={{ padding: "10px", color: "#ffffff" }}
        >
          <p className="mt-0">{notification.text}</p>
          <small>{formattedDate}</small>
        </div>
      </Link>
      {isHovered && (
        <button
          className="btn btn-danger d-flex align-items-center justify-content-center"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            width: "40px",
            height: "40px",
            padding: "0",
          }}
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Notification;
