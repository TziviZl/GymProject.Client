import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { MTrainer, MViewTrainerBL, MViewStudioClasses } from '../types';

const BASE_URL = `${API_BASE_URL}/Trainer`;

export interface BackupTrainers {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  specialization: string;
  email: string;
  cell: string;
}

export const getNumOfGymnasts = (trainerId: string, courseDate: string) =>
  axios.get<number>(`${BASE_URL}/GetNumOfGymnasts`, {
    params: { trainerId, courseDate },
  });

export const getAllTrainers = () => axios.get<MViewTrainerBL[]>(`${BASE_URL}`);

export const newTrainer = (trainer: MTrainer) =>
  axios.post(`${BASE_URL}/NewTrainer`, trainer);

export const getTrainerStudioClasses = (trainerId: string) =>
  axios.get<MViewStudioClasses[]>(`${BASE_URL}/GetTrainerStudioClasses`, {
    params: { trainerId },
  });

export const updateTrainer = (trainer: MTrainer) =>
  axios.put(`${BASE_URL}/UpdateTrainer`, trainer);

export const getTrainerById = (trainerId: string) =>
  axios.get<MTrainer>(`${BASE_URL}/GetTrainerById`, { params: { trainerId } });


export const deleteTrainer = (trainerId: string) =>
  axios.delete<string[] | string>(`${BASE_URL}/DeleteTrainer`, {
    params: { trainerId },
  });

export const getBackupTrainers = () => axios.get<BackupTrainers[]>(`${BASE_URL}/GetBackupTrainers`);