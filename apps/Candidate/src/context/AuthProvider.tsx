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

const AUTH_LOCALSTORAGE_KEY = 'VIDEO-CV-CANDIDATE';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Make this a useReducer
  const [authState, setAuthState] = useState(
    GetItemsFromLocalStorage(AUTH_LOCALSTORAGE_KEY) ?? null
  );

  const handleLogin = () => {
    localStorage.setItem('video-cv-candidate', 'true');
    setAuthState(true);
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




















// import React, { createContext, ReactNode, useState, useContext } from 'react';

// export const AuthContext = createContext<any>(null);

// const AUTH_LOCALSTORAGE_KEY = 'video-cv-candidate';

// const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [authState, setAuthState] = useState(
//     localStorage.getItem(AUTH_LOCALSTORAGE_KEY)
//       ? Boolean(localStorage.getItem(AUTH_LOCALSTORAGE_KEY))
//       : false
//   );

//   const handleLogin = () => {
//     localStorage.setItem(AUTH_LOCALSTORAGE_KEY, 'true');
//     setAuthState(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem(AUTH_LOCALSTORAGE_KEY);
//     setAuthState(false);
//   };

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

