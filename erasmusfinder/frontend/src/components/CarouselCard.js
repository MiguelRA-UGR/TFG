import React from "react";
import { Link } from "react-router-dom";

import '../index.css';

function formatedName(name) {
    return name.toLowerCase().replace(/\s+/g, '');
}

export default function Product(dest) {
  return (
    <Link to={`/Destination/${dest.id}`} style={{ textDecoration: 'none'}}>
        <div className="card text-center" id="custom_card" style={{marginLeft:"5px", fontFamily: "Cambria, serif", textDecoration:"none"}}>
        <img className="" style={{height:"100px", objectFit:"cover"}} src={`http://localhost:4000/imgs/frontpages/${formatedName(dest.name)}2.png`} alt="Destination image" />
        <h2>{dest.name}</h2>
        </div>
    </Link>
    
  );
}