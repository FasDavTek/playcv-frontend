import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Tooltip, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PushPinIcon from '@mui/icons-material/PushPin';
import { useInView } from 'react-intersection-observer';

import {
  demoThumbnailUrl,
  demoVideoUrl,
  demoVideoTitle,
} from '../utils/constants';
import { Button } from '@video-cv/ui-components';
import { useCart } from '../context/CartProvider';
import { useAuth } from './../../../../libs/context/AuthContext';
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

interface VideoCardProps {
  video: Video;
}


const VideoCard: React.FC<VideoCardProps> = ({ video }: any) => {
  const { id, title, views, videoUrl, thumbnailUrl, authorProfile, type, dateCreated, status, price } = video;
  const { cartState, dispatch } = useCart();
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Video | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const itemInCart = cartState.cart.some((item: any) => item.id === id);
    setIsInWishlist(itemInCart);
  }, [cartState, id]);

  const handleViewDetails = async (item: Video) => {
    setSelectedItem(item);
    navigate(`/video/${item.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!authState.isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (authState?.user?.userTypeId !== 2) {
      toast.error("Only employers can add videos to the cart.");
      return;
    }

    console.log('clicking')

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
        name: title,
        id: id,
        imageSrc: thumbnailUrl,
        price: price,
        uploader: authorProfile.userDetails.fullName,
        type: type,
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
        width: { xs: '300px', sm: '100%', md: '100%' },
        maxWidth: '300px',
        // boxShadow: { xs: '1', sm: '1', lg:'0'},
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        mx: 'auto',
        height: '100%',
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        '&:hover': {
          cursor: 'pointer',
          // boxShadow: '5',
          transform: "translateY(-5px)",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        },
        touchAction: "manipulation"
      }}
      className="cursor-pointer touch-action-manipulation"
      elevation={4}
      onClick={() => handleViewDetails(video)}
    >
      {/* <Link to={`/video/${id}`} style={{ textDecoration: 'none' }} > */}
        <CardMedia
          ref={ref}
          component='img'
          image={inView ? thumbnailUrl : videoUrl}
          title={title}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = thumbnailUrl;
          }}
          onClick={() => handleViewDetails(video)}
          sx={{ width: { xs: '100%', sm: '358px' }, height: 180 }}
        />
      {/* </Link> */}
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: 'transparent', height: 'auto' }} >
        
          <Typography variant="body2" component='h6' fontWeight="medium" color="#000">
            {title?.slice(0, 30)}{' '}
            {/* <CheckCircleIcon
              sx={{ fontSize: '12px', color: 'gray', ml: '5px' }}
            /> */}
          </Typography>
          
        
        <Stack direction='row' alignItems='center' justifyContent='space-between' my='.3125rem'>
          <Stack direction='row' alignItems='start' justifyContent='space-between'>
            <Typography variant="caption" color="gray">
              {authorProfile.userDetails.fullName}
            </Typography>
            {type === 'Pinned' && <PushPinIcon sx={{ fontSize: '1rem', color: 'red', ml: '.5rem' }} />}
          </Stack>
          <Typography variant="body2" fontWeight="normal" hidden>
            ₦{price}
          </Typography>
          {(authState?.isAuthenticated && authState?.user?.userTypeId === 2) || !authState?.isAuthenticated ? (
            <Tooltip title='Add to wishlist' placeholder='right-start'>
              <span>
                <Button variant="custom" color="gray" className='text-[#5c6bc0] hover:text-[#2e3a86] touch-action-manipulation' onClick={handleAddToCart} icon={isInWishlist ? <ShoppingCartIcon /> : <AddShoppingCartIcon />} style={{ touchAction: "manipulation" }} ></Button>
              </span>
            </Tooltip>
          ) : null}
        </Stack>
        <Typography variant="body2" component='span' color="gray">
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