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

const AUTH_LOCALSTORAGE_KEY = 'VIDEO-CV-EMPLOYER';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Make this a useReducer
  const [authState, setAuthState] = useState(
    GetItemsFromLocalStorage(AUTH_LOCALSTORAGE_KEY) ?? false
  );

  const handleLogin = () => {
    localStorage.setItem(AUTH_LOCALSTORAGE_KEY, 'true');
    setAuthState(true);
  };

  const handleLogout = () => {
    localStorage.clear();
  };

  // useEffect(() => {

  // }, [])

  return (
    <AuthContext.Provider value={{ authState, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
