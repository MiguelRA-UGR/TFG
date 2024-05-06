import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as actionType from "../constants/actionTypes";
import { jwtDecode } from "jwt-decode";

const Navegation = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const dispatch = useDispatch();
  const history = useNavigate();
  const location = useLocation();

  const renderAvatarContent = () => {
    if (user.result.photo) {
      return (
        <img
          src={require(`../imgs/users/${user.result.userName.toLowerCase()}.png`)}
          alt={user.result.userName}
          style={{ width: "35px", height: "35px" }}
          className="avatar rounded-circle"
        />
      );
    } else {
      const firstLetter = user?.result.userName.charAt(0).toUpperCase();
      return (
        <div
          className="avatar rounded-circle text-center"
          style={{
            fontSize: "25px",
            color: "white",
            width: "35px",
            height: "35px",
            lineHeight: "35px",
            backgroundColor:
                                user.result.state === 0
                                  ? "transparent"
                                  : user.result.state === 1
                                  ? "#f5973d" // Naranja
                                  : user.result.state === 2
                                  ? "#6691c3" // Azul
                                  : user.result.state === 3
                                  ? "#61bdb8" // Aguamarina
                                  : "#969696" //Gris
          }}
        >
          {firstLetter}
        </div>
      );
    }
  };

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history("/");

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = jwtDecode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <Link
            className="navbar-brand"
            to="/"
            style={{
              fontSize: "40px",
              fontFamily: "Cambria, serif",
              fontWeight: "bold",
            }}
          >
            <span style={{ color: "#000000" }}>Erasmus</span>
            <span style={{ color: "#f5973d" }}>Finder</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse"
            id="navbarNav"
            style={{ textAlign: "right" }}
          >
            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  <li className="nav-item ms-auto">
                    <Link
                      className="nav-link d-flex align-items-center"
                      to="/Profile"
                  
                    >
                      {renderAvatarContent()}

                      <span
                        className="navlink ms-2 font-weight-bold"
                        style={{ fontSize: "22px" }}
                      >
                        Profile
                      </span>
                    </Link>
                  </li>

                  <li className="nav-item active ms-auto">
                    <Link
                      className="nav-link ml-5 d-flex align-items-center"
                      to="/Notifications"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        fill="currentColor"
                        className="bi bi-envelope-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                      </svg>

                      <span
                        className="navlink ms-2 font-weight-bold"
                        style={{ fontSize: "22px" }}
                      >
                        Notifications
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item mt-1">
                    <button
                      onClick={logout}
                      className="btn btn-warning"
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        backgroundColor: "#969696",
                        color: "#ffffff",
                      }}
                    >
                      Log Out
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link ml-3" to="/SignUp">
                    <button
                      className="btn btn-warning"
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        backgroundColor: "#f5973d",
                        color: "#ffffff",
                      }}
                    >
                      Log In
                    </button>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navegation;
