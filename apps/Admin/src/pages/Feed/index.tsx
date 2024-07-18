import React, { useEffect, useState } from 'react';

import { Box, Stack, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// import { fetchFromAPI } from '../../utils/fetchFromAPI';
// import { Videos, Sidebar } from '../../components';
// import { Videos as VideosConstant } from '../../utils/Videos';

const Feed = () => {
  const [selectedCategory, setSelectedCategory] = useState('New');

  return (
    <Stack className="flex flex-col">
      <Box className="h-[220px] px-10 border flex py-10 flex-col gap-3">
        <h3 className="font-bold text-3xl">Search for Job Listings </h3>
        <p className="text-md text-gray-500">
          Looking for Jobs? Browse our latest job openings to view and apply to
          best jobs today !
        </p>
      </Box>
    </Stack>
  );
};

export default Feed;
