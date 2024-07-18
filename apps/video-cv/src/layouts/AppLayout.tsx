import { useState, useEffect, Suspense } from 'react';

import { Link, Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import { ChannelDetail, VideoDetail, SearchFeed, Navbar } from '../components';
import { useAuth } from '../context/AuthProvider';
import { Layout } from '@video-cv/ui-components';
import * as Assets from '@video-cv/assets';

const routesWithoutDashboardLayout = ['job-board', 'cart', 'video/'];

export default function AppLayout(): React.ReactElement {
  const { authState } = useAuth();
  const location = useLocation();

  return (
    <div>
      {routesWithoutDashboardLayout.some(
        (route) =>
          location.pathname.includes(route) || location.pathname === '/'
      ) ? (
        <Box sx={{ backgroundColor: '#fff' }}>
          <Navbar />
          <Suspense fallback={<h1>Loading...</h1>}>
            <Outlet />
          </Suspense>
          <footer className="py-5 px-10 text-center flex gap-3 justify-center  bottom-0 left-0 right-0 relative">
            <a href="https://facebook.com/" className="">
              <img
                src={Assets.Icons.Facebook}
                className="w-[25px] h-[25px]"
                alt="facebook icon"
              />
            </a>
            <p className="">
              Powered by National Youth Service Corps | BLOGME | DRAGNET. All
              rights reserved.
            </p>
          </footer>
        </Box>
      ) : (
        <Layout type="Employer" />
      )}
    </div>
  );
}
