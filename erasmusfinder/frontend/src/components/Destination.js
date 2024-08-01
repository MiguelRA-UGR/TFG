import React, { useState, useEffect } from "react";
import axios from "axios";

import "../index.css";
import Avatar from "./Avatar";
import Review from "./Review";
import ReviewForm from "./ReviewForm";
import PhotoForm from "./PhotoForm";
import Photo from "./Photo";
import ForumPreview from "./ForumPreview";
import { getColorForScore, stateColors } from "./utils";
import ForumForm from "./ForumForm";

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

  function formatedName(name) {
    return name.toLowerCase().replace(/\s+/g, "");
  }

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
    return <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading destination...</span>
  </div>;
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
      </div>

      <img
        src={`http://localhost:4000/imgs/frontpages/${formatedName(
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
            {following ? (
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
                        <p>Be the first one to create a forum</p>
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/1171/1171279.png"
                          alt="Tumbleweed"
                          style={{ width: "100px" }}
                        />
                      </div>
                    )}
                  </div>

                  <ForumForm/>
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
            {following ? (
              <div className="row">
                <div className="col-md-12">
                  <ul className="list-unstyled">
                    {Object.values(followers).map((follower) => (
                      <li
                        className="d-flex align-items-center mb-2"
                        key={follower._id}
                      >
                        <Avatar
                          user={follower}
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
            {following ? (
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
                      <span className="section-title">
                        What do you think about{" "}
                        <span
                          style={{ color: stateColors.one, fontWeight: "bold" }}
                        >
                          {destination.name}
                        </span>
                        ?
                      </span>
                      <ReviewForm
                        user_id={user.result._id}
                        destination_id={destination._id}
                      />
                    </div>
                  )}

                  <div className="row">
                    <span className="section-title text-center">
                      What people think about {""}
                      <span
                        style={{ color: stateColors.one, fontWeight: "bold" }}
                      >
                        {destination.name}
                      </span>
                      :
                    </span>

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
                    <p>Be the first to review this destination</p>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1171/1171279.png"
                      alt="Tumbleweed"
                      style={{ width: "100px" }}
                    />
                  </div>
                  <div className="row text-center justify-content-center">
                    <ReviewForm
                      user_id={user.result._id}
                      destination_id={destination._id}
                    />
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
          <div className="container">
            {following ? (
              <>
                <div className="row justify-content-center">
                  {photos.map((photo) => (
                    <div className="col-12 col-md-6 col-lg-4" key={photo._id}>
                      <Photo
                        photo={photo}
                        delete={photo.user === user.result._id}
                      />
                    </div>
                  ))}
                </div>

                <div className="row justify-content-center text-center mt-3">
                  <PhotoForm />
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
