import axios from 'axios';

const BASE_URL = 'http://localhost:5281';  

export const sendVerificationCode = (phone: string) =>
  axios.post(`${BASE_URL}/Auth/SendCode`, JSON.stringify(phone), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const verifyCode = (phone: string, code: string) =>
  axios.post(`${BASE_URL}/Auth/VerifyCode`, { phone, code });