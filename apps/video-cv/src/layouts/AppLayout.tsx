import { useState, useEffect, Suspense } from 'react';

import { Link, Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import { ChannelDetail, VideoDetail, SearchFeed, Navbar } from '../components';
import { useAuth } from '../context/AuthProvider';
import { Layout } from '@video-cv/ui-components';
import * as Assets from '@video-cv/assets';
import { useTokenExpiration } from './../../../../libs/utils/helpers/useTokenExpiration';

const routesWithoutDashboardLayout = ['job-board', 'cart', 'talents', 'video/', 'job/', '/terms-and-conditions', '/advert-policy', '/privacy-policy'];

export default function AppLayout(): React.ReactElement {
  const { authState } = useAuth();
  const location = useLocation();

  useTokenExpiration();

  return (
    <div className='min-h-screen flex flex-col'>
      {routesWithoutDashboardLayout.some(
        (route) =>
          location.pathname.includes(route) || location.pathname === '/'
      ) ? (
        <Box className="flex-grow flex flex-col" sx={{ backgroundColor: '#fff', flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <Suspense fallback={<h1>Loading...</h1>}>
            <Outlet />
          </Suspense>
          <footer className="bg-[#F6F9F8] py-4 md:py-8 px-4 md:px-10 text-sm md:text-base mt-auto z-10 bottom-0 left-0 right-0 sticky">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
                {/* Contact Section */}
                <div className="flex flex-col items-center md:items-start">
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
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="font-semibold mb-2">Quick Links</h3>
                  <Link to="/terms-and-conditions" className="hover:underline mb-1">Terms and Conditions</Link>
                  <Link to="/advert-policy" className="hover:underline mb-1">Advert Policy</Link>
                  <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                </div>
  
                {/* Social Media and Copyright */}
                <div className="flex flex-col items-center md:items-end">
                  <a href="https://facebook.com/" className="mb-2" aria-label="Facebook">
                    <img
                      src={Assets.Icons.FacebookLink}
                      className="w-8 h-8 md:w-6 md:h-6 icon-blue"
                      alt="Facebook icon"
                    />
                  </a>
                  <p className="text-center md:text-right text-xs md:text-sm">
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
