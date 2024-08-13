import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { like, dislike, deletePhoto } from "../actions/photo.js";
import DeleteButton from "./DeleteButton.js";

const initialState = {
  photoId: "",
  userId: "",
};

const Photo = ({ photo, delete: deletable }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeData] = useState(initialState);
  const [likes, setLikes] = useState(0);
  const [user] = useState(JSON.parse(localStorage.getItem("profile")));
  const dispatch = useDispatch();

  const loggedUserId = user.result._id;
  const isAdmin = user.result.admin;

  const googleMapsLink = `https://www.google.com/maps?q=${photo.ubication.lat},${photo.ubication.long}`;

  useEffect(() => {
    setLikes(photo.likes.length);
  }, [photo.likes, loggedUserId]);

  const handleDelete = async (event) => {
    try {
      dispatch(deletePhoto(photo._id));
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar la foto: ", error);
    }
  };

  const handleLike = async () => {
    if (isAdmin) return;

    likeData.photoId = photo._id;
    likeData.userId = user.result._id;

    try {
      let result;
      if (isLiked) {
        result = await dispatch(dislike(likeData));
      } else {
        result = await dispatch(like(likeData));
      }
      setIsLiked(!isLiked);
      setLikes(result.nLikes);
    } catch (error) {
      console.error('Error al intentar dar like/dislike:', error);
    }
  };

  return (
    <div
      className="card"
      style={{ width: "300px", height: "auto", position: "relative" }}
    >
      <div className="card-body d-flex flex-column">
        <div
          className="image-container mb-3"
          style={{ width: "275px", height: "275px" }}
        >
          <img
            className="card-img-top"
            src={`http://localhost:4000${photo.url}`}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: "5px",
            }}
            alt={photo.ubication.name}
          />
        </div>

        <div
          className="d-flex align-items-center mb-2"
          style={{ width: "100%" }}
        >
          {photo.anonymous ? (
            <div
              style={{
                width: "40px",
                height: "40px",
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
              userId={photo.author._id}
              outerSize="40px"
              innerSize="30px"
              flagSize="1px"
            />
          )}
          <div className="d-flex flex-row ms-2 align-items-center">
            <span>{photo.anonymous ? 'Anonymous' : photo.author.userName}</span>

            <div className="d-flex flex-column text-center" style={{ cursor: isAdmin ? 'default' : 'pointer', marginLeft: '150px' }} onClick={handleLike}>
            {isLiked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" className="bi bi-suit-heart-fill" viewBox="0 0 16 16">
                  <path d="M4 1c2.21 0 4 1.755 4 3.92C8 2.755 9.79 1 12 1s4 1.755 4 3.92c0 3.263-3.234 4.414-7.608 9.608a.513.513 0 0 1-.784 0C3.234 9.334 0 8.183 0 4.92 0 2.755 1.79 1 4 1"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" className="bi bi-suit-heart" viewBox="0 0 16 16">
                  <path d="m8 6.236-.894-1.789c-.222-.443-.607-1.08-1.152-1.595C5.418 2.345 4.776 2 4 2 2.324 2 1 3.326 1 4.92c0 1.211.554 2.066 1.868 3.37.337.334.721.695 1.146 1.093C5.122 10.423 6.5 11.717 8 13.447c1.5-1.73 2.878-3.024 3.986-4.064.425-.398.81-.76 1.146-1.093C14.446 6.986 15 6.131 15 4.92 15 3.326 13.676 2 12 2c-.777 0-1.418.345-1.954.852-.545.515-.93 1.152-1.152 1.595zm.392 8.292a.513.513 0 0 1-.784 0c-1.601-1.902-3.05-3.262-4.243-4.381C1.3 8.208 0 6.989 0 4.92 0 2.755 1.79 1 4 1c1.6 0 2.719 1.05 3.404 2.008.26.365.458.716.596.992a7.6 7.6 0 0 1 .596-.992C9.281 2.049 10.4 1 12 1c2.21 0 4 1.755 4 3.92 0 2.069-1.3 3.288-3.365 5.227-1.193 1.12-2.642 2.48-4.243 4.38z"/>
                </svg>
              )}
              <small style={{ color: "red" }}>{likes}</small>
            </div>
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
              <Link to={googleMapsLink} style={{ textDecoration: "none" }}>
                <span>{photo.ubication.name}</span>
              </Link>
            </div>

            {(deletable || isAdmin) ? (
              <DeleteButton handleDelete={handleDelete}/>
            ) : (
              <span className="text-muted" style={{ fontSize: "10px" }}>
                {new Date(photo.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photo;
