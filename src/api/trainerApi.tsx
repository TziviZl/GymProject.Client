import axios from 'axios';

const BASE_URL = 'http://localhost:5281/api/Trainer'; 

// ממשקים (ניתן להגדיר בקובץ נפרד, לדוגמה: types.ts)
export interface MTrainer {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string; // או Date
  specialization: string;
    email: string;
    cell: string;
}

export interface MViewTrainerBL {
  firstName: string
  lastName: string
  level: string;
  nummOfStudioClasses: number;
}

export interface MViewStudioClasses {
    id: number; 
    name: string;
    level: string;
    date: Date
}

export interface BackupTrainers {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    specialization: string; 
    email: string;
    cell: string;
    
     // או Date
  // ... שדות נוספים
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