import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() { 
const [id, setId] = useState(''); 
const [phone, setPhone] = useState(''); 
const [error, setError] = useState(''); 
const navigate = useNavigate(); 
const { login } = useAuth(); 

async function handleSubmit(e: React.FormEvent) { 
e.preventDefault(); 
setError(''); 

try { 
const res = await fetch(`http://localhost:5281/api/Gymnast/GetGymnastById?id=${encodeURIComponent(id)}`); 
if (!res.ok) { 
setError('User not found, must register'); 
navigate('/Register', { state: { id } });
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

const code = prompt('Enter the verification code you received in the phone call');
if (!code) {
setError('No verification code entered');
return;
}

const verifyRes = await fetch('http://localhost:5281/Auth/VerifyCode', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ phone, code }),
});

if (!verifyRes.ok) {
setError('Incorrect verification code');
return;
}

login(id); // ⬅ Save in Context
navigate('/MyProfile');
} catch (err) {
setError('General error, please try again');
} 
} 

return ( 
<div> 
<h2>Login</h2> 
<form onSubmit={handleSubmit}> 
<div> 
<label>ID:</label> 
<input value={id} onChange={e => setId(e.target.value)} required /> 
</div> 
<div> 
<label>Phone:</label> 
<input value={phone} onChange={e => setPhone(e.target.value)} required /> 
</div> 
<button type="submit">Sign in</button> 
</form> 
{error && <div style={{ color: 'red' }}>{error}</div>} 
</div> 
);
}