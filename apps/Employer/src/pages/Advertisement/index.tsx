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
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

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
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);


  const checkPaymentStatus = async () => {
    try {

      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_STATUS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.data;
      
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

      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_AUTH_ADS}?UserId=${userId}&Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data;
      if (resp.succeeded === true) {
        data = await resp.data;
        setAds(data);
      }

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
  }, [search, filter, token]);


  const handleView = async (adId: string) => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_BY_ID}/${adId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

      <Table loading={false} data={ads} columns={columns} search={setSearch} filter={filter} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableHeading="All My Ads" />

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <>
          <CreateAdsConfirmModal onClose={closeModal} />
        </>
      </Modal>
    </div>
  );
};

export default Advertisement;
