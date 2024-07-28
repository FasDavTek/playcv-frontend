// import { lazy, Suspense } from 'react';

// import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import { Layout } from '@video-cv/ui-components';
// import AuthLayout from '../layouts/AuthLayout';
// import ErrorBoundary from './ErrorBoundary';
// // import { routes } from "../constants";

// const Home = lazy(() => import('../pages/Home'));
// const Dashboard = lazy(() => import('../pages/Dashboard'));
// const VideoManagement = lazy(() => import('../pages/VideoManagement'));
// const VideoDetail = lazy(() => import('../pages/VideoDetail'));
// const Vacancies = lazy(() => import('../pages/Vacancies'));
// const Profile = lazy(() => import('../pages/Profile'));
// const FAQ = lazy(() => import('../pages/FAQ'));
// const Payment = lazy(() => import('../pages/Payment'));
// const Login = lazy(() => import('../pages/Login'));

// const router = createBrowserRouter([
//   {
//     path: '/auth/*',
//     element: (
//       <Suspense fallback={<h1>Loading...</h1>}>{<AuthLayout />}</Suspense>
//     ),
//     children: [
//       {
//         path: 'login',
//         element: <Login />,
//       },
//     ],
//     errorElement: <ErrorBoundary />,
//   },
//   {
//     // path: '/*',
//     element: <Suspense fallback={<h1>Loading...</h1>}>{<Layout type='Candidate' />}</Suspense>,
//     children: [
//       // {
//       //   path: '/',
//       //   element:
//       // },
//       {
//         path: 'dashboard',
//         element: <Dashboard />,
//       },
//       {
//         path: 'video-management',
//         element: <VideoManagement />,
//       },
//       {
//         path: 'video-management/:id',
//         element: <VideoDetail />,
//       },
//       {
//         path: 'video-guideline',
//         element: <VideoDetail />,
//       },
//       {
//         path: 'vacancies',
//         element: <Vacancies />,
//       },
//       {
//         path: 'profile',
//         element: <Profile />,
//       },
//       {
//         path: 'faq',
//         element: <FAQ />,
//       },
//       {
//         path: 'payment',
//         element: <Payment />,
//       },

//       {
//         path: '*',
//         element: <Home />,
//       },
//     ],
//     errorElement: <ErrorBoundary />,
//   },
// ]);

// export default function ProtectedRoutes(): React.ReactElement {
//   return <RouterProvider router={router} />;
// }
