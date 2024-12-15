import React, { createContext, useContext, useState, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from './../../libs/utils/localStorage';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email?: string;
    username?: string;
    name: string;
    firstName?: string;
    lastName?: string;
    userTypeId?: number;
    [key: string]: any;
    // Add other relevant user fields
  } | null;
}

interface AuthContextType {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return {
        isAuthenticated: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.email,
          name: user.name,
          userTypeId: user.userTypeId,
          firstName: user.firstName,
          lastName: user.lastName,
          // Add other relevant user fields
        }
      };
    }
    return { isAuthenticated: false, user: null };
  });

  useEffect(() => {
      if (authState.isAuthenticated && authState.user) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(authState.user));
      }
      else {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
      }
  }, [authState]);

  const logout = () => {
    setAuthState({ isAuthenticated: false, user: null });
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    // Add any other logout logic (e.g., redirecting to login page)
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
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