import ProtectedRoutes from '../../../../libs/sharedRoutes/ProtectedRoutes';
import AuthRoutes from './AuthRoutes';
import { useAuth } from '../context/AuthProvider';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  const isAuthenticated = useAuth();
  // if (!isAuthenticated.authState) window.location.href = '/auth/login';
  return <ProtectedRoutes />;
};

const NonPrivateRoutes = () => {
  if (window.location.pathname === '/') {
    window.location.href = '/auth/login';
  }
  return <AuthRoutes />;
};

export default function Routes(): React.ReactElement {
  const isAuthenticated = useAuth();

  return (
    <>
      <PrivateRoutes />
    </>
  );
}
