import React, { useEffect, useState } from 'react';
import { Button, SelectMenu, Table, TextArea } from '@video-cv/ui-components';
import { createColumnHelper } from '@tanstack/react-table';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Input, Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDate, handleDate } from '@video-cv/utils';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { CreateAdsConfirmModal } from './modals';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';


const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

// Define your ad data type
type ads = {
  id: string;
  status: string;
  adName: string;
  redirectUrl: string;
  adType: string;
  dateCreated: string;
  authorName: string;
  adDescription: string;
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
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ads | null>(null);
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

      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_STATUS}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.data;
      
      if (response.status === 'success' && response.hasValidAdRequest === true) {
        toast.info('You have an existing payment for video upload that you have not yet completed.');
        navigate(`/employer/advertisement/create`, { 
          state: { 
            adTypeId: response.adRequest.adTypeId,
          } 
        });
      } else {
        openSetModalFn('confirmationModal');
      }
    } 
    catch (error) {
      if(!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/');
      }
      else {
        toast.warning('There was an error checking your payment status. Please try again later.');
      }
    }
  };


  
  const fetchAds = async () => {
    setLoading(true);
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_AUTH_ADS}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data;
      if (resp.code === '00') {
        data = await resp.adverts;
        setAds(data);
      }

      const currentTime = Date.now();
      const newAds = data.filter((ad: ads) => new Date(ad.dateCreated).getTime() > lastFetchTime);
      if (newAds.length > 0) {
        toast.info(`${newAds.length} new ad(s) uploaded`);
      }
      setLastFetchTime(currentTime);
    }
    catch (err) {
      if(!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/');
      }
      else {
        toast.error('Failed to fetch ads')
      }
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


  const handleView = async (item: ads) => {
    setSelectedItem(item)
    navigate(`/employer/advertisement/view/:${item.id}`, {
      state: { ads: item },
    });
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
    columnHelper.accessor('adName', {
      header: 'Ad Name',
    }),
    columnHelper.accessor('redirectUrl', {
      header: 'Ad Link',
    }),
    columnHelper.accessor('adType', {
      header: 'Ad Type',
    }),
    columnHelper.accessor('dateCreated', {
      header: 'Date Created',
      cell: (info) => handleDate(info.getValue()),
    }),
    columnHelper.accessor('adDescription', {
      header: 'Description',
      cell: (info) => truncateText(info.getValue() as string || '', 10),
    }),
    columnHelper.accessor('startDate', {
      header: 'Start Date',
      cell: (info) => handleDate(info.getValue()),
    }),
    columnHelper.accessor('endDate', {
      header: 'End Date',
      cell: (info) => handleDate(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1.5 text-center rounded-full ${
            info.getValue() === 'Active' ? 'bg-green-200 text-green-600' : 'bg-red-200 text-red-600'
          }`}
        >
          {info.getValue() === 'Active' ? 'Active' : 'Inactive'}
        </span>
      ),
    }),
    columnHelper.accessor('id', {
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {/* <Button variant="custom"
            onClick={() => handleView(row.original.id)}
            label={'View'}  
          >
          </Button> */}
          <SelectMenu
            options={[
              { label: "View", onClick: () => handleView(row.original)},
            ]}
            buttonVariant="text"
          />
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
