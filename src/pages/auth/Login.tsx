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
      if (!res.ok) {
        navigate('/Register', { state: { id } });
        return;
      }

      const user = await res.json();

      if (user.cell !== phone) {
        setError('מספר טלפון שגוי עבור משתמש זה');
        return;
      }

      const sendCodeRes = await fetch('http://localhost:5281/Auth/SendCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phone),
      });

      if (!sendCodeRes.ok) {
        setError('נכשל ניסיון שליחת קוד אימות');
        return;
      }

      const code = prompt('הכנס את קוד האימות שקיבלת בשיחת הטלפון (מודפס בקונסול השרת)');

      if (!code) {
        setError('יש להזין קוד אימות');
        return;
      }

      const verifyRes = await fetch('http://localhost:5281/Auth/VerifyCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      if (!verifyRes.ok) {
        setError('קוד אימות שגוי');
        return;
      }

      navigate('/MyProfile', { state: { user } });

    } catch (err) {
      console.error(err);
      setError('שגיאת תקשורת עם השרת');
    }
  }

  return (
    <div>
      <h1>כניסה</h1>
      <form onSubmit={handleSubmit}>
        <label>
          תעודת זהות:
          <input
            type="text"
            value={id}
            onChange={e => setId(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          טלפון:
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">המשך</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
