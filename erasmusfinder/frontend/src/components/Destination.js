import React, { useState, useEffect } from "react";
import axios from "axios";

const Destination = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile")));
  const [destination, setDestination] = useState(null);
  const [following, setFollowing] = useState(false);

  //Fnución para actualizar los destinos seguidos dentro del usuario
  const updateUser = async (destinationId, following, userId, token) => {
    try {
      const updatedUser = following
        ? {
            followedDestinations: user.result.followedDestinations.filter(
              (dest) => dest !== destinationId
            ),
          }
        : {
            followedDestinations: [
              ...user.result.followedDestinations,
              destinationId,
            ],
          };

      await axios.put(
        `http://localhost:4000/api/users/${userId}`,
        updatedUser,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser((prevUser) => ({
        ...prevUser,
        result: {
          ...prevUser.result,
          followedDestinations: updatedUser.followedDestinations,
        },
      }));
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  //Fnución para actualizar los destinos seguidos dentro del usuario
  const updateDestination = async (destinationId, following, token) => {
    try {
      const resGet = await axios.get(
        `http://localhost:4000/api/dests/${destinationId}`
      );
      const dataDest = resGet.data;
      const newFollowers = following
        ? dataDest.n_users - 1
        : dataDest.n_users + 1;
      const newFollowersList = following
        ? dataDest.users.filter((userId) => userId !== user.result._id)
        : [...dataDest.users, user.result._id];

      const resPut = await axios.put(
        `http://localhost:4000/api/dests/${destinationId}`,
        {
          n_users: newFollowers,
          users: newFollowersList,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resPut.data) {
        throw new Error("No se pudo actualizar el destino");
      }

      setFollowing(!following);
    } catch (error) {
      console.error("Error al actualizar el destino:", error);
    }
  };

  const handleFollowToggle = async () => {
    const destinationId = window.location.pathname.split("/").pop();
    const token = user.token;
    const userId = user.result._id;

    await updateUser(destinationId, following, userId, token);
    await updateDestination(destinationId, following, token);

    const updatedDestination = {
      ...destination,
      n_users: following ? destination.n_users - 1 : destination.n_users + 1,
    };
    setDestination(updatedDestination);
  };

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
      return "#525252";
    } else {
      //Rojo
      return "#b81414";
    }
  };

  useEffect(() => {
    localStorage.setItem("profile", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    const getDestination = async () => {
      try {
        const destinationId = window.location.pathname.split("/").pop();

        const res = await fetch(
          `http://localhost:4000/api/dests/${destinationId}`,
          {
            method: "GET",
          }
        );
        if (!res.ok) {
          throw new Error("Error al obtener el destino");
        }
        const data = await res.json();
        setDestination(data);

        if (user && user.result.followedDestinations.includes(destinationId)) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getDestination();
  }, [user]);

  if (!destination) {
    return <div>Cargando destino...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <img
            className="mt-4"
            src={require(`../imgs/flags/${destination.country.toLowerCase()}.png`)}
            alt={destination.country}
            style={{ height: "50px", marginRight: "15px" }}
          />

          <div className="d-flex flex-column">
            <span
              className=""
              style={{
                fontSize: "50px",
                fontFamily: "Cambria, serif",
                fontWeight: "bold",
                marginBottom: "-15px",
              }}
            >
              {destination.name}
            </span>
            <span
              style={{
                fontSize: "30px",
                marginTop: "",
                fontFamily: "Cambria, serif",
              }}
              className=""
            >
              {destination.country}
            </span>
          </div>
        </div>

        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: getColorForScore(destination.mean_score),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: "30px", color: "#ffffff", fontWeight: "bold" }}
          >
            {destination.mean_score === -1 ? "-" : destination.mean_score}
          </span>
        </div>

        <div className="mt-3 d-flex flex-column justify-self-center align-items-center">
          <h5>{destination.n_users}</h5>
          <h5>seguidores</h5>
        </div>

        <button
          className="btn btn-warning"
          onClick={handleFollowToggle}
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            backgroundColor: following ? "#969696" : "#f5973d",
            color: "#ffffff",
            width: "200px",
          }}
        >
          {following ? "Dejar de seguir" : "Seguir"}
        </button>
      </div>

      <img
        src={require(`../imgs/frontpages/${destination.name.toLowerCase()}2.png`)}
        style={{ height: "400px", width: "100%", objectFit: "cover" }}
        alt={destination.name}
      />
      <p className="mt-3" style={{ margin: "0 auto" }}>
        {destination.description}
      </p>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <h4>Idiomas</h4>
            <p>{destination.languages.join(", ")}</p>
          </div>
          <div className="col-md-6">
            <h4>Nivel de coste de vida</h4>
            <p>{destination.cost_life}</p>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <h4>Superficie</h4>
            <p>{destination.surface}</p>
          </div>
          <div className="col-md-6 mt-3">
            <h4>Universidades</h4>

            <div className="btn-group">
              <button
                style={{ color: "black", backgroundColor: "white" }}
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="defaultDropdown"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
                aria-expanded="false"
              >
                Enlaces
              </button>
              <ul className="dropdown-menu" aria-labelledby="defaultDropdown">
                {destination.universities.map((university, index) => (
                  <li key={index}>
                    <a
                      className="dropdown-item"
                      href={university.url}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img
                        src={university.logo}
                        alt={university.name}
                        className="mr-4"
                        width="30"
                        height="30"
                        style={{ borderRadius: "5px" }}
                      />
                      <span style={{ marginLeft: "8px" }}>
                        {university.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <h4>Clima</h4>
            <ul>
              <li>
                <strong>Tipo: </strong>
                {destination.clima.general}
              </li>
              <li>
                <strong>Verano: </strong>
                {destination.clima.summer}
              </li>
              <li>
                <strong>Invierno:</strong>
                {destination.clima.winter}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destination;
