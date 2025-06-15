import React from "react";
import { Link, Outlet } from "react-router-dom";
import "../../css/layout.css"; 
import "../../css/Class.css";


function Navbar() {
  return (
    <div>
      <nav className="navbar">
        <ul>
          <li><Link to="/">בית</Link></li>
          <li><Link to="/lessons">שיעורים</Link></li>
          <li><Link to="/contact">צור קשר</Link></li>
          <li><Link to="/blog">בלוג ספורט</Link></li>
          <li><Link to="/Login">אזור אישי</Link></li>
          <li><a href="#about">אודות</a></li> {/* קפיצה למטה בעמוד הבית */}
        </ul>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Navbar;