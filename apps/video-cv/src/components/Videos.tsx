import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { videoCVs } from '../utils/videoCVs'
import { ChannelCard, Loader, VideoCard } from '.';
import { Button } from '@video-cv/ui-components';
import { Link } from 'react-router-dom';
import { getData } from './../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../libs/utils/helpers/config';

interface Video {
  id: string;
  uploaderName: string;
  role: string;
  videoUrl: string;
  uploadDate: string;
  views: number;
  isActive: boolean;
  imageSrc?: string;
  price: number;
  description: string;
  pinned?: boolean;
}

// TODO: Rename component
const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [videosPerPage, setVideosPerPage] = useState(0);
  const [columns, setColumns] = useState(1);

  const calculateColumns = () => {
    const width = window.innerWidth;
    if (width >= 1536) return 6; // 2xl
    if (width >= 1024) return 5; // lg
    if (width >= 768) return 3; // md
    if (width >= 450) return 2; // sm
    return 1;
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?Page=1&Limit=100`);
        if (response.code === "201") {
          setVideos(response.data);
        } else {
          console.error('Unable to fetch videos:', response.message);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const cols = calculateColumns();
      setColumns(cols);
      setVideosPerPage(cols * 2);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (loading) return <Loader />;
  if (!videos.length) return <p>No videos available</p>;

  const totalPages = Math.ceil(videos.length / videosPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * videosPerPage;
  const currentVideos = videos.slice(startIndex, startIndex + videosPerPage);

  return (
    <div>
        <div className={` items-center grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* {videoCVs.map((item: any, idx: number) => (
            <Box key={idx}>{item.url && <VideoCard video={item} />}</Box>
          ))} */}
          {currentVideos.map((video: Video) => (
            // <Link key={video.id} to={`/video/${video.id}`} state={video}>
              <Box key={video.id}>
                <VideoCard video={video} />
              </Box>
            // </Link>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <Link to={'/talent'} className='mr-3 text-blue-600'>
            <span>View more</span>
          </Link>
          <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 0}></Button>
          <Button icon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
        </div>
    </div>
  );
};

export default Videos;
