import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { createReview } from "../actions/review.js";
import PropTypes from "prop-types";
import { ratingColors } from './utils';

const initialState = {
  comment: "",
  score: 0,
  destination: "",
  user: "",
  anonymous: false,
};

const ReviewForm = ({ user_id, destination_id }) => {
  const [hoverRating, setHoverRating] = useState(null);
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const dispatch = useDispatch();
  const [reviewData] = useState(initialState);

  const handleMouseEnter = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const handleClick = (value) => {
    setRating(value);
  };

  const handleToggle = () => {
    setAnonymous((prevAnonymous) => !prevAnonymous);
  };

  const handleReview = async (event) => {
    event.preventDefault();
    const updatedReviewData = {
      ...reviewData,
      comment,
      score: rating,
      anonymous,
      user: user_id,
      destination: destination_id,
    };
    
    try {
      dispatch(createReview(updatedReviewData));
      window.location.reload();
    } catch (error) {
      console.error("Error al enviar la reseña: ", error);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  return (
    <form className="form-control" style={{ width: "50%" }} onSubmit={handleReview}>
      <div className="mb-3">
        <label htmlFor="comment" className="form-label">Comment</label>
        <textarea
          className="form-control"
          name="comment"
          value={comment}
          maxLength={300}
          onChange={handleCommentChange}
        />
      </div>

      <label htmlFor="rating1" className="form-label">Score: </label>

      <div className="star-rating mb-3">
        {[...Array(10)].map((_, index) => {
          const value = index + 1;
          const isFilled = hoverRating >= value || rating >= value;
          
          return (
            <span
              key={value}
              className="star"
              data-value={value}
              style={{
                color: ratingColors[value - 1],
                fontSize: "30px",
                cursor: "pointer",
                margin: "0 2px",
                display: 'inline-block'
              }}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(value)}
            >
              {isFilled ? String.fromCharCode(10121 + value) : String.fromCharCode(9311 + value)}
            </span>
          );
        })}
        <div>
          <p>Your rating: {rating || 0}</p>
        </div>
      </div>

      <div className="mb-3">
        <input
          type="checkbox"
          className="form-check-input me-2"
          id="anonymous"
          checked={anonymous}
          onChange={handleToggle}
        />
        <label className="form-check-label" htmlFor="anonymous">Hide Username</label>
      </div>

      <button
        type="submit"
        style={{
          fontWeight: "bold",
          backgroundColor: "#f5973d",
          color: "#ffffff",
        }}
        className="btn btn-warning"
      >
        Review
      </button>
    </form>
  );
};

ReviewForm.propTypes = {
  user_id: PropTypes.string.isRequired,
  destination_id: PropTypes.string.isRequired,
};

export default ReviewForm;
