import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ToastMessage from '../../components/shared/ToastMessage';
import '../../css/Login.css';

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
      const res = await fetch(`http://localhost:5281/api/Gymnast/GetGymnastById?id=${encodeURIComponent(id)}`);
      if (!res.ok) {
        setError('User not found, please register');
        navigate('/Register', { state: { id } });
        return;
      }

      const user = await res.json();
      if (user.cell !== phone) {
        setError('Invalid phone number for this user');
        return;
      }

      const sendCodeRes = await fetch('http://localhost:5281/Auth/SendCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phone),
      });

      if (!sendCodeRes.ok) {
        setError('Error sending verification code');
        return;
      }

      setAwaitingCode(true);
      showMessage('Verification code sent! Please enter it below.', 'success');
    } catch {
      setError('General error, please try again');
    }
  }

  async function handleVerifyCode() {
    if (!code) {
      setError('Please enter the verification code');
      return;
    }
    setError('');
    try {
      const verifyRes = await fetch('http://localhost:5281/Auth/VerifyCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      if (!verifyRes.ok) {
        setError('Incorrect verification code');
        return;
      }

      login(id);
      navigate('/MyProfile');
    } catch {
      setError('Failed to verify code');
    }
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input type="text" value={id} onChange={e => setId(e.target.value)} required disabled={awaitingCode} />
        </div>
        <div>
          <label>Phone:</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required disabled={awaitingCode} />
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
