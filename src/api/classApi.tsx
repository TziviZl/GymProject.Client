import axios from "axios";

const BASE_URL = "http://localhost:5281/StudioClass"; // כתובת ה-API שלך

export interface MViewStudioClasses {
  name: string;
  level: string;
  trainerName: string; // שם המאמן
  date: string; // או Date, תלוי איך מחזירים מהשרת
  // ... שדות נוספים אם יש
}

export const getAllLessons = () => {
  return axios.get<MViewStudioClasses[]>(`${BASE_URL}/GetAllLessons`);
};
