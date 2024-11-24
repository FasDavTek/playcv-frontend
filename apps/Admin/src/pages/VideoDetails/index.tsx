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

const VideoDetails = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const navigate = useNavigate();
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}${videoId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch video details')
        }
        const data = await response.json()
        setVideoDetails(data)
      } 
      catch (err) {
        console.error('Error fetching video details:', err)
        setError('Failed to load video details. Please try again later.')
        toast.error('Failed to load video details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    if (videoId) {
      fetchVideoDetails()
    }
  }, [videoId]);


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

  if (error || !videoDetails) {
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
    <Stack direction={{ sm: 'column', md: 'row' }} gap={3} className="min-h-screen flex-col md:flex-row mx-auto py-4 px-3 md:px-7 max-w-8xl">
      <Stack direction="column" flex={4} spacing={3}>
        <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-0 p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
        <Box className="rounded-lg">
          <Stack mx='auto' direction="column" spacing={4}>
            <Box className="w-full top-24 rounded-3xl">
              <ReactPlayer url={videoDetails.videoUrl} className="react-player" controls style={{ borderRadius: '1.5rem', overflow: 'hidden' }} />
            </Box>
            <Box className="flex flex-col gap-1">
              <Typography variant="h5" gutterBottom>
                {videoDetails.title}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Uploaded by {videoDetails.uploaderName} on {new Date(videoDetails.uploadDate).toLocaleDateString()}
              </Typography>
              <Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
                <Typography variant="h6" gutterBottom>
                  {videoDetails.role}
                </Typography>
                <Typography variant="subtitle2">{videoDetails.views} views</Typography>
              </Stack>
              <Box flex={1} className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex lg:hidden border border-neutral-100 shadow-md max-h-44`}>
                  <Stack direction="column" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" gutterBottom>
                      {videoDetails.title}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {videoDetails.role}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Uploaded by {videoDetails.uploaderName}
                    </Typography>
                    <Typography variant="body2">
                      {videoDetails.description}
                    </Typography>
                    <Typography variant='caption'>
                      Uploaded on {new Date(videoDetails.uploadDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant='caption'>
                      {videoDetails.views}
                    </Typography>
                  </Stack>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Stack>

      <Box className={`flex-col w-[30%] gap-4 mt-[3.25rem] lg:flex hidden`}>
          <Stack direction="column" alignItems="start" justifyContent="space-between" className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex-col lg:flex hidden border border-neutral-100 shadow-md h-auto`}>
            <Typography variant="h5" gutterBottom>
              {videoDetails.title}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {videoDetails.role}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Uploaded by {videoDetails.uploaderName}
            </Typography>
            <Typography variant="body2">
              {videoDetails.description}
            </Typography>
            <Typography variant='caption'>
              Uploaded on {new Date(videoDetails.uploadDate).toLocaleDateString()}
            </Typography>
            <Typography variant='caption'>
              {videoDetails.views}
            </Typography>
          </Stack>
      </Box>
    </Stack>
  );
};

export default VideoDetails;
