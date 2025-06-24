import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Box, Stack, Typography, Card, CardMedia, CardContent, Paper, CircularProgress } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import './../../styles.scss';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { AdPlayer, Button, HtmlContent } from '@video-cv/ui-components';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import { handleDate } from '@video-cv/utils';

interface VideoDetails {
  id: number
  title: string
  description: string
  videoUrl: string
  uploaderName: string
  uploadDate: string
  views: number
  price: number;
  role: string;
}

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
  reasonForRejaction?: string
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
  hasSubscription: {
      userId: number,
      subscriptionId: number,
      videoId: number,
      totalAmountPaid: number,
      canAccessProduct: string,
      datePaid: string,
      checkOutId: number
  },
}

const VideoDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video>();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [viewCounted, setViewCounted] = useState(false)
  const [showAd, setShowAd] = useState(true)
  const [adUrl, setAdUrl] = useState("")
  const [adType, setAdType] = useState<"video" | "image">("video");
  const [adId, setAdId] = useState<string | null>(null);
  const [addedToHistory, setAddedToHistory] = useState(false);

  const itemsPerPage = 4;

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);


  useEffect(() => {
    fetchVideoDetails();
    getRandomAds();
  }, []);


  const fetchVideoDetails = async () => {
    setLoading(true);
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.code === '200') {
        let data = await resp.videoDetails;
        setVideo(data);
        // if (location.state?.fromVideosList) {
        //   incrementViewCount()
        // }
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
      const randomAd = await getData(`${CONFIG.BASE_URL}${apiEndpoints.RANDOM_ADS}`)

      if (!randomAd.data || !randomAd.data.coverURL) {
        console.error("Invalid ad data received")
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
      setAdId(resp.id);
      setAdType(isVideo ? "video" : "image");

      if (resp.id) {
        try {
          await postData(`${CONFIG.BASE_URL}${apiEndpoints.RANDOM_ADS_COUNT}/${resp.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        }
        catch (err) {
          console.error("Error updating ad view count:", err)
        }
      }
    }
    catch (err) {
      console.error("Error fetching random ad:", err)
      setShowAd(false)
    }
  }



  const handleAdEnd = async () => {
    setShowAd(false);
  };



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
  };


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
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !video) {
    return (
      <Box className="items-center justify-center min-h-screen">
        <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-0 p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
      </Box>
    )
  };


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-200 text-green-700"
      case "InReview":
        return "bg-yellow-200 text-yellow-700"
      case "Rejected":
        return "bg-red-200 text-red-700"
      case "Closed":
        return "bg-gray-200 text-gray-700"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }


  // const shareOnWhatsApp = (videoUrl: string) => {
  //   const message = `Check out my video: ${videoUrl}`;
  //   const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  //   window.open(whatsappUrl, '_blank');
  // }

  // const shareViaEmail = (videoUrl: string) => {
  //   const subject = `Check out my video`;
  //   const body = `Here is the link: ${videoUrl}`;
  //   const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  //   window.location.href = mailtoUrl;
  // };


  return (
    <Stack direction={{ sm: 'column', md: 'row' }} gap={3} className="min-h-screen flex-col xlg:flex-row mx-auto py-4 px-3 md:px-7 max-w-8xl">
      <Stack direction="column" flex={4} spacing={3}>
        <ChevronLeftIcon className="cursor-pointer text-4xl mr-1 top-0 p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
        <Box className="rounded-lg">
          <Stack mx='auto' direction="column" spacing={4}>
            <Box className="w-full top-24 rounded-3xl">
            {showAd
              ? (
                  <AdPlayer adUrl={adUrl} adType={adType} adDuration={5} onAdEnd={handleAdEnd} />
              )
              : (
                  <ReactPlayer url={video?.videoUrl} className="react-player" controls style={{ borderRadius: '1.5rem', overflow: 'hidden' }} onStart={incrementViewCount} onProgress={handleProgress} />
            )}
            </Box>
            <Box className="flex flex-col gap-1">
              <Typography variant="h5" gutterBottom>
                {video?.title}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Uploaded on {new Date(video?.dateCreated).toLocaleDateString()}
              </Typography>
              {/* <Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
                <Typography variant="subtitle2">{video?.views} views</Typography>
              </Stack> */}
              <Box className='flex items-center justify-between'>
                <Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
                  <Typography variant="subtitle2">{video?.views} views</Typography>
                </Stack>
                {video?.status && (
                  <Stack direction="row" alignItems="center" justifyContent="space-between" className='gap-1 px-2'>
                    <span className='text-sm'>Video Status: </span>
                    <span className={`text-sm px-2 py-1 rounded-lg ${getStatusColor(video.status)}`}>
                      {video?.status}
                    </span>
                  </Stack>
                )}
              </Box>
              <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-3'>
                <span className='mb-1 text-base font-semibold uppercase underline'>Personal Information</span>
                <div className='flex flex-wrap gap-1 justify-center'>
                  <span className='font-semibold text-neutral-200'>Full Name:</span>
                  <span>
                    {video?.authorProfile?.userDetails?.firstName} {video?.authorProfile?.userDetails?.middleName} {video?.authorProfile?.userDetails?.lastName}
                  </span>
                </div>
                <div className='flex flex-wrap gap-1 justify-center'>
                  <span className='font-semibold text-neutral-200'>Email:</span>
                  <span>
                    {video?.authorProfile?.userDetails?.email}
                  </span>
                </div>
                <div className='flex flex-wrap gap-1 justify-center'>
                  <span className='font-semibold text-neutral-200'>Gender:</span>
                  <span>
                    {video?.authorProfile?.userDetails?.gender}
                  </span>
                </div>
                <div className='flex flex-wrap gap-1 justify-center'>
                  <span className='font-semibold text-neutral-200'>Phone Number:</span>
                  <span>
                    {video?.authorProfile?.userDetails?.phoneNo}
                  </span>
                </div>
                <div className='flex flex-wrap gap-1 justify-center'>
                  <span className='font-semibold text-neutral-200'>Date of Birth:</span>
                  <span>
                    {handleDate(video?.authorProfile?.userDetails?.dateOfBirth)}
                  </span>
                </div>
              </Stack>
              {video?.authorProfile?.professionalDetails && (
                <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-4 w-full'>
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
              {video?.authorProfile?.professionalDetails?.coverLetter && (
                <div className='flex flex-col gap-1 justify-start w-full my-1'>
                  <span className='font-semibold text-neutral-200 uppercase underline'>Why you should hire ME:</span>
                  <HtmlContent html={video?.authorProfile?.professionalDetails?.coverLetter} />
                </div>
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
                </Stack>
              )}
              {video?.videoDescription && (
                <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-4 w-full'>
                  <span className='mb-1 text-base font-semibold uppercase underline'>Video Description</span>
                  <HtmlContent html={video?.videoDescription} />
                </Stack>
              )}
            </Box>
          </Stack>
        </Box>
      </Stack>

      <Box className={`flex-col w-[30%] gap-4 mt-[3.25rem] xlg:flex hidden`}>
        {/* {isExpanded ? ( */}
          <Stack direction="column" alignItems="start" justifyContent="space-between" className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex-col xlg:flex hidden border border-neutral-100 shadow-md ${isExpanded ? 'h-auto' : 'max-h-auto'}`}>
            <Typography variant="h5" gutterBottom>
              {video?.title}
            </Typography>
            <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-3'>
              <span className='mb-1 text-base font-semibold uppercase underline'>Personal Information</span>
              <div className='flex flex-wrap gap-1 justify-center'>
                <span className='font-semibold text-neutral-200'>Full Name:</span>
                <span>
                  {video?.authorProfile?.userDetails?.firstName} {video?.authorProfile?.userDetails?.middleName} {video?.authorProfile?.userDetails?.lastName}
                </span>
              </div>
              <div className='flex flex-wrap gap-1 justify-center'>
                <span className='font-semibold text-neutral-200'>Email:</span>
                <span>
                  {video?.authorProfile?.userDetails?.email}
                </span>
              </div>
              <div className='flex flex-wrap gap-1 justify-center'>
                <span className='font-semibold text-neutral-200'>Gender:</span>
                <span>
                  {video?.authorProfile?.userDetails?.gender}
                </span>
              </div>
              <div className='flex flex-wrap gap-1 justify-center'>
                <span className='font-semibold text-neutral-200'>Phone Number:</span>
                <span>
                  {video?.authorProfile?.userDetails?.phoneNo}
                </span>
              </div>
              <div className='flex flex-wrap gap-1 justify-center'>
                <span className='font-semibold text-neutral-200'>Date of Birth:</span>
                <span>
                  {handleDate(video?.authorProfile?.userDetails?.dateOfBirth)}
                </span>
              </div>
            </Stack>
            {video?.authorProfile?.professionalDetails && (
              <Stack direction="column" alignItems="start" justifyContent="space-between" className='gap-1 mt-4 w-full'>
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
      </Box>
    </Stack>
  );
};

export default VideoDetails;
