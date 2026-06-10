import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from './services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'educator' | 'super-admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      // In a real app, you might want to fetch the user profile from /api/users/me
      // For now, if we have a token, we assume logged in until a request fails
      // However, to be safe, we should get user data from localStorage or fetch it
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (accessToken: string, userData: User) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout failed on server');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('student_token');
      localStorage.removeItem('logged_in_student_id');
      localStorage.removeItem('educator_token');
      localStorage.removeItem('logged_in_educator_id');
      localStorage.removeItem('admin_token');
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
