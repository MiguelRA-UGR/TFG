import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  createContact,
  breakContact,
  sendContactRequest,
} from "../actions/usersContact";

const initialState = {
  snd: "",
  rcv: "",
};

const User = () => {
  const [dataContact, setFormData] = useState(initialState);
  const [userProfile, setUserProf] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [countryNames, setCountryNames] = useState({});
  const dispatch = useDispatch();

  const handleFollow = async () => {
    dataContact.snd = user.result._id;
    dataContact.rcv = userProfile._id;

    try {
      if (userProfile.privacy === 0) {
        dispatch(createContact(dataContact));
      } else {
        dispatch(sendContactRequest(dataContact));
      }

      window.location.reload();
    } catch (error) {
      console.error("Error al manejar la solicitud de contacto:", error);
    }
  };

  const handleUnfollow = async () => {
    dataContact.snd = user.result._id;
    dataContact.rcv = userProfile._id;

    try {
      dispatch(breakContact(dataContact));
      window.location.reload();
    } catch (error) {
      console.error("Error al manejar la solicitud de dejar de seguir:", error);
    }
  };

  const fetchCountryFlags = async () => {
    try {
      const response = await axios.get("https://flagcdn.com/en/codes.json");
      const data = response.data;

      const filteredData = Object.entries(data)
        .filter(([key, value]) => !key.includes("us-"))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      setCountryNames(filteredData);
    } catch (error) {
      console.error("Error al obtener las banderas de los países:", error);
    }
  };

  useEffect(() => {
    fetchCountryFlags();
  }, []);

  useEffect(() => {
    const getUserProf = async () => {
      try {
        const userId = window.location.pathname.split("/").pop();

        const response = await axios.get(
          `http://localhost:4000/api/users/${userId}`
        );

        setUserProf(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getUserProf();
  }, []);

  if (!userProfile) {
    return <div>Obteniendo datos del usuario...</div>;
  }

  //Mostrar datos en función de la opción que tenga el usuario
  const isFollowing = () => {
    var following = userProfile.followingUsers.includes(user.result._id);
    return following;
  };

  const isPending = () => {
    var pending =
      user.result.pendingContact.includes(userProfile._id) &&
      userProfile.incomingContactRequest.includes(user.result._id);

    return pending;
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6 position-relative" style={{ width: "300px" }}>
          <div className="d-flex flex-column align-items-center justify-content-center rounded-circle position-relative">
            {userProfile.photo && (
              <img
                src={`http://localhost:4000/imgs/users/${userProfile._id}.png`}
                alt={userProfile.userName}
                className="rounded-circle"
                width="120px"
                height="120px"
              />
            )}
            {userProfile.badge && (
              <div
                className="badge position-absolute"
                style={{
                  backgroundColor: userProfile.badge.color,
                  color: userProfile.badge.textColor,
                  border: "2px solid white",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  top: "-10px",
                  right: "-10px",
                  zIndex: "1",
                }}
              >
                {userProfile.badge.text}
              </div>
            )}
            {!userProfile.photo && (
              <div
                className="text-center rounded-circle d-flex align-items-center justify-content-center position-relative"
                style={{
                  fontSize: "60px",
                  color: "white",
                  width: "120px",
                  height: "120px",
                  border: "3px solid white",
                  backgroundColor:
                    userProfile.state === 0
                      ? "#969696"
                      : userProfile.state === 1
                      ? "#f5973d" // Naranja
                      : userProfile.state === 2
                      ? "#6691c3" // Azul
                      : userProfile.state === 3
                      ? "#61bdb8" // Aguamarina
                      : "#969696",
                }}
              >
                {userProfile.userName.charAt(0).toUpperCase()}
              </div>
            )}
            <h4 className="mt-3">{userProfile.userName}</h4>
            <span
              style={{
                backgroundColor:
                  userProfile.state === 1
                    ? "#f5973d"
                    : userProfile.state === 2
                    ? "#6691c3"
                    : userProfile.state === 3
                    ? "#61bdb8"
                    : "#969696",
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
                padding: "5px 10px",
                borderRadius: "20px",
              }}
            >
              {userProfile.state === 1
                ? "Searching destination"
                : userProfile.state === 2
                ? `Coming soon to ${userProfile.destCity}`
                : userProfile.state === 3
                ? `Living in ${userProfile.destCity}`
                : "Just having a look"}
            </span>
          </div>

          {isFollowing() ? (
            <>
              <div className="row align-items-center mt-3">
                <div className="col">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-instagram"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>{" "}
                  {userProfile.instagram}
                </div>
                <div className="col">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-twitter"
                    viewBox="0 0 16 16"
                  >
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                  </svg>{" "}
                  {userProfile.twitter}
                </div>
              </div>
              <div className="row align-items-center mt-3">
                <div className="col">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-facebook"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                  </svg>{" "}
                  {userProfile.facebook}
                </div>
                <div className="col">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-linkedin"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                  </svg>{" "}
                  {userProfile.linkedin}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="col-md-6 mt-2">
          <h5>Description:</h5>
          <p
            className="form-control"
            style={{ height: "200px", width: "100%", maxWidth: "700px" }}
          >
            {userProfile.description}
          </p>

          <div className="row justify-content-center text-center mt-3 w-100">
            <div className="col-md-6">
              <h6>Country</h6>
              <div className="d-flex justify-content-center">
                <img
                  className="mb-1 me-1"
                  src={`https://flagcdn.com/${userProfile.badge}.svg`}
                  alt={`${countryNames[userProfile.badge]} flag`}
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
                <p>{countryNames[userProfile.badge]}</p>
              </div>

              {userProfile.occupation !== "" && (
                <>
                  <h6>Occupation: </h6>
                  <p> {userProfile.occupation}</p>
                </>
              )}

              {(userProfile.state === 2 || userProfile.state === 3) && (
                <>
                  <h6>Destination City:</h6>
                  <p> {userProfile.destCity}</p>
                </>
              )}
            </div>
            <div className="col-md-6">
              <h6>Origin City: </h6>
              <p>{userProfile.originCity}</p>

              {(userProfile.state === 2 || userProfile.state === 3) && (
                <>
                  <h6>Destination University: </h6>
                  <p> {userProfile.destUniversity}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFollowing() ? (
        <button
          type="button"
          style={{
            fontWeight: "bold",
            backgroundColor: "#696969",
            color: "#ffffff",
          }}
          className="btn btn-warning mt-4"
          onClick={handleUnfollow}
        >
          Break contact
        </button>
      ) : (
        <>
          {isPending() ? (
            <button
              type="button"
              style={{
                fontWeight: "bold",
                backgroundColor: "#696969",
                color: "#ffffff",
              }}
              className="btn btn-warning mt-4"
              disabled
            >
              Pending
            </button>
          ) : (
            <button
              type="submit"
              style={{
                fontWeight: "bold",
                backgroundColor: "#f5973d",
                color: "#ffffff",
              }}
              className="btn btn-warning"
              onClick={handleFollow}
            >
              Contact
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default User;
