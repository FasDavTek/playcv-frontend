import { Navigate } from 'react-router-dom';

import ProtectedRoutes from '../../../../libs/sharedRoutes/ProtectedRoutes';
import AuthRoutes from '../routes/AuthRoutes';
import { useAuth } from '../context/AuthProvider';

const PrivateRoutes = () => {
  const isAuthenticated = useAuth();
  if (!isAuthenticated.authState) return <Navigate to="/auth/login" />;
  return <ProtectedRoutes />;
};

const NonPrivateRoutes = () => {
  if (window.location.pathname === '/') {
    window.location.href = '/auth/login';
  }
  return <AuthRoutes />;
};

export function App() {
  const isAuthenticated = useAuth();

  return (
    <>{isAuthenticated.authState ? <PrivateRoutes /> : <NonPrivateRoutes />}</>
  );
}

export default App;
