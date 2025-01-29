import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Box, Stack, Typography, Card, CardMedia, CardContent, Paper, CircularProgress } from '@mui/material';
import { useCart } from '../../context/CartProvider';
import { Button } from '@video-cv/ui-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import styled from '@emotion/styled';
import { Images } from '@video-cv/assets';
import './../../styles.scss';
import { JobCardBoard, VideoCard } from '../../components';
import { mockJobs } from '../../utils/jobs';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthProvider';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import SwiperCore from 'swiper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { getData } from './../../../../../libs/utils/apis/apiMethods';

interface Video {
  id: number
  title: string
  typeId: number
  type: string
  transcript: string
  categoryId: number
  category: string | null
  userId: string
  dateCreated: string
  views: number
  videoUrl: string
  thumbnailUrl: string
  status: string
  totalRecords: number
  authorProfile: {
    userDetails: {
      fullName: string
      profileImage: string | null
    }
  }
}

const ClampedText = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  WebkitLineClamp: 2,
  position: 'relative',
  maxHeight: '3em',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -15,
    left: 0,
    right: 0,
    height: '1em',
    background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
    WebkitFilter: 'blur(5px)',
  },
});

const TabPanel = ({ children, value, index }: any) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} style={{ width: '100%' }}>
      {value === index && (
        <Box sx={{ width: '100%' }} className="p-4 w-full">
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const VideoDetails = () => {
  const { id } = useParams<{ id: any }>()
  const navigate = useNavigate();
  const location = useLocation();
  const [video, setVideo] = useState<Video | undefined>(location.state?.video);
  // const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { cartState, dispatch } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [relatedVideos, setRelatedVideos] = useState([]);
  const isFromTalentGallery = location.state?.fromTalentGallery;
  const searchParams = location.state?.searchParams;

  const itemsPerPage = 4;

  useEffect(() => {
    // Check if the item is in the cart on component mount
    const itemInCart = cartState.cart.some((item: any) => item.id === id);
    setIsInWishlist(itemInCart);
  }, [cartState, id]);

  const handleAddToCart = () => {
    const itemInCart = cartState.cart.some((item: any) => item.id === id);
    setIsInWishlist(!isInWishlist);
    if (itemInCart) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: { id },
      });
    }
    else {
      const value = {
        name: video?.authorProfile.userDetails.fullName,
        id: id,
        imageSrc: video?.videoUrl,
        // price: video?.price,
      };
      dispatch({
        type: 'ADD_TO_CART',
        payload: value,
      });
    }
  };


  const getVideoDetails = async () => {
    // Replace with actual API call or data fetching logic
    if (!video && id) {
      setLoading(false);
      try {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resp && resp.videoDetails) {
          setVideo(resp.videoDetails);
          setLoading(false);
        }
        else {
          setError('Failed to fetch related videos')
        }
      }
      catch (err) {
        console.error('Error fetching video detail:', err);
        setError('Error fetching video detail');
        toast.error('Error fetching video detail');
      }
    }
    else if (!id) {
      setError('No video Id provided');
      setLoading(false);
      return;
    }
  };


  useEffect(() => {
    getVideoDetails();
  }, [video, id]);

  const getRelatedVideos = async (searchParams: any) => {
    // Replace with actual API call or data fetching logic
    const query = new URLSearchParams(searchParams).toString();
    const response = await fetch(`/api/videos/related?${query}`);
    if (!response.ok) throw new Error('Failed to fetch related videos');
    return response.json();
  };


  const shareOnWhatsApp = (videoUrl: string) => {
    const message = `Check out my video: ${videoUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }

  const shareViaEmail = (videoUrl: string) => {
    const subject = `Check out my video`;
    const body = `Here is the link: ${videoUrl}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const getTabs = (items: string[]) => {
    const numberOfTabs = Math.ceil(items.length / itemsPerPage);
    return Array.from({ length: numberOfTabs }, (_, index) => {
      const start = index * itemsPerPage;
      const end = start + itemsPerPage;
      return items.slice(start, end);
    });
  };


  const handleReadMoreClick = () => {

    const isBusinessAccount = user?.userType === 'business' || user?.userType === 'employer';
    const hasPaidForVideo = false;

    if (!isAuthenticated) {
      navigate('/auth/login');
    } else if (!isBusinessAccount) {
      toast.warning('You cannot make a payment for this video. Please sign up with a business/employer account.');
    } else if (!hasPaidForVideo) {
      navigate('/cart');
    } else {
      setIsExpanded(true);
    }
  };

  useEffect(() => {
    if (isFromTalentGallery && searchParams) {
      // Fetch related videos based on searchParams
      const fetchRelatedVideos = async () => {
        try {
          const videos = await getRelatedVideos(searchParams);
          setRelatedVideos(videos);
        } catch (err: any) {
          setError(err.message);
        }
      };
      fetchRelatedVideos();
    }
  }, [isFromTalentGallery, searchParams]);

  const handleBackClick = () => {
    navigate(-1);
  };

  // if (loading) {
  //   return (
  //     <Box className="flex items-center justify-center min-h-screen">
  //       <CircularProgress />
  //     </Box>
  //   )
  // }

  // if (error || !video) {
  //   return (
  //     <Box className="items-center justify-center min-h-screen">
  //       <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-0 p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
  //       <Typography variant="h6" color="error" gutterBottom>
  //         {error || 'Video not found'}
  //       </Typography>
  //     </Box>
  //   )
  // };


  return (
    <Stack direction={{ sm: 'column', md: 'row' }} gap={3} className="min-h-screen flex-col md:flex-row mx-auto py-9 px-3 md:px-7 max-w-8xl">
      <Stack direction="column" flex={4} spacing={3}>
        <Box className="rounded-lg">
          <Stack mx='auto' direction="column" spacing={4}>
            <Box className="w-full top-24 rounded-3xl">
              <ReactPlayer url={video?.videoUrl} className="react-player" controls style={{ borderRadius: '1.5rem', overflow: 'hidden' }} />
            </Box>
            <Box className="flex flex-col gap-1 ">
              <Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
                <Typography variant="subtitle2">{video?.views} views</Typography>
                <Button onClick={handleAddToCart} variant="custom" className="text-[#5c6bc0] hover:text-[#2e3a86] animate-bounce" icon={isInWishlist ? <ShoppingCartIcon /> : <AddShoppingCartIcon />} />
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" p={1} spacing={8}>
                <Stack direction='row' spacing={1}>
                  <Button variant="custom" className='text-green-600 hover:text-green-500' icon={<WhatsAppIcon />} onClick={() => shareOnWhatsApp(`https://www.youtube.com/watch?v=${id}`)} />
                  <Button variant='custom' className='text-blue-600 hover:text-blue-500' icon={<EmailIcon />} onClick={() => shareViaEmail(`https://www.youtube.com/watch?v=${id}`)} />
                </Stack>
              </Stack>
              <Box flex={1} className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex lg:hidden border border-neutral-100 shadow-md ${isExpanded ? 'h-auto' : 'max-h-44'}`}>
                {isExpanded ? (
                  <Stack direction="column" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" gutterBottom>
                      {video?.title}
                    </Typography>
                    {/* <Typography variant="h6" gutterBottom>
                      {video?.role}
                    </Typography> */}
                    <Typography variant="body1" gutterBottom>
                      Uploaded by {video?.authorProfile.userDetails.fullName}
                    </Typography>
                    {/* <Typography variant="body2">
                      {video?.description}
                    </Typography> */}
                    {/* <Typography variant='caption'>
                      Uploaded on {new Date(video?.dateCreated).toLocaleDateString()}
                    </Typography> */}
                  </Stack>
                ) : (
                  <Stack direction={'column'} alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" gutterBottom>
                      {video?.title}
                    </Typography>
                    {/* <Typography variant="h6" gutterBottom>
                      {video?.role}
                    </Typography> */}
                    <Typography variant="body1" gutterBottom>
                      Uploaded by {video?.authorProfile.userDetails.fullName}
                    </Typography>
                    <label></label>
                    {/* <ClampedText variant="body2" className={`${isExpanded ? '' : 'line-clamp-2'} relative overflow-hidden`} sx={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', display: '-webkit-box'}}>
                      {video?.description}
                    </ClampedText> */}
                    <Button onClick={handleReadMoreClick} label='Read More' variant="custom" className='video-description' ></Button>
                  </Stack>
                )}
              </Box>
            </Box>
          </Stack>
        </Box>
        {/* CART ITEM STARTS */}
        {isFromTalentGallery && relatedVideos && (
          <Swiper spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }} navigation>
            {relatedVideos.map((video, index) => (
              <SwiperSlide key={index}>
                {/* Render each related video here */}
                <div className="video-card">
                  {/* <img src={video.thumbnailUrl} alt={video.title} /> */}
                  {/* <h3>{video.title}</h3> */}
                  {/* Add other video details here */}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        {/* CART ITEM ENDS */}
        
        <JobCardBoard filterOptions={{ searchText: '', selectedCategories: [], selectedLocations: [], selectedDates: [], selectedStatus: 'all' }} />
      </Stack>

      <Box className={`flex-col w-[30%] gap-4 lg:flex hidden`}>
        {isExpanded ? (
          <Stack direction="column" alignItems="start" justifyContent="space-between" className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex-col lg:flex hidden border border-neutral-100 shadow-md ${isExpanded ? 'h-auto' : 'max-h-aut0'}`}>
            <Typography variant="h5" gutterBottom>
              {video?.title}
            </Typography>
            {/* <Typography variant="h6" gutterBottom>
              {video?.role}
            </Typography> */}
            <Typography variant="body1" gutterBottom>
              Uploaded by {video?.authorProfile.userDetails.fullName}
            </Typography>
            {/* <Typography variant="body2">
              {video?.description}
            </Typography> */}
          </Stack>
        ) : (
          <Stack direction={'column'} alignItems="start" justifyContent="space-between" className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex-col lg:flex hidden border border-neutral-100 shadow-md ${isExpanded ? 'h-auto' : 'max-h-auto'}`}>
            <Typography variant="h5" gutterBottom>
              {video?.title}
            </Typography>
            {/* <Typography variant="h6" gutterBottom>
              {video?.role}
            </Typography> */}
            <Typography variant="body1" gutterBottom>
              Uploaded by {video?.authorProfile.userDetails.fullName}
            </Typography>
            {/* <ClampedText variant="body2" className={`${isExpanded ? '' : 'line-clamp-2'} relative overflow-hidden`} sx={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', display: '-webkit-box'}}>
              {video.description}
            </ClampedText> */}
            <Button onClick={handleReadMoreClick} label='Read More' variant="custom" className='video-description' ></Button>
          </Stack>
        )}

        {/* ITEM SHOULD BE HERE */}
        {isFromTalentGallery && relatedVideos.length > 0 && (
          <Box className="related-videos bg-black">
            <Typography variant='h6'>Related Videos</Typography>
            <div className="grid grid-cols-1 gap-4">
              {relatedVideos.map(video => (
                <VideoCard key={id} video={video} />
              ))}
            </div>
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default VideoDetails;
