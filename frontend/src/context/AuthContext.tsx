import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse, User, Role } from '../types/user';
import { authService } from '../services/authService';
import { LoginRequest, RegisterRequest } from '../types/user';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response: AuthResponse = await authService.login(credentials);
    setToken(response.token);
    const userData: User = {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role as Role,
      enabled: true,
    };
    setUser(userData);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = async (data: RegisterRequest) => {
    const response: AuthResponse = await authService.register(data);
    setToken(response.token);
    const userData: User = {
      id: response.id,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role as Role,
      enabled: true,
    };
    setUser(userData);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const hasRole = (role: Role): boolean => {
    return user?.role === role || user?.role === Role.ROLE_ADMIN;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!token,
        hasRole,
      }}
    >
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

