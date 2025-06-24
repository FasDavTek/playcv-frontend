import { Suspense, useEffect, useState } from 'react';

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

import { Navbar } from '../components';
import { useAuth } from '../context/AuthProvider';
import { Layout, ProfileCompletionNotice } from '@video-cv/ui-components';
import * as Assets from '@video-cv/assets';
import { useTokenExpiration } from './../../../../libs/utils/helpers/useTokenExpiration';
import { useProfileCompletionNotice } from './../../../../libs/utils/helpers/profileCompletionNotice';

const routesWithoutDashboardLayout = ['job-board', 'cart', 'talents', 'video/', 'job/', '/terms-and-conditions', '/advert-policy', '/privacy-policy', 'faq', 'video-guideline'];

export default function AppLayout(): React.ReactElement {
  const { authState } = useAuth();
  const location = useLocation();
  const navigate = useNavigate()
  const { shouldShowNotice, dismissNotice } = useProfileCompletionNotice();
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [shouldShowFirstLoginNotice, setShouldShowFirstLoginNotice] = useState(false);

  useTokenExpiration();

  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.id) {
      const userId = authState.user?.id;
      const firstLoginKey = `first_login_${userId}`;
      const firstLoginTimeKey = `first_login_time_${userId}`;
      const hasLoggedInBefore = localStorage.getItem(firstLoginKey) === 'false';
      const firstLoginData = localStorage.getItem(firstLoginTimeKey);

      if (!hasLoggedInBefore && !firstLoginData) {
        const loginTime = new Date().toISOString();
        localStorage.setItem(firstLoginTimeKey, loginTime);
        localStorage.setItem(firstLoginKey, 'false');
        setIsFirstLogin(true);
        setShouldShowFirstLoginNotice(true);
      }
      else if (hasLoggedInBefore && firstLoginData) {
        const firstLoginDate = new Date(firstLoginData);
        const eightDaysLater = new Date(firstLoginDate);
        eightDaysLater.setUTCDate(eightDaysLater.getUTCDate() + 8);
        const isWithinEightDays = new Date() <= eightDaysLater;
        setIsFirstLogin(false)
        setShouldShowFirstLoginNotice(isWithinEightDays)
      }
    }
  }, [authState]);

  const showNotice = !!authState.isAuthenticated && (isFirstLogin || shouldShowNotice) && [2, 3].includes(authState.user?.userTypeId!)
  const variant: "persistent" | "dismissible" = (isFirstLogin || shouldShowFirstLoginNotice) ? 'persistent' : shouldShowNotice ? "dismissible" : "persistent";

  const handleNavigateToProfile = () => {
    if (authState?.user?.userTypeId === 3) {
      navigate("/candidate/profile")
    }
    else {
      navigate("/employer/profile")
    }
  }

  const handleDismiss = () => {
    dismissNotice()
  }

  return (
    <div className='min-h-screen flex flex-col'>
      {routesWithoutDashboardLayout.some(
        (route) =>
          location.pathname.includes(route) || location.pathname === '/'
      ) ? (
        <Box className="flex-grow flex flex-col" sx={{ backgroundColor: '#fff', flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <Suspense fallback={<h1>Loading...</h1>}>
            {showNotice && (
              <div className="relative top-0 z-50 p-4">
                <div className="max-w-7xl mx-auto">
                  <ProfileCompletionNotice
                    onNavigateToProfile={handleNavigateToProfile}
                    onDismiss={variant === "dismissible" ? handleDismiss : undefined}
                    variant={variant}
                  />
                </div>
              </div>
            )}
            <Outlet />
          </Suspense>
          <footer className="bg-[#F6F9F8] py-4 md:py-8 px-4 md:px-10 text-sm md:text-base mt-auto z-10 bottom-0 left-0 right-0">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-6 md:gap-10 w-full">
                {/* Contact Section */}
                <div className="flex flex-col items-start text-sm md:text-base">
                  <h3 className="font-semibold mb-2">Contact Us</h3>
                  <a 
                    href="https://wa.me/2347065245969" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                  >
                    <img
                      src={Assets.Icons.WhatsAppLink}
                      alt="WhatsApp"
                      className="w-5 h-5 mr-2"
                    />
                    WhatsApp Chat Support
                  </a>
                </div>
  
                {/* Navigation Links */}
                <div className="flex flex-col items-start">
                  <h3 className="font-semibold mb-2">Quick Links</h3>
                  <Link to="/terms-and-conditions" className="hover:underline mb-1 text-sm md:text-base">Terms and Conditions</Link>
                  <Link to="/advert-policy" className="hover:underline mb-1 text-sm md:text-base">Advert Policy</Link>
                  <Link to="/privacy-policy" className="hover:underline text-sm md:text-base">Privacy Policy</Link>
                </div>
  
                {/* Social Media and Copyright */}
                <div className="flex flex-col items-start md:items-end">
                  <a href="https://facebook.com/" className="mb-2" aria-label="Facebook">
                    <img
                      src={Assets.Icons.FacebookLink}
                      className="w-8 h-8 md:w-6 md:h-6 icon-blue"
                      alt="Facebook icon"
                    />
                  </a>
                  <p className="text-left md:text-right text-sm md:text-base">
                    Powered by National Youth Service Corps | BLOGME | DRAGNET. <br />
                    All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </Box>
      ) : (
        <Layout type="Employer" />
      )}
    </div>
  );
}
