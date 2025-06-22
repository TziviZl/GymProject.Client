import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../../css/layout.css";

function Navbar() { 
  const { userId, userType, logout } = useAuth(); 
  const navigate = useNavigate(); 

  const handlePersonalAreaClick = (e: React.MouseEvent) => { 
    e.preventDefault(); 

    if (!userId || !userType) {
      navigate("/Login");
      return;
    }

    // נניח שיש לך נתיבי URL נפרדים לפרופיל של מתאמן ופרופיל של מאמן
    if (userType === "gymnast") {
      navigate("/MyProfile"); // או "/GymnastProfile" אם יש לך כזה
    } else if (userType === "trainer") {
      navigate("/TrainerProfile");
    } else {
      // אפשרות ברירת מחדל או התייחסות למזכירה או אחרים
      navigate("/Login");
    }
  }; 

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/lessons">Lessons</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/blog">Sports Blog</Link></li>

        {/* Personal Area - Always Shown */}
        <li>
          <a href="#" onClick={handlePersonalAreaClick}>Personal Area</a>
        </li>

        {/* Logout Button - Only If Logged In */}
        {userId && (
          <li>
            <button className="logout-btn" onClick={() => {
              logout();
              navigate("/");
            }}>
              Logout
            </button>
          </li>
        )}
        <li><Link to="/about">About</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
