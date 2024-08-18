import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { stateColors } from "./utils";
import DeleteButton from "./DeleteButton";
import { deleteRequest } from "../actions/request";
import { useDispatch } from "react-redux";
import axios from 'axios';  // Importa axios para las solicitudes
import DestinationPreview from "./DestinationPreview";

const Request = ({ request }) => {
  const [userName, setUserName] = useState("");
  const [reportedUserName, setReportedUserName] = useState("");
  const [destination, setDestination] = useState(null); // Nuevo estado para el destino
  const formattedDate = new Date(request.createdAt).toLocaleString();
  const dispatch = useDispatch();

  // Función para manejar la eliminación de una solicitud
  const handleDelete = () => {
    dispatch(deleteRequest(request._id));
    window.location.reload();
  };

  // Callback para obtener el nombre del usuario reportado
  const userReportedCallBack = (name) => {
    setReportedUserName(name);
  };

  // Callback para obtener el nombre del usuario
  const userNameCallBack = (name) => {
    setUserName(name);
  };

  // Obtener el tipo de solicitud con su color
  const getRequestType = (type) => {
    switch (type) {
      case 0:
        return { label: "Destination Request", color: stateColors.three };
      case 1:
        return { label: "Destination Change Request", color: stateColors.two };
      case 2:
        return { label: "Report", color: stateColors.one  };
      default:
        return { label: "Other", color: stateColors.zero };
    }
  };

  const requestType = getRequestType(request.type);

  // Obtén la información del destino cuando se monta el componente
  useEffect(() => {
    if (request.destination) {
      const fetchDestination = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dests/${request.destination}`);
          setDestination(response.data);
        } catch (error) {
          console.error("Error fetching destination:", error);
        }
      };

      fetchDestination();
    }
  }, [request.destination]);

  return (
    <div className="m-1 card p-3 d-flex flex-column align-items-start">
      <span className="badge mb-2" style={{ backgroundColor: requestType.color }}>
        {requestType.label}
      </span>

      <div className="d-flex align-items-center mb-2">
        <Avatar
          userId={request.user}
          outerSize="40px"
          innerSize="30px"
          flagSize="1px"
          userName={userNameCallBack}
        />
        <h6 className="m-2 font-weight-bold">{userName}</h6>
      </div>

      {destination && (
        <div className="mt-2">
          <span className="text-secondary">Destination:</span>{" "}

          <DestinationPreview destination={destination}/>
        </div>
      )}

      {request.reported && (
        <div className="mt-2 d-flex align-items-center">
          <span className="text-secondary">Reported User:</span>{" "}
          <div className="m-1 d-flex">
            <Avatar
              userId={request.reported}
              outerSize="35px"
              innerSize="25px"
              flagSize="0px"
              userName={userReportedCallBack}
            />
            <span className="m-2 font-weight-bold">{reportedUserName}</span>
          </div>
        </div>
      )}

      <span className="text-secondary m-1">{request.comment}</span>

      <div className="mt-auto">
        <span className="text-muted">{formattedDate}</span>
      </div>

      <DeleteButton handleDelete={handleDelete} />
    </div>
  );
};

export default Request;
