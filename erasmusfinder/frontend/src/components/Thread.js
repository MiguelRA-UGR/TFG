import React, { useState, useEffect } from "react";
import Avatar from "./Avatar";
import Reply from "./Reply.js";
import { timeElapsed } from "./utils";
import { useDispatch } from "react-redux";
import axios from "axios";
import { deleteThread } from "../actions/thread.js";
import { stateColors } from "./utils";
import { createReply } from "../actions/reply.js";

const Thread = ({ thread }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const dispatch = useDispatch();

  const isAuthor = user && user.result._id === thread.author._id;

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const repliesData = await Promise.all(
          thread.replies.map(async (replyId) => {
            const replyRes = await axios.get(
              `http://localhost:4000/api/replies/${replyId}`
            );
            const reply = replyRes.data;

            const authorRes = await axios.get(
              `http://localhost:4000/api/users/${reply.author}`
            );
            reply.author = authorRes.data;

            return reply;
          })
        );
        setReplies(repliesData);
      } catch (error) {
        console.error("Error al obtener las respuestas: ", error);
      }
    };

    fetchReplies();
  }, [thread.replies]);

  const handleDelete = async () => {
    try {
      dispatch(deleteThread(thread._id));
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar el thread: ", error);
    }
  };

  const handleReplyChange = (event) => {
    setNewReply(event.target.value);
  };

  const handleReplySubmit = async () => {
    if (!newReply.trim()) {
      alert("Reply can't be empty");
      return;
    }

    try {
      const reply = {
        content: newReply,
        author: user.result._id,
        thread: thread._id,
      };

      dispatch(createReply(reply));

      setNewReply("");
      window.location.reload();
    } catch (error) {
      console.error("Error al enviar la respuesta: ", error);
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

        {replies.length > 0 && (
          <div className="mt-3">
            <h6 className="m-2">Replies:</h6>
            {[...replies].reverse().map((reply) => (
              <div
                key={reply._id}
                className="d-flex flex-column align-items-end"
              >
                <Reply reply={reply} />
              </div>
            ))}
          </div>
        )}

        <div className="mb-3 mt-3 input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Reply..."
            value={newReply}
            onChange={handleReplyChange}
          />
          <button
            className="btn"
            style={{ color: "white", backgroundColor: stateColors.three }}
            type="button"
            onClick={handleReplySubmit}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-send-fill"
              viewBox="0 0 16 16"
            >
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
            </svg>
          </button>
        </div>

        <span style={{ color: stateColors.zero, fontWeight: "bold" }}>
          {timeElapsed(new Date(thread.createdAt))}
        </span>
      </div>
    </div>
  );
};

export default Thread;
