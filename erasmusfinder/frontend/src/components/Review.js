import { React, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useDispatch } from "react-redux";
import { deleteReview } from "../actions/review.js";
import { getColorForScore } from "./utils";
import DeleteButton from "./DeleteButton.js";

const Review = ({ review, destination, mode }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const isAdmin = user.result.admin;

  const handleDelete = async (event) => {
    try {
      dispatch(deleteReview(review._id));
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar la reseña: ", error);
    }
  };

  //El modo determina si se esta mostrando la review en la pagina del destino o una review suya al propio autor
  if (review) {
    if (mode === 0) {
      return (
        <div
          className="card mb-3 m-1"
          style={{ maxWidth: "400px", margin: "auto" }}
        >
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              {review.anonymous ? (
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "grey",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "30px",
                  }}
                >
                  ?
                </div>
              ) : (
                <Avatar
                  userId={review.author._id}
                  outerSize="60px"
                  innerSize="50px"
                  flagSize="20px"
                />
              )}

              <div className="ms-3 flex-grow-1">
                <h5>
                  {review.anonymous ? "Anonymous" : review.author.userName}
                </h5>
              </div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: getColorForScore(review.score),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "25px",
                    color: "#ffffff",
                    fontWeight: "bold",
                  }}
                >
                  {review.score === -1 ? "-" : review.score}
                </span>
              </div>
            </div>
            <p className="card-text">{review.comment}</p>
            <h6 className="card-subtitle mb-2 text-muted">
              {new Date(review.createdAt).toLocaleDateString()}
            </h6>
          </div>

          {isAdmin && (
            <button
              className="btn btn-danger d-flex align-items-center justify-content-center"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                width: "40px",
                height: "40px",
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
      );
    } else {
      return (
        <div
          className="card mb-3 m-1"
          style={{
            maxWidth: "400px",
            height: "150px",
            margin: "auto",
            position: "relative",
          }}
        >
          <div className="card-body">
            <Link
              to={`/Destination/${destination._id}`}
              className="nav-link ml-3"
              key={destination._id}
            >
              <div className="d-flex align-items-center mb-3">
                <div className="flex-grow-1 d-flex flex-row">
                  <h5>{destination.name}</h5>
                  <img
                    className="mt-1"
                    src={`https://flagcdn.com/${destination.iso}.svg`}
                    alt={destination.country}
                    style={{
                      height: "20px",
                      width: "20px",
                      marginLeft: "5px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: getColorForScore(review.score),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "25px",
                      color: "#ffffff",
                      fontWeight: "bold",
                    }}
                  >
                    {review.score === -1 ? "-" : review.score}
                  </span>
                </div>
              </div>
            </Link>
            <p
              className="card-text"
              style={{
                maxHeight: "50px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {review.comment}
            </p>
            <small
              className="card-subtitle text-muted"
              style={{ alignSelf: "flex-end" }}
            >
              {new Date(review.createdAt).toLocaleDateString()}
            </small>

              <DeleteButton handleDelete={handleDelete}/>
          </div>
        </div>
      );
    }
  }
};

Review.propTypes = {
  review: PropTypes.object.isRequired,
  destination: PropTypes.object,
  mode: PropTypes.number.isRequired,
};

export default Review;
