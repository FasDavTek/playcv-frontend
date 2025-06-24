import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Tooltip, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PushPinIcon from '@mui/icons-material/PushPin';
import { useInView } from 'react-intersection-observer';
import { Button, useToast } from '@video-cv/ui-components';
import { useCart } from '../context/CartProvider';
import { useAuth } from './../../../../libs/context/AuthContext';
import { toast } from 'react-toastify';
import { apiEndpoints } from './../../../../libs/utils/apis/apiEndpoints';
import { deleteData, getData, postData } from './../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../libs/utils/helpers/config';
import { SESSION_STORAGE_KEYS } from './../../../../libs/utils/sessionStorage';

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
  reasonForRejaction?: string
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

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  useEffect(() => {
    const itemInCart = cartState.cart.some((item: any) => item.videoCvId === id);
    setIsInWishlist(itemInCart);
  }, [cartState, id]);

  const { showToast } = useToast();

  const handleViewDetails = async (item: Video) => {
    setSelectedItem(item);
    navigate(`/video/${item.id}`);
  };

  // const handleAddToCart = async (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (!authState.isAuthenticated) {
  //     navigate('/auth/login');
  //     toast.warning("Please signin to add videos to the cart.");
  //     return;
  //   }

  //   if (authState?.user?.userTypeId !== 2) {
  //     toast.error("Only employers can add videos to the cart.");
  //     return;
  //   }

  //   if (isInWishlist) {
  //     toast.info('This video is already in your cart.');
  //     return;
  //   }

  //   try {
  //     const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_TO_CART}`, { videoCvId: id, quantity: 1 }, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });

  //     if (response.code === '00') {
  //       const newItem = {
  //         name: video?.title,
  //         id: id,
  //         imageSrc: video?.thumbnailUrl,
  //         uploader: video?.authorProfile.userDetails.firstName + ' ' +  video?.authorProfile.userDetails.middleName + ' ' + video?.authorProfile.userDetails.lastName,
  //         type: video?.type,
  //       };
  //       dispatch({ type: 'ADD_TO_CART', payload: newItem });
  //       setIsInWishlist(true);
  //       toast.success('Video added to wishlist');
  //     }
  //   } catch (err) {
  //     toast.error('Failed to add video to wishlist');
  //   }
  // };

  // const handleRemoveFromCart = async (cartItemId: number) => {
  //   try {
  //     const response = await deleteData(`${CONFIG.BASE_URL}${apiEndpoints.REMOVE_FROM_CART}/${cartItemId}`,
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.code === '00') {
  //       dispatch({ type: 'REMOVE_FROM_CART', payload: { cartItemId } });
  //       setIsInWishlist(false);
  //       toast.success('Video removed from cart');
  //     }
  //   } catch (err) {
  //     toast.error('Failed to remove video from cart');
  //   }
  // };

  
  // const handleCartButtonClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (isInWishlist) {
  //     const cartItem = cartState.cart.find((item: any) => item.videoCvId === id);
  //     if (cartItem) {
  //       handleRemoveFromCart(cartItem.id)
  //     }
  //   } else {
  //     handleAddToCart(e)
  //   }
  // }

  const fetchCart = async () => {
    const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
    if (authState.isAuthenticated && authState?.user?.userTypeId === 2) {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.FETCH_MY_CART}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.code === '00') {
          dispatch({ type: 'SET_CART', payload: response.data });
        }

      }
      catch (err) {
        return;
      }
    }
  };

  const shouldShowCartButtons = 
    !video.hasSubscription &&
    ((authState?.isAuthenticated && authState?.user?.userTypeId === 2) || 
    !authState?.isAuthenticated);

 
  const handleCartButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!authState.isAuthenticated) {
      navigate('/auth/login');
      showToast("Please signin to add videos to the cart.", 'warning');
      return;
    }

    if (authState?.user?.userTypeId === 3) {
      showToast("Only employers can add videos to the cart.", 'error');
      return;
    }

    // Optimistic update
    const wasInWishlist = isInWishlist;
    setIsInWishlist(!wasInWishlist);
    
    try {
      if (wasInWishlist) {
        const cartItem = cartState.cart.find((item: any) => item.videoCvId === id);
        if (cartItem) {
          await deleteData(`${CONFIG.BASE_URL}${apiEndpoints.REMOVE_FROM_CART}/${cartItem.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch({ type: 'REMOVE_FROM_CART', payload: { cartItemId: cartItem.id } });
          showToast('Video removed from cart', 'success');
        }
      } else {
        const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_TO_CART}`, { videoCvId: id, quantity: 1 }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.code === '00') {
          const newItem = {
            name: video?.title,
            id: id,
            // videoCvId: id,
            imageSrc: video?.thumbnailUrl,
            uploader: video?.authorProfile.userDetails.firstName + ' ' +  video?.authorProfile.userDetails.middleName + ' ' + video?.authorProfile.userDetails.lastName,
            type: video?.type,
            // price: 0 // temporary value
          };

          dispatch({ type: 'ADD_TO_CART', payload: newItem });
          showToast('Video added to cart', 'success');

          await fetchCart();
        }
      }
    } catch (err) {
      setIsInWishlist(wasInWishlist);
      showToast(wasInWishlist ? 'Failed to remove from cart' : 'Failed to add to cart', 'error');
    }
  };

  return (
    <Card
      sx={{
        width: { xs: '300px', sm: '100%', md: '100%' },
        maxWidth: '300px',
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        mx: 'auto',
        height: '100%',
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        '&:hover': {
          cursor: 'pointer',
          transform: "translateY(-5px)",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        },
        touchAction: "manipulation"
      }}
      className="cursor-pointer touch-action-manipulation"
      elevation={4}
      onClick={() => handleViewDetails(video)}
    >
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
        // onClick={() => handleViewDetails(video)}
        sx={{ width: { xs: '100%', sm: '358px' }, height: 180 }}
      />
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: 'transparent', height: 'auto' }} >
        <Typography variant="body2" component='h6' fontWeight="medium" color="#000">
          {title?.slice(0, 30)}{' '}
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
          {shouldShowCartButtons && (
            <Tooltip title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'} placeholder='right-start'>
              <span>
                <Button variant="custom" color="gray" className='text-[#5c6bc0] hover:text-[#2e3a86] touch-action-manipulation' onClick={handleCartButtonClick} icon={isInWishlist ? <ShoppingCartIcon style={{ touchAction: "manipulation" }} /> : <AddShoppingCartIcon style={{ touchAction: "manipulation" }} />} style={{ touchAction: "manipulation" }} ></Button>
              </span>
            </Tooltip>
          )}
          {!shouldShowCartButtons && video.hasSubscription && (
            <Tooltip title="You've already purchased this video" placeholder='right-start'>
              <CheckCircleIcon color="success" />
            </Tooltip>
          )}
        </Stack>
        <Typography variant="body2" component='span' color="gray">
         {views} views
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;