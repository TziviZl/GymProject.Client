export const API_BASE_URL = 'http://localhost:5281/api';

export const USER_TYPES = {
  GYMNAST: 'gymnast',
  TRAINER: 'trainer',
  SECRETARY: 'secretary'
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/Login',
  REGISTER: '/Register',
  MY_PROFILE: '/MyProfile',
  TRAINER_PROFILE: '/TrainerProfile',
  SECRETARY_DASHBOARD: '/SecretaryDashboard',
  MANAGE_GYMNASTS: '/ManageGymnasts',
  MANAGE_TRAINERS: '/ManageTrainers',
  MANAGE_CLASSES: '/ManageClasses',
  LESSONS: '/lessons',
  CONTACT: '/Contact',
  BLOG: '/Blog',
  ABOUT: '/About'
} as const;