import React, { useEffect, useState } from 'react';
import { Button, Table, TextArea } from '@video-cv/ui-components';
import { createColumnHelper } from '@tanstack/react-table';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Input, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '@video-cv/utils';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { CreateAdsConfirmModal } from './modals';

// Define your ad data type
type ads = {
  id: string;
  status: string;
  title: string;
  adUrl: string;
  adType: string;
  createdAt: string;
  authorName: string;
  description: string;
  startDate: string;
  endDate: string;
  userType: string;
  userId: string;
  action: string;
};

// Mock data
// const initialData = [
//   {
//     id: '1',
//     adName: 'Summer Sale',
//     adUrl: 'https://example.com/summer-sale.png',
//     createdAt: '2024-06-01T10:00:00Z',
//     status: 'active',
//     description: 'This is a summer sale ad',
//     startDate: '2024-06-01T10:00:00Z',
//     endDate: '2024-06-30T10:00:00Z',
//     adType: 'image',
//   },
//   {
//     id: '2',
//     adName: 'Winter Collection',
//     adUrl: 'https://example.com/winter-collection.png',
//     createdAt: '2024-11-15T12:00:00Z',
//     status: 'suspended',
//     description: 'This is a winter collection ad',
//     startDate: '2024-11-15T12:00:00Z',
//     endDate: '2024-12-31T12:00:00Z',
//     adType: 'image',
//   },
//   {
//     id: '3',
//     adName: 'Spring Promo',
//     adUrl: 'https://example.com/spring-promo.png',
//     createdAt: '2024-03-21T09:30:00Z',
//     status: 'active',
//     description: 'This is a spring promo ad',
//     startDate: '2024-03-21T09:30:00Z',
//     endDate: '2024-04-30T09:30:00Z',
//     adType: 'video',
//   },
// ];

type ModalTypes = null | 'confirmationModal' | 'createAds';

const columnHelper = createColumnHelper<ads>();

const Advertisement = () => {
  const [ads, setAds] = useState<ads[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const navigate = useNavigate();
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [selectedAdTitle, setSelectedAdTitle] = useState('');
  const [reason, setReason] = useState('');

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const checkPaymentStatus = async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_STATUS}?Page=1&Limit=10`);

      if (!response.code === "201") {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      
      if (!data || !data.checkoutId) {
        openSetModalFn('confirmationModal');
      } else {
        toast.info('You have an existing payment for video upload that you have not yet completed.');
        navigate(`/employer/advertisement/upload`, { 
          state: { 
            checkoutId: data.checkoutId,
          } 
        });
      }
    } 
    catch (error) {
      console.error('Error checking payment status:', error);
      toast.warning('There was an error checking your payment status. Please try again later.');
    }
  };


  
  const fetchAds = async () => {
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_AUTH_ADS}?Page=1&Limit=10`)
      if (!resp.code === "201") {
        throw new Error("Failed to fetch ads");
      }

      const data = await resp.json();
      setAds(data);
      setLoading(false);

      const currentTime = Date.now();
      const newAds = data.filter((ad: ads) => new Date(ad.createdAt).getTime() > lastFetchTime);
      if (newAds.length > 0) {
        toast.info(`${newAds.length} new ad(s) uploaded`);
      }
      setLastFetchTime(currentTime);
    }
    catch (err) {
      console.error('Error fetching ads:', err)
      setLoading(false)
      toast.error('Failed to fetch ads')
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchAds()
    const interval = setInterval(fetchAds, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, []);


  const handleView = async (adId: string) => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_BY_ID}/${adId}`);
      if (!response.code === "201") {
        throw new Error('Error fetching ad details');
      }

      const adDetails = await response.json();
      navigate(`/employer/advertisement/view/:${adId}`, {
        state: { adDetails },
      });
    }
    catch (err) {
      console.error('Error fetching ad details:', err)
      toast.error('Failed to fetch ad details')
    }
  };


  const handleStatusToggle = async (adId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
      
      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad.id === adId ? { ...ad, status: newStatus } : ad
        )
      )
      toast.success(`Ad ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`)
    } catch (err) {
      console.error('Error updating ad status:', err)
      toast.error('Failed to update ad status')
    }
  };




  const columns = [
    columnHelper.accessor('title', {
      header: 'Ad Name',
    }),
    columnHelper.accessor('authorName', {
      header: 'User Fullname',
    }),
    columnHelper.accessor('adUrl', {
      header: 'Ad Link',
    }),
    columnHelper.accessor('adType', {
      header: 'Ad Type',
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date Created',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
    }),
    columnHelper.accessor('startDate', {
      header: 'Start Date',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('endDate', {
      header: 'End Date',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1.5 text-center rounded-full text-white ${
            info.getValue() === 'active' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {info.getValue() === 'active' ? 'Active' : 'Suspended'}
        </span>
      ),
    }),
    columnHelper.accessor('id', {
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="custom"
            onClick={() => handleView(row.original.id)}
            label={'View'}  
          >
          </Button>
        </div>
      ),
    }),
  ];

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-4">
        <Button
          label="Create Ad"
          variant="black"
          onClick={checkPaymentStatus}
        />
      </div>


      {/* {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <CircularProgress className="w-8 h-8 animate-spin" />
        </div>
      ) : (
          ads.length > 0 ? (
            
          ) : (
            <p>No ads available</p>
          )
      )} */}

      <Table loading={false} data={ads} columns={columns} tableHeading="All Ads" />

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <CreateAdsConfirmModal onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default Advertisement;
