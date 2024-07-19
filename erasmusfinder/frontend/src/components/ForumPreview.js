import React from 'react';
import { Link } from "react-router-dom";

const ForumPreview = ({ forum }) => {
  return (
    <div className="card mb-2" style={{ width: "75%" }}>
      <Link
        to={`/Forum/${forum._id}`}
        className="nav-link ml-3"
        key={forum._id}
      >
        <div className="card-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img 
              src={`http://localhost:4000/imgs/forums/${forum.url}`}
              alt="Forum" 
              className="rounded-circle mr-3" 
              style={{ width: "40px", height: "40px", marginRight: "10px" }} 
            />
            <h5 className="mb-0" style={{fontSize: `${25 - forum.title.length * 0.3}px`,}}>{forum.title}</h5>
          </div>
          <span>{forum.users.length} members</span>

          <span>{forum.threads.length} threads</span>
        </div>
      </Link>
    </div>
  );
}

export default ForumPreview;
