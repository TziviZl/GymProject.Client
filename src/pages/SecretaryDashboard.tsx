import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import "../css/SecretaryDashboard.css";

function SecretaryDashboard() {
  const navigate = useNavigate();

  return (
    <div className="secretary-dashboard">
      <h1>Welcome to the Secretary Dashboard</h1>

      <div className="dashboard-buttons">
        <button onClick={() => navigate(ROUTES.MANAGE_GYMNASTS)}>
          Manage Gymnasts
        </button>

        <button onClick={() => navigate(ROUTES.MANAGE_TRAINERS)}>
          Manage Trainers
        </button>

        <button onClick={() => navigate(ROUTES.MANAGE_CLASSES)}>
          Manage Classes
        </button>
      </div>
    </div>
  );
}

export default SecretaryDashboard;
