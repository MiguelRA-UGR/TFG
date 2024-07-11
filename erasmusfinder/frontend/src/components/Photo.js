import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const Photo = ({ photo }) => {
  const googleMapsLink = `https://www.google.com/maps?q=${photo.ubication.lat},${photo.ubication.long}`;
  
  return (
    <div className="card" style={{ width: "300px", height: "auto", position: "relative" }}>
      <div className="card-body d-flex flex-column">
        <div className="image-container mb-3" style={{ width: "275px", height: "275px" }}>
          <img
            className="card-img-top"
            src={`http://localhost:4000${photo.url}`}
            style={{ objectFit: "cover", width: "100%", height: "100%", borderRadius:"5px" }}
            alt={photo.ubication.name}
          />
        </div>

        <div className="d-flex align-items-center mb-2" style={{ width: "100%" }}>
        {photo.anonymous ? (
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'grey',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '30px'
                }}
                >
                  ?
                </div>
              ) : (
              <Avatar
                user={photo.author}
                outerSize="40px"
                innerSize="30px"
                flagSize="1px"
              />
              )}
          <div className="ms-2">
            <span>{photo.anonymous ? 'Anonymous' : photo.author.userName}</span>
          </div>
        </div>

        <p className="card-text mb-2" style={{ fontSize: "15px" }}>
          {photo.comment}
        </p>
        
        <div className="mt-auto" style={{ width: "100%" }}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img
                src={"../imgs/icons/push-pin-orange.png"}
                alt="Push Pin Icon"
                className="icon"
                style={{ width: "20px", height: "20px" }}
              />
              <Link to={googleMapsLink} style={{textDecoration:"none"}}>
              <span>{photo.ubication.name}</span>
              </Link>
              
            </div>
            <span className="text-muted" style={{ fontSize: "10px" }}>
              {new Date(photo.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photo;
