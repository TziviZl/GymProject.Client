import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { ROUTES, USER_TYPES } from "../../utils/constants";
import "../../css/layout.css";



function Navbar() {
  const { userId, userType, logout } = useAuth();
  const navigate = useNavigate();

  const handlePersonalAreaClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!userId || !userType) {
      navigate(ROUTES.LOGIN);
      return;
    }

    switch (userType) {
      case USER_TYPES.GYMNAST:
        navigate(ROUTES.MY_PROFILE);
        break;
      case USER_TYPES.TRAINER:
        navigate(ROUTES.TRAINER_PROFILE);
        break;
      case USER_TYPES.SECRETARY:
        navigate(ROUTES.SECRETARY_PERSONAL_AREA);
        break;
      default:
        navigate(ROUTES.LOGIN);
    }
  };

  return (
    <nav className="navbar">
      <ul>
        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to={ROUTES.HOME}>Home</Link>
        </motion.li>
        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to={ROUTES.LESSONS}>Lessons</Link>
        </motion.li>
        {userType === USER_TYPES.SECRETARY ? (
          <li><Link to={ROUTES.MESSAGES}>View Messages</Link></li>
        ) : (
          <li><Link to={ROUTES.CONTACT}>Contact</Link></li>
        )}
        <li><Link to={ROUTES.BLOG}>Blog</Link></li>
        <li><Link to={ROUTES.ABOUT}>About</Link></li>

        {/* Secretary - Full Access */}
        {userType === USER_TYPES.SECRETARY && (
          <>
            <li><Link to={ROUTES.MANAGE_GYMNASTS}>Manage Gymnasts</Link></li>
            <li><Link to={ROUTES.MANAGE_TRAINERS}>Manage Trainers</Link></li>
            <li><Link to={ROUTES.MANAGE_CLASSES}>Manage Classes</Link></li>
          </>
        )}

        {/* Personal Area - לא למזכירה */}
        {userType !== USER_TYPES.SECRETARY && (
          <li>
            <button className="nav-btn" onClick={handlePersonalAreaClick}>Personal Area</button>
          </li>
        )}

        {/* Logout */}
        {userId && (
          <li>
            <button className="logout-btn" onClick={() => {
              logout();
              navigate(ROUTES.HOME);
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
