import { useContext, createContext, ReactNode, useState, } from 'react';

import { GetItemsFromSessionStorage,  } from '@video-cv/utils';
import { SESSION_STORAGE_KEYS, } from '../../../../libs/utils/sessionStorage';
import { useToast } from '@video-cv/ui-components';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  userTypeId: number;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  businessName: string | null;
  businessEmail: string | null;
  exp?: number;
}
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextType {
  authState: AuthState;
  handleLogin: (user: User) => void;
  handleLogout: () => void;
}

// Create the AuthContext with a default value
export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { showToast } = useToast();

  // TODO: Make this a useReducer
  const [authState, setAuthState] = useState<AuthState>(() => {
    const storedUser = GetItemsFromSessionStorage(SESSION_STORAGE_KEYS.USER)
    return storedUser ? { isAuthenticated: true, user: storedUser } : { isAuthenticated: false, user: null }
  });

  const handleLogin = (user: User) => {
    try {
      const userAuthData = { ...user, userTypeId: user.userTypeId, };
      sessionStorage.setItem(SESSION_STORAGE_KEYS.USER, JSON.stringify({ user: userAuthData }));
      setAuthState({isAuthenticated: true, user: userAuthData});
      showToast('Login successful!', 'success');
    }
    catch (err) {
      showToast('Failed to save login data', 'error');
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.USER)
      setAuthState({ isAuthenticated: false, user: null });
      showToast('You have been logged out.', 'info');
    }
    catch (err) {
      showToast('Failed to logout properly', 'error');
    }
  };

  // useEffect(() => {

  // }, [])

  return (
    <AuthContext.Provider value={{ authState, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
};