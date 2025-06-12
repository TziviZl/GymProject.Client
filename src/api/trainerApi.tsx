import axios from 'axios';

const BASE_URL = 'https://localhost:5281/api'; // וודא שה-BASE_URL נכון עבור הסביבה שלך

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
  // הגדר את השדות של M_ViewTrainerBL
  firstName: string
  lastName: string
  level: string;
  nummOfStudioClasses: number;
  // ... שדות נוספים
}

export interface MViewStudioClasses {
    name: string;
    level: string;
    date: Date
  // הגדר את השדות של M_ViewStudioClasses
  // ... שדות נוספים
}

export interface BackupTrainers {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    specialization: string; // או Enum אם יש לך רשימה קבועה של התמחויות
    email: string;
    cell: string;
    
     // או Date
  // ... שדות נוספים
}

export const getNumOfGymnasts = (trainerId: string, courseDate: string) =>
  axios.get<number>(`${BASE_URL}/Trainer/GetNumOfGymnasts`, {
    params: { trainerId, courseDate },
  });

export const getAllTrainers = () => axios.get<MViewTrainerBL[]>(`${BASE_URL}/Trainer`);

export const newTrainer = (trainer: MTrainer) =>
  axios.post(`${BASE_URL}/Trainer/NewTrainer`, trainer);

export const getTrainerStudioClasses = (trainerId: string) =>
  axios.get<MViewStudioClasses[]>(`${BASE_URL}/Trainer/GetTrainerSudioClasses`, {
    params: { trainerId },
  });

export const updateTrainer = (trainer: MTrainer) =>
  axios.put(`${BASE_URL}/Trainer/UpdateTrainer`, trainer);

export const getTrainerById = (trainerId: string) =>
  axios.get<MTrainer>(`${BASE_URL}/Trainer/GetTrainerById`, { params: { trainerId } });

export const deleteTrainer = (trainerId: string) =>
  axios.delete<string[] | string>(`${BASE_URL}/Trainer/DeleteTrainer`, {
    params: { trainerId },
  });

export const getBackupTrainers = () => axios.get<BackupTrainers[]>(`${BASE_URL}/Trainer/GetBackupTrainers`);