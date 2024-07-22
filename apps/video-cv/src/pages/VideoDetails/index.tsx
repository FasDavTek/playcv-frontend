import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Box, Stack, Typography, Card, CardMedia, CardContent, Paper } from '@mui/material';
import { useCart } from '../../context/CartProvider';
import { Button } from '@video-cv/ui-components';
import { useLocation } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import styled from '@emotion/styled';
import { Images } from '@video-cv/assets';
import './../../styles.scss';

const ClampedText = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  WebkitLineClamp: 2,
});

const TabPanel = ({ children, value, index }: any) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} style={{ width: '100%' }}>
      {value === index && (
        <Box sx={{ width: '100%' }} className="p-4 w-full">
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
    imageSrc: string;
    price: number;
    videoUrl: string;
    role: string;
    description: string;
  } | null;
  const { cartState, dispatch } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check if the item is in the cart on component mount
    const itemInCart = cartState.cart.some((item: any) => item.id === id);
    setIsInWishlist(itemInCart);
  }, [cartState, id]);

  const handleAddToCart = () => {
    const itemInCart = cartState.cart.some((item: any) => item.id === id);
    setIsInWishlist(!isInWishlist);
    if (itemInCart) {
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: { id },
      });
    }
    else {
      const value = {
        name: video?.uploaderName,
        id: id,
        imageSrc: video?.imageSrc,
        price: video?.price,
      };
      dispatch({
        type: 'ADD_TO_CART',
        payload: value,
      });
    }
  };

  return (
    <Box className="min-h-screen mx-auto py-9 px-3 md:px-9 max-w-7xl">
      <Stack direction="column" spacing={3}>
        <Box className="rounded-lg">
          <Stack direction="column" spacing={4}>
            <Box className="w-full top-24 rounded-3xl">
              <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className="react-player" controls style={{ borderRadius: '1.5rem', overflow: 'hidden' }} />
            </Box>
            <Box className="flex flex-col gap-1">
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" gutterBottom>
                  Frontend Developer
                </Typography>
                <Button onClick={handleAddToCart} variant="custom" className="text-[#5c6bc0] hover:text-[#2e3a86] animate-bounce" icon={<AddShoppingCartIcon />} />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={8}>
                <Typography variant="body1" gutterBottom>
                  Lorem Ipsum.
                </Typography>
              </Stack>
              <Box className="bg-gray-700 p-4 rounded-xl text-white backdrop-blur-sm">
                <Typography variant="subtitle2">views</Typography>
                {isExpanded ? (
                  <Typography variant="body2">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam impedit repellendus eum eaque sed dolore nesciunt, blanditiis animi maiores atque enim corporis ratione voluptates, ipsa reiciendis necessitatibus at architecto ea ab distinctio aperiam fuga! Ex sunt facilis vel? Dicta fugiat animi inventore adipisci beatae! Laudantium quasi doloremque debitis odio eos animi dicta recusandae velit aliquid pariatur quisquam architecto voluptas delectus provident maiores, quaerat earum rerum. Officia nihil, velit, facilis veniam assumenda reiciendis dolore quisquam, provident recusandae culpa voluptatum eos numquam.
                  </Typography>
                ) : (
                  <ClampedText variant="body2">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam impedit repellendus eum eaque sed dolore nesciunt, blanditiis animi maiores atque enim corporis ratione voluptates, ipsa reiciendis necessitatibus at architecto ea ab distinctio aperiam fuga! Ex sunt facilis vel? Dicta fugiat animi inventore adipisci beatae! Laudantium quasi doloremque debitis odio eos animi dicta recusandae velit aliquid pariatur quisquam architecto voluptas delectus provident maiores, quaerat earum rerum. Officia nihil, velit, facilis veniam assumenda reiciendis dolore quisquam, provident recusandae culpa voluptatum eos numquam.
                  </ClampedText>
                )}
              </Box>
            </Box>
          </Stack>
        </Box>
        <Box className="flex-1 flex-grow overflow-auto flex items-start px-1 md:px-8">
          <Stack direction="column" className=" w-full items-start md:items-center justify-start overflow-hidden space-y-1">
            <div className="flex overflow-auto hide-scrollbar gap-2 my-1 bg-gray-200 px-3 py-2 rounded-lg">
              {['Cart1', 'Cart2', 'Cart3', 'Cart4', 'Cart5', 'Cart6', 'Cart7', 'Cart8', 'Cart9'].map((label, index) => (
                <button
                  key={index}
                  onClick={() => setTabValue(index)}
                  className={`flex items-center text-gray-800 hover:text-blue-700 px-4 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-neutral-500 ${tabValue === index ? 'bg-gray-400' : 'bg-gray-200'} ${index === 0 ? 'flex-shrink-0' : ''}`}
                >
                  {label} <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">3</span>
                </button>
              ))}
            </div>
            {Array(9)
              .fill('')
              .map((_, index) => (
                <TabPanel key={index} value={tabValue} index={index} s>
                  <Stack direction='column' width='100%' overflow='auto' p={2} className='hide-scrollbar'>
                   <Card elevation={2} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%', maxWidth: '50rem', margin: 'auto' }} className='rounded-xl'>
                     <CardMedia
                      component="img"
                      sx={{ width: { xs: 'full', md: 251 } }}
                      image={Images.HeroImage}
                      alt="Live from space album cover"
                    />
                    <CardContent sx={{ flex: '1 0 auto', display: 'grid', gap: '.875rem' }}>
                      <Typography component="div" variant="h6">
                        Live From Space
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" component="div">
                        Mac Miller
                      </Typography>
                      <Stack direction='row' alignItems='center' justifyContent='space-between'>
                        <Typography variant="subtitle2" color="text.secondary" component="div">
                          views
                        </Typography>
                        <Button onClick={handleAddToCart} variant="custom" className="text-[#5c6bc0] hover:text-[#2e3a86]" icon={isInWishlist ? <ShoppingCartIcon /> : <AddShoppingCartIcon />} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
                </TabPanel>
              ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetails;
