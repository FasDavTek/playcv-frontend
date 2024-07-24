import React, { useEffect, useState } from 'react';

import { Box, Stack, Typography, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { fetchFromAPI } from '../../utils/fetchFromAPI';
import { Videos, Sidebar, JobBoard } from '../../components';
// import { Videos as VideosConstant } from '../../utils/Videos';
import { Images } from '@video-cv/assets';
import { Button } from '@video-cv/ui-components';
import { videoCVs } from './../../utils/videoCVs';
import fetchJobs from '../../components/fetchJobs';
import { mockJobs } from '../../utils/jobs';

const Feed = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('New');

  return (
    <Stack className="flex flex-col">
      <Box className="min-h-[500px] bg-[#F7FaFF] px-10 flex justify-center items-start py-10 flex-col gap-6">
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems='center' spacing={4}>
          <Box flex={1}>
            <Typography variant="h3" className="font-bold text-[42px] leading-[66px] md:leading-[72px] text-[#2c3e50]" sx={{ marginBottom: '1.25rem' }}>
              Accelerate Your Career with Top Job Opportunities
            </Typography>
            <Typography variant="body1" className="text-[#34495e]" sx={{ fontSize: '1.2rem', marginBottom: '1.875rem' }}>
              Discover the best job listings tailored to your skills and aspirations. Join thousands of professionals who have found their dream jobs through our platform.
            </Typography>
            <Box className="flex items-center gap-10" sx={{ marginBottom: '1.25rem' }}>
              <Button variant="blue" color="primary" label={'Explore Jobs'} onClick={() => navigate('/job-board')} className="text-lg"></Button>
              <Button variant="custom" color="primary" label={'Hire a talent'} onClick={() => navigate('/talents')} className="text-lg"></Button>
            </Box>
            <Typography variant='body2' className="text-lg" sx={{ fontSize: '1rem', color: '#7f8c8d' }}>
                Reach <span className="text-TColor-150 font-bold">50K+</span> Individuals
            </Typography>
          </Box>
          <Box className='!rounded-lg'
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'block' },
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            <img className='!rounded-lg'
              src={Images.HeroImage}
              alt="Job search illustration"
              style={{ maxWidth: '80%', height: 'auto', borderRadius: 'lg' }}
            />
          </Box>
        </Stack>
      </Box>

      <Box py={2} className="px-3 md:px-10">
        <Box className="mt-10">
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
            sx={{ color: 'black' }}
            className="font-bold text-5xl my-5"
          >
            LATEST VIDEOS
          </Typography>

          <Videos videos={videoCVs.slice(0, 20)} />
        </Box>

          {/* LAtest jobs section */}
        <Box className="mt-20 w-full mx-auto">
          <Typography
           variant="h5"
           fontWeight="bold"
           mb={2}
           sx={{ color: 'black' }}
           className="font-bold text-3xl my-5">LATEST JOBS</Typography>
          {/* <JobBoard jobs={jobs}> */}
          <JobBoard jobs={mockJobs.slice(0, 30)} />
        </Box>

        <Box className="mt-20 ">
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
            sx={{ color: 'black' }}
            className="font-bold text-5xl my-5"
          >
            VIDEOS
          </Typography>

          <Videos videos={videoCVs.slice(10, 30)} />
        </Box>

        <Box className="mt-20">
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
            sx={{ color: 'black' }}
            className="font-bold text-5xl my-5"
          >
            EXPERIENCED PROFESSIONAL
          </Typography>

          <Videos videos={videoCVs.slice(10, 30)} />
        </Box>

      </Box>
    </Stack>
  );
};

export default Feed;
