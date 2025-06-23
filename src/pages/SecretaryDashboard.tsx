import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/SecretaryDashboard.css"; // אם יש לך קובץ עיצוב, לא חובה

function SecretaryDashboard() {
  const navigate = useNavigate();

  return (
    <div className="secretary-dashboard">
      <h1>Welcome to the Secretary Dashboard</h1>

      <div className="dashboard-buttons">
        <button onClick={() => navigate("/ManageGymnasts")}>
          Manage Gymnasts
        </button>

        <button onClick={() => navigate("/ManageTrainers")}>
          Manage Trainers
        </button>

        <button onClick={() => navigate("/ManageClasses")}>
          Manage Classes
        </button>

        <button onClick={() => navigate("/AssignGymnastToClass")}>
          Assign Gymnast to Class
        </button>

        <button onClick={() => navigate("/RemoveGymnastFromClass")}>
          Remove Gymnast from Class
        </button>

        <button onClick={() => navigate("/Reports")}>
          Reports
        </button>
      </div>
    </div>
  );
}

export default SecretaryDashboard;
