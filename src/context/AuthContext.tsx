import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  gymnastId: string | null;
  login: (id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [gymnastId, setGymnastId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('gymnastId');
    if (id) setGymnastId(id);
  }, []);

  const login = (id: string) => {
    localStorage.setItem('gymnastId', id);
    setGymnastId(id);
  };

  const logout = () => {
    localStorage.removeItem('gymnastId');
    setGymnastId(null);
  };

  return (
    <AuthContext.Provider value={{ gymnastId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
