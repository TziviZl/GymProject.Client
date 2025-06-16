import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { newGymnast, MGymnast ,addMembershipType, MembershipTypeEnum} from '../../api/gymnastApi';
import { sendVerificationCode, verifyCode } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

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
const membershipOptions = Object.entries(MembershipTypeEnum) 
.filter(([key]) => isNaN(Number(key))) 
.map(([key, value]) => ({ label: key, value })); 
const [membershipType, setMembershipType] = useState<MembershipTypeEnum | null>(MembershipTypeEnum.monthly_Standard); 

const [error, setError] = useState(''); 

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
birthDate: birthDate,
medicalInsurance
};

console.log("newUser:", newUser);

const res = await newGymnast(newUser);
if (res.status === 200 || res.status === 201) {
login(id); // ⬅ Save in Context
if (membershipType) {
await addMembershipType(membershipType, id);
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
<div>
<h1>Register</h1>
<form onSubmit={handleSubmit}>
{initialId ? <p>ID: {id}</p> : (
<div>
<label>
ID:
<input type="text" value={id} onChange={e => setId(e.target.value)} required />
</label><br />
</div>
)}

<label>
First name:
<input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />
</label><br />

<label>
Last name:
<input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
</label><br />

<label>
Email:
<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /> 
</label><br /> 

<label> 
phone: 
<input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required /> 
</label><br /> 

<label> 
date of birth: 
<input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} required /> 
</label><br /> 

<label> 
Medical insurance: 
<input type="text" value={medicalInsurance} onChange={e => setMedicalInsurance(e.target.value)} required /> 
</label><br />


<label> 
Subscription type: 
<select 
value={membershipType ?? ''} 
onChange={e => setMembershipType(Number(e.target.value))} 
required 
> 
<option value="">Select subscription type</option> 
{Object.entries(MembershipTypeEnum) 
.filter(([key]) => isNaN(Number(key))) 
.map(([key, value]) => ( 
<option key={key} value={value}> 
{key} - {value} NIS 
</option> 
))} 
</select>
</label> 
<br /> 
<button type="submit">Subscribe</button> 
</form> 
{error && <p style={{ color: 'red' }}>{error}</p>} 
</div> 
);
}