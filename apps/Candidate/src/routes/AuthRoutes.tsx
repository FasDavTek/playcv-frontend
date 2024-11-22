import { lazy, Suspense } from 'react';

import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
// import { routes } from "../constants";

// TODO: Move this away from here
const Login = lazy(() => import('../pages/Login'));

// NOTE: this is for the login pages, might have to move it to the libs folder
const router = createBrowserRouter([
  {
    path: '/auth/*',
    element: (
      <Suspense fallback={<h1>Loading...</h1>}>
        {
          <div className="">
            <Outlet />
          </div>
        }
      </Suspense>
    ),
    children: [
      {
        path: 'login',
        element: <Login />,
      },
    ],
    errorElement: <ErrorBoundary />,
  },
]);

export default function ProtectedRoutes(): React.ReactElement {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
