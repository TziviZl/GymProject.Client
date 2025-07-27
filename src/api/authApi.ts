import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const BASE_URL = `${API_BASE_URL}/Auth`; 

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
