import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ToastMessage from '../../components/shared/ToastMessage';
import { sendVerificationCode, verifyCode, getUserType } from '../../api/authApi';
import { getGymnastById } from '../../api/gymnastApi';
import { getTrainerById } from '../../api/trainerApi';
import '../../css/Login.css';

type UserType = 'gymnast' | 'trainer' | 'secretary';

export default function Login() {
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [code, setCode] = useState('');
  const [awaitingCode, setAwaitingCode] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

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
      const typeRes = await getUserType(id);
      const userTypeRaw = typeRes.data?.toLowerCase().trim();

      if (!userTypeRaw || !['gymnast', 'trainer', 'secretary'].includes(userTypeRaw)) {
        setError('User not found. Please register.');
        navigate('/Register', { state: { id } });
        return;
      }

      const userType = userTypeRaw as UserType;
      let user: any;

      if (userType === 'gymnast') {
        const res = await getGymnastById(id);
        user = res.data;
      } else if (userType === 'trainer') {
        const res = await getTrainerById(id);
        user = res.data;
      } else if (userType === 'secretary') {
        user = { cell: phone }; // מזכירה – לא שומרת מידע בשרת, משתמשים במספר טלפון בלבד
      }

      if (!user) {
        setError('User data not found.');
        return;
      }

      if (user.cell !== phone) {
        setError('Phone number does not match our records.');
        return;
      }

      await sendVerificationCode(phone);
      setAwaitingCode(true);
      showMessage('Verification code sent. Please enter it below.');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 404) {
        navigate('/Register', { state: { id } });
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  }

  async function handleVerifyCode() {
    if (!code) {
      setError('Please enter the verification code.');
      return;
    }

    setError('');

    try {
      await verifyCode(phone, code);

      const typeRes = await getUserType(id);
      const userTypeRaw = typeRes.data?.toLowerCase().trim();
      const userType = userTypeRaw as UserType;

      if (!userType || !['gymnast', 'trainer', 'secretary'].includes(userType)) {
        setError('Could not identify user type.');
        return;
      }

      login(id, userType);

      // ניווט לפי סוג המשתמש
      switch (userType) {
        case 'trainer':
          navigate('/TrainerProfile');
          break;
        case 'secretary':
          navigate('/SecretaryDashboard'); // ← תיקון
          break;
        case 'gymnast':
        default:
          navigate('/MyProfile');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Incorrect verification code or server error.');
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            value={id}
            onChange={e => setId(e.target.value)}
            required
            disabled={awaitingCode}
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            disabled={awaitingCode}
          />
        </div>

        {!awaitingCode && <button type="submit">Send Verification Code</button>}

        {awaitingCode && (
          <>
            <div>
              <label>Verification Code:</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                autoFocus
                maxLength={6}
              />
            </div>
            <button type="button" onClick={handleVerifyCode}>Verify Code</button>
          </>
        )}
      </form>

      {error && <div className="error">{error}</div>}
      {message && <ToastMessage message={message} type={messageType} />}
    </div>
  );
}
