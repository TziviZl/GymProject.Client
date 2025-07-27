// User Types
export type UserType = 'gymnast' | 'trainer' | 'secretary' | null;

// Gymnast Types
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
  medicalInsurance: string;
  membershipType: MembershipTypeEnum;
}

// Trainer Types
export interface MTrainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cell: string;
  birthDate: string;
  specialization: string;
}

export interface MViewTrainerBL {
  id: string;
  firstName: string;
  lastName: string;
  level: string;
  nummOfStudioClasses: number;
}

// Class Types
export interface MViewStudioClasses {
  id: number;
  name: string;
  level: string;
  trainerID: string;
  trainerName: string;
  date: string;
  currentNum: number;
  isCancelled?: boolean;
}

export interface StudioClass {
  globalId: number;
  id: number;
  level: string;
  date: Date;
  name: string;
  currentNum: number;
}

// Membership Types
export enum MembershipTypeEnum {
  monthly_Standard = 300,
  monthly_Pro = 500,
  yearly_Standard = 3000,
  yearly_Pro = 4500
}

// Contact Types
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

// Common Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export type MessageType = 'success' | 'error';