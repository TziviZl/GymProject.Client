import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { newGymnast, MGymnast, addMembershipType, MembershipTypeEnum } from '../../api/gymnastApi';
import { sendVerificationCode, verifyCode } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import ToastMessage from '../../components/shared/ToastMessage';
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

  const [membershipType, setMembershipType] = useState<MembershipTypeEnum | null>(() => {
    const saved = localStorage.getItem('membershipType');
    return saved ? Number(saved) : MembershipTypeEnum.monthly_Standard;
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [code, setCode] = useState('');

  const membershipOptions = Object.entries(MembershipTypeEnum)
    .filter(([key]) => isNaN(Number(key)))
    .map(([key, value]) => ({ label: key, value }));

  useEffect(() => {
    if (location.state?.id) {
      setId(location.state.id);
    }
  }, [location.state?.id]);

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setCode('');
    setAwaitingCode(false);

    try {
      await sendVerificationCode(phone);
      setAwaitingCode(true);
      showMessage('Verification code sent! Please enter it below.', 'success');
    } catch (e: any) {
      setError('Error sending verification code');
    }
  }

  async function handleVerifyCode() {
    if (!code) {
      setError('Please enter the verification code');
      return;
    }
    setError('');
    try {
      await verifyCode(phone, code);

      const newUser: MGymnast = {
        id,
        firstName,
        lastName,
        email,
        cell: phone,
        birthDate,
        medicalInsurance,
      };

      const res = await newGymnast(newUser);

      if (res.status === 200 || res.status === 201) {
        login(id, 'gymnast');
        if (membershipType !== null) {
          await addMembershipType(membershipType, id);
          localStorage.setItem('membershipType', membershipType.toString());
        }
        showMessage('Registration successful!', 'success');
        setTimeout(() => navigate('/MyProfile'), 1500);
      } else {
        const text = res.data?.message || res.statusText || 'Registration Error';
        setError(text);
      }
    } catch (e: any) {
      setError(e.response?.data || 'Communication error or incorrect data');
    }
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={awaitingCode ? (e) => e.preventDefault() : handleSubmit}>
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
              disabled={awaitingCode}
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
            disabled={awaitingCode}
          />
        </label>

        <label>
          Last name:
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            disabled={awaitingCode}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={awaitingCode}
          />
        </label>

        <label>
          Phone:
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            disabled={awaitingCode}
          />
        </label>

        <label>
          Date of birth:
          <input
            type="date"
            value={birthDate}
            onChange={e => setBirthDate(e.target.value)}
            required
            disabled={awaitingCode}
          />
        </label>

        <label>
          Medical insurance:
          <input
            type="text"
            value={medicalInsurance}
            onChange={e => setMedicalInsurance(e.target.value)}
            required
            disabled={awaitingCode}
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
              localStorage.setItem('membershipType', val.toString());
            }}
            required
            disabled={awaitingCode}
          >
            <option value="">Select a subscription</option>
            {membershipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.value} NIS
              </option>
            ))}
          </select>
        </div>

        {!awaitingCode && <button type="submit">Send Verification Code</button>}

        {awaitingCode && (
          <>
            <label>
              Verification Code:
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                maxLength={6}
                autoFocus
              />
            </label>
            <button type="button" onClick={handleVerifyCode}>
              Verify Code & Register
            </button>
          </>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      {message && <ToastMessage message={message} type={messageType} />}
    </div>
  );
}
