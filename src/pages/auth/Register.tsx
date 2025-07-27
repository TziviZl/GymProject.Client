import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { newGymnast, addMembershipType } from '../../api/gymnastApi';
import { MGymnast, MembershipTypeEnum } from '../../types';
import { sendVerificationCode, verifyCode } from '../../api/authApi';
import { useAuth } from '../../store/hooks';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { storage } from '../../utils/storage';
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
    const saved = storage.getMembershipType();
    return saved ? Number(saved) : MembershipTypeEnum.monthly_Standard;
  });

  const [error, setError] = useState('');
  const { message, messageType, showMessage, showError, handleError } = useErrorHandler();
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [code, setCode] = useState('');

  const membershipOptions = [
    { label: 'Monthly Standard', value: MembershipTypeEnum.monthly_Standard, price: '300 NIS' },
    { label: 'Monthly Pro', value: MembershipTypeEnum.monthly_Pro, price: '500 NIS' },
    { label: 'Yearly Standard', value: MembershipTypeEnum.yearly_Standard, price: '3,000 NIS' },
    { label: 'Yearly Pro', value: MembershipTypeEnum.yearly_Pro, price: '4,500 NIS' }
  ];

  useEffect(() => {
    if (location.state?.id) {
      setId(location.state.id);
    }
  }, [location.state?.id]);



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

    // Phone validation (9-10 digits)
    if (phone.length < 9 || phone.length > 10 || !/^\d+$/.test(phone)) {
      setError('Phone number must be 9-10 digits');
      return;
    }

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
          storage.setMembershipType(membershipType.toString());
        }
        showMessage('Registration successful!', 'success');
        setTimeout(() => navigate('/MyProfile'), 1500);
      } else {
        const text = res.data?.message || res.statusText || 'Registration Error';
        setError(text);
      }
    } catch (e: any) {
      setError(handleError(e));
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
          <label htmlFor="subscription">Membership Plan:</label>
          <select
            id="subscription"
            className="form-select"
            value={membershipType ?? ''}
            onChange={e => {
              const val = Number(e.target.value);
              setMembershipType(val);
              storage.setMembershipType(val.toString());
            }}
            required
            disabled={awaitingCode}
          >
            <option value="">Choose your membership plan</option>
            {membershipOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.price}
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
