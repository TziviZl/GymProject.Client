import { useAuth } from "../../store/hooks";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import { ROUTES, USER_TYPES } from "../../utils/constants";
import "../../css/layout.css";



function Navbar() {
  const { userId, userType, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
          <Link to={ROUTES.HOME} className={location.pathname === ROUTES.HOME ? 'active' : ''}>Home</Link>
        </motion.li>
        <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to={ROUTES.LESSONS} className={location.pathname === ROUTES.LESSONS ? 'active' : ''}>Lessons</Link>
        </motion.li>
        {userType === USER_TYPES.SECRETARY ? (
          <li><Link to={ROUTES.MESSAGES} className={location.pathname === ROUTES.MESSAGES ? 'active' : ''}>View Messages</Link></li>
        ) : (
          <li><Link to={ROUTES.CONTACT} className={location.pathname === ROUTES.CONTACT ? 'active' : ''}>Contact</Link></li>
        )}
        <li><Link to={ROUTES.BLOG} className={location.pathname === ROUTES.BLOG ? 'active' : ''}>Blog</Link></li>
        <li><Link to={ROUTES.ABOUT} className={location.pathname === ROUTES.ABOUT ? 'active' : ''}>About</Link></li>

        {/* Secretary - Full Access */}
        {userType === USER_TYPES.SECRETARY && (
          <>
            <li><Link to={ROUTES.MANAGE_GYMNASTS} className={location.pathname === ROUTES.MANAGE_GYMNASTS ? 'active' : ''}>Manage Gymnasts</Link></li>
            <li><Link to={ROUTES.MANAGE_TRAINERS} className={location.pathname === ROUTES.MANAGE_TRAINERS ? 'active' : ''}>Manage Trainers</Link></li>
            <li><Link to={ROUTES.MANAGE_CLASSES} className={location.pathname === ROUTES.MANAGE_CLASSES ? 'active' : ''}>Manage Classes</Link></li>
          </>
        )}

        {/* Personal Area - לא למזכירה */}
        {userType !== USER_TYPES.SECRETARY && (
          <li>
            <button className={`nav-btn ${(
              location.pathname === ROUTES.MY_PROFILE || 
              location.pathname === ROUTES.TRAINER_PROFILE || 
              location.pathname === ROUTES.SECRETARY_PERSONAL_AREA
            ) ? 'active' : ''}`} onClick={handlePersonalAreaClick}>Personal Area</button>
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
