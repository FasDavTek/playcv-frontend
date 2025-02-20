import { useContext, createContext, ReactNode, useState, useEffect, } from 'react';

import { GetItemsFromLocalStorage, RemoveFromLocalStorage, AddToLocalStorage, } from '@video-cv/utils';
import { LOCAL_STORAGE_KEYS } from '../../../../libs/utils/localStorage';

export const AuthContext = createContext<any>(null); // Specify the context type

const AUTH_LOCALSTORAGE_KEY = 'VIDEO-CV-AUTH';
const currentUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Make this a useReducer
  const [authState, setAuthState] = useState(() => {
    const storedAuth = GetItemsFromLocalStorage(currentUser)
    return storedAuth ? { isAuthenticated: true, user: storedAuth } : { isAuthenticated: false, user: null }
});

  const handleLogin = (userType: string) => {
    const userAuthData = { isAuthenticated: true, userType };
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userAuthData));
    setAuthState({isAuthenticated: true, user: userAuthData});
  };

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER)
    setAuthState({ isAuthenticated: false, user: null })
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
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
};








































// import { useContext, createContext, ReactNode, useState, useEffect, } from 'react';

// import { GetItemsFromLocalStorage, RemoveFromLocalStorage, AddToLocalStorage, } from '@video-cv/utils';

// interface AuthState {
//   isAuthenticated: boolean
//   user: any // Replace 'any' with a more specific user type if available
// }

// interface AuthContextType {
//   authState: AuthState
//   handleLogin: (userData: any, userType: string) => void // Replace 'any' with a more specific user data type
//   handleLogout: () => void
// }

// export const AuthContext = createContext<AuthContextType | null>(null); // Specify the context type

// const AUTH_LOCALSTORAGE_KEY = 'VIDEO-CV-AUTH';

// const AuthProvider = ({ children }: { children: ReactNode }) => {
//   // TODO: Make this a useReducer
//   // const [authState, setAuthState] = useState(
//   //   GetItemsFromLocalStorage(AUTH_LOCALSTORAGE_KEY) ?? null
//   // );

//   const [authState, setAuthState] = useState<AuthState>(() => {
//     const storedAuth = GetItemsFromLocalStorage(AUTH_LOCALSTORAGE_KEY)
//     return storedAuth ? { isAuthenticated: true, user: storedAuth } : { isAuthenticated: false, user: null }
//   })

//   const handleLogin = (userData: any, userType: string) => {
//     const userAuthData = { isAuthenticated: true, userType, userData };
//     localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify(userAuthData));
//     setAuthState({ isAuthenticated: true, user: userAuthData })
//   };

//   const handleLogout = () => {
//     localStorage.removeItem(AUTH_LOCALSTORAGE_KEY)
//     setAuthState({ isAuthenticated: false, user: null })
//   };

//   // useEffect(() => {

//   // }, [])

//   return (
//     <AuthContext.Provider value={{ authState, handleLogin, handleLogout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

// export const useAuth = () => {
//   return useContext(AuthContext);
// };
