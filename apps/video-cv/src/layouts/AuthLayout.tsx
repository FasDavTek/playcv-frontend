import { useState, useEffect } from 'react';

import { Link, Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import { ChannelDetail, VideoDetail, SearchFeed, Navbar } from '../components';

export default function AppLayout(): React.ReactElement {
  return (
    <Box sx={{ backgroundColor: '#fff' }}>
      <Outlet />
    </Box>
  );
}
