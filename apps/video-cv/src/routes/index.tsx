import ProtectedRoutes from '../../../../libs/sharedRoutes/ProtectedRoutes';
import AuthRoutes from './AuthRoutes';
import { useAuth } from '../context/AuthProvider';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  const { authState } = useAuth();
  // if (!authState.isAuthenticated) window.location.href = '/auth/login';
  return <ProtectedRoutes />;
};

const NonPrivateRoutes = () => {
  if (window.location.pathname === '/') {
    window.location.href = '/auth/login';
  }
  return <AuthRoutes />;
};

export default function Routes(): React.ReactElement {
  const { authState } = useAuth();

  return (
    <>
      <PrivateRoutes />
    </>
  );
}
