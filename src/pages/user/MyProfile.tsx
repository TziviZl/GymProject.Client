// src/pages/Profile.tsx
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';

export default function MyProfile() {
  const location = useLocation();
  const user = location.state?.user;

  // אם אין משתמש ב־state, אפשר להפנות לדף הכניסה מחדש
  if (!user) {
    return (
      <div>
        <p>אין מידע משתמש, יש להתחבר מחדש.</p>
        {/* אפשר להחזיר ל-login אוטומטית או ללחצן */}
        {/* <Navigate to="/Login" replace /> */}
      </div>
    );
  }

  // Debug - לוג של המשתמש
  console.log('MyProfile user:', user);

return (
  <div>
    <h1>שלום, {user.firstName || user.id}</h1>
    <p>תעודת זהות: {user.id}</p>
    <p>אימייל: {user.email}</p>
    <p>טלפון: {user.cell}</p>
    <p>שם משפחה: {user.lastName}</p>
    <p>שם פרטי: {user.firstName}</p>
    <p>ברוך הבא לאזור האישי שלך!</p>
    {/* כאן אפשר להוסיף עוד מידע או אפשרויות למשתמש */} 
        
  </div>
);
}
