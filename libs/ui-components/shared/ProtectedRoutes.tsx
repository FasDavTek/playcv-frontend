import React, { lazy, Suspense } from 'react';

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import AppLayout from '../../../apps/video-cv/src/layouts/AppLayout';
import AuthLayout from '../../../apps/video-cv/src/layouts/AuthLayout';
import ErrorBoundary from '../../../apps/video-cv/src/routes/ErrorBoundary';
import Layout from '../Layout/index';
// import { routes } from "../constants";

const Home = lazy(() => import('../../../apps/video-cv/src/pages/Home'));
const TalentGallery = lazy(() => import('../../../apps/video-cv/src/pages/TalentGallery'));
const VideoDetails = lazy(() => import('../../../apps/video-cv/src/pages/VideoDetails'));
const Feed = lazy(() => import('../../../apps/video-cv/src/pages/Feed'));
const JobBoard = lazy(() => import('../../../apps/video-cv/src/pages/JobBoard'));
const JobDetail = lazy(() => import('../../../apps/video-cv/src/pages/JobDetail'));
const Cart = lazy(() => import('../../../apps/video-cv/src/pages/Cart'));
const Login = lazy(() => import('../../../apps/video-cv/src/pages/Login'));
const Dashboard = lazy(() => import('../../../apps/video-cv/src/pages/Dashboard'));
const Profile = lazy(() => import('../../../apps/video-cv/src/pages/Profile'));
const Advertisement = lazy(() => import('../../../apps/video-cv/src/pages/Advertisement'));
const ManageAdvertisement = lazy(() => import('../../../apps/video-cv/src/pages/Advertisement/manage'));
const VideoManagement = lazy(() => import('../../../apps/video-cv/src/pages/VideoManagement'));

// ADMIN ROUTES
const AdminDashboard = lazy(() => import('../../../apps/Admin/src/pages/Dashboard'));
const NotFound = lazy(() => import('../../../apps/Admin/src/pages/Home'));
const UserManagement = lazy(() => import('../../../apps/Admin/src/pages/UserManagement'));
const ContentManagement = lazy(() => import('../../../apps/Admin/src/pages/ContentManagement'));
const AdvertisementManagement = lazy(
  () => import('../../../apps/Admin/src/pages/AdvertisementManagement')
);
const OrderManagement = lazy(() => import('../../../apps/Admin/src/pages/OrderManagement'));
const OrderManagementById = lazy(() => import('../../../apps/Admin/src/pages/OrderManagement/id'));

// CANDIDATE ROUTES
const CandidateHome = lazy(() => import('../../../apps/Candidate/src/pages/Home'));
const CandidateDashboard = lazy(() => import('../../../apps/Candidate/src/pages//Dashboard'));
const CandidateVideoManagement = lazy(() => import('../../../apps/Candidate/src/pages//VideoManagement'));
const VideoDetail = lazy(() => import('../../../apps/Candidate/src/pages//VideoDetail'));
const Vacancies = lazy(() => import('../../../apps/Candidate/src/pages//Vacancies'));
const CandidateProfile = lazy(() => import('../../../apps/Candidate/src/pages//Profile'));
const FAQ = lazy(() => import('../../../apps/Candidate/src/pages//FAQ'));
const Payment = lazy(() => import('../../../apps/Candidate/src/pages//Payment'));
const CandidateLogin = lazy(() => import('../../../apps/Candidate/src/pages//Login'));


const router = createBrowserRouter([
  {
    path: '/auth/*',
    element: (
      <Suspense fallback={<h1>Loading...</h1>}>{<AuthLayout />}</Suspense>
    ),
    children: [
      {
        path: 'login',
        element: <Login />,
      },
    ],
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<h1>Loading...</h1>}>{<AppLayout />}</Suspense>
    ),
    children: [
      {
        path: '',
        element: <Feed />,
      },
      {
        path: 'talents',
        element: <TalentGallery />,
      },
      {
        path: 'video/:id',
        element: <VideoDetails />,
      },
      {
        path: 'job-board',
        element: <JobBoard />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'job-board/:id',
        element: <JobDetail />,
      },
      {
        path: 'video-guideline',
        element: <div className="h-[500px]">Video CV guideline</div>,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'advertisement',
        element: <Advertisement />,
      },
      {
        path: 'advertisement/manage/:id',
        element: <ManageAdvertisement />,
      },
      {
        path: 'video-management',
        element: <VideoManagement />,
      },
      // {
      //   path: 'admin/dashboard',
      //   element: <AdminDashboard />,
      // },
      // {
      //   path: 'admin/user-management',
      //   element: <UserManagement />,
      // },
      // {
      //   path: 'employer/*',
      //   element: (
      //     <Suspense fallback={<h1>Loading...</h1>}>
      //       {<Layout type="Employer" />}
      //     </Suspense>
      //   ),
      //   children: [
      //     {
      //       path: '',
      //       element: <Navigate to="/dashboard" replace={true} />,
      //     },
      //     {
      //       path: 'employer/video-guideline',
      //       element: <div className="h-[500px]">Video CV guideline</div>,
      //     },
      //     {
      //       path: 'employer/dashboard',
      //       element: <Dashboard />,
      //     },
      //     {
      //       path: 'employer/profile',
      //       element: <Profile />,
      //     },
      //     {
      //       path: 'employer/advertisement',
      //       element: <Advertisement />,
      //     },
      //     {
      //       path: 'employer/advertisement/manage/:id',
      //       element: <ManageAdvertisement />,
      //     },
      //     {
      //       path: 'employer/video-management',
      //       element: <VideoManagement />,
      //     },
      //   ],
      // },
      {
        path: '/admin/*',
        element: (
          <Suspense fallback={<h1>Loading...</h1>}>
            {<Layout type="Admin" />}
          </Suspense>
        ),
        children: 
        [
          {
            path: '',
            element: <Navigate to="admin/dashboard" replace={true} />,
          },
          {
            path: 'admin/dashboard',
            element: <AdminDashboard />,
          },
          {
            path: 'admin/user-management',
            element: <UserManagement />,
          },
          {
            path: 'admin/content-management',
            element: <ContentManagement />,
          },
          {
            path: 'admin/advertisement-management',
            element: <AdvertisementManagement />,
          },
          {
            path: 'admin/order-management',
            element: <OrderManagement />,
          },
          {
            path: 'admin/order-management/:id',
            element: <OrderManagementById />,
          },
          {
            path: '*',
            element: <NotFound />,
          },
        ],
        errorElement: <ErrorBoundary />,
      },
      {
        path: 'candidate/*',
        element: (
          <Suspense fallback={<h1>Loading...</h1>}>
            {<Layout type="Candidate" />}
          </Suspense>
        ),
        children: [
          {
            path: '',
            element: <Navigate to="/dashboard" replace={true} />,
          },
          {
            path: 'candidate/dashboard',
            element: <CandidateDashboard />,
          },
          {
            path: 'candidate/video-management',
            element: <CandidateVideoManagement />,
          },
          {
            path: 'candidate/video-management/:id',
            element: <VideoDetail />,
          },
          {
            path: 'candidate/video-guideline',
            element: <VideoDetail />,
          },
          {
            path: 'candidate/vacancies',
            element: <Vacancies />,
          },
          {
            path: 'candidate/profile',
            element: <CandidateProfile />,
          },
          {
            path: 'candidate/faq',
            element: <FAQ />,
          },
          {
            path: 'candidate/payment',
            element: <Payment />,
          },
    
          {
            path: '*',
            element: <Home />,
          },
        ]
      },
      {
        path: '*',
        element: <Suspense fallback={<h1>Loading...</h1>}>{<Home />}</Suspense>,
      },
    ],
    errorElement: <ErrorBoundary />,
  },
]);

export default function ProtectedRoutes(): React.ReactElement {
  return <RouterProvider router={router} />;
}
