import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ image, title, body }) => {
  return (
    <li className="list-group-item">
      <div className="card">
        <div className="card-body">
          <h5 className="mt-0">{title}</h5>
          <p>{body}</p>
        </div>
      </div>
    </li>
  );
};

Notification.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default Notification;
