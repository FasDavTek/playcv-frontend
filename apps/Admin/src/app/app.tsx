import ProtectedRoutes from '../../../../libs/sharedRoutes/ProtectedRoutes';
import { useAuth } from '../../../../libs/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AuthRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/auth/login')
  }, [navigate]);

  return null
};

export function App() {
  const { authState } = useAuth();
  return <>{authState.isAuthenticated ? <ProtectedRoutes /> : <AuthRoutes />}</>;
}

export default App;
