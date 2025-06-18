import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../../css/layout.css";

function Navbar() { 
const { gymnastId, logout } = useAuth(); 
const navigate = useNavigate(); 

const handlePersonalAreaClick = (e: React.MouseEvent) => { 
e.preventDefault(); 
navigate(gymnastId ? "/MyProfile" : "/Login"); 
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
{gymnastId && (
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