import React, { useState, useEffect } from 'react';
import '../css/SportBlog.css';

export default function Blog() {
  const articles = [
    {
      title: "The Power of Regular Exercise",
      content: `Regular physical activity enhances cardiovascular health, boosts metabolism, and supports weight management...`,
    },
    {
      title: "How to Stay Committed to Your Fitness Goals",
      content: `Consistency is key. Start with realistic goals...`,
    },
    {
      title: "Nutrition: The Other Half of Fitness",
      content: `Fueling your body with a balanced diet is essential...`,
    },
    {
      title: "Group Workouts: The Motivation Multiplier",
      content: `Exercising in a group setting boosts motivation...`,
    },
    {
      title: "Why Recovery is Essential",
      content: `Rest days are crucial. Your muscles need time to repair...`,
    },
    {
      title: "Mind and Body Connection in Fitness",
      content: `Mental health is just as important as physical health...`,
    },
  ];

  const [favorites, setFavorites] = useState<boolean[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);

  // טוען את מצב הלבבות מה-LocalStorage בעת הטעינה
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteArticles');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    } else {
      setFavorites(Array(articles.length).fill(false));
    }
  }, []);

  // שומר ל-localStorage בכל שינוי
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('favoriteArticles', JSON.stringify(favorites));
    }
  }, [favorites]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, articles.length));
  };

  const toggleFavorite = (index: number) => {
    const updatedFavorites = [...favorites];
    updatedFavorites[index] = !updatedFavorites[index];
    setFavorites(updatedFavorites);
  };

  return (
    <div className="blog-grid-container">
      <h1>Fitness & Wellness Blog</h1>

      <div className="blog-grid">
        {articles.slice(0, visibleCount).map((article, index) => (
          <div key={index} className="blog-card">
            <h2>{article.title}</h2>
            <p>{article.content}</p>
            <div className="feedback-section">
              <button
                className={favorites[index] ? 'favorite' : ''}
                aria-label={favorites[index] ? "Unfavorite article" : "Favorite article"}
                onClick={() => toggleFavorite(index)}
              >
                {favorites[index] ? '❤️' : '🤍'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < articles.length && (
        <div className="load-more-container">
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      )}
    </div>
  );
}
