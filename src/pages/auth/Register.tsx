import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialId = location.state?.id || '';
  const [id] = useState(initialId);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [medicalInsurance, setMedicalInsurance] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    // שלב 1: שליחת קוד אימות לפלאפון (יודפס בקונסול)
    try {
      const sendRes = await fetch('http://localhost:5281/Auth/SendCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phone),
      });

      if (!sendRes.ok) {
        setError('שליחת קוד אימות נכשלה');
        return;
      }

      // שלב 2: בקשת קוד מהמשתמש
      const code = prompt('קוד אימות נשלח לטלפון (בדוק בקונסול). אנא הזן את הקוד:');
      if (!code) {
        setError('יש להזין קוד אימות');
        return;
      }

      // שלב 3: אימות הקוד מול השרת
      const verifyRes = await fetch('http://localhost:5281/Auth/VerifyCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      if (!verifyRes.ok) {
        setError('קוד אימות שגוי');
        return;
      }

      // שלב 4: הרשמה בפועל
      const newUser = {
        ID: id,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Cell: phone,
        BirthDate: birthDate,
        MedicalInsurance: medicalInsurance
      };

      const res = await fetch('http://localhost:5281/Gymnast/NewGymnast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        // שליפת המשתמש
        const getRes = await fetch(`http://localhost:5281/Gymnast/GetGymnastById?id=${encodeURIComponent(id)}`);
        if (getRes.ok) {
          const userFromServer = await getRes.json();
          alert('הרשמה בוצעה בהצלחה');
          navigate('/MyProfile', { state: { user: userFromServer } });
        } else {
          setError('ההרשמה הצליחה אך לא ניתן היה להביא את פרטי המשתמש מהשרת');
        }
      } else {
        const text = await res.text();
        setError(text || 'שגיאה בהרשמה');
      }
    } catch (e) {
      console.error(e);
      setError('שגיאת תקשורת עם השרת');
    }
  }

  return (
    <div>
      <h1>הרשמה</h1>
      <form onSubmit={handleSubmit}>
        <p>תעודת זהות: {id}</p>

        <label>
          שם פרטי:
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        </label>
        <br />

        <label>
          שם משפחה:
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
        </label>
        <br />

        <label>
          אימייל:
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </label>
        <br />

        <label>
          טלפון:
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
        </label>
        <br />

        <label>
          תאריך לידה:
          <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required />
        </label>
        <br />

        <label>
          ביטוח רפואי:
          <input type="text" value={medicalInsurance} onChange={e => setMedicalInsurance(e.target.value)} required />
        </label>
        <br />

        <button type="submit">הרשם</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
