import { lazy, Suspense } from 'react';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary';
// import { routes } from "../constants";

const Home = lazy(() => import('../pages/Home'));
const Feed = lazy(() => import('../pages/Feed'));
const JobBoard = lazy(() => import('../pages/JobBoard'));

// NOTE: this is for the login pages, might have to move it to the libs folder
const router = createBrowserRouter([
  // {
  //   path: '/auth/*',
  //   element: (
  //     <Suspense fallback={<h1>Loading...</h1>}>{<AuthLayout />}</Suspense>
  //   ),
  //   children: [
  //     {
  //       path: 'login',
  //       element: <Home />,
  //     },
  //   ],
  //   errorElement: <ErrorBoundary />,
  // },
  // {
  //   path: '/*',
  //   element: (
  //     <Suspense fallback={<h1>Loading...</h1>}>{<AppLayout />}</Suspense>
  //   ),
  //   children: [
  //     {
  //       path: '',
  //       element: <Feed />,
  //     },
  //     {
  //       path: 'job-board',
  //       element: <JobBoard />,
  //     },
  //     {
  //       path: '*',
  //       element: <Suspense fallback={<h1>Loading...</h1>}>{<Home />}</Suspense>,
  //     },
  //   ],
  //   errorElement: <ErrorBoundary />,
  // },
]);

export default function ProtectedRoutes(): React.ReactElement {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
