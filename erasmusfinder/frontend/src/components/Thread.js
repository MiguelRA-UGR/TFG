import React, { useState } from "react";
import Avatar from "./Avatar";
import { timeElapsed } from "./utils";
import { useDispatch } from "react-redux";
import { deleteThread } from "../actions/thread.js";
import { deletePhoto } from "../api";

const Thread = ({ thread }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const dispatch = useDispatch();

  const isAuthor = user && user.result._id === thread.author._id;

  const handleDelete = async (event) => {
    try {
      dispatch(deleteThread(thread._id));
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar el thread: ", error);
    }
  };

  return (
    <div
      className="card w-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="d-flex flex-row align-items-center">
          <Avatar
            user={thread.author}
            outerSize="50px"
            innerSize="40px"
            flagSize="0px"
          />
          <h5 style={{ marginLeft: "10px" }}>{thread.title}</h5>
        </div>
        {isAuthor && isHovered && (

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
      <div className="card-body">
        <p className="card-text">{thread.content}</p>
        {thread.url && (
          <img
            src={`http://localhost:4000${thread.url}`}
            alt={thread.title}
            className="img-fluid"
            style={{ minWidth: "100%", height: "auto", marginTop: "10px" }}
          />
        )}
        <span>{timeElapsed(new Date(thread.createdAt))}</span>
      </div>
    </div>
  );
};

export default Thread;

// onClick={() => onDelete(thread.id)}
