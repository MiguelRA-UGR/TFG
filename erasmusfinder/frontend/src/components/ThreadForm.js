import React, { useState } from "react";
import PhotoCrop from "./PhotoCrop";
import { useDispatch } from "react-redux";
import { createThread } from "../actions/thread";
import axios from "axios";

const ThreadForm = () => {
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState("#");
  const [cropped, setCropped] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [photoUrl, setPhotoUrl] = useState(null);
  const [addPhoto, setAddPhoto] = useState(false);

  const dispatch = useDispatch();

  const handleImageChange = (newImage) => {
    setImage(newImage);
    setCropped(false);
  };

  const handleCropData = (data) => {
    setCropData(data);
    setCropped(true);
  };

  const uploadPhotoToBack = async (file) => {
    const formData = new FormData();
    formData.append("photo", file);
  
    try {
      const response = await axios.post(
        "http://localhost:4000/api/threads/upload-thread-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Foto subida con éxito:", response.data);
      return response.data.url;
    } catch (error) {
      console.error("Error al subir la foto:", error);
      return null;
    }
  };
  
  const handlePost = async (e) => {
    e.preventDefault();
  
    const fileBlob = await fetch(cropData).then((res) => res.blob());
    const file = new File([fileBlob], "photo.png", { type: fileBlob.type });
  
    const forumId = window.location.pathname.split("/").pop();
    
    let photoUrl = await uploadPhotoToBack(file);
    
    if(!addPhoto){
      photoUrl=null;
    }

    const updatedThreadData = {
      title,
      content,
      url: photoUrl,
      author: user.result._id,
      forum: forumId,
    };
  
    try {
      await dispatch(createThread(updatedThreadData));
      setImage(null);
      setCropData("#");
      setTitle("");
      setContent("");
      setPhotoUrl(null);
      setAddPhoto(false);
      setCropped(false);
  
      //window.location.reload();
    } catch (error) {
      console.error("Error al crear el hilo: ", error);
    }
  };
  
  
  return (
    <div>
      <form className="form-control text-center" onSubmit={handlePost}>
        <h4>Creating a New Thread</h4>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            maxLength={100}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            className="form-control"
            id="content"
            maxLength={300}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <small className="form-text text-muted">max 300 characters</small>
        </div>

        <div className="mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="addPhoto"
            checked={addPhoto}
            onChange={() => setAddPhoto(!addPhoto)}
            style={{marginRight:"5px"}}
          />
          <label htmlFor="addPhoto" className="form-check-label">
            Add Photo
          </label>
        </div>

        {addPhoto && (
          <div className="mb-3 d-flex justify-content-center">
            <PhotoCrop
              image={image}
              onImageChange={handleImageChange}
              onCropData={handleCropData}
              cropped={cropped}
            />
          </div>
        )}

        <button
          type="submit"
          style={{
            fontWeight: "bold",
            backgroundColor: "#f5973d",
            color: "#ffffff",
          }}
          className="btn btn-warning"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default ThreadForm;
