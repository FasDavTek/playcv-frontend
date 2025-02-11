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
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { useAuth } from '../../context/AuthProvider';

const heroImages = [Images.HeroImage, Images.HeroImage1, Images.HeroImage2, Images.HeroImage3, Images.HeroImage4, Images.HeroImage5, Images.HeroImage6, Images.HeroImage7, Images.HeroImage8, Images.HeroImage9];

const Feed = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  const checkPaymentStatus = async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 'success' && response.hasValidUpploadRequest === true) {
        toast.info('You have an existing payment for video upload that you have not yet completed.');
        // navigate('/candidate/video-management/upload', {
        //   state: {
        //     uploadTypeId: response.uploadRequest.uploadTypeId,
        //     uploadTypeName: response.uploadRequest.uploadType,
        //     uploadRequestId: response.uploadRequest.id,
        //     paymentDate: response.uploadRequest.paymentDate,
        //     duration: response.uploadRequest.duration
        //   }
        // });
      }
    } 
    catch (error) {
      if (isAuthenticated) {
        console.error('Error checking payment status:', error);
        toast.warning('There was an error checking your payment status. Please try again later.');
      }
    }
  };

  useEffect(() => {
    if (token) {
      checkPaymentStatus()
    }
  }, [token])

  return (
    <Stack className="flex flex-col">
      <Box className="min-h-[500px] bg-[#F7FaFF] px-3 md:px-7 lg:px-10 flex justify-center w-full items-start py-10 flex-col gap-6">
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent='space-between' spacing={4} width='100%'>
          <Box flex={2} width={['100%', '70%']}>
            <Typography variant="h3" className="font-bold text-lg flex flex-col md:text-[42px] leading-[60px] md:leading-[72px] text-[#2c3e50]" fontSize={{ xs: '32px', md: '42px' }} sx={{ marginBottom: '1.25rem' }}>
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
              <Button variant="black" color="primary" label={'Explore Jobs'} onClick={() => navigate('/job-board')} className="text-lg cursor-pointer"></Button>
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
              height: '600px'
            }}
            width='40%'
          >

           <Swiper grabCursor={false} loop={true} autoplay={{ delay: 3000, disableOnInteraction: false }} speed={3000} effect={'creative'} creativeEffect={{ prev: { shadow: true, translate: ['-20%', 0, -1], }, next: { translate: ['100%', 0, 0] } }} modules={[EffectCreative, Autoplay]} style={{ width: '550px', alignItems: 'center', justifyContent: 'center', height: '600px', borderRadius: '.75rem' }}>
              {heroImages.map((image: any, index: any) => (
                <SwiperSlide key={index}>
                  <img className='!rounded-lg h-full' src={image} alt={`Hero image ${index + 1}`} style={{ objectFit: 'contain', borderRadius: 'lg' }} />
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
            className="font-medium text-5xl my-5"
          >
            Pinned Videos
          </Typography>

          <Videos type='pinned' />
        </Box>

        <Box className="mt-10">
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={2}
            sx={{ color: 'black' }}
            className="font-medium text-5xl my-5"
          >
            Latest Videos
          </Typography>

          <Videos type='latest' />
        </Box>

          {/* LAtest jobs section */}
        <Box className="mt-20 w-full mx-auto">
          <Typography
           variant="h5"
           fontWeight="bold"
           mb={2}
           sx={{ color: 'black' }}
           className="font-medium text-3xl my-5">Latest Jobs</Typography>
          {/* <JobCardBoard jobs={jobs}> */}
          <JobCardBoard filterOptions={{ searchText: '', selectedCategories: [], selectedLocations: [], selectedDates: [], selectedStatus: 'all' }} />
        </Box>

        {['Building service', 'VideoCV'].map((category) => (
          <Box key={category} className="mt-20 ">
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              sx={{ color: 'black' }}
              className="font-medium text-5xl my-5"
            >
              {category}
            </Typography>

            <Videos category={category} />
          </Box>
        ))}

        {/* <Box className="mt-20">
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
        </Box> */}

      </Box>
    </Stack>
  );
};

export default Feed;
