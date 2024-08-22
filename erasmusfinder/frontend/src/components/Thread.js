import React, { useState, useEffect } from "react";
import Avatar from "./Avatar";
import Reply from "./Reply.js";
import { timeElapsed } from "./utils";
import { useDispatch } from "react-redux";
import axios from "axios";
import { deleteThread } from "../actions/thread.js";
import { stateColors } from "./utils";
import { createReply } from "../actions/reply.js";
import DeleteButton from "./DeleteButton.js";

const Thread = ({ thread }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem("profile")));
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();

  const isAuthor = user && user.result._id == thread.author;
  const isAdmin = user.result.admin;

  const userNameCallBack = (name) => {
    setUserName(name);
  };

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const repliesData = await Promise.all(
          thread.replies.map(async (replyId) => {
            const replyRes = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/replies/${replyId}`
            );
            const reply = replyRes.data;

            const authorRes = await axios.get(
              `${process.env.REACT_APP_API_URL}/api/users/${reply.author}`
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

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this thread?"
    );

    if (confirmed) {
      try {
        dispatch(deleteThread(thread._id));
        window.location.reload();
      } catch (error) {
        console.error("Error al eliminar el thread: ", error);
      }
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
            userId={thread.author}
            outerSize="50px"
            innerSize="40px"
            flagSize="0px"
            userName={userNameCallBack}
          />
          <div style={{ marginLeft: "10px" }}>
            <h5>{thread.title}</h5>
            posted by {""}
            <span
              style={{
                marginLeft: "",
                color: stateColors.one,
                fontWeight: "bold",
              }}
            >
              {userName}
            </span>
          </div>
        </div>
        {(isAdmin || (isAuthor && isHovered)) && (
          <DeleteButton handleDelete={handleDelete} />
        )}
      </div>
      <div className="card-body">
        <p className="card-text">{thread.content}</p>
        {thread.url && (
          <img
            src={`${process.env.REACT_APP_API_URL}${thread.url}`}
            alt={thread.title}
            className="img-fluid"
            style={{ minWidth: "100%", height: "auto", marginTop: "10px" }}
          />
        )}

        {replies.length > 0 && (
          <div className="mt-3 mb-2">
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

        {!isAdmin && (
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
              aria-label="Send Reply"
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
        )}

        <span style={{ color: stateColors.zero, fontWeight: "bold" }}>
          {timeElapsed(new Date(thread.createdAt))}
        </span>
      </div>
    </div>
  );
};

export default Thread;
