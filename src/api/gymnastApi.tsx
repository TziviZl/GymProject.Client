import axios from 'axios';

const BASE_URL = 'http://localhost:5281/api/Gymnast'; 
export interface MGymnast {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cell: string;
  birthDate: string;
  medicalInsurance: string;
  level?: string; 
  memberShipType?: string; 
  weeklyCounter?: number;
}


export interface MViewGymnastBL {
  id: string;
  firstName: string;
  lastName: string;
MedicalInsurance : string,
membershipType: MembershipTypeEnum;
}

export interface MViewStudioClasses {
  id: number;
name: string;
trainerName?: string; 
level: string;
date: Date;
}

export enum MembershipTypeEnum {
        monthly_Standard = 300, //בחודש 8
        monthly_Pro = 500, //חופשי 
        yearly_Standard = 3000, //בחודש 8
        yearly_Pro = 4500 // חופשי
  
  
}

export interface StudioClass {
  // הגדר את השדות של StudioClass
  globalId: number;
  id: number;
  level: string;
    date: Date;
  name: string,
  currentNum: number;
  // ... שדות נוספים
}

export const newGymnast = (gymnast: MGymnast) =>
  axios.post(`${BASE_URL}/NewGymnast`, gymnast);

export const getAllGymnasts = () => axios.get<MViewGymnastBL[]>(`${BASE_URL}/Gymnast`);

export const addMembershipType = (type: MembershipTypeEnum, id: string) =>
  axios.put(`${BASE_URL}/AddMembershipType`, null, {
    params: { type, id },
  });

export const removeGymnastFromClass = (gymnastId: string, classId: number) =>
  axios.delete(`${BASE_URL}/RemoveGymnastFromClass`, {
    params: { gymnastId, classId },
  });

export const getGymnastById = (id: string) =>
  axios.get<MGymnast>(`${BASE_URL}/GetGymnastById`, { params: { id } });

export const updateGymnast = (gymnast: MGymnast) =>
  axios.put(`${BASE_URL}/UpdateGymnast`, gymnast);

export const deleteGymnast = (id: string) =>
  axios.delete(`${BASE_URL}/DeleteGymnast`, { params: { id } });

export const addGymnastLesson = (gymnastId: string, studioClassId: number) =>
  axios.post(`${BASE_URL}/AddGymnastLesson`, null, {
    params: { gymnastId, studioClassId },
  });

export const removeGymnastFromLesson = (gymnastId: string, studioClass: StudioClass) =>
  axios.delete(`${BASE_URL}/RemoveGymnastFromLesson`, {
    data: studioClass, // For DELETE with body
    params: { gymnastId },
  });

export const getGymnastLessons = (gymnastId: string, numOfLesson: number) =>
  axios.get<MViewStudioClasses[]>(`${BASE_URL}/GetGymnastLessons`, {
    params: { gymnastId, numOfLesson },
  });

export const getAllGymnastInSpecificClass = (studioClass: StudioClass) =>
  axios.get<MViewStudioClasses[]>(`${BASE_URL}/GetAllGymnastInSpecificClass`, {
    params: studioClass,
  });

export const getAllGymnastInSpecificLevel = (level: string) =>
  axios.get<MViewGymnastBL[]>(`${BASE_URL}/GetAllGymnastInSpecificLevel`, {
    params: { level },
  });

export const getAllGymnastByAge = (minAge: number, maxAge: number) =>
  axios.get<MViewGymnastBL[]>(`${BASE_URL}/GetAllGymnastByAge`, {
    params: { minAge, maxAge },
  });

export const getAllGymnastByMembershipType = (membershipType: MembershipTypeEnum) =>
  axios.get<MViewGymnastBL[]>(`${BASE_URL}/GetAllGymnastByMembershipType`, {
    params: { membershipType },
  });

export const getAllGymnastJoinedAfter = (joinDate: string) =>
  axios.get<MViewGymnastBL[]>(`${BASE_URL}/GetAllGymnastJoinedAfter`, {
    params: { joinDate },
  });