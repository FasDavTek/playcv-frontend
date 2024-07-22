import React, { useState } from 'react';

import ReactPlayer from 'react-player';
import { Box, Stack, Modal, Typography, Card, CardMedia, CardContent, Tabs, Tab } from '@mui/material';

import { useCart } from '../../context/CartProvider';
import { Button } from '@video-cv/ui-components';
import { useLocation } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import styled from '@emotion/styled';
import { Images } from '@video-cv/assets';
import './../../styles.scss'

const ClampedText = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  WebkitLineClamp: 2,
  // textOverflow: 'ellipsis',
});

const TabPanel = (props: any) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const VideoDetails = () => {
  const id = 'GDa8kZLNhJ4';
  const location = useLocation();
  const video = location.state as {
    uploaderName: string;
    // id: string;
    imageSrc: string;
    price: number;
    videoUrl: string;
    role: string;
    description: string;
  } | null;;
  const { cartState, dispatch } = useCart();

  const handleAddToCart = () => {
    // if (video) {
      const value = {
        name: video?.uploaderName,
        id: id,
        // id: video?.id,
        imageSrc: video?.imageSrc,
        price: video?.price,
      };
      dispatch({
        type: 'ADD_TO_CART',
        payload: value,
      });
    // }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // const handleToggle = () => {
  //   setIsExpanded(!isExpanded);
  // };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  return (
    <Box minHeight="95dvh" className="py-9 px-3 md:px-9">
      {/* {!video 
        ? (
        <Typography variant="h6" textAlign='center' marginY='auto' alignSelf='center' justifySelf='center'>Video not found</Typography>
        ) : ( */}
        <Stack direction='column' spacing={3}>
          <Box flex={3} className='rounded-lg'>
            <Stack direction='column' spacing='rem'>
              <Box className="w-full top-[86px] rounded-3xl">
                <ReactPlayer
                  // url={video?.videoUrl}
                  url={`https://www.youtube.com/watch?v=${id}`}
                  className="react-player"
                  controls
                  style={{ borderRadius: '1.5rem', overflow: 'hidden' }}
                />

                {/*  category, reason for rejection if rejected */}
              </Box>
              <Box flex='1' display='flex' flexDirection='column' gap={1}>

                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                  <Typography variant="h4" gutterBottom>
                    {/* Role: {video.role} */}
                    Frontend Developer
                  </Typography>

                  {/* <Typography variant='caption' align='center' bgcolor='InfoText' py='.125rem' height='2.125rem' lineHeight='2rem' borderRadius='1000px' color='white' px='1.25rem'>
                    ₦200
                  </Typography> */}
                  <Button onClick={handleAddToCart} variant='custom' className='text-[#5c6bc0] hover:text-[#2e3a86]' icon={<AddShoppingCartIcon />} />
                </Stack>

                <Stack direction='row' alignItems='center' spacing={8}>
                  <Typography variant="body1" gutterBottom>
                    {/* Uploaded by: {video.uploaderName} */}
                    Lorem Ipsum.
                  </Typography>
                </Stack>

                <Box bgcolor='#495057' p={1}  borderRadius={2} color='white' sx={{ backdropFilter: 'blur(.625rem)' }}>
                  <Typography variant="subtitle2" justifySelf='flex-end'>
                    views
                  </Typography>
                  {isExpanded ? (
                    <Typography variant='body2'>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam impedit repellendus eum eaque sed dolore nesciunt, blanditiis animi maiores atque enim corporis ratione voluptates, ipsa reiciendis necessitatibus at architecto ea ab distinctio aperiam fuga! Ex sunt facilis vel? Dicta fugiat animi inventore adipisci beatae! Laudantium quasi doloremque debitis odio eos animi dicta recusandae velit aliquid pariatur quisquam architecto voluptas delectus provident maiores, quaerat earum rerum. Officia nihil, velit, facilis veniam assumenda reiciendis dolore quisquam, provident recusandae culpa voluptatum eos numquam.
                    </Typography>
                  ) : (
                    <ClampedText variant='body2'>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam impedit repellendus eum eaque sed dolore nesciunt, blanditiis animi maiores atque enim corporis ratione voluptates, ipsa reiciendis necessitatibus at architecto ea ab distinctio aperiam fuga! Ex sunt facilis vel? Dicta fugiat animi inventore adipisci beatae! Laudantium quasi doloremque debitis odio eos animi dicta recusandae velit aliquid pariatur quisquam architecto voluptas delectus provident maiores, quaerat earum rerum. Officia nihil, velit, facilis veniam assumenda reiciendis dolore quisquam, provident recusandae culpa voluptatum eos numquam.
                    </ClampedText>
                  )}
                  {/* <Typography onClick={handleToggle} variant='body2' sx={{ cursor: 'pointer', fontWeight: 'semibold' }} style={{ color: 'white' }}>
                    {isExpanded ? 'Show less' : '...more'}
                  </Typography> */}
                </Box>

              </Box>
            </Stack>
          </Box>
          <Box flex={1} flexGrow={1} className="flex items-start px-1 md:px-8">
            <Stack direction='column' maxHeight='600px' width='100%' alignItems='center' justifyContent='start' overflow='hidden' spacing={1}>
              {/* <Typography variant="body1" gutterBottom>
                {video.description}
              </Typography> */}
              <Tabs value={tabValue} onChange={handleChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile aria-label="video-cv category tab" sx={{ '.MuiTabs-indicator': { display: 'none' }, '.Mui-selected': { backgroundColor: '#403d39', color: 'white', borderRadius: '.5rem' } }} className='hide-scrollbar'>
                <Tab className='text-[#5c6bc0] hover:text-[#2e3a86] border-b-0' label='Cart1' />
                <Tab className='text-[#5c6bc0] hover:text-[#2e3a86] border-b-0' label='Cart2' />
                <Tab className='text-[#5c6bc0] hover:text-[#2e3a86] border-b-0' label='Cart3' />
                <Tab className='text-[#5c6bc0] hover:text-[#2e3a86] border-b-0' label='Cart4' />
                <Tab className='text-[#5c6bc0] hover:text-[#2e3a86] border-b-0' label='Cart5' />
                <Tab className='text-[#5c6bc0] hover:text-[#2e3a86] border-b-0' label='Cart6' />
                <Tab className='text-[#5c6bc0] hover:text-[#2e3a86] border-b-0' label='Cart7' />
                <Tab className='text-[#5c6bc0] hover:text-[#2e3a86] border-b-0' label='Cart8' />
                <Tab className='text-[#5c6bc0] hover:text-[#2e3a86] border-b-0' label='Cart9' />
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <Stack direction='column' width='100%' overflow='hidden'>
                  <Card sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={Images.HeroImage}
                      alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6">
                        Live From Space
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" component="div">
                        views
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={1} width='100%'>
                <Stack direction='column' width='100%' overflow='hidden'>
                  <Card sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={Images.HeroImage}
                      alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6">
                        Live From Space
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" component="div">
                        views
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={2} width='100%'>
                <Stack direction='column' width='100%' overflow='hidden'>
                  <Card sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={Images.HeroImage}
                      alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6">
                        Live From Space
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" component="div">
                        views
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={3} width='100%'>
                <Stack direction='column' width='100%' overflow='hidden'>
                  <Card sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={Images.HeroImage}
                      alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6">
                        Live From Space
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" component="div">
                        views
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={4} width='100%'>
                <Stack direction='column' width='100%' overflow='hidden'>
                  <Card sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={Images.HeroImage}
                      alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6">
                        Live From Space
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" component="div">
                        views
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={5} width='100%'>
                <Stack direction='column' width='100%' overflow='hidden'>
                  <Card sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={Images.HeroImage}
                      alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6">
                        Live From Space
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" component="div">
                        views
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={6} width='100%'>
                <Stack direction='column' width='100%' overflow='hidden'>
                  <Card sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={Images.HeroImage}
                      alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6">
                        Live From Space
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" component="div">
                        views
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={7} width='100%'>
                <Stack direction='column' width='100%' overflow='hidden'>
                  <Card sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={Images.HeroImage}
                      alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6">
                        Live From Space
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" component="div">
                        views
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </TabPanel>
              <TabPanel value={tabValue} index={8} width='100%'>
                <Stack direction='column' width='100%' overflow='hidden'>
                  <Card sx={{ display: 'flex' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={Images.HeroImage}
                      alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto' }}>
                      <Typography component="div" variant="h6">
                        Live From Space
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" component="div">
                        views
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </TabPanel>
            </Stack>
          </Box>
        </Stack>
      {/* )} */}
    </Box>
  );
};

export default VideoDetails;
