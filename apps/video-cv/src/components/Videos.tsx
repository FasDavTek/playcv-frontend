import React, { useEffect, useMemo, useState } from 'react';
import { Stack, Box } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Loader, VideoCard } from '.';
import { Button, useToast } from '@video-cv/ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { getData } from './../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../libs/utils/helpers/config';
import { SESSION_STORAGE_KEYS } from './../../../../libs/utils/sessionStorage';
import { toast } from 'react-toastify';

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
  rejectionReason?: string;
  reasonForRejaction?: string;
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

interface VideosProps {
  page?: number
  limit?: number
  start_Date?: string
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
}

interface VideoType {
  id: string
  name: string
  buyPrice: number
}

// TODO: Rename component
const Videos: React.FC<VideosProps> = ({ page = 1, limit = 10, start_Date, endDate, title, authorName, status = 'Approved', category, categoryId, search, download = false, userType, userId, type = "category" }) => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [pinnedVideos, setPinnedVideos] = useState<Video[]>([])
  const [regularVideos, setRegularVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(1)
  const [videosPerPage, setVideosPerPage] = useState(0);
  const [videoTypes, setVideoTypes] = useState<VideoType[]>([])
  const [columns, setColumns] = useState(1);
  const [error, setError] = useState<string | null>(null)

  const { showToast } = useToast();

  const calculateColumns = () => {
    const width = window.innerWidth;
    if (width >= 1536) return 6; // 2xl
    if (width >= 1024) return 5; // lg
    if (width >= 768) return 3; // md
    if (width >= 450) return 2; // sm
    return 1;
  };




  useEffect(() => {
    const fetchVideoTypes = async () => {
      try {
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD_TYPE}`)
        if (resp.code === "00") {
          setVideoTypes(resp.data)
        } 
        else {
          throw new Error("Failed to fetch video types")
        }
      } catch (error) {
        showToast("Failed to fetch video types", 'error');
      }
    }

    fetchVideoTypes()
  }, [])




  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        // const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

        let queryString = `Page=${currentPage}&Limit=${limit}&Download=${download}`
        if (start_Date) queryString += `&StartDate=${start_Date}`
        if (endDate) queryString += `&EndDate=${endDate}`
        if (title) queryString += `&Title=${encodeURIComponent(title)}`
        if (authorName) queryString += `&AuthorName=${encodeURIComponent(authorName)}`
        if (status) queryString += `&Status=${status}`
        if (category) queryString += `&Category=${category}`
        if (categoryId) queryString += `&CategoryId=${categoryId}`
        if (userType) queryString += `&UserType=${userType}`
        if (userId) queryString += `&UserId=${userId}`

        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?${queryString}`);

        let videoData;
        
        if (response.succeeded === true) {
          videoData = await response.data;
          // let filteredVideos = response.data.filter((video: Video) => video.status === "Approved")


          // filteredVideos = filteredVideos.map((video: Video) => {
          //   const videoType = videoTypes.find((vt) => vt.name === video.type)
          //   return {
          //     ...video,
          //     price: videoType ? videoType.buyPrice : 0,
          //   }
          // })

          const pinned = videoData.filter((video: Video) => video.type === "Pinned")
          const regular = videoData.filter((video: Video) => video.type !== "Pinned")

          // Sort videos based on the type prop
          if (type === "latest") {
            pinned.sort((a: Video, b: Video) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
            regular.sort((a: Video, b: Video) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
          }

          setPinnedVideos(pinned)
          setRegularVideos(regular)
          setVideos([...pinned, ...regular])
          setTotalPages(Math.ceil(response.totalRecords / limit));
        }
      } 
      catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos(); 
  }, [currentPage, limit, start_Date, endDate, title, authorName, status, category, download, userType, userId, type]);

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

  const filteredVideos = category ? videos.filter(video => video.category === category) : videos;


  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);


  // const pageNumbers = useMemo(() => {
  //   const pages = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     pages.push(i);
  //   }
  //   return pages;
  // }, [totalPages]);

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



  if (loading) return <Loader />
  if (error) return <p>{error}</p>
  if (!videos.length) return <p>No videos available</p>

  return (
    <div className="space-y-4">
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center md:justify-items-start`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {/* {videoCVs.map((item: any, idx: number) => (
            <Box key={idx}>{item.url && <VideoCard video={item} />}</Box>
          ))} */}
          {videos.map((video: Video) => (
            <VideoCard key={video.id} video={video} />
          ))}

          {/* {pinnedVideos.map((video: Video) => (
              <VideoCard key={video.id} video={video} />
          ))}
          {regularVideos.map((video: Video) => (
              <VideoCard key={video.id} video={video} />
          ))} */}
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <Link to={'/talents'} className='mr-3 text-blue-600 text-sm'>
            <span>View more</span>
          </Link>
          <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1.45rem' }} />} variant={currentPage === 1 ? 'custom' : 'black'} onClick={handlePrevPage} disabled={currentPage === 1}></Button>
          
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="text-sm text-gray-600">...</span>
            ) :
            (
              <Button
                key={`page-${page}-${index}`}
                variant={currentPage === page ? 'black' : 'custom'}
                label={page.toString()}
                onClick={() => handlePageChange(page as number)}
                className={currentPage === page ? 'active text-sm' : ''}
              />
            )
          ))}

          <Button icon={<NavigateNextIcon sx={{ fontSize: '1.45rem' }} />} variant={currentPage === totalPages ? 'custom' : 'black'} onClick={handleNextPage} disabled={currentPage === totalPages}></Button>
        </div>
    </div>
  );
};

export default Videos;