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
    localStorage.getItem('video-cv-candidate')
      ? Boolean(localStorage.getItem('video-cv-candidate'))
      : false
  );

  const handleLogin = () => {
    localStorage.setItem('video-cv-candidate', 'true');
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
