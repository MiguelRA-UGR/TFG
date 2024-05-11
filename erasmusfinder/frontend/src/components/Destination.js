import React, { useState, useEffect } from "react";
import axios from "axios";

import "../index.css";
import { Link } from "react-router-dom";

const Destination = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [destination, setDestination] = useState(null);
  const [following, setFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [followers, setFollowers] = useState([]);

  //Fnución para actualizar los destinos seguidos dentro del usuario
  const updateUser = async (destinationId, following, userId, token) => {
    try {
      const updatedUser = following
        ? {
            followedDestinations: user.result.followedDestinations.filter(
              (dest) => dest !== destinationId
            ),
          }
        : {
            followedDestinations: [
              ...user.result.followedDestinations,
              destinationId,
            ],
          };

      await axios.put(
        `http://localhost:4000/api/users/${userId}`,
        updatedUser,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prevUser) => ({
        ...prevUser,
        result: {
          ...prevUser.result,
          followedDestinations: updatedUser.followedDestinations,
        },
      }));
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  //Fnución para actualizar los destinos seguidos dentro del usuario
  const updateDestination = async (destinationId, following, token) => {
    try {
      const resGet = await axios.get(
        `http://localhost:4000/api/dests/${destinationId}`
      );
      const dataDest = resGet.data;
      const newFollowers = following
        ? dataDest.n_users - 1
        : dataDest.n_users + 1;
      const newFollowersList = following
        ? dataDest.users.filter((userId) => userId !== user.result._id)
        : [...dataDest.users, user.result._id];

      const resPut = await axios.put(
        `http://localhost:4000/api/dests/${destinationId}`,
        {
          n_users: newFollowers,
          users: newFollowersList,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resPut.data) {
        throw new Error("No se pudo actualizar el destino");
      }

      setFollowing(!following);
    } catch (error) {
      console.error("Error al actualizar el destino:", error);
    }
  };

  //Manejar cuando el usuario no está logueado
  const handleLoginReminder = () => {
    alert("You must log in to start following destinations");
  };

  //Manejar el seguir/dejar de seguir a un destino
  const handleFollowToggle = async () => {
    const destinationId = window.location.pathname.split("/").pop();
    const token = user ? user.token : null;
    const userId = user ? user.result._id : null;

    await updateUser(destinationId, following, userId, token);
    await updateDestination(destinationId, following, token);

    const updatedDestination = {
      ...destination,
      n_users: following ? destination.n_users - 1 : destination.n_users + 1,
    };
    setDestination(updatedDestination);
  };

  //Manejar botones del menú
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getColorForScore = (score) => {
    if (score >= 9) {
      //Verde
      return "#00913f";
    } else if (score >= 7) {
      //Verde-amarillo
      return "#c6ce00";
    } else if (score >= 6) {
      //Amarillo
      return "#e6c619";
    } else if (score >= 4) {
      //Naranjs
      return "#e25f23";
    } else if (score === -1) {
      return "#969696";
    } else {
      //Rojo
      return "#b81414";
    }
  };

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(user));
  }, [user]);

  //Obtener los datos del destino y de los usuarios que lo siguen
  useEffect(() => {
    const getDestination = async () => {
      try {
        const destinationId = window.location.pathname.split("/").pop();

        const res = await fetch(
          `http://localhost:4000/api/dests/${destinationId}`,
          {
            method: "GET",
          }
        );
        if (!res.ok) {
          throw new Error("Error al obtener el destino");
        }
        const data = await res.json();
        setDestination(data);

        const followerIds = data.users;
        const followersData = await Promise.all(
          followerIds.map(async (followerId) => {
            const userRes = await fetch(
              `http://localhost:4000/api/users/${followerId}`
            );
            if (!userRes.ok) {
              throw new Error("Error al obtener los datos del seguidor");
            }
            return await userRes.json();
          })
        );
        setFollowers(followersData);

        if (user && user.result.followedDestinations.includes(destinationId)) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getDestination();
  }, [user]);

  if (!destination) {
    return <div>Cargando destino...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <img
            className="mt-3"
            
            src={`https://flagcdn.com/${destination.iso}.svg`}
            alt={destination.country}
            style={{ height: "50px",width: "50px", marginRight: "15px" ,borderRadius: "50%", objectFit: "cover"}}
          />

          <div className="d-flex flex-column">
            <span
              className=""
              style={{
                fontSize: "40px",
                fontFamily: "Cambria, serif",
                fontWeight: "bold",
                marginBottom: "-15px",
              }}
            >
              {destination.name}
            </span>
            <span
              style={{
                fontSize: "25px",
                marginTop: "",
                fontFamily: "Cambria, serif",
              }}
              className=""
            >
              {destination.country}
            </span>
          </div>
        </div>

        <div className="mt-3"
          style={{
            width: "45px",
            height: "45px",
            borderRadius: "50%",
            backgroundColor: getColorForScore(destination.mean_score),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: "30px", color: "#ffffff", fontWeight: "bold" }}
          >
            {destination.mean_score === -1 ? "-" : destination.mean_score}
          </span>
        </div>

        <div className="mt-3 d-flex flex-column justify-self-center align-items-center">
          <h5>{destination.n_users}</h5>
          <h5>followers</h5>
        </div>

        <button
          className="btn btn-warning d-flex align-items-center justify-content-center"
          onClick={user ? handleFollowToggle : handleLoginReminder}
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            backgroundColor: user && !following ? "#f5973d" : "#969696",
            color: "#ffffff",
            width: "200px",
          }}
        >
          {user ? (
            following ? (
              "Unfollow"
            ) : (
              "Follow"
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
              Follow
            </>
          )}
        </button>
      </div>

      <img
        src={`http://localhost:4000/imgs/frontpages/${destination.name.toLowerCase()}2.png`}
        style={{ height: "400px", width: "100%", objectFit: "cover" }}
        alt={destination.name}
      />

      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container-fluid">
          <ul className="navbar-nav mb-2 mb-lg-0 flex-row">
            <li className="nav-item me-3">
              <button
                className={`nav-link btn ${
                  activeTab === "info" ? "active" : ""
                }`}
                onClick={() => handleTabChange("info")}
                style={{
                  color: activeTab === "info" ? "#f5973d" : "",
                  fontWeight: activeTab === "info" ? "bold" : "",
                }}
              >
                Info
              </button>
            </li>
            <li className="nav-item me-3">
              <button
                className={`nav-link btn ${
                  activeTab === "forums" ? "active" : ""
                }`}
                onClick={() => handleTabChange("forums")}
                style={{
                  color: activeTab === "forums" ? "#f5973d" : "",
                  fontWeight: activeTab === "forums" ? "bold" : "",
                }}
              >
                Forums
              </button>
            </li>
            <li className="nav-item me-3">
              <button
                className={`nav-link btn ${
                  activeTab === "followers" ? "active" : ""
                }`}
                onClick={() => handleTabChange("followers")}
                style={{
                  color: activeTab === "followers" ? "#f5973d" : "",
                  fontWeight: activeTab === "followers" ? "bold" : "",
                }}
              >
                Followers
              </button>
            </li>

            <li className="nav-item me-3">
              <button
                className={`nav-link btn ${
                  activeTab === "reviews" ? "active" : ""
                }`}
                onClick={() => handleTabChange("reviews")}
                style={{
                  color: activeTab === "reviews" ? "#f5973d" : "",
                  fontWeight: activeTab === "reviews" ? "bold" : "",
                }}
              >
                Reviews
              </button>
            </li>

            <li className="nav-item me-3">
              <button
                className={`nav-link btn ${
                  activeTab === "gallery" ? "active" : ""
                }`}
                onClick={() => handleTabChange("gallery")}
                style={{
                  color: activeTab === "gallery" ? "#f5973d" : "",
                  fontWeight: activeTab === "gallery" ? "bold" : "",
                }}
              >
                Gallery
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="container">
        {activeTab === "info" && (
          <>
            <div className="row">
              <p className="" style={{ margin: "0 auto" }}>
                {destination.description}
              </p>

              <div className="container mt-4">
                <div className="row">
                  <div className="col-md-6">
                    <h4>Languages</h4>
                    <p>{destination.languages.join(", ")}</p>
                  </div>
                  <div className="col-md-6">
                    <h4>Cost of life</h4>
                    <p>{destination.cost_life}</p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h4>Surface</h4>
                    <p>{destination.surface}</p>
                  </div>
                  <div className="col-md-6 mt-3">
                    <h4>Universities</h4>

                    <div className="btn-group">
                      <button
                        style={{ color: "black", backgroundColor: "white" }}
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="defaultDropdown"
                        data-bs-toggle="dropdown"
                        data-bs-auto-close="true"
                        aria-expanded="false"
                      >
                        Links
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="defaultDropdown"
                      >
                        {destination.universities.map((university, index) => (
                          <li key={index}>
                            <a
                              className="dropdown-item"
                              href={university.url}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <img
                                src={university.logo}
                                alt={university.name}
                                className="mr-4"
                                width="30"
                                height="30"
                                style={{ borderRadius: "5px" }}
                              />
                              <span style={{ marginLeft: "8px" }}>
                                {university.name}
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <h4>Climate</h4>
                    <ul>
                      <li>
                        <strong>Type: </strong>
                        {destination.clima.general}
                      </li>
                      <li>
                        <strong>Summer: </strong>
                        {destination.clima.summer}
                      </li>
                      <li>
                        <strong>Winter:</strong>
                        {destination.clima.winter}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "forums" && (
          <>
            <div className="row"></div>
          </>
        )}

        {activeTab === "followers" && (
          <>
            <div className="row">
              <div className="col-md-12">
                <ul className="list-unstyled">
                  {followers.map((follower, index) => (
                    <Link
                    to={user.result._id === follower._id ? `/Profile` : `/User/${follower._id}`}
                    className="nav-link ml-3"
                  >
                      <li
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <div className="d-flex justify-content-center h-100">
                          <div
                            className="image_outer_container"
                            style={{
                              backgroundColor:
                                follower.state === 0
                                  ? "#969696"
                                  : follower.state === 1
                                  ? "#f5973d" // Naranja
                                  : follower.state === 2
                                  ? "#6691c3" // Azul
                                  : follower.state === 3
                                  ? "#61bdb8" // Aguamarina
                                  : "#969696" //Gris
                            }}
                          >
                            <div className="flag_icon">
                              <img
                                src={`https://flagcdn.com/${follower.badge}.svg`}
                                alt="User's Flag"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  objectFit: "cover",
                                  border: "3px solid white",
                                  borderRadius: "50%",
                                  
                                }}
                              />
                            </div>
                            <div className="image_inner_container">
                              {follower.photo ? (
                                <img
                                  src={`http://localhost:4000/imgs/users/${follower._id}.png`}
                                  alt={follower.userName}
                                  className="rounded-circle"
                                  style={{
                                    width: "45px",
                                    height: "45px",
                                    border: "2px solid white",
                                  }}
                                />
                              ) : (
                                <div
                                  className="text-center rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    fontSize: "18px",
                                    color: "white",
                                    width: "45px",
                                    height: "45px",
                                    border: "3px solid white",
                                    backgroundColor: "969696",
                                  }}
                                >
                                  {follower.userName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <span className="ms-3">{follower.userName}</span>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {activeTab === "reviews" && (
          <>
            <div className="row"></div>
          </>
        )}

        {activeTab === "gallery" && (
          <>
            <div className="row"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Destination;
