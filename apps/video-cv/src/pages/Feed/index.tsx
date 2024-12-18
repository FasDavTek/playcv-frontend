import React, { useEffect, useState } from 'react';

import { Box, Stack, Typography, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Videos, Sidebar, JobCardBoard } from '../../components';
// import { Videos as VideosConstant } from '../../utils/Videos';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/autoplay';
import { EffectCreative, Autoplay } from 'swiper/modules';
import { Images } from '@video-cv/assets';
import { Button } from '@video-cv/ui-components';

const heroImages = [Images.HeroImage1, Images.HeroImage2, Images.HeroImage3, Images.HeroImage4, Images.HeroImage5];

const Feed = () => {
  const navigate = useNavigate();

  return (
    <Stack className="flex flex-col">
      <Box className="min-h-[500px] bg-[#F7FaFF] px-3 md:px-7 lg:px-10 flex justify-center w-full items-start py-10 flex-col gap-6">
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent='space-between' spacing={4} width='100%'>
          <Box flex={2} width={['100%', '70%']}>
            <Typography variant="h3" className="font-bold text-lg md:text-[42px] leading-[60px] md:leading-[72px] text-[#2c3e50]" fontSize={{ xs: '32px', md: '42px' }} sx={{ marginBottom: '1.25rem' }}>
              ACCELERATE YOUR CAREER!
              <span className="font-normal text-base md:text-[40px] leading-[60px] md:leading-[72px] text-[#2c3e50]"> SHOWCASE YOUR SKILLS & QUALITIES!</span>
            </Typography>
            <Typography variant="body1" className="text-[#34495e]" sx={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>
              Discover the best job listings for young graduates tailored to your aspirations.
            </Typography>
            <Typography variant="body1" className="text-[#34495e]" sx={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              STAND OUT! Let thousands of potential employers notice you via videoCV.
            </Typography>
            <Typography variant="body1" className="text-[#34495e]" sx={{ fontSize: '1.05rem', marginBottom: '1.875rem' }}>
              Announce your amazing business, inventions, products and services as a young entrepreneur via your video profile
            </Typography>
            <Box className="flex items-center gap-10" sx={{ marginBottom: '1.25rem' }}>
              <Button variant="blue" color="primary" label={'Explore Jobs'} onClick={() => navigate('/job-board')} className="text-lg cursor-pointer"></Button>
              <Button variant="custom" color="primary" label={'Hire a talent'} onClick={() => navigate('/talents')} className="text-lg cursor-pointer"></Button>
            </Box>
            <Typography variant='body2' className="text-lg" sx={{ fontSize: '1rem', color: '#7f8c8d' }}>
                Reach <span className="text-TColor-150 font-bold">50K+</span> Individuals
            </Typography>
          </Box>
          <Box className='!rounded-lg'
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'flex' },
              alignSelf: 'center',
              textAlign: 'center',
            }}
            width='40%'
            height='500px'
          >

           <Swiper grabCursor={false} loop={true} autoplay={{ delay: 3000, disableOnInteraction: false }} speed={3000} effect={'creative'} creativeEffect={{ prev: { shadow: true, translate: ['-20%', 0, -1], }, next: { translate: ['100%', 0, 0] } }} modules={[EffectCreative, Autoplay]} style={{ width: '100%', maxWidth: '100%', height: 'auto', borderRadius: '.75rem' }}>
              {heroImages.map((image: any, index: any) => (
                <SwiperSlide key={index}>
                  <img className='!rounded-lg h-full' src={image} alt={`Hero image ${index + 1}`} style={{ width: '100%', objectFit: 'cover', maxWidth: '100%', borderRadius: 'lg' }} />
                </SwiperSlide>
                
              ))}
           </Swiper>
            
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

          <Videos />
        </Box>

          {/* LAtest jobs section */}
        <Box className="mt-20 w-full mx-auto">
          <Typography
           variant="h5"
           fontWeight="bold"
           mb={2}
           sx={{ color: 'black' }}
           className="font-bold text-3xl my-5">LATEST JOBS</Typography>
          {/* <JobCardBoard jobs={jobs}> */}
          <JobCardBoard filterOptions={{ searchText: '', selectedCategories: [], selectedLocations: [], selectedDates: [], selectedStatus: 'all' }} />
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

          <Videos />
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

          <Videos />
        </Box>

      </Box>
    </Stack>
  );
};

export default Feed;
