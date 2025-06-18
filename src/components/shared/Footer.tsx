// components/shared/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import "../../css/Footer.css"; // Assuming you have a CSS file for styling the footer

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📍 Location: 123 Fitness Street, Tel Aviv</p>
          <p>📞 Phone: 03-5551234</p>
          <p>📧 Email: info@fitnesspro.co.il</p>
        </div>

        <div className="footer-section">
          <h3>Opening Hours</h3>
          <p>Sunday - Thursday: 06:00–22:00</p>
          <p>Friday: 06:00–14:00</p>
          <p>Saturday: Closed</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/lessons">Lessons</Link>
            <Link to="/blog">Blog</Link>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        💪 "Train smart. Feel stronger. Live better." <br />
        &copy; {new Date().getFullYear()} FitnessPro Gym
      </div>
    </footer>
  );
}
