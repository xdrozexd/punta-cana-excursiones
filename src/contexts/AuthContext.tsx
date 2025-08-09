import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

interface AuthContextType {
  auth: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar el estado de autenticación desde localStorage al iniciar
  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        setAuth(parsedAuth);
      } catch (error) {
        console.error('Error parsing auth data from localStorage', error);
        localStorage.removeItem('adminAuth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulamos una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'admin@puntacanaexcursiones.com' && password === 'admin123') {
          const authData = {
            isLoggedIn: true,
            user: {
              name: 'Administrador',
              email: email,
              role: 'admin'
            },
            token: 'mock-jwt-token-' + Date.now()
          };
          
          setAuth(authData);
          localStorage.setItem('adminAuth', JSON.stringify(authData));
          setIsLoading(false);
          resolve(true);
        } else {
          setIsLoading(false);
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setAuth({
      isLoggedIn: false,
      user: null,
      token: null
    });
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
