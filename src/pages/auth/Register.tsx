import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { newGymnast, MGymnast, addMembershipType, MembershipTypeEnum } from '../../api/gymnastApi';
import { sendVerificationCode, verifyCode } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import '../../css/Register.css';

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialId = location.state?.id || '';
  const [id, setId] = useState(initialId);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [medicalInsurance, setMedicalInsurance] = useState('');
  
  // טען מה localStorage אם קיים, אחרת ברירת מחדל
  const [membershipType, setMembershipType] = useState<MembershipTypeEnum | null>(() => {
    const saved = localStorage.getItem('membershipType');
    return saved ? Number(saved) : MembershipTypeEnum.monthly_Standard;
  });
  
  const [error, setError] = useState('');

  const membershipOptions = Object.entries(MembershipTypeEnum)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ label: key, value }));

  useEffect(() => {
    if (location.state?.id) {
      setId(location.state.id);
    }
  }, [location.state?.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await sendVerificationCode(phone);
      const code = prompt('A verification code has been sent to your phone. Please enter the code:');
      if (!code) {
        setError('A verification code must be entered');
        return;
      }

      await verifyCode(phone, code);

      const newUser: MGymnast = {
        id,
        firstName,
        lastName,
        email,
        cell: phone,
        birthDate,
        medicalInsurance
      };

      const res = await newGymnast(newUser);

      if (res.status === 200 || res.status === 201) {
        login(id);
        if (membershipType !== null) {
          await addMembershipType(membershipType, id);
          // שמור ב־localStorage
          localStorage.setItem('membershipType', membershipType.toString());
        }
        alert('Registration Successfully');
        navigate('/MyProfile');
      } else {
        const text = res.data?.message || res.statusText || 'Registration Error';
        setError(text);
      }
    } catch (e: any) {
      console.error(e.response?.data || e.message || e);
      setError(e.response?.data || 'Communication error or incorrect data');
    }
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        {initialId ? (
          <p>ID: {id}</p>
        ) : (
          <label>
            ID:
            <input
              type="text"
              value={id}
              onChange={e => setId(e.target.value)}
              required
            />
          </label>
        )}

        <label>
          First name:
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </label>

        <label>
          Last name:
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Phone:
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
          />
        </label>

        <label>
          Date of birth:
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            required
          />
        </label>

        <label>
          Medical insurance:
          <input
            type="text"
            value={medicalInsurance}
            onChange={e => setMedicalInsurance(e.target.value)}
            required
          />
        </label>

        <div className="form-group">
          <label htmlFor="subscription">Subscription Type:</label>
          <select
            id="subscription"
            className="form-select"
            value={membershipType ?? ''}
            onChange={e => {
              const val = Number(e.target.value);
              setMembershipType(val);
              // עדכון גם ב־localStorage מיד עם שינוי
              localStorage.setItem('membershipType', val.toString());
            }}
            required
          >
            <option value="">Select a subscription</option>
            {membershipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.value} NIS
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Subscribe</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
