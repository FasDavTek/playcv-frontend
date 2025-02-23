// import React, { useEffect, useState } from 'react';
// import { Stack, Box } from '@mui/material';
// import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// import { videoCVs } from '../utils/videoCVs'
// import { ChannelCard, Loader, VideoCard } from '.';
// import { Button } from '@video-cv/ui-components';
// import { Link, useNavigate } from 'react-router-dom';
// import { getData } from './../../../../libs/utils/apis/apiMethods';
// import { apiEndpoints } from './../../../../libs/utils/apis/apiEndpoints';
// import CONFIG from './../../../../libs/utils/helpers/config';
// import { LOCAL_STORAGE_KEYS } from './../../../../libs/utils/localStorage';
// import { toast } from 'react-toastify';

// interface Video {
//   id: number
//   title: string
//   typeId: number
//   type: string
//   transcript: string
//   categoryId: number
//   category: string | null
//   userId: string
//   dateCreated: string
//   views: number
//   videoUrl: string
//   thumbnailUrl: string
//   status: string
//   price: number
//   totalRecords: number
//   rejectionReason?: string
//   authorProfile: {
//     userDetails: {
//       fullName: string
//       email: string
//       profileImage: string | null
//       userId: string;
//       firstName: string;
//       middleName: string;
//       lastName: string;
//       phoneNo: string;
//       dateOfBirth: string;
//       gender: string;
//       type: string;
//       isActive: boolean;
//       phoneVerification: boolean;
//       isBusinessUser: boolean;
//       isProfessionalUser: boolean;
//       isAdmin: boolean;
//       isEmailVerified: boolean;
//       isDeleted: boolean;
//       createdAt: string;
//       updatedAt: string;
//       lastLoginDate: string;
//       genderId: number;
//     }
//   }
//   paymentDetails: {
//     amountPaid: number
//     totalAmount: number
//     paymentStatus: string
//     currency: string
//     paymentDate: string
//   }
// }

// interface VideosProps {
//   category?: string
//   limit?: number
//   type?: "pinned" | "latest" | "category"
// }

// interface VideoType {
//   id: string
//   name: string
//   buyPrice: number
// }

// // TODO: Rename component
// const Videos: React.FC<VideosProps> = ({ category, limit = 100, type = "category" }) => {
//   const navigate = useNavigate();
//   const [videos, setVideos] = useState<Video[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [videosPerPage, setVideosPerPage] = useState(0);
//   const [videoTypes, setVideoTypes] = useState<VideoType[]>([])
//   const [columns, setColumns] = useState(1);

//   const calculateColumns = () => {
//     const width = window.innerWidth;
//     if (width >= 1536) return 6; // 2xl
//     if (width >= 1024) return 5; // lg
//     if (width >= 768) return 3; // md
//     if (width >= 450) return 2; // sm
//     return 1;
//   };




//   useEffect(() => {
//     const fetchVideoTypes = async () => {
//       try {
//         const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN)
//         const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD_TYPE}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         if (resp.code === "00") {
//           setVideoTypes(resp.data)
//         } 
//         else {
//           throw new Error("Failed to fetch video types")
//         }
//       } catch (error) {
//         console.error("Error fetching video types:", error)
//         toast.error("Failed to fetch video types")
//       }
//     }

//     fetchVideoTypes()
//   }, [])




//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

//         const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?Page=1&Limit=30`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         let data;
//         if (response.succeeded === true) {
//           data = await response.data;
//           let filteredVideos = data.filter((video: Video) => video.status === "Approved")


//           filteredVideos = filteredVideos.map((video: Video) => {
//             const videoType = videoTypes.find((vt) => vt.name === video.type)
//             return {
//               ...video,
//               price: videoType ? videoType.buyPrice : 0,
//             }
//           })


//           if (type === "pinned") {
//             filteredVideos = filteredVideos.filter((video: Video) => video.type === "Pinned")
//           }
//           else if (type === "latest") {
//             filteredVideos.sort(
//               (a: Video, b: Video) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
//             )
//           }
//           else if (category) {
//             filteredVideos = filteredVideos.filter((video: Video) => video.category === category)
//           }

//           setVideos(filteredVideos)
//         }
//       } catch (error) {
//         console.error('Error fetching videos:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (videoTypes.length > 0) {
//       fetchVideos()
//     }
//   }, [category, type, videoTypes]);

//   useEffect(() => {
//     const handleResize = () => {
//       const cols = calculateColumns();
//       setColumns(cols);
//       setVideosPerPage(cols * 2);
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
    
//     return () => window.removeEventListener('resize', handleResize);
//   }, [calculateColumns]);
  
//   if (loading) return <Loader />;
//   if (!videos.length) return <p>No videos available</p>;

//   const filteredVideos = category ? videos.filter(video => video.category === category) : videos;
//   const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

//   const handleNextPage = () => {
//     setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
//   };

//   const handlePrevPage = () => {
//     setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
//   };

//   const startIndex = currentPage * videosPerPage;
//   const currentVideos = videos?.slice(startIndex, startIndex + videosPerPage);

//   return (
//     <div className="space-y-4">
//         <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center md:justify-items-start`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
//           {/* {videoCVs.map((item: any, idx: number) => (
//             <Box key={idx}>{item.url && <VideoCard video={item} />}</Box>
//           ))} */}
//           {currentVideos.map((video: Video) => (
//               <Box key={video.id}>
//                 <VideoCard video={video} />
//               </Box>
//           ))}
//         </div>

//         <div className="flex items-center justify-end gap-2 mt-4">
//           <Link to={'/talents'} className='mr-3 text-blue-600 text-sm'>
//             <span>View more</span>
//           </Link>
//           <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '0.875rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 0}></Button>
//           <Button icon={<NavigateNextIcon sx={{ fontSize: '0.875rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
//         </div>
//     </div>
//   );
// };

// export default Videos;

























import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Loader, VideoCard } from '.';
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
  price: number
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
  paymentDetails: {
    amountPaid: number
    totalAmount: number
    paymentStatus: string
    currency: string
    paymentDate: string
  }
}

interface VideosProps {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  title?: string
  authorName?: string
  status?: string
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
const Videos: React.FC<VideosProps> = ({ page = 1, limit = 10, startDate, endDate, title, authorName, status = 'Approved', category, categoryId, download = false, userType, userId, type = "category" }) => {
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
        console.error("Error fetching video types:", error)
        toast.error("Failed to fetch video types")
      }
    }

    fetchVideoTypes()
  }, [])




  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        // const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

        let queryString = `Page=${currentPage}&Limit=${limit}&Download=${download}`
        if (startDate) queryString += `&StartDate=${startDate}`
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
  }, [currentPage, limit, startDate, endDate, title, authorName, status, category, download, userType, userId, type]);


  console.log(videos.length)

  console.log(currentPage)
  console.log(totalPages)


  console.log(videos)

  console.log(videos.length)

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
          <span className="text-sm text-gray-600 mr-10">
            Page {currentPage} of {totalPages}
          </span>
          <Link to={'/talents'} className='mr-3 text-blue-600 text-sm'>
            <span>View more</span>
          </Link>
          <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '0.875rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 1}></Button>
          <Button icon={<NavigateNextIcon sx={{ fontSize: '0.875rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages}></Button>
        </div>
    </div>
  );
};

export default Videos;