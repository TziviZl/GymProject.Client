import axios from 'axios';

const BASE_URL = 'https://localhost:5281/api'; // וודא שה-BASE_URL נכון עבור הסביבה שלך

// ממשקים (ניתן להגדיר בקובץ נפרד, לדוגמה: types.ts)
export interface MGymnast {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date; // או Date
  medicalInsurance: string;
  email: string;
  cell: string;
  level?: string; 
}

export interface MViewGymnastBL {
  // הגדר את השדות של M_ViewGymnastBL
  id: string;
  firstName: string;
  lastName: string;
MedicalInsurance : string,
membershipType: string;
}

export interface MViewStudioClasses {
  // הגדר את השדות של M_ViewStudioClasses
name: string;
level: string;
date: Date;
  // ... שדות נוספים
}

export enum MembershipTypeEnum {
  // הגדר את סוגי החברות
  // לדוגמה:
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
  axios.post(`${BASE_URL}/Gymnast/NewGymnast`, gymnast);

export const getAllGymnasts = () => axios.get<MViewGymnastBL[]>(`${BASE_URL}/Gymnast`);

export const addMembershipType = (type: string, id: string) =>
  axios.put(`${BASE_URL}/Gymnast/AddMembershipType`, null, {
    params: { type, id },
  });

export const removeGymnastFromClass = (gymnastId: string, classId: number) =>
  axios.delete(`${BASE_URL}/Gymnast/RemoveGymnastFromClass`, {
    params: { gymnastId, classId },
  });

export const getGymnastById = (id: string) =>
  axios.get<MGymnast>(`${BASE_URL}/Gymnast/GetGymnastById`, { params: { id } });

export const updateGymnast = (gymnast: MGymnast) =>
  axios.put(`${BASE_URL}/Gymnast/UpdateGymnast`, gymnast);

export const deleteGymnast = (id: string) =>
  axios.delete(`${BASE_URL}/Gymnast/DeleteGymnast`, { params: { id } });

export const addGymnastLesson = (gymnastId: string, studioClass: StudioClass) =>
  axios.post(`${BASE_URL}/Gymnast/AddGymnastLesson`, studioClass, {
    params: { gymnastId },
  });

export const removeGymnastFromLesson = (gymnastId: string, studioClass: StudioClass) =>
  axios.delete(`${BASE_URL}/Gymnast/RemoveGymnastFromLesson`, {
    data: studioClass, // For DELETE with body
    params: { gymnastId },
  });

export const getGymnastLessons = (gymnastId: string, numOfLesson: number) =>
  axios.get<MViewStudioClasses[]>(`${BASE_URL}/Gymnast/GetGymnastLessons`, {
    params: { gymnastId, numOfLesson },
  });

export const getAllGymnastInSpecificClass = (studioClass: StudioClass) =>
  axios.get<MViewStudioClasses[]>(`${BASE_URL}/Gymnast/GetAllGymnastInSpecificClass`, {
    params: studioClass,
  });

export const getAllGymnastInSpecificLevel = (level: string) =>
  axios.get<MViewGymnastBL[]>(`${BASE_URL}/Gymnast/GetAllGymnastInSpecificLevel`, {
    params: { level },
  });

export const getAllGymnastByAge = (minAge: number, maxAge: number) =>
  axios.get<MViewGymnastBL[]>(`${BASE_URL}/Gymnast/GetAllGymnastByAge`, {
    params: { minAge, maxAge },
  });

export const getAllGymnastByMembershipType = (membershipType: MembershipTypeEnum) =>
  axios.get<MViewGymnastBL[]>(`${BASE_URL}/Gymnast/GetAllGymnastByMembershipType`, {
    params: { membershipType },
  });

export const getAllGymnastJoinedAfter = (joinDate: string) =>
  axios.get<MViewGymnastBL[]>(`${BASE_URL}/Gymnast/GetAllGymnastJoinedAfter`, {
    params: { joinDate },
  });