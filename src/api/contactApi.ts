import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { ContactMessage } from '../types';

const BASE_URL = `${API_BASE_URL}/Contact`;

export const sendContactMessage = (message: ContactMessage) =>
  axios.post(`${BASE_URL}/SendMessage`, message);

export const getAllContactMessages = () =>
  axios.get<ContactMessage[]>(`${BASE_URL}/GetAllMessages`);

export const deleteContactMessage = (id: number) =>
  axios.delete(`${BASE_URL}/DeleteMessage`, { params: { id } });