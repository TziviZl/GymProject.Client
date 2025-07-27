import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { MGymnast, MViewGymnastBL, MViewStudioClasses, StudioClass, MembershipTypeEnum } from '../types';

const BASE_URL = `${API_BASE_URL}/Gymnast`;

export const newGymnast = (gymnast: MGymnast) =>
  axios.post(`${BASE_URL}/NewGymnast`, gymnast);

export const getAllGymnasts = () => axios.get<MViewGymnastBL[]>(`${BASE_URL}`);

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

// export const removeGymnastFromLesson = (gymnastId: string, studioClass: StudioClass) =>
//   axios.delete(`${BASE_URL}/RemoveGymnastFromLesson`, {
//     data: studioClass, // For DELETE with body
//     params: { gymnastId },
//   });

export const getGymnastLessons = (gymnastId: string, numOfLesson: number) =>
  axios.get<MViewStudioClasses[]>(`${BASE_URL}/GetGymnastLessons`, {
    params: { gymnastId, numOfLesson },
  });
export const getGymnastsInClass = (studioClass: StudioClass) =>
  axios.get<MGymnast[]>(`${BASE_URL}/GetAllGymnastInSpecificClass`, {
    params: studioClass
  });

export const getAllGymnastInSpecificClass = (studioClassId: number) =>
  axios.get<MViewStudioClasses[]>(`${BASE_URL}/GetAllGymnastInSpecificClass`, {
    params: studioClassId,
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