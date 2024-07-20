import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Tooltip, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import {
  demoThumbnailUrl,
  demoVideoUrl,
  demoVideoTitle,
} from '../utils/constants';
import { Button } from '@video-cv/ui-components';
import { useCart } from '../context/CartProvider';
import { Images } from '@video-cv/assets';

interface VideoProps {
  video: {
    id: string;
    uploaderName: string;
    role: string;
    videoUrl: string;
    uploadDate: string;
    views: number;
    isActive: boolean;
    imageSrc: string;
    price: number;
    link?: string;
    description: string;
  };
}

const VideoCard: React.FC<VideoProps> = ({ video }: any) => {
  const { videoUrl, uploaderName, views, role, description, id, imageSrc, price, link = '/video/cV2gBU6hKfY' /*   link = `/video/${id}` */ } = video;
  const { cartState, dispatch } = useCart();
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleAddToCart = () => {
    setIsInWishlist(!isInWishlist);
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
  };

  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '100%', md: '100%' },
        maxWidth: '300px',
        boxShadow: '0',
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
          component='video'
          image={imageSrc || demoThumbnailUrl}
          title={role}
          sx={{ width: { xs: '100%', sm: '358px' }, height: 180 }}
        />
      </Link>
      <CardContent sx={{ backgroundColor: 'transparent', height: 'auto' }}>
        <Typography variant="subtitle1" fontWeight="bold" color="#000">
          {role.slice(0, 30)}{' '}
          <CheckCircleIcon
            sx={{ fontSize: '12px', color: 'gray', ml: '5px' }}
          />
        </Typography>
        <Stack direction='row' alignItems='center' justifyContent='space-between' my='.3125rem'>
          <Typography variant="subtitle2" color="gray">
            {uploaderName}
          </Typography>
          <Tooltip title='Add to wishlist' placeholder='right-start'>
            <span>
            <Button variant="custom" color="gray" className='text-[#5c6bc0] hover:text-[#2e3a86]' onClick={handleAddToCart} icon={isInWishlist ? <BookmarkIcon /> : <BookmarkBorderIcon />}></Button>
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
