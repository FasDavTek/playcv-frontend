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
import { Button } from '@video-cv/ui-components';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { getData } from './../../../../../libs/utils/apis/apiMethods';

interface VideoDetails {
  id: string
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

const VideoDetails = () => {
  const { id } = useParams<{ id: any }>()
  const navigate = useNavigate();
  const location = useLocation();
  const [video, setVideo] = useState<Video | undefined>(location.state?.video);
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  console.log(video);
  console.log(id);

//   const fetchVideoDetails = async () => {
//     if (!video && id) {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
//         const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (resp && resp.videoDetails) {
//           setVideo(resp.videoDetails);
//         }
//         else {
//           setError('Failed to fetch related videos')
//         }
//       }
//       catch (err) {
//         setError('Error fetching video detail');
//         toast.error('Error fetching video detail');
//       }
//       finally {
//         setLoading(false);
//       }
//   }
//   else if (!id) {
//     setError('No video Id provided');
//     setLoading(false);
//     return;
//   }
// }


// useEffect(() => {
//   fetchVideoDetails();
// }, [video, id]);


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
        {error || 'Video not found'}
      </Typography>
    </Box>
  )
}


  return (
    <Stack direction={{ sm: 'column', md: 'row' }} gap={3} className="min-h-screen flex-col md:flex-row mx-auto py-4 px-3 md:px-7 w-[98%]">
      <Stack direction="column" flex={4} spacing={3}>
        <ChevronLeftIcon className="cursor-pointer text-3xl mr-1 top-0 p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
        <Box className="rounded-lg">
          <Stack mx='auto' direction="column" spacing={4}>
            <Box className="w-full top-24 rounded-3xl">
              <ReactPlayer url={video?.videoUrl} className="react-player" controls style={{ borderRadius: '1.5rem', overflow: 'hidden' }} />
            </Box>
            <Box className="flex flex-col gap-1">
              <Typography variant="h5" gutterBottom>
                {video?.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Uploaded by {video?.authorProfile.userDetails.fullName} on {new Date(video?.dateCreated).toLocaleDateString()}
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
                <Typography variant="subtitle2">{video?.views} views</Typography>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>

      {/* <Box className={`flex-col w-[30%] gap-4 mt-[3.25rem] md:flex hidden`}>
          <Stack direction="column" alignItems="start" justifyContent="space-between" className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex-col lg:flex hidden border border-neutral-100 shadow-md h-auto`}>
            <Typography variant="h5" gutterBottom>
              {video?.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Uploaded by {video?.authorProfile.userDetails.fullName}
            </Typography>
            <Typography variant="body2">
              {video?.description}
            </Typography>
          </Stack>
      </Box> */}
    </Stack>
  );
};

export default VideoDetails;
