import axios from 'axios';

const BASE_URL = 'http://localhost:5281/api/Auth'; 

export const sendVerificationCode = (phone: string) =>
  axios.post(`${BASE_URL}/SendCode`, JSON.stringify(phone), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

export const verifyCode = (phone: string, code: string) =>
  axios.post(`${BASE_URL}/VerifyCode`, { phone, code });

export const getUserType = (id: string) =>
  axios.get(`${BASE_URL}/getUserType/${encodeURIComponent(id)}`);
