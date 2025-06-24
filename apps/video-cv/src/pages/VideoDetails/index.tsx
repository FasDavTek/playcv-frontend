import React, { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Box, Stack, Typography, Card, CardMedia, CardContent, Paper, CircularProgress, Tooltip } from '@mui/material';
import { useCart } from '../../context/CartProvider';
import { AdPlayer, Button, HtmlContent, Loader, useToast } from '@video-cv/ui-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
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
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import { deleteData, getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import { handleDate } from '@video-cv/utils';

interface Video {
  id: number
  title: string
  typeId: number
  type: string
  transcript: string
  description: string
  categoryId: number
  category: string | null
  userId: string
  dateCreated: string
  views: number
  videoUrl: string
  thumbnailUrl: string
  status: string
  totalRecords: number
  videoDescription: string;
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
    businessDetails: {
      userId: string;
      businessName: string;
      industry: string;
      address: string;
      websiteUrl: string;
      contactPhone: string;
      businessEmail: string;
      businessTypeId: string;
      contactName: string;
      contactPosition: string;
      fbLink: string;
      id: string;
      industryId: string;
      instagramUrl: string;
      isActive: boolean;
      twitter: string;
    }
    professionalDetails: {
      id: string;
      nyscStateCode: string;
      nyscStartYear: number;
      nyscEndYear: number;
      address: string;
      businessName: string;
      businessPhone: string;
      businessProfile: string;
      classOfDegree: string;
      course: string;
      courseId: number;
      coverLetter: string;
      dateCreated: string;
      degree: string;
      degreeClassId: number;
      degreeTypeId: number;
      industry: string;
      industryId: number;
      institution: string;
      institutionId: number;
    }
  }
  hasSubscription: boolean;
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

const ClampedText = styled(Box)({
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
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { authState } = useAuth();
  const { isAuthenticated, user } = authState;
  const [relatedVideos, setRelatedVideos] = useState([]);
  const isFromTalentGallery = location.state?.fromTalentGallery;
  const searchParams = location.state?.searchParams;
  const [viewCounted, setViewCounted] = useState(false)
  const [showAd, setShowAd] = useState(true)
  const [adUrl, setAdUrl] = useState("")
  const [adType, setAdType] = useState<"video" | "image">("video");
  const [adId, setAdId] = useState<number | null>(null);
  const [addedToHistory, setAddedToHistory] = useState(false);

  const currentUser = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER);
  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  const itemsPerPage = 4;

  const { showToast } = useToast();

  const hasAccess = video?.hasSubscription !== false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    getVideoDetails();
    getRandomAds();
  }, []);


  const getVideoDetails = async () => {
      try {
        setLoading(true);

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}/${id}`);

        if (resp.code === '200') {
          let data = await resp.videoDetails;
          setVideo(data);
          // if (location.state?.fromVideosList) {
          //   incrementViewCount()
          // }
          // else {
          //   setError('Failed to fetch related videos')
          // }
        }
      }
      catch (err) {
        setError('Error fetching video detail');
        showToast('Error fetching video detail', 'error');
      }
      finally {
        setLoading(false);
      }
  };



  const getRandomAds = async () => {
    try {
      const randomAd = await getData(`${CONFIG.BASE_URL}${apiEndpoints.RANDOM_ADS}`)

      if (!randomAd.data || !randomAd.data.coverURL) {
        setShowAd(false)
        return
      }

      const resp = randomAd.data;
      const isVideo = resp.coverURL.toLowerCase().endsWith(".mp4");

      if (isVideo) {
        const videoElement = document.createElement("video")
        videoElement.preload = "auto"
        videoElement.src = resp.coverURL
        videoElement.load()
      }
      else {
        const img = new Image()
        img.src = resp.coverURL
      }


      setAdUrl(resp.coverURL);
      setAdType(isVideo ? "video" : "image")
      setAdId(resp.id);

      if (resp.id) {
        try {
          await postData(`${CONFIG.BASE_URL}${apiEndpoints.RANDOM_ADS_COUNT}/${resp.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        }
        catch (err: any) {
          throw new Error(err)
        }
      }
    }
    catch (err) {
      setShowAd(false)
    }
  }



  const handleAdEnd = async () => {
    setShowAd(false);
  };



  useEffect(() => {
    if (video) {
      const itemInCart = cartState.cart.some((item: any) => item.videoCvId === video.id);
      setIsInWishlist(itemInCart);
    }
  }, [cartState, video]);


  // const handleAddToCart = async () => {
  //   if (!authState.isAuthenticated) {
  //     navigate('/auth/login');
  //     showToast('Please log in to add items to your wishlist', 'info');
  //     return;
  //   }

  //   if (authState?.user?.userTypeId === 3) {
  //     showToast('Only employers can add videos to the wishlist.', 'error');
  //     return;
  //   }

  //   if (isInWishlist) {
  //     showToast('This video is already in your cart.', 'info');
  //     return;
  //   }

  //   try {
  //     const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_TO_CART}`, { videoCvId: id, quantity: 1 }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     if (response.code === '00') {
  //       const newItem = {
  //         name: video?.title,
  //         id: id,
  //         imageSrc: video?.thumbnailUrl,
  //         uploader: video?.authorProfile.userDetails.firstName + ' ' +  video?.authorProfile.userDetails.middleName + ' ' + video?.authorProfile.userDetails.lastName,
  //         type: video?.type,
  //       };
  //       dispatch({ type: 'ADD_TO_CART', payload: newItem });
  //       setIsInWishlist(true);
  //       showToast('Video added to wishlist. Please proceed to payment to view more details.', 'success');
  //     }
  //   } catch (err) {
  //     showToast('Failed to add video to wishlist', 'error');
  //   }
  // };



  // const handleRemoveFromCart = async (cartItemId: number) => {
  //   try {
  //     const response = await deleteData(`${CONFIG.BASE_URL}${apiEndpoints.REMOVE_FROM_CART}/${cartItemId}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.code === '00') {
  //       dispatch({ type: 'REMOVE_FROM_CART', payload: { cartItemId } });
  //       setIsInWishlist(false);
  //       showToast('Video removed from wishlist', 'success');
  //     }
  //   } catch (err) {
  //     showToast('Failed to remove video from wishlist', 'error');
  //   }
  // };


  // const handleCartButtonClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (isInWishlist) {
  //     const cartItem = cartState.cart.find((item: any) => item.videoCvId === id);
  //     if (cartItem) {
  //       handleRemoveFromCart(cartItem.id)
  //     }
  //   } else {
  //     handleAddToCart()
  //   }
  // }

  const shouldShowCartButtons = 
    !hasAccess && // Only show if no subscription exists
    ((authState?.isAuthenticated && authState?.user?.userTypeId === 2) || 
    authState?.isAuthenticated === false);


  const handleReadMoreClick = () => {
    if (authState.isAuthenticated === false) {
      showToast('Please log in to view video details', 'info');
      navigate('/auth/login');
      return;
    }

    const userTypeId = authState?.user?.userTypeId;

    if (userTypeId === 1) {
      setIsExpanded(true);
      return;
    }

    if (userTypeId === 3) {
      showToast('You have no subscription payment for this video. Please sign into an employer account.', 'warning');
      return;
    }

    if (userTypeId === 2 && hasAccess) {
        setIsExpanded(true);
    }
    else {
      if (isInWishlist) {
        showToast('This video is already in your cart. Please proceed to payment to view details.', 'info');
      }
      else {
        handleCartButtonClick({ stopPropagation: () => {} } as React.MouseEvent);
        showToast('Video added to cart. Please proceed to payment to view details.', 'info');
      }
    }
  };






  const handleCartButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!authState.isAuthenticated) {
      navigate('/auth/login');
      showToast("Please signin to add videos to the cart.", 'warning');
      return;
    }

    if (authState?.user?.userTypeId === 3) {
      showToast("Only employers can add videos to the cart.", 'error');
      return;
    }

    // Optimistic update
    const wasInWishlist = isInWishlist;
    setIsInWishlist(!wasInWishlist);
    
    try {
      if (wasInWishlist) {
        const cartItem = cartState.cart.find((item: any) => item.videoCvId === id);
        if (cartItem) {
          await deleteData(`${CONFIG.BASE_URL}${apiEndpoints.REMOVE_FROM_CART}/${cartItem.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch({ type: 'REMOVE_FROM_CART', payload: { cartItemId: cartItem.id } });
          showToast('Video removed from cart', 'success');
        }
      } else {
        const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_TO_CART}`, { videoCvId: id, quantity: 1 }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.code === '00') {
          const newItem = {
            name: video?.title,
            id: id,
            // videoCvId: id,
            imageSrc: video?.thumbnailUrl,
            uploader: video?.authorProfile.userDetails.firstName + ' ' +  video?.authorProfile.userDetails.middleName + ' ' + video?.authorProfile.userDetails.lastName,
            type: video?.type,
            // price: 0 // temporary value
          };

          dispatch({ type: 'ADD_TO_CART', payload: newItem });
          showToast('Video added to cart', 'success');
        }
      }
    } catch (err) {
      setIsInWishlist(wasInWishlist);
      showToast(wasInWishlist ? 'Failed to remove from cart' : 'Failed to add to cart', 'error');
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
        const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

        await postData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_VIEWS}?videoId=${id}`, {});

        setViewCounted(true);
        setVideo((prevVideo) => (prevVideo ? { ...prevVideo, views: prevVideo.views + 1 } : prevVideo));
      }
      catch (err) {
        console.error('Error incrementing view count:', err)
      }
    }
  }

  const handleProgress = (progress: { playedSeconds: number; }) => {
    if (!addedToHistory && progress.playedSeconds >= 5) {
      addToWatchHistory();
      setAddedToHistory(true); // Ensure we don't add it multiple times
    }
  };


  const addToWatchHistory = async () => {
    try {
      await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_TO_WATCH_HISTORY}?videoId=${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Error adding to watch history:', err);
    }
  };

  useEffect(() => {
    setAddedToHistory(false); // Reset the state when the video changes
  }, [id]);


  const handleBackClick = () => {
    navigate(-1);
    window.scrollTo(0, 0);
  };
  

  if (!video && loading) return <Loader />;
  if (!video && !loading) return <div className='items-center flex text-center'>No video found</div>;


  return (
    <Stack direction={{ sm: 'column', md: 'row' }} gap={3} className="min-h-screen flex-col md:flex-row mx-auto py-4 md:py-7 px-3 md:px-7 w-[98%]">
      <Stack direction="column" flex={4} spacing={3}>
        {/* <a href="/"> */}
          <ChevronLeftIcon className="cursor-pointer text-3xl mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '2rem', touchAction: "manipulation" }} onClick={handleBackClick} />
        {/* </a> */}
        <Box className="rounded-lg">
          <Stack mx='auto' direction="column" spacing={4}>
            <Box className="w-full h-auto rounded-3xl">
              {showAd
                ? (
                  <AdPlayer adUrl={adUrl} adType={adType} adDuration={5} onAdEnd={handleAdEnd} />
                )
                : (
                  <ReactPlayer url={video?.videoUrl} className="react-player" controls style={{ borderRadius: '1.5rem', overflow: 'hidden' }} onStart={incrementViewCount} />
                )}
            </Box>
            <Box className="flex flex-col gap-1">
              <Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
                <Typography variant="subtitle2">{video?.views} views</Typography>
                {shouldShowCartButtons && (
                  <Tooltip title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'} placeholder='right-start'>
                    <span>
                      <Button variant="custom" color="gray" className='text-[#5c6bc0] hover:text-[#2e3a86] touch-action-manipulation' onClick={handleCartButtonClick} icon={isInWishlist ? <ShoppingCartIcon style={{ touchAction: "manipulation" }} /> : <AddShoppingCartIcon style={{ touchAction: "manipulation" }} />} style={{ touchAction: "manipulation" }} />
                    </span>
                  </Tooltip>
                )}
                {!shouldShowCartButtons && hasAccess && (
                  <Tooltip title="You've already purchased this video" placeholder='right-start'>
                    <CheckCircleIcon color="success" />
                  </Tooltip>
                )}
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between" p={1} spacing={8}>
                <Stack direction='row' spacing={1}>
                  <Button variant="custom" className='text-green-600 hover:text-green-500' icon={<WhatsAppIcon />} onClick={shareOnWhatsApp} />
                  <Button variant='custom' className='text-blue-600 hover:text-blue-500' icon={<EmailIcon />} onClick={shareViaEmail} />
                </Stack>
              </Stack>
              <Box flex={1} className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex lg:hidden border border-neutral-100 shadow-md ${isExpanded ? 'h-auto' : 'max-h-auto'}`}>
                {isExpanded ? (
                  <Stack direction="column" alignItems="start" justifyContent="space-between">
                    <Typography variant="h5" gutterBottom>
                      {video?.title}
                    </Typography>
                    <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-3'>
                      <span className='mb-1 text-base font-semibold uppercase underline'>Personal Information</span>
                      <div className='flex flex-wrap gap-1 justify-start'>
                        <span className='font-semibold text-neutral-200'>Full Name:</span>
                        <span>
                          {video?.authorProfile?.userDetails?.firstName} {video?.authorProfile?.userDetails?.middleName} {video?.authorProfile?.userDetails?.lastName}
                        </span>
                      </div>
                      <div className='flex flex-wrap gap-1 justify-start'>
                        <span className='font-semibold text-neutral-200'>Email:</span>
                        <span>
                          {video?.authorProfile?.userDetails?.email}
                        </span>
                      </div>
                      <div className='flex flex-wrap gap-1 justify-start'>
                        <span className='font-semibold text-neutral-200'>Gender:</span>
                        <span>
                          {video?.authorProfile?.userDetails?.gender}
                        </span>
                      </div>
                      <div className='flex flex-wrap gap-1 justify-start'>
                        <span className='font-semibold text-neutral-200'>Phone Number:</span>
                        <span>
                          {video?.authorProfile?.userDetails?.phoneNo}
                        </span>
                      </div>
                      <div className='flex flex-wrap gap-1 justify-start'>
                        <span className='font-semibold text-neutral-200'>Date of Birth:</span>
                        <span>
                          {handleDate(video?.authorProfile?.userDetails?.dateOfBirth)}
                        </span>
                      </div>
                    </Stack>
                    {video?.authorProfile?.professionalDetails && (
                      <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-4'>
                        {(video?.authorProfile?.professionalDetails?.institution || video?.authorProfile?.professionalDetails?.course || video?.authorProfile?.professionalDetails?.degree) && (
                          <span className='mb-1 text-base font-semibold uppercase underline'>Professional Information</span>
                        )}
                        {video?.authorProfile?.professionalDetails?.course && (
                          <div className='flex flex-wrap gap-1 justify-start'>
                            <span className='font-semibold text-neutral-200'>Course of Study:</span>
                            <span>
                              {video?.authorProfile?.professionalDetails?.course}
                            </span>
                          </div>
                        )}
                        {video?.authorProfile?.professionalDetails?.degree && (
                          <div className='flex flex-wrap gap-1 justify-start'>
                            <span className='font-semibold text-neutral-200'>Degree:</span>
                            <span>
                              {video?.authorProfile?.professionalDetails?.degree}
                            </span>
                          </div>
                        )}
                        {video?.authorProfile?.professionalDetails?.classOfDegree && (
                          <div className='flex flex-wrap gap-1 justify-start'>
                            <span className='font-semibold text-neutral-200'>Degree Class:</span>
                            <span>
                              {video?.authorProfile?.professionalDetails?.classOfDegree}
                            </span>
                          </div>
                        )}
                        {video?.authorProfile?.professionalDetails?.institution && (
                          <div className='flex flex-wrap gap-1 justify-start'>
                            <span className='font-semibold text-neutral-200'>Institution of Study:</span>
                            <span>
                              {video?.authorProfile?.professionalDetails?.institution}
                            </span>
                          </div>
                        )}
                        {video?.authorProfile?.professionalDetails?.nyscStartYear && (
                          <div className='flex flex-wrap gap-1 justify-start'>
                            <span className='font-semibold text-neutral-200'>NYSC Start Year:</span>
                            <span>
                              {video?.authorProfile?.professionalDetails?.nyscStartYear}
                            </span>
                          </div>
                        )}
                        {video?.authorProfile?.professionalDetails?.nyscEndYear && (
                          <div className='flex flex-wrap gap-1 justify-start'>
                            <span className='font-semibold text-neutral-200'>NYSC End Year:</span>
                            <span>
                              {video?.authorProfile?.professionalDetails?.nyscEndYear}
                            </span>
                          </div>
                        )}
                        {video?.authorProfile?.professionalDetails?.nyscStateCode && (
                          <div className='flex flex-wrap gap-1 justify-start'>
                            <span className='font-semibold text-neutral-200'>NYSC State Code:</span>
                            <span>
                              {video?.authorProfile?.professionalDetails?.nyscStateCode}
                            </span>
                          </div>
                        )}
                      </Stack>
                    )}
                    {video?.authorProfile?.professionalDetails && (
                      <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-4'>
                        {video?.authorProfile?.professionalDetails?.businessName && (
                          <span className='mb-1 text-base font-semibold uppercase underline'>Business Information</span>
                        )}
                        {video?.authorProfile?.professionalDetails?.businessName && (
                          <div className='flex flex-wrap gap-1 justify-start'>
                            <span className='font-semibold text-neutral-200'>Business Name:</span>
                            <span>
                              {video?.authorProfile?.professionalDetails?.businessName}
                            </span>
                          </div>
                        )}
                        {video?.authorProfile?.professionalDetails?.businessPhone && (
                          <div className='flex flex-wrap gap-1 justify-start'>
                            <span className='font-semibold text-neutral-200'>Business Phone Number:</span>
                            <span>
                              {video?.authorProfile?.professionalDetails?.businessPhone}
                            </span>
                          </div>
                        )}
                        {video?.authorProfile?.professionalDetails?.industry && (
                          <div className='flex flex-wrap gap-1 justify-start'>
                            <span className='font-semibold text-neutral-200'>Business Sector:</span>
                            <span>
                              {video?.authorProfile?.professionalDetails?.industry}
                            </span>
                          </div>
                        )}
                        {video?.authorProfile?.professionalDetails?.businessProfile && (
                          <div className='flex flex-col gap-1 justify-start w-full'>
                            <span className='font-semibold text-neutral-200'>Business Profile:</span>
                            <HtmlContent html={video?.authorProfile?.professionalDetails?.businessProfile} />
                          </div>
                        )}
                        {video?.authorProfile?.professionalDetails?.coverLetter && (
                          <div className='flex flex-col gap-1 justify-start w-full'>
                            <span className='font-semibold text-neutral-200'>Why you should hire ME:</span>
                            <HtmlContent html={video?.authorProfile?.professionalDetails?.coverLetter} />
                          </div>
                        )}
                      </Stack>
                    )}
                    {video?.videoDescription && (
                      <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-4 w-full'>
                        <span className='mb-1 text-base font-semibold uppercase underline'>Video Description</span>
                        <HtmlContent html={video?.videoDescription} />
                      </Stack>
                    )}
                  </Stack>
                ) : (
                  <Stack direction={'column'} alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" gutterBottom>
                      {video?.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Uploaded by {video?.authorProfile?.userDetails?.firstName} {video?.authorProfile?.userDetails?.middleName} {video?.authorProfile?.userDetails?.lastName}
                    </Typography>
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
            <Typography variant="body1" gutterBottom>
              {video?.title}
            </Typography>
            
            <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-3'>
              <span className='mb-1 text-base font-semibold uppercase underline'>Personal Information</span>
              <div className='flex flex-wrap gap-1 justify-start'>
                <span className='font-semibold text-neutral-200'>Full Name:</span>
                <span>
                  {video?.authorProfile?.userDetails?.firstName} {video?.authorProfile?.userDetails?.middleName} {video?.authorProfile?.userDetails?.lastName}
                </span>
              </div>
              <div className='flex flex-wrap gap-1 justify-start'>
                <span className='font-semibold text-neutral-200'>Email:</span>
                <span>
                  {video?.authorProfile?.userDetails?.email}
                </span>
              </div>
              <div className='flex flex-wrap gap-1 justify-start'>
                <span className='font-semibold text-neutral-200'>Gender:</span>
                <span>
                  {video?.authorProfile?.userDetails?.gender}
                </span>
              </div>
              <div className='flex flex-wrap gap-1 justify-start'>
                <span className='font-semibold text-neutral-200'>Phone Number:</span>
                <span>
                  {video?.authorProfile?.userDetails?.phoneNo}
                </span>
              </div>
              <div className='flex flex-wrap gap-1 justify-start'>
                <span className='font-semibold text-neutral-200'>Date of Birth:</span>
                <span>
                  {handleDate(video?.authorProfile?.userDetails?.dateOfBirth)}
                </span>
              </div>
            </Stack>
            {video?.authorProfile?.professionalDetails && (
              <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-4'>
                {(video?.authorProfile?.professionalDetails?.institution || video?.authorProfile?.professionalDetails?.course || video?.authorProfile?.professionalDetails?.degree) && (
                  <span className='mb-1 text-base font-semibold uppercase underline'>Professional Information</span>
                )}
                {video?.authorProfile?.professionalDetails?.course && (
                  <div className='flex flex-wrap gap-1 justify-start'>
                    <span className='font-semibold text-neutral-200'>Course of Study:</span>
                    <span>
                      {video?.authorProfile?.professionalDetails?.course}
                    </span>
                  </div>
                )}
                {video?.authorProfile?.professionalDetails?.degree && (
                  <div className='flex flex-wrap gap-1 justify-start'>
                    <span className='font-semibold text-neutral-200'>Degree:</span>
                    <span>
                      {video?.authorProfile?.professionalDetails?.degree}
                    </span>
                  </div>
                )}
                {video?.authorProfile?.professionalDetails?.classOfDegree && (
                  <div className='flex flex-wrap gap-1 justify-start'>
                    <span className='font-semibold text-neutral-200'>Degree Class:</span>
                    <span>
                      {video?.authorProfile?.professionalDetails?.classOfDegree}
                    </span>
                  </div>
                )}
                {video?.authorProfile?.professionalDetails?.institution && (
                  <div className='flex flex-wrap gap-1 justify-start'>
                    <span className='font-semibold text-neutral-200'>Institution of Study:</span>
                    <span>
                      {video?.authorProfile?.professionalDetails?.institution}
                    </span>
                  </div>
                )}
                {video?.authorProfile?.professionalDetails?.nyscStartYear && (
                  <div className='flex flex-wrap gap-1 justify-start'>
                    <span className='font-semibold text-neutral-200'>NYSC Start Year:</span>
                    <span>
                      {video?.authorProfile?.professionalDetails?.nyscStartYear}
                    </span>
                  </div>
                )}
                {video?.authorProfile?.professionalDetails?.nyscEndYear && (
                  <div className='flex flex-wrap gap-1 justify-start'>
                    <span className='font-semibold text-neutral-200'>NYSC End Year:</span>
                    <span>
                      {video?.authorProfile?.professionalDetails?.nyscEndYear}
                    </span>
                  </div>
                )}
                {video?.authorProfile?.professionalDetails?.nyscStateCode && (
                  <div className='flex flex-wrap gap-1 justify-start'>
                    <span className='font-semibold text-neutral-200'>NYSC State Code:</span>
                    <span>
                      {video?.authorProfile?.professionalDetails?.nyscStateCode}
                    </span>
                  </div>
                )}
              </Stack>
            )}
            {video?.authorProfile?.professionalDetails && (
              <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-4'>
                {video?.authorProfile?.professionalDetails?.businessName && (
                  <span className='mb-1 text-base font-semibold uppercase underline'>Business Information</span>
                )}
                {video?.authorProfile?.professionalDetails?.businessName && (
                  <div className='flex flex-wrap gap-1 justify-start'>
                    <span className='font-semibold text-neutral-200'>Business Name:</span>
                    <span>
                      {video?.authorProfile?.professionalDetails?.businessName}
                    </span>
                  </div>
                )}
                {video?.authorProfile?.professionalDetails?.businessPhone && (
                  <div className='flex flex-wrap gap-1 justify-start'>
                    <span className='font-semibold text-neutral-200'>Business Phone Number:</span>
                    <span>
                      {video?.authorProfile?.professionalDetails?.businessPhone}
                    </span>
                  </div>
                )}
                {video?.authorProfile?.professionalDetails?.industry && (
                  <div className='flex flex-wrap gap-1 justify-start'>
                    <span className='font-semibold text-neutral-200'>Business Sector:</span>
                    <span>
                      {video?.authorProfile?.professionalDetails?.industry}
                    </span>
                  </div>
                )}
                {video?.authorProfile?.professionalDetails?.businessProfile && (
                  <div className='flex flex-col gap-1 justify-start w-full'>
                    <span className='font-semibold text-neutral-200'>Business Profile:</span>
                    <HtmlContent html={video?.authorProfile?.professionalDetails?.businessProfile} />
                  </div>
                )}
                {video?.authorProfile?.professionalDetails?.coverLetter && (
                  <div className='flex flex-col gap-1 justify-start w-full'>
                    <span className='font-semibold text-neutral-200'>Why you should hire ME:</span>
                    <HtmlContent html={video?.authorProfile?.professionalDetails?.coverLetter} />
                  </div>
                )}
              </Stack>
            )}
            {video?.videoDescription && (
              <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-4 w-full'>
                <span className='mb-1 text-base font-semibold uppercase underline'>Video Description</span>
                <HtmlContent html={video?.videoDescription} />
              </Stack>
            )}
          </Stack>
        ) : (
          <Stack direction={'column'} alignItems="start" justifyContent="space-between" className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex-col lg:flex hidden border border-neutral-100 shadow-md ${isExpanded ? 'h-auto' : 'max-h-auto'}`}>
            <Typography variant="h6" gutterBottom>
              {video?.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Uploaded by {video?.authorProfile?.userDetails?.firstName} {video?.authorProfile?.userDetails?.middleName} {video?.authorProfile?.userDetails?.lastName}
            </Typography>
            <Button onClick={handleReadMoreClick} label='Read More' variant="custom" className='video-description' ></Button>
          </Stack>
        )}

        {/* ITEM SHOULD BE HERE */}
        {isFromTalentGallery && relatedVideos.length > 0 && (
          <Box className="related-videos bg-black">
            <Typography component='div' variant='h6' className="grid grid-cols-1 gap-4">Related Videos</Typography>
              {relatedVideos.map(video => (
                <VideoCard key={id} video={video} />
              ))}
          </Box>
        )}
      </Box>
    </Stack>
  );
};

export default VideoDetails;
