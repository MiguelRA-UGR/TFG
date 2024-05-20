import React, { useEffect, useState } from 'react';
import Notification from './Notification';
import ContactRequest from './ContactRequest';
import axios from 'axios';

const Notifications = () => {
  const [forums, setForums] = useState([]);
  const [requests, setRequests] = useState([]);
  const [incomingContactRequest, setIncomingContactRequest] = useState([]);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("profile"));

        const response = await axios.get(`http://localhost:4000/api/users/${storedUser.result._id}`);
        setUser(response.data);
        setUserId(response.data?._id);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    setForums([
      { image: 'https://via.placeholder.com/64', title: 'Forum 1', body: 'Body of Forum 1' },
      { image: 'https://via.placeholder.com/64', title: 'Forum 2', body: 'Body of Forum 2' },
      { image: 'https://via.placeholder.com/64', title: 'Forum 3', body: 'Body of Forum 3' }
    ]);

    setRequests([
      { image: 'https://via.placeholder.com/64', title: 'Request 1', body: 'Body of Request 1' },
      { image: 'https://via.placeholder.com/64', title: 'Request 2', body: 'Body of Request 2' },
      { image: 'https://via.placeholder.com/64', title: 'Request 3', body: 'Body of Request 3' }
    ]);

    const fetchIncomingContacts = async () => {
      if (userId && user?.incomingContactRequest?.length > 0) {
        try {
          const incomingContactsData = await Promise.all(
            user.incomingContactRequest.map(async (requestId) => {
              const response = await axios.get(`http://localhost:4000/api/users/${requestId}`);
              return {
                ...response.data,
                id: requestId,
              };
            })
          );
          setIncomingContactRequest(incomingContactsData);
        } catch (error) {
          console.error('Error al recuperar los datos del usuario:', error);
        }
      }
    };

    fetchIncomingContacts();
  }, [userId, user]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 justify-content-center text-center">
          <h3>Contact Requests</h3>
          <ul className="list-group">
            {incomingContactRequest.map((contact, index) => (
              <ContactRequest
                key={index}
                user={userId}
                userRequest={contact}
              />
            ))}
          </ul>
        </div>
        <div className="col-md-4 text-center">
          <h3>Forums</h3>
          <ul className="list-group">
            {forums.map((forum, index) => (
              <Notification key={index} image={forum.image} title={forum.title} body={forum.body} />
            ))}
          </ul>
        </div>
        <div className="col-md-4 text-center">
          <h3>Others</h3>
          <ul className="list-group">
            {requests.map((request, index) => (
              <Notification key={index} image={request.image} title={request.title} body={request.body} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
