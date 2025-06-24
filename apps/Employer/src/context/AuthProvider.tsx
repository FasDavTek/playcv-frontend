import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';

export const AuthContext = createContext<any>(null); // Specify the context type

const AuthProvider = ({ children }: { children: ReactNode }) => {
  // TODO: Make this a useReducer
  const [authState, setAuthState] = useState(
    sessionStorage.getItem('video-cv-candidate')
      ? Boolean(sessionStorage.getItem('video-cv-candidate'))
      : false
  );

  const handleLogin = () => {
    sessionStorage.setItem('video-cv-candidate', 'true');
    setAuthState(true);
  };

  const handleLogout = () => {
    sessionStorage.clear();
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
