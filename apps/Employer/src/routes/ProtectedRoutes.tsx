// import { lazy, Suspense } from 'react';

// import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import { Layout } from '@video-cv/ui-components';
// import ErrorBoundary from './ErrorBoundary';
// // import { routes } from "../constants";

// const Dashboard = lazy(() => import('../pages/Dashboard'));
// const Home = lazy(() => import('../pages/Home'));
// const VideoManagement = lazy(() => import('../pages/Dashboard'));

// const router = createBrowserRouter([
//   {
//     path: '/*',
//     element: <Suspense fallback={<h1>Loading...</h1>}>{<Layout type='Employer' />}</Suspense>,
//     children: [
//       {
//         path: '',
//         element: <Dashboard />,
//       },
//       {
//         path: 'video-management',
//         element: <VideoManagement />,
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
