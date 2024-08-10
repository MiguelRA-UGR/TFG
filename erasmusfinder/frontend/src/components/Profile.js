import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { stateColors } from "./utils";
import CountryPicker from "./CountryPicker";

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [isEditing, setIsEditing] = useState(false);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [privacy, setPrivacyOption] = useState(user.result.privacy);
  const history = useNavigate();

  const isAdmin = user.result.admin;

  const [selectedCountry, setSelectedCountry] = useState(
    user.result.nationality
  );
  const [countryName, setSelectedCountryName] = useState(user.result.nationality);

  const [editedUser, setEditedUser] = useState({
    userName: "",
    state: 0,
    privacy: 0,
    instagram: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    description: "",
    country: "",
    originCity: "",
    destCity: "",
    destUniversity: "",
    badge: "",
  });

  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const handleEditClick = () => {
    const originalUserCopy = { ...user.result };
    setEditedUser(originalUserCopy);
    setIsEditing(true);
  };

  const handleCountryChange = ({ code, name }) => {
    setSelectedCountry(code);
    setSelectedCountryName(name);
  
    console.log(code);
  
    setEditedUser({
      ...editedUser,
      nationality: code,
      badge: code,
    });
  };
  

  const handleStateChange = (e) => {
    const newState = parseInt(e.target.value);
    setEditedUser({ ...editedUser, state: newState });
  };

  const handlePrivacyOptionChange = (value) => {
    setPrivacyOption(value);
    setEditedUser({ ...editedUser, privacy: value });
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSaveClick = () => {
    setIsEditing(false);

    if (newProfilePicture) {
      updateProfilePicture();
    }
    updateUserData();
  };

  const updateProfilePicture = () => {
    const formData = new FormData();
    formData.append("profilePicture", newProfilePicture);

    console.log("New profile picture:", newProfilePicture);

    axios
      .put(
        `http://localhost:4000/api/users/${user.result._id}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating profile picture:", error);
      });
  };

  const updateUserData = () => {
    axios
      .put(`http://localhost:4000/api/users/${user.result._id}`, editedUser)
      .then((response) => {
        setUser({ ...user, result: { ...user.result, ...editedUser } });
        setEditedUser({
          userName: "",
          state: 0,
          privacy: 0,
          instagram: "",
          twitter: "",
          facebook: "",
          linkedin: "",
          description: "",
          nationality: "",
          originCity: "",
          destCity: "",
          destUniversity: "",
          badge: "",
        });
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePicture(file);
  };

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(user));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("profile"));
      setUser(updatedUser);
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (isAdmin) {
    history("/");
  }

  return (
    <div className="container-fluid d-flex flex-column align-items-center mt-4">
      <div className="col-md-6" style={{ width: "300px" }}>
        <div className="d-flex flex-column align-items-center justify-content-center rounded-circle">
          {user.result.photo ? (
            <img
              src={`http://localhost:4000/imgs/users/${user.result._id}.png`}
              alt={user.result.userName}
              className="rounded-circle"
              width="120px"
              height="120px"
            />
          ) : (
            <div
              className="text-center rounded-circle d-flex align-items-center justify-content-center"
              style={{
                fontSize: "60px",
                color: "white",
                width: "120px",
                height: "120px",
                border: "3px solid white",
                backgroundColor:
                  user.result.state === 0
                    ? stateColors.zero
                    : user.result.state === 1
                    ? stateColors.one
                    : user.result.state === 2
                    ? stateColors.two
                    : user.result.state === 3
                    ? stateColors.three
                    : stateColors.zero,
              }}
            >
              {user.result.userName.charAt(0).toUpperCase()}
            </div>
          )}

          {isEditing && (
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
              />
            </div>
          )}

          {isEditing ? (
            <input
              type="text"
              className="form-control mt-2"
              name="userName"
              value={editedUser.userName}
              onChange={handleChange}
            />
          ) : (
            <h4 className="mt-3">{user.result.userName}</h4>
          )}

          <p className="text-secondary mt-2 mb-3">{user.result.email}</p>

          {isEditing ? (
            <>
              <h6> State</h6>

              <div className="input-group mb-3">
                <select
                  className="form-select"
                  id="state"
                  value={editedUser.state}
                  onChange={handleStateChange}
                >
                  <option
                    style={{
                      backgroundColor: stateColors.zero,
                      fontWeight: "bold",
                      color: "white",
                    }}
                    value="0"
                  >
                    Just having a look
                  </option>
                  <option
                    style={{
                      backgroundColor: stateColors.one,
                      fontWeight: "bold",
                      color: "white",
                    }}
                    value="1"
                  >
                    Searching for destination
                  </option>
                  <option
                    style={{
                      backgroundColor: stateColors.two,
                      fontWeight: "bold",
                      color: "white",
                    }}
                    value="2"
                  >
                    I have already got a destination
                  </option>
                  <option
                    style={{
                      backgroundColor: stateColors.three,
                      fontWeight: "bold",
                      color: "white",
                    }}
                    value="3"
                  >
                    Already in a destination
                  </option>
                </select>
                <label className="input-group-text"></label>
              </div>
            </>
          ) : (
            <span
              style={{
                backgroundColor:
                  user.result.state === 0
                    ? stateColors.zero
                    : user.result.state === 1
                    ? stateColors.one
                    : user.result.state === 2
                    ? stateColors.two
                    : user.result.state === 3
                    ? stateColors.three
                    : stateColors.zero,
                color: "white",
                fontWeight: "bold",
                fontSize: "14px",
                padding: "5px 10px",
                borderRadius: "20px",
              }}
            >
              {user.result.state === 1
                ? "Searching destination"
                : user.result.state === 2
                ? `Coming soon to ${user.result.destCity}`
                : user.result.state === 3
                ? `Living in ${user.result.destCity}`
                : "Just having a look"}
            </span>
          )}
        </div>
        <div className="row align-items-center mt-3">
          <div className="col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-instagram"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
            </svg>{" "}
            {isEditing ? (
              <input
                type="text"
                className="form-control"
                name="instagram"
                value={editedUser.instagram}
                onChange={handleChange}
              />
            ) : (
              user.result.instagram
            )}
          </div>
          <div className="col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-facebook"
              viewBox="0 0 16 16"
            >
              <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
            </svg>{" "}
            {isEditing ? (
              <input
                type="text"
                className="form-control"
                name="facebook"
                value={editedUser.facebook}
                onChange={handleChange}
              />
            ) : (
              user.result.facebook
            )}
          </div>
        </div>
        <div className="row justify-content-center mt-2">
          <div className="col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-twitter-x"
              viewBox="0 0 16 16"
            >
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
            </svg>{" "}
            {isEditing ? (
              <input
                type="text"
                className="form-control"
                name="twitter"
                value={editedUser.twitter}
                onChange={handleChange}
              />
            ) : (
              user.result.twitter
            )}
          </div>
          <div className="col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-linkedin"
              viewBox="0 0 16 16"
            >
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
            </svg>{" "}
            {isEditing ? (
              <input
                type="text"
                className="form-control"
                name="linkedin"
                value={editedUser.linkedin}
                onChange={handleChange}
              />
            ) : (
              user.result.linkedin
            )}
          </div>
        </div>
        <div></div>
      </div>
      <div className="row justify-content-center mt-2">
        <div className="col-12 mt-3" style={{ minWidth: "400px" }}>
          <h5>Description:</h5>
          {isEditing ? (
            <textarea
              className="form-control"
              name="description"
              value={editedUser.description}
              onChange={handleChange}
            />
          ) : (
            <p
              className="form-control"
              style={{ height: "200px", width: "100%", maxWidth: "700px" }}
            >
              {user.result.description}
            </p>
          )}
        </div>
      </div>
      <div className="row text-center mt-2">
        <div className="col-md-6">
          <div className="mb-3 d-flex flex-column align-items-center justify-content-center">
            <h6 style={{ width: "200px" }}>Country</h6>
            {isEditing ? (
              <CountryPicker onCountrySelect={handleCountryChange} />
            ) : (
              <div className="d-flex align-items-center">
                {selectedCountry && (
                  <img
                    className="mb-3 me-1"
                    src={`https://flagcdn.com/${selectedCountry}.svg`}
                    alt={`${selectedCountry} flag`}
                    style={{
                      width: "20px",
                      height: "20px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                )}
                <p>{countryName}</p>
              </div>
            )}
          </div>

          <div className="mb-3 d-flex flex-column align-items-center justify-content-center">
            <h6 style={{ width: "200px" }}> Origin City</h6>

            {isEditing ? (
              <>
                <input
                  type="text"
                  className="form-control mt-1"
                  name="originCity"
                  value={editedUser.originCity}
                  onChange={handleChangeInput}
                />
              </>
            ) : (
              <p>{user.result.originCity}</p>
            )}
          </div>

          {(user.result.state === 2 || user.result.state === 3) && (
            <div className="mb-3 d-flex flex-column align-items-center justify-content-center">
              <h6 style={{ width: "200px" }}>Destination</h6>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    className="form-control"
                    name="destCity"
                    value={editedUser.destCity}
                    onChange={handleChangeInput}
                  />
                </>
              ) : (
                <p>{user.result.destCity}</p>
              )}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <div className="mb-4">
            <h6>Privacy options</h6>
            {isEditing ? (
              <div
                className="input-group mb-3 justify-content-center"
                style={{ fontSize: "13px" }}
              >
                <div className="form-check form-check-inline mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="privacy"
                    value="0"
                    checked={privacy === 0}
                    onChange={() => handlePrivacyOptionChange(0)}
                  />
                  <label className="form-check-label">Public Profile</label>
                </div>
                <div className="form-check form-check-inline mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="privacy"
                    value="1"
                    checked={privacy === 1}
                    onChange={() => handlePrivacyOptionChange(1)}
                  />
                  <label className="form-check-label">Hide Contact Data</label>
                </div>
                <div className="form-check form-check-inline mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="privacy"
                    value="2"
                    checked={privacy === 2}
                    onChange={() => handlePrivacyOptionChange(2)}
                  />
                  <label className="form-check-label">Private Profile</label>
                </div>
              </div>
            ) : (
              <p>
                {user.result.privacy === 0
                  ? "Public Profile"
                  : user.result.privacy === 1
                  ? "Hide Contact Data"
                  : "Private Profile"}
              </p>
            )}
          </div>

          <div className="mb-4">
            <h6>Occupation</h6>
            {isEditing ? (
              <>
                <input
                  type="text"
                  className="form-control mt-1"
                  name="originCity"
                  value={editedUser.occupation}
                  onChange={handleChangeInput}
                />
              </>
            ) : (
              <p>{user.result.occupation}</p>
            )}
          </div>

          {(user.result.state === 2 || user.result.state === 3) && (
            <div className="mb-3 d-flex flex-column align-items-center justify-content-center">
              <h6 style={{ width: "200px" }}>Destination University</h6>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    className="form-control"
                    name="destUniversity"
                    value={editedUser.destUniversity}
                    onChange={handleChangeInput}
                  />
                </>
              ) : (
                <p>{user.result.destUniversity}</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="row justify-content-center mt-2">
        <div className="col">
          {isEditing ? (
            <button
              type="button"
              style={{
                fontWeight: "bold",
                backgroundColor: stateColors.one,
                color: "#ffffff",
              }}
              className="btn btn-warning form-control"
              onClick={handleSaveClick}
            >
              Save
            </button>
          ) : (
            <button
              type="submit"
              style={{
                fontWeight: "bold",
                backgroundColor: stateColors.one,
                color: "#ffffff",
              }}
              className="btn btn-warning form-control"
              onClick={handleEditClick}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
