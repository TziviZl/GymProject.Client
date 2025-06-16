import axios from "axios";

const BASE_URL = "http://localhost:5281/StudioClass"; // כתובת ה-API שלך

export interface MViewStudioClasses {
  id: number; // או string, תלוי איך מחזירים מהשרת
  name: string;
  level: string;
  trainerName: string; // שם המאמן
  date: string; // או Date, תלוי איך מחזירים מהשרת
  // ... שדות נוספים אם יש
}

export const getAllLessons = () => {
  return axios.get<MViewStudioClasses[]>(`${BASE_URL}/GetAllLessons`);
};

export const isFull = (lessonId: number) => {
  return axios.get<boolean>(`${BASE_URL}/isFull`, {
    params: { studioClassId: lessonId },
  });
}