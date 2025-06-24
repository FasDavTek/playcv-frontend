// import { lazy, Suspense } from 'react';

// import {
//   createBrowserRouter,
//   Navigate,
//   RouterProvider,
// } from 'react-router-dom';

// import { Layout } from '@video-cv/ui-components';
// import ErrorBoundary from './ErrorBoundary';
// // import { routes } from "../constants";

// const Dashboard = lazy(() => import('../pages/Dashboard'));
// const NotFound = lazy(() => import('../pages/Home'));
// const UserManagement = lazy(() => import('../pages/UserManagement'));
// const ContentManagement = lazy(() => import('../pages/ContentManagement'));
// const AdvertisementManagement = lazy(
//   () => import('../pages/AdvertisementManagement')
// );
// const OrderManagement = lazy(() => import('../pages/OrderManagement'));
// const OrderManagementById = lazy(() => import('../pages/OrderManagement/id'));

// const router = createBrowserRouter([
//   {
//     path: '/*',
//     element: (
//       <Suspense fallback={<h1>Loading...</h1>}>
//         {<Layout type="Admin" />}
//       </Suspense>
//     ),
//     children: [
//       {
//         path: '',
//         element: <Navigate to="/dashboard" replace={true} />,
//       },
//       {
//         path: 'dashboard',
//         element: <Dashboard />,
//       },
//       {
//         path: 'user-management',
//         element: <UserManagement />,
//       },
//       {
//         path: 'content-management',
//         element: <ContentManagement />,
//       },
//       {
//         path: 'advertisement-management',
//         element: <AdvertisementManagement />,
//       },
//       {
//         path: 'order-management',
//         element: <OrderManagement />,
//       },
//       {
//         path: 'order-management/:id',
//         element: <OrderManagementById />,
//       },
//       {
//         path: '*',
//         element: <NotFound />,
//       },
//     ],
//     errorElement: <ErrorBoundary />,
//   },
// ]);

// export default function ProtectedRoutes(): React.ReactElement {
//   return <RouterProvider router={router} />;
// }
