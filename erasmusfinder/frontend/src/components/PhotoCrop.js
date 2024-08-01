import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const PhotoCrop = ({ image, onImageChange, onCropData, cropped, height = 200, aspectRatio = 1 }) => {
  const cropperRef = useRef(null);

  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onImageChange(reader.result);
    };
    if (files && files.length > 0) {
      reader.readAsDataURL(files[0]);
    }
  };

  const getCropData = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      onCropData(cropper.getCroppedCanvas().toDataURL());
    }
  };

  return (
    <div>
      <input type="file" onChange={onChange} />
      <br />
      <br />
      <Cropper
        ref={cropperRef}
        style={{ height, width: "100%" }}
        zoomTo={0.2}
        initialAspectRatio={aspectRatio}
        preview=".img-preview"
        src={image}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        checkOrientation={false}
        guides={true}
        aspectRatio={aspectRatio}
      />
      <div>
        <div className="box" style={{ width: "50%", float: "right" }}>
          <h6>Preview</h6>
          <div
            className="img-preview"
            style={{ width: "100%", float: "left", height: "200px" }}
          />
        </div>
        <div
          className="box"
          style={{ width: "50%", float: "right", height: "200px" }}
        >
          <h6>Crop</h6>
          <button
            type="button"
            className="btn btn-info"
            onClick={getCropData}
            disabled={cropped}
          >
            {cropped ? "Cropped" : "Crop Image"}
          </button>
        </div>
      </div>
      <br style={{ clear: "both" }} />
    </div>
  );
};

export default PhotoCrop;
