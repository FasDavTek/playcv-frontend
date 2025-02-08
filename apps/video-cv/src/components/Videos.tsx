import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { videoCVs } from '../utils/videoCVs'
import { ChannelCard, Loader, VideoCard } from '.';
import { Button } from '@video-cv/ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { getData } from './../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../libs/utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from './../../../../libs/utils/localStorage';
import { toast } from 'react-toastify';

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
}

interface VideosProps {
  category?: string
  limit?: number
  type?: "pinned" | "latest" | "category"
}

// TODO: Rename component
const Videos: React.FC<VideosProps> = ({ category, limit = 100, type = "category" }) => {
  const navigate = useNavigate();
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
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?Download=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let data;
        if (response.code === '00') {
          data = await response.videos;
          let approvedVideos = data.filter((video: Video) => video.status === "Approved")

          if (type === "pinned") {
            approvedVideos = approvedVideos.filter((video: Video) => video.type === "Pinned")
          } else if (type === "latest") {
            approvedVideos.sort(
              (a: Video, b: Video) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
            )
          } else if (category) {
            approvedVideos = approvedVideos.filter((video: Video) => video.category === category)
          }

          setVideos(approvedVideos)
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
  }, [calculateColumns]);
  
  if (loading) return <Loader />;
  if (!videos.length) return <p>No videos available</p>;

  const filteredVideos = category ? videos.filter(video => video.category === category) : videos;
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * videosPerPage;
  const currentVideos = videos?.slice(startIndex, startIndex + videosPerPage);

  return (
    <div className="space-y-4">
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center md:justify-items-start`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {/* {videoCVs.map((item: any, idx: number) => (
            <Box key={idx}>{item.url && <VideoCard video={item} />}</Box>
          ))} */}
          {currentVideos.map((video: Video) => (
              <Box key={video.id}>
                <VideoCard video={video} />
              </Box>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <Link to={'/talent'} className='mr-3 text-blue-600'>
            <span>View more</span>
          </Link>
          <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '0.875rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 0}></Button>
          <Button icon={<NavigateNextIcon sx={{ fontSize: '0.875rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
        </div>
    </div>
  );
};

export default Videos;
