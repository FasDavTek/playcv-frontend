import { Icons } from './../../libs/assets';
import { ROUTES } from '../ui-components/shared/routes';

const CandidateRoutes = [
  {
    name: 'Dashboard',
    img: Icons.HouseIcon,
    route: ROUTES.CANDIDATE_DASHBOARD,
    pageName: 'Dashboard',

  },
  {
    name: 'Profile',
    img: Icons.User,
    route: ROUTES.CANDIDATE_PROFILE,
    pageName: 'Profile',
  },
  {
    name: 'VideoCV Warehouse',
    img: Icons.VideoWareHouse,
    route: ROUTES.CANDIDATE_VIDEO_MANAGEMENT,
    pageName: 'My Videos',
  },
  {
    name: 'VideoCV Guideline',
    img: Icons.Guideline,
    route: ROUTES.VIDEO_GUIDELINE,
    pageName: 'Video CV GuideLine',
  },
  {
    name: 'Vacancies',
    img: Icons.Vacancy,
    route: ROUTES.JOB_BOARD,
    pageName: 'Job Listing',
  },
  {
    name: 'FAQ',
    img: Icons.FAQ,
    route: ROUTES.FAQ,
    pageName: 'Frequently Asked Questions',
  },
  {
    name: 'All Payments',
    img: Icons.Payment,
    route: ROUTES.CANDIDATE_PAYMENT,
    pageName: 'Payment History',
  },
];

const PageHeaders = {};

const EmployerRoutes: any = [
  {
    name: 'Dashboard',
    img: Icons.HouseIcon,
    route: ROUTES.EMPLOYER_DASHBOARD,
    pageName: 'Dashboard',
  },
  {
    name: 'Profile',
    img: Icons.User,
    route: ROUTES.EMPLOYER_PROFILE,
    pageName: 'Profile',
  },
  {
    name: 'VideoCV Management',
    img: Icons.VideoWareHouse,
    route: ROUTES.EMPLOYER_VIDEO_MANAGEMENT,
    pageName: 'Video Management',
  },
  {
    name: 'Advertisement',
    img: Icons.Advert,
    route: ROUTES.EMPLOYER_ADVERTISEMENT,
    pageName: 'Advertisement',
  },
  {
    name: 'VideoCV Warehouse',
    img: Icons.VideoWareHouse,
    route: ROUTES.TALENT_GALLERY,
    pageName: 'Video Warehouse',
  },
  {
    name: 'All Payments',
    img: Icons.Payment,
    route: ROUTES.EMPLOYER_PAYMENT,
    pageName: 'Payment History',
  },
];

const AdminRoutes: any = [
  {
    name: 'Dashboard',
    img: Icons.HouseIcon,
    route: ROUTES.ADMIN_DASHBOARD,
    pageName: 'Dashboard',
  },
  {
    name: 'All Users',
    img: Icons.UserMagnagement,
    route: ROUTES.ADMIN_USER_MANAGEMENT,
    pageName: 'User Management',
  },
  {
    name: 'CV Warehouse',
    img: Icons.VideoWareHouse,
    route: ROUTES.ADMIN_VIDEo_WAREHOUSE,
    pageName: 'Video warehouse',
  },
  {
    name: 'Video Management',
    img: Icons.Guideline,
    route: ROUTES.ADMIN_VIDEO_MANAGEMENT,
    pageName: 'Video management',
  },
  {
    name: 'Price Board',
    img: Icons.Payment,
    route: ROUTES.ADMIN_PRICE_MANAGEMENT,
    pageName: 'Price management',
  },
  {
    name: 'Site Content',
    img: Icons.Content,
    route: ROUTES.ADMIN_CONTENT_MANAGEMENT,
    pageName: 'Content management',
  },
  {
    name: 'Vacancies',
    img: Icons.Vacancy,
    route: ROUTES.ADMIN_JOB_MANAGEMENT,
    pageName: 'Job Management',
  },
  {
    name: 'Advertisement',
    img: Icons.Advert,
    route: ROUTES.ADMIN_ADVERTISEMENT_MANAGEMENT,
    pageName: 'Advertisement management',
  },
  {
    name: 'Payment Order',
    img: Icons.OrderManagement,
    route: ROUTES.ADMIN_ORDER_MANAGEMENT,
    pageName: 'Order management',
  },
];

// Timing
export const PaymentTimingDeadlineInDays = 2;

export const demoThumbnailUrl = 'https://i.ibb.co/G2L2Gwp/API-Course.png';
export const demoChannelUrl = '/channel/UCmXmlB4-HJytD7wek0Uo97A';
export const demoVideoUrl = '/video-management/GDa8kZLNhJ4';
export const demoChannelTitle = 'JavaScript Mastery';
export const demoVideoTitle =
  'Build and Deploy 5 JavaScript & React API Projects in 10 Hours - Full Course | RapidAPI';
export const demoProfilePicture =
  'http://dergipark.org.tr/assets/app/images/buddy_sample.png';

import { Videos } from './VideoLinks';

export { Videos as VideoLinks };
export { VIDEO_STATUS } from './Types';
export { ErrorMessages } from './error';

export { CandidateRoutes, EmployerRoutes, AdminRoutes };
