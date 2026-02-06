import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    if (token) {
      apiClient
        .refreshToken()
        .then(() => {
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              setUser(null);
            }
          }
          setLoading(false);
        })
        .catch(() => {
          apiClient.logout();
          setUser(null);
          localStorage.removeItem('auth_user');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    setUser(response.user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
