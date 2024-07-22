import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Tooltip, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useInView } from 'react-intersection-observer';

import {
  demoThumbnailUrl,
  demoVideoUrl,
  demoVideoTitle,
} from '../utils/constants';
import { Button } from '@video-cv/ui-components';
import { useCart } from '../context/CartProvider';

interface VideoProps {
  video: {
    id: string;
    uploaderName: string;
    role: string;
    videoUrl: string;
    uploadDate: string;
    views: number;
    isActive: boolean;
    imageSrc?: string;
    price: number;
    link?: string;
    description: string;
  };
}

const VideoCard: React.FC<VideoProps> = ({ video }: any) => {
  const { videoUrl, uploaderName, views, role, description, id, imageSrc, price, link = '/video/cV2gBU6hKfY' /*   link = `/video/${id}` */ } = video;
  const { cartState, dispatch } = useCart();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true, // Load the image only once when it comes into view
    threshold: 0.1, // Trigger when 10% of the image is visible
  });

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
        name: uploaderName,
        id: id,
        imageSrc: imageSrc,
        price: price,
      };
      dispatch({
        type: 'ADD_TO_CART',
        payload: value,
      });
    }
  };

  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '100%', md: '100%' },
        maxWidth: '300px',
        boxShadow: { xs: '1', sm: '1', lg:'0'},
        mx: 'auto',
        borderRadius: 2,
        '&:hover': {
          cursor: 'pointer',
          boxShadow: '5',
        },
      }}
      elevation={4}
    >
      <Link to={link} style={{ textDecoration: 'none' }} >
        <CardMedia
          ref={ref}
          component='img'
          image={inView ? imageSrc || demoThumbnailUrl : demoThumbnailUrl}
          title={role}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = demoThumbnailUrl;
          }}
          sx={{ width: { xs: '100%', sm: '358px' }, height: 180 }}
        />
      </Link>
      <CardContent sx={{ backgroundColor: 'transparent', height: 'auto' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="#000">
          {role.slice(0, 30)}{' '}
          {/* <CheckCircleIcon
            sx={{ fontSize: '12px', color: 'gray', ml: '5px' }}
          /> */}
        </Typography>
        <Stack direction='row' alignItems='center' justifyContent='space-between' my='.3125rem'>
          <Typography variant="subtitle2" color="gray">
            {uploaderName}
          </Typography>
          <Tooltip title='Add to wishlist' placeholder='right-start'>
            <span>
              <Button variant="custom" color="gray" className='text-[#5c6bc0] hover:text-[#2e3a86]' onClick={handleAddToCart} icon={isInWishlist ? <ShoppingCartIcon /> : <AddShoppingCartIcon />}></Button>
            </span>
          </Tooltip>
        </Stack>
        <Typography variant="subtitle2" color="gray">
         {views} views
        </Typography>
        {/* <div className="flex justify-end mt-2">
          <Tooltip title="Add to cart" placement="right-start">
            <span>
              <Button onClick={handleAddToCart} variant='custom' className='text-[#5c6bc0] hover:text-[#2e3a86]' icon={<AddShoppingCartIcon />} />
            </span>
          </Tooltip>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default VideoCard;
