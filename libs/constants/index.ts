const CandidateRoutes = [
  {
    name: 'Dashboard',
    // img: Assets.Icons.DashboardNav,
    route: '/dashboard',
    pageName: 'Dashboard',
  },
  {
    name: 'Profile',
    // img: Assets.Icons.DashboardNav,
    route: '/profile',
    pageName: 'Profile',
  },
  {
    name: 'Video Management',
    // img: Assets.Icons.DashboardNav,
    route: '/video-management',
    pageName: 'My Videos',
  },
  {
    name: 'VideoCV Guideline',
    // img: Assets.Icons.DashboardNav,
    route: '/video-guideline',
    pageName: 'Video CV GuideLine',
  },
  {
    name: 'Vacancies',
    // img: Assets.Icons.DashboardNav,
    route: '/vacancies',
    pageName: 'Job Listing',
  },
  {
    name: 'Payment',
    // img: Assets.Icons.DashboardNav,
    route: '/payment',
    pageName: 'Payment History',
  },

  {
    name: 'FAQ',
    // img: Assets.Icons.DashboardNav,
    route: '/faq',
    pageName: 'Frequently Asked Questions',
  },
];

const PageHeaders = {};

const EmployerRoutes: any = [
  {
    name: 'Dashboard',
    // img: Assets.Icons.DashboardNav,
    route: '/dashboard',
    pageName: 'Dashboard',
  },
  {
    name: 'VideoCV Guideline',
    // img: Assets.Icons.DashboardNav,
    route: '/video-guideline',
    pageName: 'Video CV GuideLine',
  },
  {
    name: 'Advertisement',
    // img: Assets.Icons.DashboardNav,
    route: '/advertisement',
    pageName: 'Advertisement',
  },
  {
    name: 'Video Warehouse',
    // img: Assets.Icons.DashboardNav,
    route: '/video-management',
    pageName: 'Video Warehouse',
  },
  {
    name: 'Profile',
    // img: Assets.Icons.DashboardNav,
    route: '/profile',
    pageName: 'Profile',
  },
];
const AdminRoutes: any = [
  {
    name: 'Dashboard',
    // img: Assets.Icons.DashboardNav,
    route: '/dashboard',
    pageName: 'Dashboard',
  },
  {
    name: 'User management',
    // img: Assets.Icons.DashboardNav,
    route: '/user-management',
    pageName: 'User Management',
  },
  {
    name: 'Content management',
    // img: Assets.Icons.DashboardNav,
    route: '/content-management',
    pageName: 'Content management',
  },
  {
    name: 'Advertisement management',
    // img: Assets.Icons.DashboardNav,
    route: '/advertisement-management',
    pageName: 'Advertisement management',
  },
  {
    name: 'Order management',
    // img: Assets.Icons.DashboardNav,
    route: '/order-management',
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
