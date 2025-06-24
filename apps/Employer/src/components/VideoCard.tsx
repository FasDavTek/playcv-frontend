import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia, Tooltip, Stack, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PushPinIcon from '@mui/icons-material/PushPin';
import { useInView } from 'react-intersection-observer';

import { Button } from '@video-cv/ui-components';
import { useCart } from './../../../video-cv/src/context/CartProvider';
import { useAuth } from './../../../../libs/context/AuthContext';
import { toast } from 'react-toastify';
import { apiEndpoints } from './../../../../libs/utils/apis/apiEndpoints';
import { deleteData, postData } from './../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../libs/utils/helpers/config';
import { SESSION_STORAGE_KEYS } from './../../../../libs/utils/sessionStorage';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

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
  hasSubscription: {
      userId: number,
      subscriptionId: number,
      videoId: number,
      totalAmountPaid: number,
      canAccessProduct: string,
      datePaid: string,
      checkOutId: number
  },
}

interface VideoCardProps {
  video: Video;
  onDelete?: (videoId: number) => void;
  isHistory?: boolean;
}


const VideoCard: React.FC<VideoCardProps> = ({ video, onDelete, isHistory = false }: any) => {
  const { id, title, views, videoUrl, thumbnailUrl, authorProfile, type, dateCreated, status, paymentDetails } = video;
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

  const handleViewDetails = async (item: Video) => {
    setSelectedItem(item);
    navigate(`/employer/video-management/${item.id}`);
  };


  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(video.id);
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
            <Typography variant="subtitle2" color="gray">
              {authorProfile.userDetails.fullName}
            </Typography>
            {type === 'Pinned' && <PushPinIcon sx={{ fontSize: '1rem', color: 'red', ml: '.5rem' }} />}
          </Stack>
          <Stack direction="row" justifyContent="flex-end">
            <IconButton 
              onClick={handleDelete}
              aria-label="delete"
              sx={{ color: 'error.main', touchAction: "manipulation" }}
              style={{ touchAction: "manipulation" }}
            >
              <DeleteOutlinedIcon style={{ touchAction: "manipulation" }} />
            </IconButton>
          </Stack>
        </Stack>
        <Typography variant="body2" component='span' color="gray" fontWeight="normal">
            ₦{paymentDetails.totalAmount}
          </Typography>
        <Typography variant="body2" component='span' color="gray">
         {views} views
        </Typography>
      </CardContent>
    </Card>
  );
};

export default VideoCard;