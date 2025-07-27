export const API_BASE_URL = 'http://localhost:5281/api';

export const USER_TYPES = {
  GYMNAST: 'gymnast' as const,
  TRAINER: 'trainer' as const,
  SECRETARY: 'secretary' as const
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/Login',
  REGISTER: '/Register',
  MY_PROFILE: '/MyProfile',
  TRAINER_PROFILE: '/TrainerProfile',
  SECRETARY_DASHBOARD: '/SecretaryDashboard',
  SECRETARY_PERSONAL_AREA: '/SecretaryPersonalArea',
  MANAGE_GYMNASTS: '/ManageGymnasts',
  MANAGE_TRAINERS: '/ManageTrainers',
  MANAGE_CLASSES: '/ManageClasses',
  LESSONS: '/lessons',
  CONTACT: '/Contact',
  MESSAGES: '/Messages',
  BLOG: '/Blog',
  ABOUT: '/About'
} as const;