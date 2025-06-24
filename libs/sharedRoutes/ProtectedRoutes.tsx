import React, { lazy, Suspense } from 'react';

import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router-dom';
import { ROUTES } from '../../libs/ui-components/shared/routes';

import AppLayout from '../../apps/video-cv/src/layouts/AppLayout';
import AuthLayout from '../../apps/video-cv/src/layouts/AuthLayout';
import ErrorBoundary from '../../apps/video-cv/src/routes/ErrorBoundary';
import { Layout, useToast } from '../ui-components';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { SESSION_STORAGE_KEYS } from './../../libs/utils/sessionStorage';
// import { routes } from "../constants";

const Home = lazy(() => import('../../apps/video-cv/src/pages/Home'));
const TalentGallery = lazy(() => import('../../apps/video-cv/src/pages/TalentGallery'));
const VideoDetails = lazy(() => import('../../apps/video-cv/src/pages/VideoDetails'));
const Feed = lazy(() => import('../../apps/video-cv/src/pages/Feed'));
const JobBoard = lazy(() => import('../../apps/video-cv/src/pages/JobBoard'));
const JobDetail = lazy(() => import('../../apps/video-cv/src/pages/JobDetail'));
const Cart = lazy(() => import('../../apps/video-cv/src/pages/Cart'));
const Login = lazy(() => import('../../apps/video-cv/src/pages/Login'));
const Signup = lazy(() => import('../../apps/Candidate/src/pages/Signup'));
const EmployerSignup = lazy(() => import('../../apps/Employer/src/pages/Signup'));
const ForgotPassword = lazy(() => import('../ui-components/Confirmation/PasswordChange'));
const VerifyToken = lazy(() => import('../ui-components/Confirmation/TokenVerification'));
const ResetPassword = lazy(() => import('../ui-components/Confirmation/ResetPassword'));
const VerifyMail = lazy(() => import('../ui-components/Confirmation/verify-mail'));
const EmailConfirmation = lazy(() => import('../ui-components/Confirmation/EmailConfirmation'));
const Terms = lazy(() => import("../../apps/video-cv/src/pages/Terms and Conditions/index"));
const Privacy = lazy(() => import("../../apps/video-cv/src/pages/Privacy Policy/index"));
const AdsPolicy = lazy(() => import("../../apps/video-cv/src/pages/Advert Policy/index"));
const VideoGuideline = lazy(() => import('../../apps/video-cv/src/pages/VideoCvGuideline/index'));
const FAQ = lazy(() => import('../../apps/video-cv/src/pages/FAQ'));

// EMPLOYER ROUTES
const Dashboard = lazy(() => import('../../apps/Employer/src/pages/Dashboard'));
const Profile = lazy(() => import('../../apps/Employer/src/pages/Profile'));
const Advertisement = lazy(() => import('../../apps/Employer/src/pages/Advertisement'));
const EmployerCreateAdsTypes = lazy(() => import("../../apps/Employer/src/pages/Advertisement/AdsManagement-Types/CreateAdsTypes"));
const EmployerCreateAdsConfirmation = lazy(() => import("../../apps/Employer/src/pages/Advertisement/AdsManagement-Confirmation/CreateAdsConfirmation"));
const CreateAdverts = lazy(() => import('../../apps/Employer/src/pages/Advertisement/CreateAdverts/CreateAds'));
const ManageAdvertisement = lazy(() => import('../../apps/Employer/src/pages/Advertisement/ManageAds/ViewAds'));
const VideoManagement = lazy(() => import('../../apps/Employer/src/pages/VideoManagement'));
const EmployerManagementById = lazy(() => import('../../apps/Employer/src/pages/VideoDetails'));
const EmployerPayment = lazy(() => import('../../apps/Employer/src/pages/Payment'));
const EmployerPaymentRecords = lazy(() => import('../../apps/Employer/src/pages/Payment/PaymentInvoice/InvoiceDetails'));

// ADMIN ROUTES
const AdminDashboard = lazy(() => import('../../apps/Admin/src/pages/Dashboard'));
const NotFound = lazy(() => import('../../apps/Admin/src/pages/Home'));
const UserManagement = lazy(() => import('../../apps/Admin/src/pages/UserManagement'));
const CreateUser = lazy(() => import('../../apps/Admin/src/pages/UserManagement/CreateEditUser/CreateUser'));
const EditUser = lazy(() => import('../../apps/Admin/src/pages/UserManagement/CreateEditUser/EditUser'));
const ViewSubAdminUser = lazy(() => import('../../apps/Admin/src/pages/UserManagement/SubAdmin/userDetails'));
const ViewProfessionalUser = lazy(() => import('../../apps/Admin/src/pages/UserManagement/Professional/userDetails'));
const ViewEmployerUser = lazy(() => import('../../apps/Admin/src/pages/UserManagement/Employer/userDetails'));
const ContentManagement = lazy(() => import('../../apps/Admin/src/pages/ContentManagement'));
const AdvertisementManagement = lazy(() => import('../../apps/Admin/src/pages/AdvertisementManagement'));
const AdminCreateAdsTypes = lazy(() => import("../../apps/Admin/src/pages/AdvertisementManagement/AdsManagement-Types/CreateAdsTypes"));
const AdminCreateAdsConfirmation = lazy(() => import("../../apps/Admin/src/pages/AdvertisementManagement/AdsManagement-Confirmation/CreateAdsConfirmation"));
const CreateAdvertisement = lazy(() => import('../../apps/Admin/src/pages/AdvertisementManagement/CreateAdverts/CreateAdvert'));
const ViewAdvertisement = lazy(() => import('../../apps/Admin/src/pages/AdvertisementManagement/ManageAds/ViewAds'));
const OrderManagement = lazy(() => import('../../apps/Admin/src/pages/OrderManagement'));
const OrderManagementById = lazy(() => import('../../apps/Admin/src/pages/OrderManagement/id'));
const Management = lazy(() => import('../../apps/Admin/src/pages/VideoManagement'));
const Warehouse = lazy(() => import('../../apps/Admin/src/pages/VideoWarehouse'));
const ManagementById = lazy(() => import('../../apps/Admin/src/pages/VideoDetails'));
const PriceManagement = lazy(() => import('../../apps/Admin/src/pages/PriceManagement'));
const JobManagement = lazy(() => import('../../apps/Admin/src/pages/JobManagement/index'));
const AddNewJob = lazy(() => import('../../apps/Admin/src/pages/JobManagement/Vacancy/Vacancies'));
const EditJob = lazy(() => import('../../apps/Admin/src/pages/JobManagement/EditVacancy'));
const ManageJob = lazy(() => import('../../apps/Admin/src/pages/JobManagement/ManageVacancy/ManageJob'));

// CANDIDATE ROUTES
const CandidateHome = lazy(() => import('../../apps/Candidate/src/pages/Home'));
const CandidateDashboard = lazy(() => import('../../apps/Candidate/src/pages/Dashboard'));
const CandidateVideoManagement = lazy(() => import('../../apps/Candidate/src/pages/VideoManagement'));
const CandidateVideoUploadTypes = lazy(() => import('../../apps/Candidate/src/pages/VideoManagement/VideoManagement-Types/VideoUploadTypes'));
const CandidateVideoUploadDetails = lazy(() => import('../../apps/Candidate/src/pages/VideoManagement/VideoManagement-VideoUpload/VideoUpload'));
const CandidateVideoUploadConfirmation = lazy(() => import('../../apps/Candidate/src/pages/VideoManagement/VideoManagement-Confirmation/VideoUploadConfirmation'));
const CandidateEditVideoManagement = lazy(() => import('../../apps/Candidate/src/pages/VideoManagement/VideoManagement-VideoEdit/VideoEdit'));
const VideoDetail = lazy(() => import('../../apps/Candidate/src/pages/VideoDetail'));
const Vacancies = lazy(() => import('../../apps/Candidate/src/pages/Vacancies'));
const CandidateProfile = lazy(() => import('../../apps/Candidate/src/pages/Profile'));
const Payment = lazy(() => import('../../apps/Candidate/src/pages/Payment'));
const PaymentRecords = lazy(() => import('../../apps/Candidate/src/pages/Payment/PaymentInvoice/InvoiceDetails'));
const CandidateLogin = lazy(() => import('../../apps/Candidate/src/pages/Login'));



const ProtectedRoute = ({ allowedUserTypes, children }: any) => {
    const { authState } = useAuth();
    const location = useLocation();
    const { showToast } = useToast();
    
    const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

    if (!authState.isAuthenticated && token) {
        showToast(`Sorry, your sesson has expired. Please log in to continue.`, 'warning');
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    const userTypeId = authState.user?.userTypeId;

    if (!allowedUserTypes.includes(userTypeId)) {
        switch (userTypeId) {
        case 1: // Admin
            showToast("Secure area detected. Authentication required to enter.", 'error');
            return <Navigate to="/" state={{ from: location }} replace />;
        case 2: // Employer
            showToast("Secure area detected. Authentication required to enter.", 'error');
            return <Navigate to="/" state={{ from: location }} replace />;
        case 3: // Candidate
            showToast("Secure area detected. Authentication required to enter.", 'error');
            return <Navigate to="/" state={{ from: location }} replace />;
        default:
            return <Navigate to="/" state={{ from: location }} replace />;
        }
    }

    return children ? children : <Outlet />;
};



const router = createBrowserRouter([
    // {
    //     path: ROUTES.LANDINGPAGE,
    //     element: <Navigate to={ROUTES.LANDINGPAGE} replace />,
    // },
    {
        path: ROUTES.LANDINGPAGE,
        element: (
            <Suspense fallback={<h1>Loading...</h1>}>{<AppLayout />}</Suspense>
          ),
          children: [
            {
                path: '',
                element: <Feed />,
            },
            {
                path: ROUTES.TALENT_GALLERY,
                element: <TalentGallery />,
            },
            {
                path: ROUTES.JOB_BOARD,
                element: <JobBoard />,
            },
            {
                path: ROUTES.CART,
                element: <Cart />,
            },
            {
                path: ROUTES.JOB_DETAIL,
                element: <JobDetail />,
            },
            {
                path: ROUTES.VIDEO_DETAILS,
                element: <VideoDetails />,
            },
            {
                path: ROUTES.TERMS_AND_CONDITION,
                element: <Terms />,
            },
            {
                path: ROUTES.PRIVACY_POLICY,
                element: <Privacy />,
            },
            {
                path: ROUTES.ADVERT_POLICY,
                element: <AdsPolicy />,
            },
            {
                path: ROUTES.FAQ,
                element: <FAQ />,
            },
            {
                path: ROUTES.VIDEO_GUIDELINE,
                element: <VideoGuideline />,
            },
          ],
    },
    {
        path: ROUTES.CANDIDATE,
        element: (
            <Suspense fallback={<h1>Loading...</h1>}>
                <ProtectedRoute allowedUserTypes={[3, 1]}>
                    {<Layout type="Professional" />}
                </ProtectedRoute>
            </Suspense>
          ),
          children: [
            {
                path: ROUTES.CANDIDATE_DASHBOARD,
                element: <CandidateDashboard />,
            },
            {
                path: ROUTES.CANDIDATE_PROFILE,
                element: <CandidateProfile />,
            },
            {
                path: ROUTES.CANDIDATE_VIDEO_MANAGEMENT,
                element: <CandidateVideoManagement />,
            },
            {
                path: ROUTES.CANDIDATE_VIDEO_UPLOAD_TYPES,
                element: <CandidateVideoUploadTypes />,
            },
            {
                path: ROUTES.CANDIDATE_VIDEO_UPLOAD,
                element: <CandidateVideoUploadDetails />,
            },
            {
                path: ROUTES.CANDIDATE_VIDEO_CONFIRMATION,
                element: <CandidateVideoUploadConfirmation />,
            },
            {
                path: ROUTES.CANDIDATE_EDIT_VIDEO_MANAGEMENT,
                element: <CandidateEditVideoManagement />,
            },
            {
                path: ROUTES.CANDIDATE_VACANCIES,
                element: <Vacancies />,
            },
            {
                path: ROUTES.CANDIDATE_PAYMENT,
                element: <Payment />,
            },
            {
                path: ROUTES.CANDIDATE_PAYMENT_RECORD,
                element: <PaymentRecords />,
            },
            {
                path: ROUTES.CANDIDATE_VIDEO_DETAIL,
                element: <VideoDetail />,
            },
          ],
    },
    {
        path: ROUTES.ADMIN,
        element: (
            <Suspense fallback={<h1>Loading...</h1>}>
                <ProtectedRoute allowedUserTypes={[1]}>
                    {<Layout type="Admin" />}
                </ProtectedRoute>
            </Suspense>
          ),
          children: [
            {
                path: ROUTES.ADMIN_DASHBOARD,
                element: <AdminDashboard />,
            },
            {
                path: ROUTES.ADMIN_USER_MANAGEMENT,
                element: <UserManagement />,
            },
            {
                path: ROUTES.ADMIN_CREATE_USER,
                element: <CreateUser />,
            },
            {
                path: ROUTES.ADMIN_EDIT_USER,
                element: <EditUser />,
            },
            {
                path: ROUTES.ADMIN_VIEW_SUBADMIN_USER,
                element: <ViewSubAdminUser />,
            },
            {
                path: ROUTES.ADMIN_VIEW_EMPLOYER_USER,
                element: <ViewEmployerUser />,
            },
            {
                path: ROUTES.ADMIN_VIEW_PROFESSIONAL_USER,
                element: <ViewProfessionalUser />,
            },
            {
                path: ROUTES.ADMIN_CONTENT_MANAGEMENT,
                element: <ContentManagement />,
            },
            {
                path: ROUTES.ADMIN_VIDEO_MANAGEMENT,
                element: <Management />,
            },
            {
                path: ROUTES.ADMIN_VIDEO_MANAGEMENT_BY_ID,
                element: <ManagementById />,
            },
            {
                path: ROUTES.ADMIN_VIDEo_WAREHOUSE,
                element: <Warehouse />,
            },
            {
                path: ROUTES.ADMIN_PRICE_MANAGEMENT,
                element: <PriceManagement />,
            },
            {
                path: ROUTES.ADMIN_ADVERTISEMENT_MANAGEMENT,
                element: <AdvertisementManagement />,
            },
            {
                path: ROUTES.ADMIN_CREATE_ADVERTISEMENT_TYPES,
                element: <AdminCreateAdsTypes />,
            },
            {
                path: ROUTES.ADMIN_CREATE_ADVERTISEMENT_CONFIRMATION,
                element: <AdminCreateAdsConfirmation />,
            },
            {
                path: ROUTES.ADMIN_ADVERTISEMENT_CREATE,
                element: <CreateAdvertisement />,
            },
            {
                path: ROUTES.ADMIN_ADVERTISEMENT_VIEW,
                element: <ViewAdvertisement />,
            },
            {
                path: ROUTES.ADMIN_ORDER_MANAGEMENT,
                element: <OrderManagement />,
            },
            {
                path: ROUTES.ADMIN_ORDER_MANAGEMENT_BY_ID,
                element: <OrderManagementById />,
            },
            {
                path: ROUTES.ADMIN_JOB_MANAGEMENT,
                element: <JobManagement />,
            },
            {
                path: ROUTES.ADMIN_ADD_JOB,
                element: <AddNewJob />,
            },
            {
                path: ROUTES.ADMIN_EDIT_JOB,
                element: <EditJob />,
            },
            {
                path: ROUTES.ADMIN_MANAGE_JOB_STATUS,
                element: <ManageJob />,
            },
            {
                path: ROUTES.ADMIN_GUIDELINE,
                element: <div className="h-[500px]">Video CV guideline</div>,
            },
          ],
    },
    {
        path: ROUTES.EMPLOYER,
        element: 
            <Suspense fallback={<h1>Loading...</h1>}>
                <ProtectedRoute allowedUserTypes={[2]}>
                    {<Layout type='Employer' />}
                </ProtectedRoute>
            </Suspense>,
        children: [
            {
                path: ROUTES.EMPLOYER_DASHBOARD,
                element: <Dashboard />,
            },
            {
                path: ROUTES.EMPLOYER_PROFILE,
                element: <Profile />,
            },
            {
                path: ROUTES.EMPLOYER_ADVERTISEMENT,
                element: <Advertisement />,
            },
            {
                path: ROUTES.EMPLOYER_CREATE_ADVERTISEMENT_TYPES,
                element: <EmployerCreateAdsTypes />,
            },
            {
                path: ROUTES.EMPLOYER_CREATE_ADVERTISEMENT_CONFIRMATION,
                element: <EmployerCreateAdsConfirmation />,
            },
            {
                path: ROUTES.EMPLOYER_ADVERTISEMENT_CREATE,
                element: <CreateAdverts />,
            },
            {
                path: ROUTES.EMPLOYER_ADVERTISEMENT_MANAGE,
                element: <ManageAdvertisement />,
            },
            {
                path: ROUTES.EMPLOYER_VIDEO_MANAGEMENT,
                element: <VideoManagement />,
            },
            {
                path: ROUTES.EMPLOYER_VIDEO_MANAGEMENT_BY_ID,
                element: <EmployerManagementById />,
            },
            {
                path: ROUTES.EMPLOYER_PAYMENT,
                element: <EmployerPayment />,
            },
            {
                path: ROUTES.EMPLOYER_PAYMENT_RECORD,
                element: <EmployerPaymentRecords />,
            },
            {
                path: ROUTES.EMPLOYER_GUIDELINE,
                element: <div className="h-[500px]">Video CV guideline</div>,
            },
        ],
    },
    {
        path: ROUTES.NOT_FOUND,
        element: <NotFound />,
    },
    {
        path: ROUTES.HOME,
        element: <Home />,
    },
    {
        path: ROUTES.AUTH,
        element: (
            <Suspense fallback={<h1>Loading...</h1>} >{<AuthLayout />}</Suspense>
        ),
        children: [
            {
                path: ROUTES.LOGIN,
                element: <Login />,
            },
            {
                path: ROUTES.CANDIDATE_SIGNUP,
                element: <Signup />,
            },
            {
                path: ROUTES.EMPLOYER_SIGNUP,
                element: <EmployerSignup />,
            },
            {
                path: ROUTES.FORGOT_PASSWORD,
                element: <ForgotPassword />,
            },
            {
                path: ROUTES.VERIFY_TOKEN,
                element: <VerifyToken />,
            },
            {
                path: ROUTES.RESET_PASSWORD,
                element: <ResetPassword />,
            },
            {
                path: ROUTES.EMAIL_CONFIRMATION,
                element: <EmailConfirmation />,
            },
            {
                path: ROUTES.VERIFY_EMAIL,
                element: <VerifyMail />,
            }
        ]
    }
]);

export default function ProtectedRoutes(): React.ReactElement {
    return (
        <AuthProvider>
            <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </AuthProvider>
    );
  }