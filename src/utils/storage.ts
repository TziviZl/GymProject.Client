import { UserType } from '../types';

export const storage = {
  // Auth
  getUserId: (): string | null => localStorage.getItem('userId'),
  setUserId: (id: string): void => localStorage.setItem('userId', id),
  
  getUserType: (): UserType => localStorage.getItem('userType') as UserType,
  setUserType: (type: UserType): void => {
    if (type) localStorage.setItem('userType', type);
  },
  
  clearAuth: (): void => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
  },
  
  // Membership
  getMembershipType: (): string | null => localStorage.getItem('membershipType'),
  setMembershipType: (type: string): void => localStorage.setItem('membershipType', type),
  
  // Messages
  getContactMessages: (): any[] => {
    const messages = localStorage.getItem('contactMessages');
    return messages ? JSON.parse(messages) : [];
  },
  setContactMessages: (messages: any[]): void => {
    localStorage.setItem('contactMessages', JSON.stringify(messages));
  },
  
  // Favorites
  getFavoriteArticles: (): Record<number, boolean> => {
    const favorites = localStorage.getItem('favoriteArticles');
    return favorites ? JSON.parse(favorites) : {};
  },
  setFavoriteArticles: (favorites: Record<number, boolean>): void => {
    localStorage.setItem('favoriteArticles', JSON.stringify(favorites));
  }
};