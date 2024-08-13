import React from 'react'
import { Link } from 'react-router-dom'

const DestinationPreview = ({destination}) => {
  return (
    <Link to={`/destination/${destination._id}`} style={{ textDecoration: 'none' }} >
    <div className='card p-1 d-flex flex-row align-items-center justify-content-center'>
    <img
        src={`https://flagcdn.com/${destination.iso}.svg`}
        alt={destination.country}
        style={{
          height: "20px",
          width: "20px",
          marginRight: "5px",
          borderRadius: "25%",
          objectFit: "cover",
        }}
      />
    <strong>{destination.name}
    </strong> - {destination.country}</div>
    </Link>

  )
}

export default DestinationPreview