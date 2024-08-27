import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Box, Stack, Typography, Card, CardMedia, CardContent, Paper } from '@mui/material';
// import { Button } from '@video-cv/ui-components';
import { useLocation, useNavigate } from 'react-router-dom';
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import EmailIcon from '@mui/icons-material/Email';
import styled from '@emotion/styled';
// import { Images } from '@video-cv/assets';
import './../../styles.scss';
// import { toast } from 'react-toastify';
// import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import SwiperCore from 'swiper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// const ClampedText = styled(Typography)({
//   display: '-webkit-box',
//   WebkitBoxOrient: 'vertical',
//   overflow: 'hidden',
//   WebkitLineClamp: 2,
//   position: 'relative',
//   maxHeight: '3em',
//   '&:after': {
//     content: '""',
//     position: 'absolute',
//     bottom: -15,
//     left: 0,
//     right: 0,
//     height: '1em',
//     background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
//     WebkitFilter: 'blur(5px)',
//   },
// });

// const TabPanel = ({ children, value, index }: any) => {
//   return (
//     <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} style={{ width: '100%' }}>
//       {value === index && (
//         <Box sx={{ width: '100%' }} className="p-4 w-full">
//           <Typography>{children}</Typography>
//         </Box>
//       )}
//     </div>
//   );
// };

const VideoDetails = () => {
  const id = 'GDa8kZLNhJ4';
  const location = useLocation();
  const navigate = useNavigate();
  const video = location.state as {
    uploaderName: string;
    imageSrc: string;
    price: number;
    videoUrl: string;
    role: string;
    description: string;
  } | null;
  const [isExpanded, setIsExpanded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [videoDetails, setVideoDetails] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFromTalentGallery = location.state?.fromTalentGallery;
  const searchParams = location.state?.searchParams;

  const itemsPerPage = 4;


  const getVideoDetails = async (id: any) => {
    // Replace with actual API call or data fetching logic
    const response = await fetch(`/api/videos/${id}`);
    if (!response.ok) throw new Error('Failed to fetch video details');
    return response.json();
  };


  // const getRelatedVideos = async (searchParams: any) => {
  //   // Replace with actual API call or data fetching logic
  //   const query = new URLSearchParams(searchParams).toString();
  //   const response = await fetch(`/api/videos/related?${query}`);
  //   if (!response.ok) throw new Error('Failed to fetch related videos');
  //   return response.json();
  // };


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

  // const getTabs = (items: string[]) => {
  //   const numberOfTabs = Math.ceil(items.length / itemsPerPage);
  //   return Array.from({ length: numberOfTabs }, (_, index) => {
  //     const start = index * itemsPerPage;
  //     const end = start + itemsPerPage;
  //     return items.slice(start, end);
  //   });
  // };


  // useEffect(() => {
  //   // Fetch video details based on videoId
  //   const fetchVideoDetails = async () => {
  //     try {
  //       const details = await getVideoDetails(id);
  //       setVideoDetails(details);
  //       setLoading(false);
  //     } catch (err: any) {
  //       setError(err.message);
  //       setLoading(false);
  //     }
  //   };
  //   fetchVideoDetails();
  // }, [id]);

  // useEffect(() => {
  //   if (isFromTalentGallery && searchParams) {
  //     // Fetch related videos based on searchParams
  //     const fetchRelatedVideos = async () => {
  //       try {
  //         const videos = await getRelatedVideos(searchParams);
  //         setRelatedVideos(videos);
  //       } catch (err: any) {
  //         setError(err.message);
  //       }
  //     };
  //     fetchRelatedVideos();
  //   }
  // }, [isFromTalentGallery, searchParams]);


  const handleBackClick = () => {
    navigate(-1);
  };


  return (
    <Stack direction={{ sm: 'column', md: 'row' }} gap={3} className="min-h-screen flex-col md:flex-row mx-auto py-4 px-3 md:px-7 max-w-8xl">
      <Stack direction="column" flex={4} spacing={3}>
        <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-0 p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
        <Box className="rounded-lg">
          <Stack mx='auto' direction="column" spacing={4}>
            <Box className="w-full top-24 rounded-3xl">
              <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className="react-player" controls style={{ borderRadius: '1.5rem', overflow: 'hidden' }} />
            </Box>
            <Box className="flex flex-col gap-1">
              {/* <Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
                <Typography variant="subtitle2">views</Typography>
              </Stack> */}
              {/* <Stack direction="row" alignItems="center" justifyContent="space-between" p={1} spacing={8}>
                <Stack direction='row' spacing={1}>
                  <Button variant="custom" className='text-green-600 hover:text-green-500' icon={<WhatsAppIcon />} onClick={() => shareOnWhatsApp(`https://www.youtube.com/watch?v=${id}`)} />
                  <Button variant='custom' className='text-blue-600 hover:text-blue-500' icon={<EmailIcon />} onClick={() => shareViaEmail(`https://www.youtube.com/watch?v=${id}`)} />
                </Stack>
              </Stack> */}
              <Box flex={1} className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex lg:hidden border border-neutral-100 shadow-md ${isExpanded ? 'h-auto' : 'max-h-44'}`}>
                  <Stack direction="column" alignItems="center" justifyContent="space-between">
                    <Typography variant="h4" gutterBottom>
                      Frontend Developer
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Lorem Ipsum.
                    </Typography>
                    <label></label>
                    <Typography variant="body2">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam impedit repellendus eum eaque sed dolore nesciunt, blanditiis animi maiores atque enim corporis ratione voluptates, ipsa reiciendis necessitatibus at architecto ea ab distinctio aperiam fuga! Ex sunt facilis vel? Dicta fugiat animi inventore adipisci beatae! Laudantium quasi doloremque debitis odio eos animi dicta recusandae velit aliquid pariatur quisquam architecto voluptas delectus provident maiores, quaerat earum rerum. Officia nihil, velit, facilis veniam assumenda reiciendis dolore quisquam, provident recusandae culpa voluptatum eos numquam.
                    </Typography>
                  </Stack>
                {/* ) : (
                  <Stack direction={'column'} alignItems="center" justifyContent="space-between">
                    <Typography variant="h4" gutterBottom>
                      Frontend Developer
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Lorem Ipsum.
                    </Typography>
                    <label></label>
                    <ClampedText variant="body2" className={`${isExpanded ? '' : 'line-clamp-2'} relative overflow-hidden`} sx={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', display: '-webkit-box'}}>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam impedit repellendus eum eaque sed dolore nesciunt, blanditiis animi maiores atque enim corporis ratione voluptates, ipsa reiciendis necessitatibus at architecto ea ab distinctio aperiam fuga! Ex sunt facilis vel? Dicta fugiat animi inventore adipisci beatae! Laudantium quasi doloremque debitis odio eos animi dicta recusandae velit aliquid pariatur quisquam architecto voluptas delectus provident maiores, quaerat earum rerum. Officia nihil, velit, facilis veniam assumenda reiciendis dolore quisquam, provident recusandae culpa voluptatum eos numquam.
                    </ClampedText>
                    <Button onClick={handleReadMoreClick} label='Read More' variant="custom" className='video-description' ></Button>
                  </Stack>
                )} */}
              </Box>
            </Box>
          </Stack>
        </Box>
        {/* CART ITEM STARTS */}
        {/* {isFromTalentGallery && relatedVideos && (
          <Swiper spaceBetween={10} slidesPerView={1} pagination={{ clickable: true }} navigation>
            {relatedVideos.map((video, index) => (
              <SwiperSlide key={index}>
                <div className="video-card">
                  <img src={video.thumbnailUrl} alt={video.title} />
                  <h3>{video.title}</h3>
                  Add other video details here
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )} */}
        {/* CART ITEM ENDS */}
        
        {/* <JobBoard jobs={mockJobs.slice(0, 3)} /> */}
      </Stack>

      <Box className={`flex-col w-[30%] gap-4 mt-[3.25rem] lg:flex hidden`}>
        {/* {isExpanded ? ( */}
          <Stack direction="column" alignItems="start" justifyContent="space-between" className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex-col lg:flex hidden border border-neutral-100 shadow-md ${isExpanded ? 'h-auto' : 'max-h-aut0'}`}>
            <Typography variant="h5" gutterBottom>
              Frontend Developer
            </Typography>
            <Typography variant="body1" gutterBottom>
              Lorem Ipsum.
            </Typography>
            <label></label>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam impedit repellendus eum eaque sed dolore nesciunt, blanditiis animi maiores atque enim corporis ratione voluptates, ipsa reiciendis necessitatibus at architecto ea ab distinctio aperiam fuga! Ex sunt facilis vel? Dicta fugiat animi inventore adipisci beatae! Laudantium quasi doloremque debitis odio eos animi dicta recusandae velit aliquid pariatur quisquam architecto voluptas delectus provident maiores, quaerat earum rerum. Officia nihil, velit, facilis veniam assumenda reiciendis dolore quisquam, provident recusandae culpa voluptatum eos numquam.
            </Typography>
          </Stack>
        {/* ) : (
          <Stack direction={'column'} alignItems="start" justifyContent="space-between" className={`bg-white p-4 rounded-xl text-neutral-400 backdrop-blur-sm flex-col lg:flex hidden border border-neutral-100 shadow-md ${isExpanded ? 'h-auto' : 'max-h-auto'}`}>
            <Typography variant="h5" gutterBottom>
              Frontend Developer
            </Typography>
            <Typography variant="body1" gutterBottom>
              Lorem Ipsum.
            </Typography>
            <label></label>
            <ClampedText variant="body2" className={`${isExpanded ? '' : 'line-clamp-2'} relative overflow-hidden`} sx={{ WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', display: '-webkit-box'}}>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam impedit repellendus eum eaque sed dolore nesciunt, blanditiis animi maiores atque enim corporis ratione voluptates, ipsa reiciendis necessitatibus at architecto ea ab distinctio aperiam fuga! Ex sunt facilis vel? Dicta fugiat animi inventore adipisci beatae! Laudantium quasi doloremque debitis odio eos animi dicta recusandae velit aliquid pariatur quisquam architecto voluptas delectus provident maiores, quaerat earum rerum. Officia nihil, velit, facilis veniam assumenda reiciendis dolore quisquam, provident recusandae culpa voluptatum eos numquam.
            </ClampedText>
            <Button onClick={handleReadMoreClick} label='Read More' variant="custom" className='video-description' ></Button>
          </Stack>
        )} */}

        {/* ITEM SHOULD BE HERE */}
        {/* {isFromTalentGallery && relatedVideos.length > 0 && (
          <Box className="related-videos">
            <Typography variant='h6'>Related Videos</Typography>
            <div className="grid grid-cols-1 gap-4">
              {relatedVideos.map(video => (
                <VideoCard key={id} video={video} />
              ))}
            </div>
          </Box>
        )} */}
      </Box>
    </Stack>
  );
};

export default VideoDetails;
