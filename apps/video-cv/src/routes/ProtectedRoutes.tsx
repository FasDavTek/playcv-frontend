// import { lazy, Suspense } from 'react';

// import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import AppLayout from '../layouts/AppLayout';
// import AuthLayout from '../layouts/AuthLayout';
// import ErrorBoundary from './ErrorBoundary';
// // import { routes } from "../constants";

// const Home = lazy(() => import('../pages/Home'));
// const TalentGallery = lazy(() => import('../pages/TalentGallery'));
// const VideoDetails = lazy(() => import('../pages/VideoDetails'));
// const Feed = lazy(() => import('../pages/Feed'));
// const JobBoard = lazy(() => import('../pages/JobBoard'));
// const JobDetail = lazy(() => import('../pages/JobDetail'));
// const Cart = lazy(() => import('../pages/Cart'));
// const Login = lazy(() => import('../pages/Login'));
// const Dashboard = lazy(() => import('../pages/Dashboard'));
// const Profile = lazy(() => import('../pages/Profile'));
// const Advertisement = lazy(() => import('../pages/Advertisement'));
// const ManageAdvertisement = lazy(() => import('../pages/Advertisement/manage'));
// const VideoManagement = lazy(() => import('../pages/VideoManagement'));

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
//     path: '/*',
//     element: (
//       <Suspense fallback={<h1>Loading...</h1>}>{<AppLayout />}</Suspense>
//     ),
//     children: [
//       {
//         path: '',
//         element: <Feed />,
//       },
//       {
//         path: 'talents',
//         element: <TalentGallery />,
//       },
//       {
//         path: 'video/:id',
//         element: <VideoDetails />,
//       },
//       {
//         path: 'video-guideline',
//         element: <div className="h-[500px]">Video CV guideline</div>,
//       },
//       {
//         path: 'job-board',
//         element: <JobBoard />,
//       },
//       {
//         path: 'cart',
//         element: <Cart />,
//       },
//       {
//         path: 'job-board/:id',
//         element: <JobDetail />,
//       },
//       {
//         path: 'dashboard',
//         element: <Dashboard />,
//       },
//       {
//         path: 'profile',
//         element: <Profile />,
//       },
//       {
//         path: 'advertisement',
//         element: <Advertisement />,
//       },
//       {
//         path: 'advertisement/manage/:id',
//         element: <ManageAdvertisement />,
//       },
//       {
//         path: 'video-management',
//         element: <VideoManagement />,
//       },
//       {
//         path: '*',
//         element: <Suspense fallback={<h1>Loading...</h1>}>{<Home />}</Suspense>,
//       },
//     ],
//     errorElement: <ErrorBoundary />,
//   },
// ]);

// export default function ProtectedRoutes(): React.ReactElement {
//   return <RouterProvider router={router} />;
// }
