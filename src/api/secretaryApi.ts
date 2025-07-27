import axios from "axios";
import { API_BASE_URL } from '../utils/constants';
import {
  MGymnast,
  MViewGymnastBL,
  MembershipTypeEnum,
  StudioClass,
  MViewStudioClasses
} from "./gymnastApi";
import {
  MTrainer,
  MViewTrainerBL,
  BackupTrainers
} from "./trainerApi";

const GYMNAST_URL = `${API_BASE_URL}/Gymnast`;
const STUDIO_URL = `${API_BASE_URL}/StudioClass`;
const TRAINER_URL = `${API_BASE_URL}/Trainer`;

// ===================== GYMNASTS =====================

export const getAllGymnasts = () =>
  axios.get<MViewGymnastBL[]>(`${GYMNAST_URL}`);

export const newGymnast = (gymnast: MGymnast) =>
  axios.post(`${GYMNAST_URL}/NewGymnast`, gymnast);

export const updateGymnast = (gymnast: MGymnast) =>
  axios.put(`${GYMNAST_URL}/UpdateGymnast`, gymnast);

export const deleteGymnast = (id: string) =>
  axios.delete(`${GYMNAST_URL}/DeleteGymnast`, { params: { id } });

export const addMembershipType = (type: MembershipTypeEnum, id: string) =>
  axios.put(`${GYMNAST_URL}/AddMembershipType`, null, {
    params: { type, id }
  });

export const addGymnastLesson = (gymnastId: string, studioClassId: number) =>
  axios.post(`${GYMNAST_URL}/AddGymnastLesson`, null, {
    params: { gymnastId, studioClassId }
  });

export const removeGymnastFromClass = (gymnastId: string, classId: number) =>
  axios.delete(`${GYMNAST_URL}/RemoveGymnastFromClass`, {
    params: { gymnastId, classId }
  });

export const removeGymnastFromLesson = (gymnastId: string, studioClass: StudioClass) =>
  axios.delete(`${GYMNAST_URL}/RemoveGymnastFromLesson`, {
    data: studioClass,
    params: { gymnastId }
  });

export const getGymnastById = (id: string) =>
  axios.get<MGymnast>(`${GYMNAST_URL}/GetGymnastById`, {
    params: { id }
  });

export const getGymnastLessons = (gymnastId: string) =>
  axios.get<MViewStudioClasses[]>(`${GYMNAST_URL}/GetGymnastLessons`, {
    params: { gymnastId }
  });

export const getGymnastsByLevel = (level: string) =>
  axios.get<MViewGymnastBL[]>(`${GYMNAST_URL}/GetAllGymnastInSpecificLevel`, {
    params: { level }
  });

export const getGymnastsByAge = (minAge: number, maxAge: number) =>
  axios.get<MViewGymnastBL[]>(`${GYMNAST_URL}/GetAllGymnastByAge`, {
    params: { minAge, maxAge }
  });

export const getGymnastsByMembershipType = (membershipType: MembershipTypeEnum) =>
  axios.get<MViewGymnastBL[]>(`${GYMNAST_URL}/GetAllGymnastByMembershipType`, {
    params: { membershipType }
  });

export const getGymnastsJoinedAfter = (joinDate: string) =>
  axios.get<MViewGymnastBL[]>(`${GYMNAST_URL}/GetAllGymnastJoinedAfter`, {
    params: { joinDate }
  });

export const getGymnastsInClass = (studioClass: StudioClass) =>
  axios.get<MGymnast[]>(`${GYMNAST_URL}/GetAllGymnastInSpecificClass`, {
    params: studioClass
  });

// ===================== TRAINERS =====================

export const getAllTrainers = () =>
  axios.get<MViewTrainerBL[]>(`${TRAINER_URL}`);

export const newTrainer = (trainer: MTrainer) =>
  axios.post(`${TRAINER_URL}/NewTrainer`, trainer);

export const updateTrainer = (trainer: MTrainer) =>
  axios.put(`${TRAINER_URL}/UpdateTrainer`, trainer);

export const deleteTrainer = (trainerId: string) =>
  axios.delete<string[] | string>(`${TRAINER_URL}/DeleteTrainer`, {
    params: { trainerId }
  });

export const getTrainerById = (trainerId: string) =>
  axios.get<MTrainer>(`${TRAINER_URL}/GetTrainerById`, {
    params: { trainerId }
  });

export const getTrainerLessons = (trainerId: string) =>
  axios.get<MViewStudioClasses[]>(`${TRAINER_URL}/GetTrainerStudioClasses`, {
    params: { trainerId }
  });

export const getBackupTrainers = () =>
  axios.get<BackupTrainers[]>(`${TRAINER_URL}/GetBackupTrainers`);

export const getNumOfTrainerGymnasts = (trainerId: string, courseDate: string) =>
  axios.get<number>(`${TRAINER_URL}/GetNumOfGymnasts`, {
    params: { trainerId, courseDate }
  });

// ===================== STUDIO CLASSES =====================

export const getAllLessons = () =>
  axios.get<MViewStudioClasses[]>(`${STUDIO_URL}/GetAllLessons`);

export const cancelClass = (classId: number) =>
  axios.post(`${STUDIO_URL}/CancelClass`, null, {
    params: { classId }
  });

export const isFull = (studioClassId: number) =>
  axios.get<boolean>(`${STUDIO_URL}/isFull`, {
    params: { studioClassId }
  });

export const isCancelled = (studioClassId: number) =>
  axios.get<boolean>(`${STUDIO_URL}/isCancelled`, {
    params: { studioClassId }
  });
