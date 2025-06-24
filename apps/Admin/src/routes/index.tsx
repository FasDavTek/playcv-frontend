import ProtectedRoutes from '../../../../libs/sharedRoutes/ProtectedRoutes';
// import AuthRoutes from './AuthRoutes';

export default function Routes(): React.ReactElement {
  // const {
  //   state: { user },
  // } = useAppState();

  return (
    <>
      <ProtectedRoutes />
    </>
  );
}
