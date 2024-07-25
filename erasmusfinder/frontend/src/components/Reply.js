import React, { useState, useEffect } from "react";
import { timeElapsed } from "./utils";
import { stateColors } from "./utils";
import Avatar from "./Avatar";
import { useDispatch } from "react-redux";
import { deleteReply } from "../actions/reply.js";

const Reply = ({ reply }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const { author } = reply;
  const dispatch = useDispatch();

  const isAuthor = user && user.result._id === author._id;

  const handleDelete = async () => {
    try {
      dispatch(deleteReply(reply._id));
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar la respuesta: ", error);
    }
  };

  console.log(isAuthor)

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="form-control mt-1"
      style={{ width: "90%" }}
    >
      <div className="d-flex ">
        <Avatar
          user={author}
          outerSize="45px"
          innerSize="35px"
          flagSize="0px"
        />

        <p className="mt-2" style={{ margin: "5px", fontWeight: "bold" }}>
          {author.userName}
        </p>

        {isAuthor && isHovered && (
          <button
            className="btn btn-danger d-flex align-items-center justify-content-center"
            style={{
              right: "10px",
              width: "35px",
              height: "35px",
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

      <p className="m-2">{reply.content}</p>
      <small style={{ color: stateColors.zero, fontWeight: "bold" }}>
        {timeElapsed(new Date(reply.createdAt))}
      </small>
    </div>
  );
};

export default Reply;
