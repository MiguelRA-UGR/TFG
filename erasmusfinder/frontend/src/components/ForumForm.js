import React, { useState } from "react";
import PhotoCrop from "./PhotoCrop";
import { useDispatch } from "react-redux";
import { createForum } from "../actions/forum.js"; // Action to be created
import axios from "axios";

const initialState = {
  title: "",
  description: "",
  url: "",
  destination: "",
  creator: "",
};

const ForumForm = () => {
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState("#");
  const [cropped, setCropped] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  var photoUrl;

  const dispatch = useDispatch();

  const uploadPhotoToBack = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/forums/upload-forum-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      photoUrl = response.data.url;
      console.log("Foto de portada subida con éxito:", response.data);
    } catch (error) {
      console.error("Error al subir la foto de portada:", error);
    }
  };

  const handleImageChange = (newImage) => {
    setImage(newImage);
    setCropped(false);
  };

  const handleCropData = (data) => {
    setCropData(data);
    setCropped(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const destinationId = window.location.pathname.split("/").pop();
    const fileBlob = await fetch(cropData).then((res) => res.blob());
    const file = new File([fileBlob], "cover_photo.png", {
      type: fileBlob.type,
    });

    await uploadPhotoToBack(file);

    const forumData = {
      title,
      description,
      url: photoUrl,
      destination: destinationId,
      creator: user.result._id,
    };

    try {
      dispatch(createForum(forumData));
      setImage(null);
      setCropData("#");
      setTitle("");
      setDescription("");
      setCropped(false);

      window.location.reload();
    } catch (error) {
      console.error("Error al crear el foro: ", error);
    }
  };

  return (
    <div>
      <form className="form-control text-center" onSubmit={handleCreate}>
        <h4>Create a new forum</h4>
        <div className="row">
          <div className="col-md-6 mb-3 d-flex justify-content-center">
            <PhotoCrop
              image={image}
              onImageChange={handleImageChange}
              onCropData={handleCropData}
              cropped={cropped}
            />
          </div>

          <div className="col-md-6 text-center">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
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
              Create Forum
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForumForm;
