import { useEffect } from 'react';

import { Box, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Videos, JobCardBoard } from '../../components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/autoplay';
import { EffectCreative, Autoplay } from 'swiper/modules';
import { Images } from '@video-cv/assets';
import { Button, useToast } from '@video-cv/ui-components';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { useAuth } from '../../context/AuthProvider';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';

const heroImages = [Images.HeroImage, Images.HeroImage1, Images.HeroImage2, Images.HeroImage3, Images.HeroImage4, Images.HeroImage5, Images.HeroImage6, Images.HeroImage7, Images.HeroImage8, Images.HeroImage9];

const Feed = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { isAuthenticated } = authState;

  const { showToast } = useToast();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  const checkPaymentStatus = async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 'success' && response.hasValidUpploadRequest === true) {
        showToast('You have an existing payment for video upload that you have not yet completed.', 'info');
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
        showToast('There was an error checking your payment status. Please try again later.', 'warning');
      }
    }
  };


  const { data: videoCategories, isLoading: isCategoryLoading, error: categoryError, refetch: refetchCategoryData, } = useAllMisc({
    resource:  "video-category",
    download: true,
    structureType: 'data',
  });



  useEffect(() => {
    if (token) {
      checkPaymentStatus()
    }
  }, [token])

  return (
    <Stack className="flex flex-col" >
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

           <Swiper grabCursor={false} loop={true} autoplay={{ delay: 3000, disableOnInteraction: false }} speed={3000} effect={'creative'} creativeEffect={{ prev: { shadow: true, translate: ['-20%', 0, -1], }, next: { translate: ['100%', 0, 0] } }} modules={[EffectCreative, Autoplay]} style={{ width: '550px', alignItems: 'center', justifyContent: 'center', height: '479px', borderRadius: '.75rem' }}>
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
        {/* <Box className="mt-10">
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
        </Box> */}

        <Box className="mt-10">
          <Typography
            variant="h6"
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
           variant="h6"
           fontWeight="bold"
           mb={2}
           sx={{ color: 'black' }}
           className="font-medium text-3xl my-5">Latest Jobs</Typography>
          {/* <JobCardBoard jobs={jobs}> */}
          <JobCardBoard filterOptions={{ searchText: '', selectedLocation: '', selectedDate: null, selectedStatus: 'all' }} />
        </Box>

        {!isCategoryLoading && !categoryError && videoCategories && videoCategories?.map((category) => (
          <Box key={category.id} className="mt-20 ">
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
              sx={{ color: 'black' }}
              className="font-medium text-5xl my-5"
            >
              {category.name}
            </Typography>

            <Videos category={category.id} />
          </Box>
        ))}

        {/* <Box className="mt-20">
          <Typography
            variant="h6"
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
