import React, { useState, useEffect } from "react";
import axios from "axios";

import "../index.css";
import Avatar from "./Avatar";
import Review from "./Review";
import ReviewForm from "./ReviewForm";
import PhotoForm from "./PhotoForm";
import Photo from "./Photo";
import ForumPreview from "./ForumPreview";
import {
  getColorForScore,
  stateColors,
  cleanString,
  formatedNumber,
} from "./utils";
import ForumForm from "./ForumForm";
import DestinationForm from "./DestinationForm";
import { deleteDestination } from "../actions/destination";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Destination = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [destination, setDestination] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [following, setFollowing] = useState(false);
  const [hasReviewed, setReviewed] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [followers, setFollowers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [forums, setForums] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  var isAdmin = false;

  if(user){
    isAdmin = user.result.admin;
  }

  const handleDeleteDestination = () => {
    const confirmed = window.confirm("Are you sure you want to delete this destination forever?");
    
    if (confirmed) {
      dispatch(deleteDestination(destination._id));
      navigate('/');
    }
  };
  

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

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

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(user));
  }, [user]);

  //Obtener los datos del destino y de los usuarios que lo siguen
  useEffect(() => {
    const getDestination = async () => {
      try {
        const destinationId = window.location.pathname.split("/").pop();

        // Obtener los datos del destino
        const res = await axios.get(
          `http://localhost:4000/api/dests/${destinationId}`
        );
        if (res.status !== 200) {
          throw new Error("Error al obtener el destino");
        }
        const data = res.data;
        setDestination(data);

        const followerIds = data.users;
        const reviewsIds = data.reviews;
        const photosIds = data.photos;
        const forumsIds = data.forums;

        const followersData = await Promise.all(
          followerIds.map(async (followerId) => {
            const userRes = await axios.get(
              `http://localhost:4000/api/users/${followerId}`
            );
            if (userRes.status !== 200) {
              throw new Error("Error al obtener los datos del seguidor");
            }
            return { [followerId]: userRes.data };
          })
        );

        const followersObject = Object.assign({}, ...followersData);
        setFollowers(followersObject);

        const reviewsData = await Promise.all(
          reviewsIds.map(async (reviewId) => {
            const reviewRes = await axios.get(
              `http://localhost:4000/api/reviews/${reviewId}`
            );
            if (reviewRes.status !== 200) {
              throw new Error("Error al obtener los datos de la reseña");
            }
            return reviewRes.data;
          })
        );

        const reviewsWithUsers = reviewsData.map((review) => ({
          ...review,
          author: followersObject[review.user],
        }));
        setReviews(reviewsWithUsers);

        const photosData = await Promise.all(
          photosIds.map(async (photoId) => {
            const photosRes = await axios.get(
              `http://localhost:4000/api/photos/${photoId}`
            );
            if (photosRes.status !== 200) {
              throw new Error("Error al obtener los datos de las fotos");
            }
            return photosRes.data;
          })
        );

        const photosWithUsers = photosData.map((photo) => ({
          ...photo,
          author: followersObject[photo.user],
        }));
        setPhotos(photosWithUsers);

        const forumsData = await Promise.all(
          forumsIds.map(async (forumId) => {
            const forumsRes = await axios.get(
              `http://localhost:4000/api/forums/${forumId}`
            );
            if (forumsRes.status !== 200) {
              throw new Error("Error al obtener los datos de los foros");
            }
            return forumsRes.data;
          })
        );

        const forumsWithUsers = forumsData.map((forum) => ({
          ...forum,
          author: followersObject[forum.user],
        }));
        setForums(forumsWithUsers);

        // Verificar si el usuario sigue el destino
        if (user && user.result.followedDestinations.includes(destinationId)) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getDestination();
  }, [user]);

  useEffect(() => {
    if (user && reviews.length > 0) {
      const foundUserReview = reviews.find(
        (review) => review.user === user.result._id
      );

      if (foundUserReview) {
        setReviewed(true);
        setUserReview(foundUserReview);
      } else {
        setReviewed(false);
        setUserReview(null);
      }
    }
  }, [reviews, user]);

  if (!destination) {
    return (
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading destination...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <img
            className="mt-3"
            src={`https://flagcdn.com/${destination.iso}.svg`}
            alt={destination.country}
            style={{
              height: "50px",
              width: "50px",
              marginRight: "15px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />

          <div className="d-flex flex-column">
            <span
              className="destination-name"
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

        <div
          className="mt-3"
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

        {isAdmin ? (
          <>
            <button
              className="btn btn-danger"
              onClick={handleDeleteDestination}
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
            onClick={user ? handleFollowToggle : handleLoginReminder}
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              width: "90px",
              backgroundColor:
                user && !following ? stateColors.one : stateColors.zero,
              color: "#ffffff",
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
        )}
      </div>

      <img
        src={`http://localhost:4000/imgs/frontpages/${cleanString(
          destination.name
        )}.png`}
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
                  color: activeTab === "info" ? stateColors.one : "",
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
                  color: activeTab === "forums" ? stateColors.one : "",
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
                  color: activeTab === "followers" ? stateColors.one : "",
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
                  color: activeTab === "reviews" ? stateColors.one : "",
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
                  color: activeTab === "gallery" ? stateColors.one : "",
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
          <div className="container d-flex flex-column align-items-center">
            {isEditing ? (
              <>
                <DestinationForm destination={destination} />
              </>
            ) : (
              <div className="row">
                <p className="" style={{ width:"100%", margin: "0 auto" }}>
                  {destination.description}
                </p>

                <div className="container mt-4">
                  <div className="row">
                    <div className="col-md-6">
                      <h4>
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          class="bi bi-translate"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z" />
                          <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31" />
                        </svg>
                        Languages
                      </h4>
                      <p>{destination.languages.join(", ")}</p>
                    </div>
                    <div className="col-md-6">
                      <h4>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          class="bi bi-piggy-bank"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5 6.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.138-1.496A6.6 6.6 0 0 1 7.964 4.5c.666 0 1.303.097 1.893.273a.5.5 0 0 0 .286-.958A7.6 7.6 0 0 0 7.964 3.5c-.734 0-1.441.103-2.102.292a.5.5 0 1 0 .276.962" />
                          <path
                            fill-rule="evenodd"
                            d="M7.964 1.527c-2.977 0-5.571 1.704-6.32 4.125h-.55A1 1 0 0 0 .11 6.824l.254 1.46a1.5 1.5 0 0 0 1.478 1.243h.263c.3.513.688.978 1.145 1.382l-.729 2.477a.5.5 0 0 0 .48.641h2a.5.5 0 0 0 .471-.332l.482-1.351c.635.173 1.31.267 2.011.267.707 0 1.388-.095 2.028-.272l.543 1.372a.5.5 0 0 0 .465.316h2a.5.5 0 0 0 .478-.645l-.761-2.506C13.81 9.895 14.5 8.559 14.5 7.069q0-.218-.02-.431c.261-.11.508-.266.705-.444.315.306.815.306.815-.417 0 .223-.5.223-.461-.026a1 1 0 0 0 .09-.255.7.7 0 0 0-.202-.645.58.58 0 0 0-.707-.098.74.74 0 0 0-.375.562c-.024.243.082.48.32.654a2 2 0 0 1-.259.153c-.534-2.664-3.284-4.595-6.442-4.595M2.516 6.26c.455-2.066 2.667-3.733 5.448-3.733 3.146 0 5.536 2.114 5.536 4.542 0 1.254-.624 2.41-1.67 3.248a.5.5 0 0 0-.165.535l.66 2.175h-.985l-.59-1.487a.5.5 0 0 0-.629-.288c-.661.23-1.39.359-2.157.359a6.6 6.6 0 0 1-2.157-.359.5.5 0 0 0-.635.304l-.525 1.471h-.979l.633-2.15a.5.5 0 0 0-.17-.534 4.65 4.65 0 0 1-1.284-1.541.5.5 0 0 0-.446-.275h-.56a.5.5 0 0 1-.492-.414l-.254-1.46h.933a.5.5 0 0 0 .488-.393m12.621-.857a.6.6 0 0 1-.098.21l-.044-.025c-.146-.09-.157-.175-.152-.223a.24.24 0 0 1 .117-.173c.049-.027.08-.021.113.012a.2.2 0 0 1 .064.199"
                          />
                        </svg>
                        Cost of life
                      </h4>
                      <p>{destination.cost_life}</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <h4>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="currentColor"
                          class="bi bi-map"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.5.5 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103M10 1.91l-4-.8v12.98l4 .8zm1 12.98 4-.8V1.11l-4 .8zm-6-.8V1.11l-4 .8v12.98z"
                          />
                        </svg>
                        Surface
                      </h4>
                      <p>{destination.surface} km<sup>2</sup></p>
                    </div>

                    <div className="col-md-6">
                      <h4>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          class="bi bi-people"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                        </svg>
                        Population
                      </h4>
                      <p>
                        {formatedNumber(destination.population)} inhabitants
                      </p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <h4>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          class="bi bi-thermometer-half"
                          viewBox="0 0 16 16"
                        >
                          <path d="M9.5 12.5a1.5 1.5 0 1 1-2-1.415V6.5a.5.5 0 0 1 1 0v4.585a1.5 1.5 0 0 1 1 1.415" />
                          <path d="M5.5 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM8 1a1.5 1.5 0 0 0-1.5 1.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0l-.166-.15V2.5A1.5 1.5 0 0 0 8 1" />
                        </svg>
                        Climate
                      </h4>
                      <ul>
                        <li>
                          <strong>Type: </strong>
                          {destination.clima.general}
                        </li>
                        <li>
                          <strong>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-thermometer-sun"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5 12.5a1.5 1.5 0 1 1-2-1.415V2.5a.5.5 0 0 1 1 0v8.585A1.5 1.5 0 0 1 5 12.5" />
                              <path d="M1 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM3.5 1A1.5 1.5 0 0 0 2 2.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0L5 10.486V2.5A1.5 1.5 0 0 0 3.5 1m5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5m4.243 1.757a.5.5 0 0 1 0 .707l-.707.708a.5.5 0 1 1-.708-.708l.708-.707a.5.5 0 0 1 .707 0M8 5.5a.5.5 0 0 1 .5-.5 3 3 0 1 1 0 6 .5.5 0 0 1 0-1 2 2 0 0 0 0-4 .5.5 0 0 1-.5-.5M12.5 8a.5.5 0 0 1 .5-.5h1a.5.5 0 1 1 0 1h-1a.5.5 0 0 1-.5-.5m-1.172 2.828a.5.5 0 0 1 .708 0l.707.708a.5.5 0 0 1-.707.707l-.708-.707a.5.5 0 0 1 0-.708M8.5 12a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5" />
                            </svg>
                            Summer:{" "}
                          </strong>
                          {destination.clima.summer}
                        </li>
                        <li>
                          <strong>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="currentColor"
                              class="bi bi-thermometer-snow"
                              viewBox="0 0 16 16"
                            >
                              <path d="M5 12.5a1.5 1.5 0 1 1-2-1.415V9.5a.5.5 0 0 1 1 0v1.585A1.5 1.5 0 0 1 5 12.5" />
                              <path d="M1 2.5a2.5 2.5 0 0 1 5 0v7.55a3.5 3.5 0 1 1-5 0zM3.5 1A1.5 1.5 0 0 0 2 2.5v7.987l-.167.15a2.5 2.5 0 1 0 3.333 0L5 10.486V2.5A1.5 1.5 0 0 0 3.5 1m5 1a.5.5 0 0 1 .5.5v1.293l.646-.647a.5.5 0 0 1 .708.708L9 5.207v1.927l1.669-.963.495-1.85a.5.5 0 1 1 .966.26l-.237.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.884.237a.5.5 0 1 1-.26.966l-1.848-.495L9.5 8l1.669.963 1.849-.495a.5.5 0 1 1 .258.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.237.883a.5.5 0 1 1-.966.258L10.67 9.83 9 8.866v1.927l1.354 1.353a.5.5 0 0 1-.708.708L9 12.207V13.5a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5" />
                            </svg>
                            Winter:
                          </strong>
                          {destination.clima.winter}
                        </li>
                      </ul>
                    </div>

                    <div className="col-md-6">
                      <h4>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          fill="currentColor"
                          class="bi bi-mortarboard"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z" />
                          <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z" />
                        </svg>
                        Universities
                      </h4>

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
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {/* <img
                                src={university.logo}
                                alt={university.name}
                                className="mr-4"
                                width="30"
                                height="30"
                                style={{ borderRadius: "5px" }}
                              /> */}
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
                </div>
              </div>
            )}

            {isAdmin && (
              <button
                type="button"
                style={{
                  fontWeight: "bold",
                  backgroundColor: isEditing
                    ? stateColors.zero
                    : stateColors.one,
                  color: "#ffffff",
                }}
                className={`mt-3 btn ${
                  isEditing ? "btn-secondary" : "btn-warning"
                }`}
                onClick={handleEditClick}
              >
                {isEditing ? "Close" : "Edit"}
              </button>
            )}
          </div>
        )}

        {activeTab === "forums" && (
          <>
            {following || isAdmin ? (
              <>
                <div className="row">
                  <div className="col-md-12">
                    {Object.keys(forums).length > 0 ? (
                      <ul className="list-unstyled">
                        {Object.values(forums).map((forum) => (
                          <li
                            className="d-flex align-items-center mb-2"
                            key={forum._id}
                          >
                            <ForumPreview forum={forum} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="container text-center">
                        <h4>Wow, it's a bit lonely in here</h4>
                        {!isAdmin && <p>Be the first one to create a forum</p>}
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1171/1171279.png"
                          alt="Tumbleweed"
                          style={{ width: "100px" }}
                        />
                      </div>
                    )}
                  </div>

                  {!isAdmin && <ForumForm />}
                </div>
              </>
            ) : (
              <div
                className="container d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: "300px" }}
              >
                <div className="row mb-4 align-items-center text-center justify-content-center">
                  <img
                    className="mb-3"
                    src="https://cdn-icons-png.flaticon.com/512/2889/2889676.png"
                    alt="Lock"
                    style={{ width: "100px" }}
                  />
                  <h5>
                    You must follow the destination if you want to access the
                    forums
                  </h5>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "followers" && (
          <>
            {following || isAdmin ? (
              <div className="row">
                <div className="col-md-12">
                  <ul className="list-unstyled">
                    {Object.values(followers).map((follower) => (
                      <li
                        className="d-flex align-items-center mb-2"
                        key={follower._id}
                      >
                        <Avatar
                          userId={follower._id}
                          outerSize="60px"
                          innerSize="50px"
                          flagSize="20px"
                        />
                        <span className="ms-3">{follower.userName}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div
                className="container d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: "300px" }}
              >
                <div className="row mb-4 align-items-center text-center justify-content-center">
                  <img
                    className="mb-3"
                    src="https://cdn-icons-png.flaticon.com/512/2889/2889676.png"
                    alt="Lock"
                    style={{ width: "100px" }}
                  />
                  <h5>
                    You must follow the destination if you want to see the
                    followers
                  </h5>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "reviews" && (
          <>
            {following || isAdmin ? (
              reviews.length > 0 ? (
                <>
                  {hasReviewed ? (
                    <>
                      <div className="row mb-4 align-items-center text-center justify-content-center">
                        <span className="section-title">Your Review:</span>
                      </div>

                      <Review
                        review={userReview}
                        destination={destination}
                        mode={1}
                      />
                    </>
                  ) : (
                    <div className="row mb-4 align-items-center text-center justify-content-center">
                      {!isAdmin && (
                        <>
                          <span className="section-title">
                            What do you think about{" "}
                            <span
                              style={{
                                color: stateColors.one,
                                fontWeight: "bold",
                              }}
                            >
                              {destination.name}
                            </span>
                            ?
                          </span>

                          <ReviewForm
                            user_id={user.result._id}
                            destination_id={destination._id}
                          />
                        </>
                      )}
                    </div>
                  )}

                  <div className="row">
                    {(reviews.length > 0 && !hasReviewed) && (
                      <span className="section-title text-center">
                      What people think about {""}
                      <span
                        style={{ color: stateColors.one, fontWeight: "bold" }}
                      >
                        {destination.name}
                      </span>
                      :
                    </span>
                    )}
                  
                    {reviews
                      .filter(
                        (review) =>
                          !hasReviewed || review._id !== userReview._id
                      )
                      .map((review) => (
                        <Review
                          review={review}
                          destination={destination}
                          mode={0}
                        />
                      ))}
                  </div>
                </>
              ) : (
                <div className="container">
                  <div className="row mb-4 align-items-center text-center justify-content-center">
                    <h4>Wow, it's a bit lonely in here</h4>
                    {!isAdmin && <p>Be the first to review this destination</p>}

                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1171/1171279.png"
                      alt="Tumbleweed"
                      style={{ width: "100px" }}
                    />
                  </div>
                  <div className="row text-center justify-content-center">
                    {!isAdmin && (<ReviewForm user_id={user.result._id} destination_id={destination._id}/>)}
                  </div>
                </div>
              )
            ) : (
              <div
                className="container d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: "300px" }}
              >
                <div className="row mb-4 align-items-center text-center justify-content-center">
                  <img
                    className="mb-3"
                    src="https://cdn-icons-png.flaticon.com/512/2889/2889676.png"
                    alt="Lock"
                    style={{ width: "100px" }}
                  />
                  <h5>
                    You must follow the destination if you want to see the
                    reviews
                  </h5>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "gallery" && (
          <div className="container justify-content-center">
            {following || isAdmin ? (
              <>
                <div className="row justify-content-center mb-3">
                  {photos.length>0 ? (
                    <>
                      {photos.map((photo) => (
                    <div className="col-12 col-md-6 col-lg-4" key={photo._id}>
                      <Photo
                        photo={photo}
                        delete={photo.user === user.result._id}
                      />
                    </div>
                  ))}
                  </>):(<>
                    <h4 className="text-center">It seems like this destination hasn't any photos posted yet</h4>
                    <img
                      src="https://cdn-icons-png.freepik.com/256/1466/1466623.png"
                      alt="Lonely file"
                      style={{ width: "200px" }}
                    />
                  </>)}
                  
                  
                </div>

                <div className="row justify-content-center text-center ">
                  {!isAdmin && <PhotoForm />}
                </div>
              </>
            ) : (
              <div
                className="container d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: "300px" }}
              >
                <div className="row mb-4 align-items-center text-center justify-content-center">
                  <img
                    className="mb-3"
                    src="https://cdn-icons-png.flaticon.com/512/2889/2889676.png"
                    alt="Lock"
                    style={{ width: "100px" }}
                  />
                  <h5>
                    You must follow the destination if you want to access the
                    gallery
                  </h5>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Destination;
