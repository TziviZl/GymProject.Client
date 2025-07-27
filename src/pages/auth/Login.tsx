import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/hooks';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import ToastMessage from '../../components/shared/ToastMessage';
import { sendVerificationCode, verifyCode, getUserType } from '../../api/authApi';
import { getGymnastById } from '../../api/gymnastApi';
import { getTrainerById } from '../../api/trainerApi';
import { ROUTES, USER_TYPES } from '../../utils/constants';
import '../../css/Login.css';

type UserType = 'gymnast' | 'trainer' | 'secretary';

export default function Login() {
  const [id, setId] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { message, messageType, showMessage, showError, handleError } = useErrorHandler();
  const [code, setCode] = useState('');
  const [awaitingCode, setAwaitingCode] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();



  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setCode('');
    setAwaitingCode(false);

    // ID validation
    if (id.length < 9) {
      setError('ID must be at least 9 digits');
      return;
    }

    // Phone validation (9-10 digits for secretary)
    if (phone.length < 9 || phone.length > 10 || !/^\d+$/.test(phone)) {
      setError('Phone number must be 9-10 digits');
      return;
    }

    try {
      const typeRes = await getUserType(id);
      const userTypeRaw = typeRes.data?.toLowerCase().trim();

      if (!userTypeRaw || !Object.values(USER_TYPES).includes(userTypeRaw as any)) {
        setError('User not found. Please register.');
        navigate(ROUTES.REGISTER, { state: { id } });
        return;
      }

      const userType = userTypeRaw as UserType;
      let user: any;

      if (userType === USER_TYPES.GYMNAST) {
        const res = await getGymnastById(id);
        user = res.data;
      } else if (userType === USER_TYPES.TRAINER) {
        const res = await getTrainerById(id);
        user = res.data;
      } else if (userType === USER_TYPES.SECRETARY) {
        user = { cell: phone };
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
      showMessage('Verification code sent. Please enter it below.', 'success');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response?.status === 404) {
        navigate(ROUTES.REGISTER, { state: { id } });
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

      if (!userType || !Object.values(USER_TYPES).includes(userType as any)) {
        setError('Could not identify user type.');
        return;
      }

      login(id, userType);

      switch (userType) {
        case USER_TYPES.TRAINER:
          navigate(ROUTES.TRAINER_PROFILE);
          break;
        case USER_TYPES.SECRETARY:
          navigate(ROUTES.LESSONS);
          break;
        case USER_TYPES.GYMNAST:
        default:
          navigate(ROUTES.MY_PROFILE);
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(handleError(error));
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
