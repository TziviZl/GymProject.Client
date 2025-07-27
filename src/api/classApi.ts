import axios from "axios";
import { API_BASE_URL } from '../utils/constants';
import { MViewStudioClasses } from '../types';

const BASE_URL = `${API_BASE_URL}/StudioClass`;

export const getAllLessons = () => {
  return axios.get<MViewStudioClasses[]>(`${BASE_URL}/GetAllLessons`);
};

export const isFull = (lessonId: number) => {
  return axios.get<boolean>(`${BASE_URL}/isFull`, {
    params: { studioClassId: lessonId },
  });
}

export const cancelClass = (classId: number) => {
  return axios.post(`${BASE_URL}/CancelClass`, null, {
    params: { classId },
  });
};

export const isCancelled = (studioClassId: number) => {
  return axios.get<boolean>(`${BASE_URL}/isCancelled`, {
    params: { studioClassId },
  });
} 
