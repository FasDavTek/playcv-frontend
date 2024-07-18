// import { useAppState } from "../contexts/app/AppProvider";
import ProtectedRoutes from './ProtectedRoutes';
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
