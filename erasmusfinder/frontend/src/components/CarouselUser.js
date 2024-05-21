import React from "react";
import { Link } from "react-router-dom";
import Avatar from './Avatar.js'

import "../index.css";

export default function User(user) {
  return (
    <Link to={`/User/${user._id}`} style={{ textDecoration: "none" }}>
      <div
        className="card text-center"
        id="custom_card"
        style={{
          marginLeft: "5px",
          fontFamily: "Cambria, serif",
          textDecoration: "none",
          width: "100px",
          height: "120px",
        }}
      >

        <Avatar user={user}
          outerSize="60px"
          innerSize="50px"
          flagSize="20px">
        </Avatar>

        <h5>{user.userName}</h5>
      </div>
    </Link>
  );
}
