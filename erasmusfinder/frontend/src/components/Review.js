import React from 'react'
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import Avatar from "./Avatar"

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

  const Review = ({ comment, author, date, score,destination, mode }) => {
    if (mode === 0) {
      return (
        <div className="card mb-3" style={{ maxWidth: '400px', margin: 'auto' }}>
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              
                <Avatar
                user={author}
                outerSize="60px"
                innerSize="50px"
                flagSize="20px"
              />
              
              <div className="ms-3 flex-grow-1">
                <h5>{author.userName}</h5>
              </div>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: getColorForScore(score),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <span
                  style={{ fontSize: "25px", color: "#ffffff", fontWeight: "bold" }}
                >
                  {score === -1 ? "-" : score}
                </span>
              </div>
            </div>
            <p className="card-text">
              {comment}
            </p>
            <h6 className="card-subtitle mb-2 text-muted">
              {new Date(date).toLocaleDateString()}
            </h6>
          </div>
        </div>
      );
    }else{
      return (
      <div className="card mb-3" style={{ maxWidth: '400px', margin: 'auto' }}>
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
                className='mt-1'
                src={`https://flagcdn.com/${destination.iso}.svg`}
                alt={destination.country}
                style={{ height: "20px",width: "20px", marginLeft: "5px" ,borderRadius: "50%", objectFit: "cover"}}
              />
            </div>
            
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: getColorForScore(score),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <span
                style={{ fontSize: "25px", color: "#ffffff", fontWeight: "bold" }}
              >
                {score === -1 ? "-" : score}
              </span>
            </div>
          </div>
        </Link>
        <p className="card-text">
          {comment}
        </p>
        <h6 className="card-subtitle mb-2 text-muted">
          {new Date(date).toLocaleDateString()}
        </h6>
      </div>
    </div>
      );
      
    }
    
  };
  
  Review.propTypes = {
    comment: PropTypes.string.isRequired,
    author: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    destination: PropTypes.object,
    mode: PropTypes.number.isRequired,
  };
  
  export default Review;