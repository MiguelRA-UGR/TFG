import React, { useEffect, useState } from "react";
import ForumNotification from "./ForumNotification";
import ContactRequest from "./ContactRequest";
import axios from "axios";
import { useDispatch } from "react-redux";
import { deleteNotificationsByUser } from "../actions/notification";

const Notifications = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [incomingContactRequest, setIncomingContactRequest] = useState([]);
  const [userId, setUserId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();

  const handleDeleteNotifications = () => {
    dispatch(deleteNotificationsByUser(userId));
    window.location.reload();
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${user.result._id}`
        );
        setUser(response.data);
        setUserId(response.data?._id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [user]);

  useEffect(() => {
    const fetchIncomingContacts = async () => {
      if (userId && user?.incomingContactRequest?.length > 0) {
        try {
          const incomingContactsData = await Promise.all(
            user.incomingContactRequest.map(async (requestId) => {
              const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/users/${requestId}`
              );
              return {
                ...response.data,
                id: requestId,
              };
            })
          );
          setIncomingContactRequest(incomingContactsData);
        } catch (error) {
          console.error("Error fetching contact requests:", error);
        }
      }
    };

    fetchIncomingContacts();
  }, [userId, user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId && user.notifications && user.notifications.length > 0) {
        try {
          const notificationsData = await Promise.all(
            user.notifications.map(async (notificationId) => {
              const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/notifications/${notificationId}`
              );
              return response.data;
            })
          );
          setNotifications(notificationsData);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }
    };

    fetchNotifications();
  }, [userId, user]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 justify-content-center text-center mb-3">
          <h3>Contact Requests</h3>
          <ul className="list-group">
            {incomingContactRequest.length === 0 ? (
              <div>
                <img
                  src="https://cdn.icon-icons.com/icons2/1678/PNG/512/wondicon-ui-free-add-user_111248.png"
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                />

                <div>You don’t have any contact requests at the moment.</div>
              </div>
            ) : (
              incomingContactRequest.map((contact, index) => (
                <ContactRequest
                  key={index}
                  user={userId}
                  userRequest={contact}
                />
              ))
            )}
          </ul>
        </div>
        <div className="col-md-4 text-center mb-3">
          <h3>Forums</h3>
          <ul className="list-group">
            {notifications.length === 0 ? (
              <div>
                <img
                  src="https://icons.veryicon.com/png/o/miscellaneous/cb/forum-16.png"
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                />

                <div>You don’t have any forum notifications at the moment.</div>
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <ForumNotification notification={notification} />
                ))}

                <button
                  className="btn btn-danger"
                  onClick={handleDeleteNotifications}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-trash"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                  Delete all
                </button>
              </>
            )}
          </ul>
        </div>
        <div className="col-md-4 text-center">
          <h3>Warnings</h3>

          {user.warningsN >= 1 ? (
            <div
              style={{
                backgroundColor: "#eccd6a",
                padding: "10px",
                borderRadius: "5px",
                textAlign: "center",
              }}
            >
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/012/042/301/small_2x/warning-sign-icon-transparent-background-free-png.png"
                alt="Warning Icon"
                style={{ width: "50px", height: "50px", marginBottom: "10px" }}
              />
              <div>
                You have{" "}
                <span style={{ fontWeight: "bold" }}>{user.warningsN}</span>{" "}
                warnings.
                <p style={{ fontSize: "small", marginTop: "5px" }}>
                  If you reach 3 warnings, your account will be deleted.
                </p>
                <p style={{ fontSize: "small", marginTop: "5px" }}>
                  Warnings are sent to notify users of inappropriate behavior or
                  violations of our terms of service. Please adhere to the
                  guidelines to avoid further actions.
                </p>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#77dd77",
                borderRadius: "10px",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <img
                style={{ width: "100px" }}
                src="https://www.svgrepo.com/show/424225/happy-happy-face-happy-icon.svg"
                alt="Positive Icon"
                className="m-3"
              />
              <div className="m-2">
                <p style={{fontWeight:"bold"}}>
                  You don’t have any warnings!
                </p>
                <p>
                This means you are a responsible
                and valued member of our community.
                </p>
                <p>
                  Keep it up by following our rules and guidelines to maintain a positive
                  environment for everyone.
                </p>
                <p>
                  This community is based on respect and collaboration. Users
                  like you keep this environment healthy and a place where
                  everyone feels comfortable.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
