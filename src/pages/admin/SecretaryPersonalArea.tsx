import React from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import "../../css/SecretaryDashboard.css";

function SecretaryPersonalArea() {
  const navigate = useNavigate();

  return (
    <div className="secretary-dashboard">
      <h1>Secretary Personal Area</h1>

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

        <button onClick={() => navigate(ROUTES.MESSAGES)}>
          View Messages
        </button>

        <button onClick={() => navigate(ROUTES.LESSONS)}>
          View Lessons
        </button>
      </div>
    </div>
  );
}

export default SecretaryPersonalArea;