import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Stack, Box } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VideoCard from './VideoCard';
import { Button, Loader } from '@video-cv/ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { deleteData, getData } from './../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../libs/utils/helpers/config';
import { SESSION_STORAGE_KEYS } from './../../../../libs/utils/sessionStorage';
import { toast } from 'react-toastify';
import Filter, { FilterConfig } from './../../../../libs/ui-components/Filter';

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

interface VideosProps {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  title?: string
  authorName?: string
  status?: string
  search?: string
  category?: string
  categoryId?: number
  download?: boolean
  userType?: string
  userId?: string
  type?: "pinned" | "latest" | "category"
  filterConfig?: FilterConfig[]
  onFilterChange?: (viewedFilters: Record<string, any>) => void
}

interface VideoType {
  id: string
  name: string
  buyPrice: number
}

// TODO: Rename component
const Videos: React.FC<VideosProps> = ({ page = 1, limit = 10, startDate, endDate, title, authorName, status = 'Approved', category, filterConfig = [], onFilterChange, categoryId, search, download = false, userType, userId, type = "category" }) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [pinnedVideos, setPinnedVideos] = useState<Video[]>([]);
  const [regularVideos, setRegularVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  const [videosPerPage, setVideosPerPage] = useState(0);
  const [videoTypes, setVideoTypes] = useState<VideoType[]>([]);
  const [columns, setColumns] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [viewedFilters, setViewedFilters] = useState<Record<string, any>>({});

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
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: limit.toString(),
          ...viewedFilters,
        });
        // const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

        let queryString = `Page=${currentPage}&Limit=${limit}&Download=${download}`

        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_WATCH_HISTORY}?${queryParams}`);

        let videoData;
        
        if (response.code === '00') {
          videoData = await response.data.videos;
          setVideos(videoData)
          setTotalPages(Math.ceil(response.data.total / limit));
        }
      } 
      catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos(); 
  }, [currentPage, limit, viewedFilters]);



  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     const cols = calculateColumns();
  //     setColumns(cols);
  //     setVideosPerPage(cols * 2);
  //   };

  //   handleResize();
  //   window.addEventListener('resize', handleResize);
    
  //   return () => window.removeEventListener('resize', handleResize);
  // }, [calculateColumns]);

  // const filteredVideos = category ? videos.filter(video => video.category === category) : videos;


  const handleFilterChange = useCallback(
    (newFilters: Record<string, any>) => {
      setViewedFilters(newFilters);
      onFilterChange?.(newFilters);
      setCurrentPage(1); // Reset to the first page when viewedFilters change
    },
    [onFilterChange]
  );

  const clearFilters = () => {
    setViewedFilters({});
    onFilterChange?.({});
  };


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = currentPage * videosPerPage;
  const currentVideos = videos?.slice(startIndex, startIndex + videosPerPage);


  const handleDeleteVideo = async (videoId: number) => {
    try {
      const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
      const resp = await deleteData(`${CONFIG.BASE_URL}${apiEndpoints.DELETE_FROM_WATCH_HISTORY}?videoId=${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (resp.succeeded === true) {
        toast.success('Video removed from watch history');
        setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
      } else {
        toast.error('Failed to delete video from watch history');
      }
    } catch (err) {
      console.error('Error deleting video from watch history:', err);
      toast.error('Failed to delete video from watch history');
    }
  };


  const filteredVideos = useMemo(() => {
    let filtered = videos;

    if (viewedFilters.title) {
      filtered = filtered.filter((video) =>
        video.title.toLowerCase().includes(viewedFilters.title.toLowerCase())
      );
    }

    if (viewedFilters.category) {
      filtered = filtered.filter((video) => video.category === viewedFilters.category);
    }

    if (viewedFilters.status) {
      filtered = filtered.filter((video) => video.status === viewedFilters.status);
    }

    return filtered;
  }, [videos, viewedFilters]);



  if (!videos.length && loading) return <Loader />
  if (error) return <p>{error}</p>
  if (!videos.length) return <p>No videos available</p>

  return (
    <div className="space-y-4">

      <div className=" mt-5 border border-neutral-100 rounded-2xl py-4">
        {filterConfig.length > 0 && (
          <Filter
            config={filterConfig} onFilterChange={handleFilterChange} filters={viewedFilters}
          />
        )}
      </div>
        
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center md:justify-items-start`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {filteredVideos.map((video: Video) => (
          <VideoCard key={video.id} video={video} onDelete={handleDeleteVideo} />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1.45rem' }} />} variant={currentPage === 1 ? 'custom' : 'black'} onClick={handlePrevPage} disabled={currentPage === 1}></Button>

        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'black' : 'custom'}
            label={page.toString()}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'active text-sm' : ''}
          />
        ))}

        <Button icon={<NavigateNextIcon sx={{ fontSize: '1.45rem' }} />} variant={currentPage === totalPages ? 'custom' : 'black'} onClick={handleNextPage} disabled={currentPage === totalPages}></Button>
      </div>
    </div>
  );
};

export default Videos;