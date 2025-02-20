import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Box, Stack, Typography, Card, CardMedia, CardContent, Paper, CircularProgress } from '@mui/material';
import { useCart } from '../../context/CartProvider';
import { AdPlayer, Button } from '@video-cv/ui-components';
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
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';

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
  rejectionReason?: string
  authorProfile: {
    userDetails: {
      fullName: string
      email: string
      profileImage: string | null
      userId: string;
      firstName: string;
      middleName: string;
      lastName: string;
      phoneNo: string;
      dateOfBirth: string;
      gender: string;
      type: string;
      isActive: boolean;
      phoneVerification: boolean;
      isBusinessUser: boolean;
      isProfessionalUser: boolean;
      isAdmin: boolean;
      isEmailVerified: boolean;
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
      lastLoginDate: string;
      genderId: number;
    }
  }
  userSubscription: {
      userId: number,
      subscriptionId: number,
      videoId: number,
      totalAmountPaid: number,
      canAccessProduct: string,
      datePaid: string,
      checkOutId: number
  },
}

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  userTypeId: number;
  firstName: string | null;
  lastName: string | null;
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
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video>();
  const location = useLocation();
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
  const [viewCounted, setViewCounted] = useState(false)
  const [showAd, setShowAd] = useState(true)
  const [adUrl, setAdUrl] = useState("")
  const [adType, setAdType] = useState<"video" | "image">("video");
  const [adId, setAdId] = useState<string | null>(null);

  const currentUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  const itemsPerPage = 4;


  useEffect(() => {
    getVideoDetails();
    getRandomAds();
  }, []);


  const getVideoDetails = async () => {
      setLoading(true);
      try {
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resp.code === '200') {
          let data = await resp.videoDetails;
          setVideo(data);
          if (location.state?.fromVideosList) {
            incrementViewCount()
          }
          else {
            setError('Failed to fetch related videos')
          }
        }
      }
      catch (err) {
        console.error('Error fetching video detail:', err);
        setError('Error fetching video detail');
        toast.error('Error fetching video detail');
      }
      finally {
        setLoading(false);
      }
  };



  const getRandomAds = async () => {
    try {
      const randomAd = await getData(`${CONFIG.BASE_URL}${apiEndpoints.RANDOM_ADS}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const resp = randomAd.data;
      setAdUrl(resp.coverURL);
      setAdId(resp.id);
      setAdType(resp.coverURL.toLowerCase().endsWith(".mp4") ? "video" : "image")
    }
    catch (err) {
      console.error("Error fetching random ad:", err)
      setShowAd(false)
    }
  }



  const handleAdEnd = async () => {
    setShowAd(false);
    if (adId) {
      try {
        const avg = await postData(`${CONFIG.BASE_URL}${apiEndpoints.RANDOM_ADS_COUNT}/${adId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      }
      catch (err) {
        console.error("Error updating ad view count:", err)
      }
      
    }
  };




  const handleReadMoreClick = () => {

    if (!currentUser && !token) {
      navigate('/auth/login');
    }
    else if (currentUser) {
      const user = JSON.parse(currentUser);

      if (user?.userTypeId !== 2) {
        toast.warning('You have no subscription payment for this video. Please sign into an employer account.');
      }
    }
    else if (video?.userSubscription?.canAccessProduct === null) {
      if (video) {
        const videoDetails = {
          id: video.id,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          authorName: video.authorProfile.userDetails.fullName,
          // Add any other relevant details you want to include
        }
        dispatch({
          type: "ADD_TO_CART",
          payload: videoDetails,
        })
        // toast.success("Video added to cart")
      }
      navigate('/cart');
    }
    else {
      setIsExpanded(true);
    }
  };



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
        name: video?.authorProfile.userDetails?.fullName,
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



  const getRelatedVideos = async (searchParams: any) => {
    // Replace with actual API call or data fetching logic
    const query = new URLSearchParams(searchParams).toString();
    const response = await fetch(`/api/videos/related?${query}`);
    if (!response.ok) throw new Error('Failed to fetch related videos');
    return response.json();
  };


  const shareOnWhatsApp = () => {
    if (video) {
      const message = `Check out my video: ${video.title} - ${window.location.href}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  }

  const shareViaEmail = () => {
    if (video) {
      const emailSubject = `Check out this video: ${video.title}`
      const emailBody = `I thought you might be interested in this video: ${window.location.href}`
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
      window.location.href = mailtoUrl
    }
  };

  const getTabs = (items: string[]) => {
    const numberOfTabs = Math.ceil(items.length / itemsPerPage);
    return Array.from({ length: numberOfTabs }, (_, index) => {
      const start = index * itemsPerPage;
      const end = start + itemsPerPage;
      return items.slice(start, end);
    });
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


  const incrementViewCount = async () => {
    if (video && !viewCounted) {
      try {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

        await postData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_VIEWS}?videoId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setViewCounted(true);
        // setVideo((prevVideo) => (prevVideo ? { ...prevVideo, views: prevVideo.views + 1 } : prevVideo));
      }
      catch (err) {
        console.error('Error incrementing view count:', err)
      }
    }
  }


  const handleBackClick = () => {
    navigate(-1);
  };


  return (
    <Stack direction={{ sm: 'column', md: 'row' }} gap={3} className="min-h-screen flex-col md:flex-row mx-auto py-4 md:py-7 px-3 md:px-7 w-[98%]">
      <Stack direction="column" flex={4} spacing={3}>
        <ChevronLeftIcon className="cursor-pointer text-7xl mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
        <Box className="rounded-lg">
          <Stack mx='auto' direction="column" spacing={4}>
            <Box className="w-full top-24 rounded-3xl">
              {showAd
                ? (
                  <AdPlayer adUrl={adUrl} adType={adType} adDuration={10} onAdEnd={handleAdEnd} />
                )
                : (
                  <ReactPlayer url={video?.videoUrl} className="react-player" controls style={{ borderRadius: '1.5rem', overflow: 'hidden' }} onStart={incrementViewCount} />
                )}
            </Box>
            <Box className="flex flex-col gap-1 ">
              <Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
                <Typography variant="subtitle2">{video?.views} views</Typography>
                <Button onClick={handleAddToCart} variant="custom" className="text-[#5c6bc0] hover:text-[#2e3a86] animate-bounce" icon={isInWishlist ? <ShoppingCartIcon /> : <AddShoppingCartIcon />} />
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" p={1} spacing={8}>
                <Stack direction='row' spacing={1}>
                  <Button variant="custom" className='text-green-600 hover:text-green-500' icon={<WhatsAppIcon />} onClick={shareOnWhatsApp} />
                  <Button variant='custom' className='text-blue-600 hover:text-blue-500' icon={<EmailIcon />} onClick={shareViaEmail} />
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
                    {/* <Typography variant="body1" gutterBottom>
                      Uploaded by {video?.authorProfile?.userDetails?.fullName}
                    </Typography> */}
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
                    {/* <Typography variant="body1" gutterBottom>
                      Uploaded by {video?.authorProfile?.userDetails?.fullName}
                    </Typography> */}
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
        
        <JobCardBoard filterOptions={{ searchText: '', selectedLocation: null, selectedDate: null, selectedStatus: 'all' }} limit={4} />
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
            {/* <Typography variant="body1" gutterBottom>
              Uploaded by {video?.authorProfile.userDetails.fullName}
            </Typography> */}
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
            {/* <Typography variant="body1" gutterBottom>
              Uploaded by {video?.authorProfile.userDetails.fullName}
            </Typography> */}
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
