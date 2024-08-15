import React, { useState, useEffect } from "react";
import axios from "axios";

import "../index.css";
import Avatar from "./Avatar";
import Thread from "./Thread";
import { stateColors } from "./utils";
import ThreadForm from "./ThreadForm";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteForum } from "../actions/forum";

const Forum = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [forum, setForum] = useState(null);
  const [member, setMember] = useState(false);
  const [followers, setFollowers] = useState({});
  const [threads, setThreads] = useState({});
  const [clickedNewThread, setClicked] = useState(false);
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  var isAdmin = false;

  if (user) {
    isAdmin = user.result.admin;
  }

  const userNameCallBack = (name) => {
    setUserName(name);
  };

  const handleDeleteForum = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this forum forever?"
    );

    if (confirmed) {
      dispatch(deleteForum(forum._id));
      navigate("/");
    }
  };

  useEffect(() => {
    const getForumData = async () => {
      try {
        const forumId = window.location.pathname.split("/").pop();

        const res = await axios.get(
          `http://localhost:4000/api/forums/${forumId}`
        );
        const forumData = res.data;
        setForum(forumData);

        const followerIds = forumData.users;

        const followersData = await Promise.all(
          followerIds.map(async (followerId) => {
            const userRes = await axios.get(
              `http://localhost:4000/api/users/${followerId}`
            );
            return { [followerId]: userRes.data };
          })
        );

        const followersObject = Object.assign({}, ...followersData);
        setFollowers(followersObject);

        const threadIds = forumData.threads;

        const threadsData = await Promise.all(
          threadIds.map(async (threadId) => {
            const threadRes = await axios.get(
              `http://localhost:4000/api/threads/${threadId}`
            );
            return { [threadId]: threadRes.data };
          })
        );

        const threadsObject = Object.assign({}, ...threadsData);

        setThreads(threadsObject);

        if (user && user.result && forumData.users.includes(user.result._id)) {
          setMember(true);
        } else {
          setMember(false);
        }
      } catch (error) {
        console.error("Error al obtener los datos del foro:", error);
      }
    };

    getForumData();
  }, [user]);

  const handleJoinToggle = async () => {
    const forumId = window.location.pathname.split("/").pop();
    const token = user ? user.token : null;
    const userId = user ? user.result._id : null;

    try {
      // Actualizar el usuario y el foro
      const updatedUserForums = member
        ? user.result.followedForums.filter((f) => f !== forumId)
        : [...user.result.followedForums, forumId];

      await axios.put(
        `http://localhost:4000/api/users/${userId}`,
        { followedForums: updatedUserForums },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedForumUsers = member
        ? forum.users.filter((u) => u !== userId)
        : [...forum.users, userId];

      await axios.put(
        `http://localhost:4000/api/forums/${forumId}`,
        {
          n_users: updatedForumUsers.length,
          users: updatedForumUsers,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar estado del usuario y el foro
      setUser((prevUser) => ({
        ...prevUser,
        result: {
          ...prevUser.result,
          followedForums: updatedUserForums,
        },
      }));

      setForum((prevForum) => ({
        ...prevForum,
        users: updatedForumUsers,
      }));

      setMember(!member);
    } catch (error) {
      console.error("Error al actualizar la membresía:", error);
    }
  };

  const toggleThreadForm = () => {
    setClicked((prevShow) => !prevShow);
  };

  if (!forum) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  return (
    <div className="form-control">
      <Link
        to={`/Destination/${forum.destination}`}
        style={{ textDecoration: "none", color: stateColors.one }}
      > 
        <div className="d-flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-bar-left mt-1"
          viewBox="0 0 16 16"
          style={{marginRight:"3px"}}
        >
          <path
            fill-rule="evenodd"
            d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5"
          />
        </svg>
        <p> Back to destination</p>
        </div>
        
      </Link>

      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex flex-row">
          <img
            src={`http://localhost:4000${forum.url}`}
            alt="Forum"
            className="rounded-circle mt-2"
            style={{ width: "50px", height: "50px", marginRight: "10px" }}
          />
          <div className="d-flex flex-column">
            <span
              className="mb-1"
              style={{
                fontSize: "25px",
                fontFamily: "Cambria, serif",
                fontWeight: "bold",
                marginBottom: "-15px",
              }}
            >
              {forum.title}
            </span>

            <div style={{ display: "inline-flex", alignItems: "center" }}>
              <span className="section-title text-center m-1">
                created by {""}
                <span style={{ color: stateColors.one, fontWeight: "bold" }}>
                  {userName}
                </span>
              </span>

              <Avatar
                userId={forum.creator}
                outerSize="35px"
                innerSize="25px"
                flagSize="0px"
                userName={userNameCallBack}
              />
            </div>
          </div>
        </div>
        <div className="mt-3 d-flex flex-column justify-self-center align-items-center">
          <h5>{forum.users.length}</h5>
          <h5>members</h5>
        </div>
        <div className="mt-3 d-flex flex-column justify-self-center align-items-center">
          <h5>{forum.threads.length}</h5>
          <h5>threads</h5>
        </div>

        {isAdmin ? (
          <>
            <button
              className="btn btn-danger"
              onClick={handleDeleteForum}
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash-fill mr-1 mb-1"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
              </svg>
              Delete
            </button>
          </>
        ) : (
          <button
            className="btn btn-warning d-flex align-items-center justify-content-center"
            onClick={handleJoinToggle}
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              width: "75px",
              backgroundColor:
                user && !member ? stateColors.one : stateColors.zero,
              color: "#ffffff",
            }}
          >
            {user ? (
              member ? (
                "Leave"
              ) : (
                "Join"
              )
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-lock-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                </svg>
                Join
              </>
            )}
          </button>
        )}
      </div>
      <span
        style={{
          fontSize: "20px",
          marginTop: "10px",
          fontFamily: "Cambria, serif",
        }}
      >
        {forum.description}
      </span>

      {(member || isAdmin) && (
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-4">
              <div className="content">
                <h4 style={{ color: stateColors.one, fontWeight: "bold" }}>
                  Members
                </h4>
                <div className="row">
                  <div className="col-md-12">
                    <ul className="list-unstyled">
                      {Object.values(followers).map((follower) => (
                        <li
                          className="d-flex align-items-center mb-2 form-control"
                          key={follower._id}
                        >
                          <Avatar
                            userId={follower._id}
                            outerSize="50px"
                            innerSize="40px"
                            flagSize="20px"
                          />
                          <span className="ms-3">{follower.userName}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="content">
                <div className="d-flex flex-row justify-content-between">
                  <h4 style={{ color: stateColors.one, fontWeight: "bold" }}>
                    Threads
                  </h4>

                  {!isAdmin && (
                    <div className="d-flex flex-column align-items-center">
                      <button
                        type="button"
                        className="btn btn-warning"
                        onClick={toggleThreadForm}
                        style={{
                          borderRadius: "50%",
                          width: "40px",
                          color: "white",
                          backgroundColor: clickedNewThread
                            ? "red"
                            : stateColors.one,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className={`bi ${
                            clickedNewThread ? "bi-x-lg" : "bi-feather"
                          }`}
                          viewBox="0 0 16 16"
                        >
                          {clickedNewThread ? (
                            <path d="M1.5 1.5a.75.75 0 0 1 1.061 0L8 6.439 13.439 1.5a.75.75 0 0 1 1.061 1.061L9.061 7.5l5.439 5.439a.75.75 0 0 1-1.061 1.061L8 8.561 2.561 14a.75.75 0 0 1-1.061-1.061L6.939 7.5 1.5 2.061A.75.75 0 0 1 1.5 1.5z" />
                          ) : (
                            <path d="M15.807.531c-.174-.177-.41-.289-.64-.363a3.8 3.8 0 0 0-.833-.15c-.62-.049-1.394 0-2.252.175C10.365.545 8.264 1.415 6.315 3.1S3.147 6.824 2.557 8.523c-.294.847-.44 1.634-.429 2.268.005.316.05.62.154.88q.025.061.056.122A68 68 0 0 0 .08 15.198a.53.53 0 0 0 .157.72.504.504 0 0 0 .705-.16 68 68 0 0 1 2.158-3.26c.285.141.616.195.958.182.513-.02 1.098-.188 1.723-.49 1.25-.605 2.744-1.787 4.303-3.642l1.518-1.55a.53.53 0 0 0 0-.739l-.729-.744 1.311.209a.5.5 0 0 0 .443-.15l.663-.684c.663-.68 1.292-1.325 1.763-1.892.314-.378.585-.752.754-1.107.163-.345.278-.773.112-1.188a.5.5 0 0 0-.112-.172M3.733 11.62C5.385 9.374 7.24 7.215 9.309 5.394l1.21 1.234-1.171 1.196-.027.03c-1.5 1.789-2.891 2.867-3.977 3.393-.544.263-.99.378-1.324.39a1.3 1.3 0 0 1-.287-.018Zm6.769-7.22c1.31-1.028 2.7-1.914 4.172-2.6a7 7 0 0 1-.4.523c-.442.533-1.028 1.134-1.681 1.804l-.51.524zm3.346-3.357C9.594 3.147 6.045 6.8 3.149 10.678c.007-.464.121-1.086.37-1.806.533-1.535 1.65-3.415 3.455-4.976 1.807-1.561 3.746-2.36 5.31-2.68a8 8 0 0 1 1.564-.173" />
                          )}
                        </svg>
                      </button>
                      <small
                        style={{
                          color: stateColors.one,
                          fontWeight: "bold",
                          visibility: clickedNewThread ? "hidden" : "visible",
                        }}
                      >
                        New Thread
                      </small>
                    </div>
                  )}
                </div>

                {clickedNewThread ? (
                  <ThreadForm />
                ) : (
                  <ul className="list-unstyled">
                    {Object.values(threads)
                      .reverse()
                      .map((thread) => (
                        <li
                          className="d-flex align-items-center mb-2 form-control mt-3"
                          key={thread._id}
                        >
                          <Thread thread={thread} />
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forum;
