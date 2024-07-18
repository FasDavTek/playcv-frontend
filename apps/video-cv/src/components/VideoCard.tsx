import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

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
    imageSrc: string;
    price: number;
    link?: string;
  };
}

const VideoCard: React.FC<VideoProps> = ({ video }: any) => {
  const { videoUrl, uploaderName, role, id, imageSrc, price, link = '/video/cV2gBU6hKfY' } = video;
  const { cartState, dispatch } = useCart();

  const handleAddToCart = () => {
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
    >
      <Link to={link}>
        <CardMedia
          image={imageSrc || demoThumbnailUrl}
          title={role}
          sx={{ width: { xs: '100%', sm: '358px' }, height: 180 }}
        />
      </Link>
      <CardContent sx={{ backgroundColor: 'transparent', height: 'auto' }}>
        <Link to={videoUrl}>
          <Typography variant="subtitle1" fontWeight="bold" color="#000">
            {role.slice(0, 30)}{' '}
            <CheckCircleIcon
              sx={{ fontSize: '12px', color: 'gray', ml: '5px' }}
            />
          </Typography>
        </Link>
        {/* <Link
        to={
          snippet?.channelId ? `/channel/${snippet?.channelId}` : demoChannelUrl
        }
      >
        <Typography variant="subtitle2" color="gray">
          {snippet?.channelTitle || demoChannelTitle}
          <CheckCircleIcon
            sx={{ fontSize: '12px', color: 'gray', ml: '5px' }}
          />
        </Typography>
      </Link> */}
        <Typography variant="subtitle2" color="gray">
          {uploaderName}
        </Typography>
        <div className="flex justify-end mt-2">
        <Tooltip title="Add to cart" placement="right-start">
          <Button onClick={handleAddToCart} variant='custom' icon={<AddShoppingCartIcon sx={{ color: '#5c6bc0' }} />} />
        </Tooltip>
          
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
