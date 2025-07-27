import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserType } from '../types';

interface AuthContextType {
  userId: string | null;
  userType: UserType;
  login: (id: string, type: UserType) => void;
  logout: () => void;
  isAuthLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    // טוען את המידע מה־localStorage
    const id = localStorage.getItem('userId');
    const type = localStorage.getItem('userType') as UserType | null;

    // אם יש נתונים תקינים, מעדכן את הסטייט
    if (id && type && (type === 'gymnast' || type === 'trainer' || type === 'secretary')) {
      setUserId(id);
      setUserType(type);
    } else {
      // במקרה של נתונים לא תקינים - מנקה
      setUserId(null);
      setUserType(null);
    }

    setIsAuthLoaded(true);
  }, []);

  const login = (id: string, type: UserType) => {
    if (type) {
      localStorage.setItem('userId', id);
      localStorage.setItem('userType', type);
      setUserId(id);
      setUserType(type);
    } else {
      // אם אין סוג משתמש תקין, מבטל את ההתחברות
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    setUserId(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider value={{ userId, userType, login, logout, isAuthLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
