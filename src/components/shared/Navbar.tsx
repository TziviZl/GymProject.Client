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

    switch (userType) {
      case "gymnast":
        navigate("/MyProfile");
        break;
      case "trainer":
        navigate("/TrainerProfile");
        break;
      case "secretary":
        navigate("/SecretaryDashboard");
        break;
      default:
        navigate("/Login");
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/lessons">Lessons</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/about">About</Link></li>

        {/* Secretary - Full Access */}
        {userType === "secretary" && (
          <>
            {/* <li><Link to="/SecretaryDashboard">Dashboard</Link></li> */}
            <li><Link to="/ManageGymnasts">Manage Gymnasts</Link></li>
            <li><Link to="/ManageTrainers">Manage Trainers</Link></li>
            <li><Link to="/ManageClasses">Manage Classes</Link></li>
            <li><Link to="/AssignGymnastToClass">Assign Gymnast to Class</Link></li>
            <li><Link to="/RemoveGymnastFromClass">Remove Gymnast from Class</Link></li>
            <li><Link to="/Reports">Reports</Link></li>
          </>
        )}

        {/* Personal Area */}
        <li>
          <a href="#" onClick={handlePersonalAreaClick}>Personal Area</a>
        </li>

        {/* Logout */}
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
      </ul>
    </nav>
  );
}

export default Navbar;
