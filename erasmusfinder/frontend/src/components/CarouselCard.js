import React from "react";
import { Link } from "react-router-dom";

import "../index.css";
import { cleanString } from "./utils";

function formatedName(name) {
  return name.toLowerCase().replace(/\s+/g, "");
}

export default function CarouselCard(dest) {
  return (
    <Link to={`/Destination/${dest.id}`} style={{ textDecoration: "none" }}>
      <div
        className="card text-center"
        id="custom_card"
        style={{
          marginLeft: "5px",
          fontFamily: "Cambria, serif",
          textDecoration: "none",
        }}
      >
        <img
          className=""
          style={{ height: "100px", objectFit: "cover" }}
          src={`${process.env.REACT_APP_API_URL}/imgs/frontpages/${cleanString(
            dest.name
          )}.png`}
          alt="Destination image"
        />
        <h2 style={{ fontSize: `${30 - dest.name.length * 0.3}px` }}>
          {dest.name}
        </h2>
      </div>
    </Link>
  );
}
