import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { defaultUsers } from "./utils.js";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CarouselCard from "./CarouselCard.js";
import CarouselUser from "./CarouselUser.js";
import Review from "./Review";
import DestinationSearch from "./DestinationSearch.js";

import "../index.css";
import MapComponent from "./MapComponent.js";
import UserSearch from "./UserSearch.js";
import ForumSearch from "./ForumSearch.js";

//Objetos para configurar el carrusel
const responsiveDests = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 5,
    slidesToSlide: 2,
  },
  desktop: {
    breakpoint: { max: 1024, min: 800 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 800, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const responsiveReviews = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 4,
    slidesToSlide: 2,
  },
  desktop: {
    breakpoint: { max: 1024, min: 800 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 800, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const Home = () => {
  const [destinations, setDestinations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem("profile")));
  const [followedDestinations, setFollowedDestinations] = useState([]);
  const [reviews, setUserReviews] = useState([]);
  const [pins, setPins] = useState([]);
  const navigate = useNavigate();

  const handleDestinationSelect = (destination) => {
    navigate(`/Destination/${destination._id}`);
  };

  useEffect(() => {
    const getUserReviews = async () => {
      if (!user || !user.result.reviews) return;

      try {
        const reviewIds = user.result.reviews;
        const reviewsData = await Promise.all(
          reviewIds.map(async (reviewId) => {
            const res = await fetch(
              `http://localhost:4000/api/reviews/${reviewId}`
            );
            if (!res.ok) {
              throw new Error("Error al obtener las reseñas");
            }
            return await res.json();
          })
        );
        setUserReviews(reviewsData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getUserReviews();
  }, [user]);

  useEffect(() => {
    const getDestinations = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/dests", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Error al obtener los destinos");
        }
        const data = await res.json();
        setDestinations(data);

        filterFollowedDestinations(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getDestinations();
  }, []);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/users", {
          method: "GET",
        });
        if (!res.ok) {
          throw new Error("Error al obtener los contactos");
        }
        const data = await res.json();
        filterContacts(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getContacts();
  }, []);

  const filterContacts = (allContacts) => {
    const followedIds = user?.result?.followedUsers || [];

    const followed = allContacts.filter((contact) =>
      followedIds.includes(contact._id)
    );
    setContacts(followed);
  };

  const filterFollowedDestinations = (allDestinations) => {
    const followedIds = user?.result?.followedDestinations || [];
    const followed = allDestinations.filter((destination) =>
      followedIds.includes(destination._id)
    );
    setFollowedDestinations(followed);

    const pinData = allDestinations.map((dest) => ({
      position: { lat: dest.coords.lat, lng: dest.coords.long },
      name: dest.name,
      score: dest.mean_score,
      country: dest.country,
      iso: dest.iso,
      icon: {
        url: followedIds.includes(dest._id)
          ? "../imgs/icons/push-pin-blue.png"
          : "../imgs/icons/push-pin-orange.png",
        scaledSize: { width: 30, height: 30 },
      },
      link: `/Destination/${dest._id}`,
    }));

    setPins(pinData);
  };
  //Mapear los destinos por sus ids
  const destinationById = {};

  followedDestinations.forEach((destination) => {
    destinationById[destination._id] = destination;
  });

  function formatedName(name) {
    return name.toLowerCase().replace(/\s+/g, "");
  }

  const followeDestination = followedDestinations.map((destination) => (
    <CarouselCard
      name={destination.name}
      image={destination.frontpage}
      id={destination._id}
    />
  ));

  const contact = contacts.map((user) => (
    <CarouselUser
      userName={user.userName}
      _id={user._id}
      badge={user.badge}
      state={user.state}
      photo={user.photo}
    />
  ));

  var review = "null";

  review = reviews.map((rev) => {
    const dest = destinationById[rev.destination];

    if (dest != null) {
      const reviewData = {
        id: rev._id,
        comment: rev.comment,
        author: user.result,
        score: rev.score,
        createdAt: rev.createdAt,
        anonymous: false,
      };

      return (
        <Review review={reviewData} destination={dest} mode={1} key={rev._id} />
      );
    }
  });

  return (
    <div className="container">
      {(user && user.result.admin) ? (
        <>
          <span className="section-title">
            Users
          </span>
          <UserSearch/>

          <span className="section-title">
            Destinations
          </span>
          <DestinationSearch/>

          <span className="section-title">
            Forums
          </span>
          <ForumSearch/>


        </>
      ) : (
        <>
          <DestinationSearch onDestinationSelect={handleDestinationSelect} />

          {(!user || user.result.followedDestinations.length === 0) && (
            <>
              <span className="section-title" style={{ fontSize: "35px" }}>
                Discover...
              </span>

              <div
                id="carouselExampleAutoplaying"
                className="carousel slide d-flex justify-content-center align-items-center"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {destinations.map((destination, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <Link to={`/Destination/${destination._id}`}>
                        <img
                          src={`http://localhost:4000/imgs/frontpages/${formatedName(
                            destination.name
                          )}.png`}
                          style={{ maxHeight: "700px", objectFit: "cover" }}
                          alt={destination.name}
                        />
                      </Link>
                      <div
                        className="carousel-caption d-flex justify-content-center align-items-center"
                        style={{
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          right: "0",
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                        }}
                      >
                        <div className="text-center">
                          <h5
                            style={{
                              fontSize: "25px",
                              fontFamily: "Cambria, serif",
                              fontWeight: "bold",
                            }}
                          >
                            {destination.name}
                          </h5>
                          <p style={{ maxWidth: "60%", margin: "0 auto" }}>
                            {destination.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleAutoplaying"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleAutoplaying"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </>
          )}

          {!user && (
            <>
              <div className="mt-4">
                <span className="section-title">
                  Interact with people who are looking for the same as you{" "}
                </span>
              </div>
              <div className="row text-center justify-content-center mt-4">
                {defaultUsers.map((user) => (
                  <div key={user.id} className="col-md-3 mb-4">
                    <div id="custom_card" className="card">
                      <img
                        src={require(`../imgs/users/${user.avatar}.png`)}
                        className="card-img-top"
                        alt={user.name}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <div className="d-flex align-items-center justify-content-center">
                          <img
                            src={`https://flagcdn.com/${user.flag}.svg`}
                            alt={user.country}
                            style={{
                              height: "20px",
                              width: "20px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              marginRight: "5px",
                            }}
                          />
                          <p className="card-text mb-0">{user.country}</p>
                        </div>
                        <div
                          className="btn btn-link mt-2 form-control"
                          style={{
                            fontWeight: "bold",
                            fontSize: `${18 - user.status.length * 0.3}px`,
                            background: user.status_color,
                            color: "white",
                            textDecoration: "none",
                          }}
                        >
                          {user.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {user && user.result.followedDestinations.length > 0 && (
            <>
              <span className="section-title">Followed destinations</span>
              <img
                src={"../imgs/icons/push-pin-blue.png"}
                alt="Push Pin Icon"
                className="icon"
                style={{ width: "20px", height: "20px" }}
              />
              <Carousel
                className="mb-3"
                showDots={false}
                autoPlay={true}
                responsive={responsiveDests}
              >
                {followeDestination}
              </Carousel>
            </>
          )}

          {user && user.result.followedUsers.length > 0 && (
            <>
              <span className="section-title">Contacts</span>

              <Carousel
                className="mb-3"
                showDots={false}
                autoPlay={true}
                responsive={responsiveDests}
              >
                {contact}
              </Carousel>
            </>
          )}

          {user && user.result.reviews.length > 0 && (
            <>
              <span className="section-title">Your Reviews</span>

              <Carousel
                className="mb-3"
                showDots={false}
                autoPlay={true}
                responsive={responsiveReviews}
              >
                {review}
              </Carousel>
            </>
          )}

          {!user && (
            <span className="section-title">
              Find the destination that better suits you!
            </span>
          )}

          <MapComponent pinData={pins}></MapComponent>

          {user && (
            <div className="mt-3 text-center d-flex flex-column">
              <span className="section-title mb-2">
                Do you think there is something our platform could improve? Let
                us know!
              </span>

              <Link to={`/RequestForm`}>
                <button
                  type="submit"
                  style={{
                    fontWeight: "bold",
                    backgroundColor: "#f5973d",
                    color: "#ffffff",
                  }}
                  className="btn btn-warning"
                >
                  Make a Request
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
