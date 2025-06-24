import ProtectedRoutes from '../../../../libs/sharedRoutes/ProtectedRoutes';

const AuthRoutes = () => {
  return <></>;
};
export function App() {
  const isAuthenticated = true;
  return <>{isAuthenticated ? <ProtectedRoutes /> : <AuthRoutes />}</>;
}

export default App;
