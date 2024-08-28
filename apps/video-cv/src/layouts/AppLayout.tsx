import { useState, useEffect, Suspense } from 'react';

import { Link, Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import { ChannelDetail, VideoDetail, SearchFeed, Navbar } from '../components';
import { useAuth } from '../context/AuthProvider';
import { Layout } from '@video-cv/ui-components';
import * as Assets from '@video-cv/assets';

const routesWithoutDashboardLayout = ['job-board', 'cart', 'talents', 'video/'];

export default function AppLayout(): React.ReactElement {
  const { authState } = useAuth();
  const location = useLocation();

  return (
    <div className='h-[100dvh]'>
      {routesWithoutDashboardLayout.some(
        (route) =>
          location.pathname.includes(route) || location.pathname === '/'
      ) ? (
        <Box sx={{ backgroundColor: '#fff' }}>
          <Navbar />
          <Suspense fallback={<h1>Loading...</h1>}>
            <Outlet />
          </Suspense>
          <footer className="bg-[#F6F9F8] py-5 flex-1 px-10 text-center flex gap-3 justify-center bottom-0 left-0 right-0 fixed">
            <a href="https://facebook.com/" className="">
              <img
                src={Assets.Icons.FacebookLink}
                className="w-[2.125rem] h-[2.125rem] md:w-[25px] md:h-[25px] icon-blue"
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
