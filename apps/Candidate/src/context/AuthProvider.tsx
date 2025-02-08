// import { useContext, createContext, ReactNode, useState, useEffect, } from 'react';

// import { GetItemsFromLocalStorage } from '@video-cv/utils';

// interface AuthState {
//   isAuthenticated: boolean
//   user: any // Replace 'any' with a more specific user type if available
// }

// interface AuthContextType {
//   authState: AuthState
//   handleLogin: (userData: any) => void // Replace 'any' with a more specific user data type
//   handleLogout: () => void
// }

// export const AuthContext = createContext<AuthContextType | null>(null); // Specify the context type

// const AUTH_LOCALSTORAGE_KEY = 'VIDEO-CV-CANDIDATE';

// const AuthProvider = ({ children }: { children: ReactNode }) => {
//   // TODO: Make this a useReducer
//   // const [authState, setAuthState] = useState(
//   //   GetItemsFromLocalStorage(AUTH_LOCALSTORAGE_KEY) ?? null
//   // );

//   const [authState, setAuthState] = useState<AuthState>(() => {
//     const storedAuth = GetItemsFromLocalStorage(AUTH_LOCALSTORAGE_KEY)
//     return storedAuth ? { isAuthenticated: true, user: storedAuth } : { isAuthenticated: false, user: null }
//   })

//   const handleLogin = (userData: any) => {
//     localStorage.setItem(AUTH_LOCALSTORAGE_KEY, JSON.stringify(userData))
//     setAuthState({ isAuthenticated: true, user: userData })
//   };

//   const handleLogout = () => {
//     localStorage.removeItem(AUTH_LOCALSTORAGE_KEY)
//     setAuthState({ isAuthenticated: false, user: null })
//   };

//   return (
//     <AuthContext.Provider value={{ authState, handleLogin, handleLogout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// };




















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

