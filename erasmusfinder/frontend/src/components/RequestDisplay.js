import React, { useEffect, useState } from "react";
import axios from "axios";
import Request from "./Request";
import "../index.css";
import Tumbleweed from "./Tumbleweed";

const RequestDisplay = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/requests/`);
        setRequests(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div>
      <h5>Requests</h5>
      {requests.length === 0 ? (
        <div className="text-center">
            <Tumbleweed/>
        <p className="mt-2">No requests right now</p>
        </div>
      ) : (
        requests.map((request) => (
          <Request key={request.id} request={request} />
        ))
      )}
    </div>
  );
};

export default RequestDisplay;
