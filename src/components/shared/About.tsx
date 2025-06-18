import React from 'react';
import '../../css/About.css';

export default function About() {
  return (
    <div className="about-grid-container">
      <h1>About Us</h1>
      <p className="about-intro">
        We're dedicated to helping you live a stronger, healthier, and more energized life through fitness, nutrition, and community.
      </p>

      <div className="about-grid">
        <div className="about-card">
          <h2>💡 Our Vision</h2>
          <p>
            To make wellness accessible and enjoyable for everyone — from beginners to pros. We combine knowledge, motivation, and modern tools to guide your journey.
          </p>
        </div>

        <div className="about-card">
          <h2>🧭 What We Believe</h2>
          <p>
            Fitness is more than workouts. It’s mindset, community, habits, and joy. We promote balance between strength, recovery, and lifestyle.
          </p>
        </div>

        <div className="about-card">
          <h2>🤝 Join Us</h2>
          <p>
            Be part of our growing community! Read our blog, share your progress, and grow with us on this exciting path.
          </p>
        </div>
      </div>
    </div>
  );
}
