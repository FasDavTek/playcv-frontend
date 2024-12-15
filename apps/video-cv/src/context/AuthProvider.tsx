import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';

import {
  GetItemsFromLocalStorage,
  RemoveFromLocalStorage,
  AddToLocalStorage,
} from '@video-cv/utils';

export const AuthContext = createContext<any>(null); // Specify the context type

const AUTH_LOCALSTORAGE_KEY = 'VIDEO-CV-AUTH';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Make this a useReducer
  const [authState, setAuthState] = useState(
    GetItemsFromLocalStorage(AUTH_LOCALSTORAGE_KEY) ?? null
  );

  const handleLogin = (userType: string) => {
    const userAuthData = { isAuthenticated: true, userType };
    localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify(userAuthData));
    setAuthState(userAuthData);
  };

  const handleLogout = () => {
    // localStorage.removeItem(AUTH_LOCALSTORAGE_KEY);
    // localStorage.clear();
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

export const useAuth = () => {
  return useContext(AuthContext);
};
