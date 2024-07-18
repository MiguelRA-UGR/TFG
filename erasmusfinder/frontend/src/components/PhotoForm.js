import React, { useState } from "react";
import PhotoCrop from "./PhotoCrop";
import { useDispatch } from "react-redux";
import { uploadPhoto } from "../actions/photo.js";
import axios from 'axios';


function extractLatLngFromGoogleMaps(url) {
  //Se extrae la latitud y longitud con una expresión regular. Lo que sigue a la @ son las coordenada
  const regex = /@([\d.-]+),([\d.-]+)/;
  const matches = url.match(regex);

  if (matches) {
    return {
      lat: parseFloat(matches[1]),
      long: parseFloat(matches[2]),
    };
  }else{
    return {
      lat: 0,
      long: 0,
    };
  }
}
const initialState = {
  comment: "",
  url: "",
  ubication: null,
  user: "",
  anonymous: false,
};

const PhotoForm = () => {
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState("#");
  const [cropped, setCropped] = useState(false);
  const [caption, setCaption] = useState("");
  const [ubication, setUbication] = useState("");
  const [ubicationName, setUbicationName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  var photoUrl;

  const dispatch = useDispatch();

    const uploadPhotoToBack = async (file) => {
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const response = await axios.post('http://localhost:4000/api/photos/upload-post-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            photoUrl = response.data.url;
            console.log('Foto subida con éxito:', response.data);
            
        } catch (error) {
            console.error('Error al subir la foto:', error);
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

  const handlePost = async (e) => {
        e.preventDefault();

        const destinationId = window.location.pathname.split("/").pop();
        const coords = extractLatLngFromGoogleMaps(ubication);
        const fileBlob = await fetch(cropData).then(res => res.blob());
        const file = new File([fileBlob], "photo.png", { type: fileBlob.type });

        await uploadPhotoToBack(file);


        const updatedPhotoData = {
            comment: caption,
            url: photoUrl,
            ubication: coords ? { name: ubicationName, lat: coords.lat, long: coords.long } : null,
            user: user.result._id,
            anonymous: anonymous,
            destination: destinationId,
            likes: [],
        };

        try {
            dispatch(uploadPhoto(updatedPhotoData));
            setImage(null);
            setCropData("#");
            setCaption("");
            setUbication("");
            setUbicationName("");
            setAnonymous(false);
            setCropped(false);

            window.location.reload();
        } catch (error) {
            console.error("Error al subir la foto: ", error);
        }
    };

  return (
    <div>
      <form className="form-control text-center" onSubmit={handlePost}>
        <h4>Post your own photos</h4>
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
              <label htmlFor="comment" className="form-label">
                Add a caption
              </label>
              <textarea
                className="form-control"
                id="comment"
                maxLength={100}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              <small className="form-text text-muted">max 100 characters</small>
            </div>
            <div className="mb-3 form-check">
              <label className="form-label">Ubication Name</label>
              <input
                type="text"
                className="form-control mb-3"
                id="ubicationNameInput"
                value={ubicationName}
                onChange={(e) => setUbicationName(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-geo-alt"
                viewBox="0 0 16 16"
              >
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
              <label className="form-label">Ubication Link</label>
              <input
                type="text"
                className="form-control mb-3"
                id="ubicationInput"
                value={ubication}
                onChange={(e) => setUbication(e.target.value)}
              />
              <input
                type="checkbox"
                className="form-check-input"
                id="anonymous"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="anonymous">
                Hide Username
              </label>
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
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PhotoForm;
