// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`http://localhost:5281/Gymnast/GetGymnastById?id=${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
            
          // משתמש קיים - נעבור לאזור אישי
        navigate('/MyProfile', { state: { user: data } });
        } else {
          // משתמש לא קיים - נעבור לדף רישום עם ת"ז
          navigate('/Register', { state: { id } });
        }
      } else if (res.status === 400) {
          navigate('/Register', { state: { id } });
      } else {
        setError('שגיאה בשרת');
      }
    } catch (e) {
      setError('שגיאת תקשורת עם השרת');
    }
  }

  return (
    <div>
      <h1>כניסה</h1>
      <form onSubmit={handleSubmit}>
        <label>
          תעודת זהות:
          <input type="text" value={id} onChange={e => setId(e.target.value)} required />
        </label>
        <br />
        <label>
          טלפון:
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
        </label>
        <br />
        <button type="submit">המשך</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
  );
}
