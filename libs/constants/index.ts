import { Icons } from '@video-cv/assets';

const CandidateRoutes = [
  {
    name: 'Dashboard',
    img: Icons.HouseIcon,
    route: '/dashboard',
    pageName: 'Dashboard',

  },
  {
    name: 'Profile',
    img: Icons.User,
    route: '/profile',
    pageName: 'Profile',
  },
  {
    name: 'Video Management',
    img: Icons.VideoManagement,
    route: '/video-management',
    pageName: 'My Videos',
  },
  {
    name: 'VideoCV Guideline',
    img: Icons.Guideline,
    route: '/video-guideline',
    pageName: 'Video CV GuideLine',
  },
  {
    name: 'Vacancies',
    img: Icons.Vacancy,
    route: '/vacancies',
    pageName: 'Job Listing',
  },
  {
    name: 'Payment',
    img: Icons.Payment,
    route: '/payment',
    pageName: 'Payment History',
  },

  {
    name: 'FAQ',
    img: Icons.FAQ,
    route: '/faq',
    pageName: 'Frequently Asked Questions',
  },
];

const PageHeaders = {};

const EmployerRoutes: any = [
  {
    name: 'Dashboard',
    img: Icons.HouseIcon,
    route: '/dashboard',
    pageName: 'Dashboard',
  },
  {
    name: 'VideoCV Guideline',
    img: Icons.Guideline,
    route: '/video-guideline',
    pageName: 'Video CV GuideLine',
  },
  {
    name: 'Advertisement',
    img: Icons.Advert,
    route: '/advertisement',
    pageName: 'Advertisement',
  },
  {
    name: 'Video Warehouse',
    img: Icons.VideoWareHouse,
    route: '/video-management',
    pageName: 'Video Warehouse',
  },
  {
    name: 'Profile',
    img: Icons.User,
    route: '/profile',
    pageName: 'Profile',
  },
];

const AdminRoutes: any = [
  {
    name: 'Dashboard',
    img: Icons.HouseIcon,
    route: '/dashboard',
    pageName: 'Dashboard',
  },
  {
    name: 'User management',
    img: Icons.UserMagnagement,
    route: '/user-management',
    pageName: 'User Management',
  },
  {
    name: 'Content management',
    img: Icons.Content,
    route: '/content-management',
    pageName: 'Content management',
  },
  {
    name: 'Advertisement management',
    img: Icons.Advert,
    route: '/advertisement-management',
    pageName: 'Advertisement management',
  },
  {
    name: 'Order management',
    img: Icons.OrderManagement,
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
