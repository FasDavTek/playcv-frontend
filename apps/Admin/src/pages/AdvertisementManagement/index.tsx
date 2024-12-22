import { useEffect, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Input, Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, Table, TextArea } from '@video-cv/ui-components';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { CreateAdsModal } from './modals';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

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

const Payment = () => {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [reason, setReason] = useState('');

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);


  const fetchAds = async () => {
    setLoading(true);
    try {

      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_ADS}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data;
      if (resp.succeeded === true) {
        data = await resp.data;
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
      console.error('Error fetching ads:', err)
      toast.error('Failed to fetch ads')
    }
    finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    fetchAds()
    // Set up interval to fetch videos every 5 minutes
    const interval = setInterval(fetchAds, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [search, filter, token]);


  const handleView = async (adId: string) => {
    try {
      
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_BY_ID}/${adId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const adDetails = await response.data;
      navigate(`/admin/advertisement-management/:${adId}`, {
        state: { adDetails },
      });
    }
    catch (err) {
      console.error('Error fetching ad details:', err)
      toast.error('Failed to fetch ad details')
    }
  };
  

  const handleAdAction = async (adId: string, action: string, reason?: string) => {
    try {

      const apiData = {
        adId,
        action,
        reason
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_ADS}`, apiData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchAds();
      toast.success(`Ad ${action === 'a' ? 'activated' : 'suspended'} successfully`)
    } catch (err) {
      console.error(`Error ${action === 'a' ? 'activating' : 'suspending'} ad:`, err)
      toast.error(`Failed to ${action === 'a' ? 'activate' : 'suspend'} ad`)
    };
  };

  const handleActivate = (adId: string) => handleAdAction(adId, 'a')

  const handleOpenSuspendDialog = (adId: string, title: string) => {
    setSelectedAdId(adId)
    setSelectedAdTitle(title)
    setOpenDialog(true)
  }

  const handleConfirmSuspend = () => {
    if (selectedAdId !== null) {
      handleAdAction(selectedAdId, 'd', reason)
    }
    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedAdId(null)
    setSelectedAdTitle('')
    setReason('')
  }

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
    columnHelper.accessor('authorName', {
      header: 'User Fullname',
    }),
    columnHelper.accessor('redirectUrl', {
      header: 'Ad Link',
    }),
    columnHelper.accessor('adType', {
      header: 'Ad Type',
    }),
    columnHelper.accessor('dateCreated', {
      header: 'Date Created',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('adDescription', {
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
          className={`px-2 py-1.5 text-center items-center rounded-full text-white ${
            info.getValue() === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
          }`}
        >
          {info.getValue()}
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
          {row.original.status === 'active' ? (
            <Button
              variant={'red'}
              onClick={() => handleOpenSuspendDialog(row.original.id, row.original.adName)}
              label={'Suspend'}
            >
            </Button>
          ) : (
            <Button
              variant={'success'}
              onClick={() => handleActivate(row.original.id)}
              label={'Activate'}
            >
            </Button>
          )}
        </div>
      ),
    }),
  ];

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end">
        <Button
          label="Create Ad"
          variant="black"
          onClick={() => openSetModalFn('confirmationModal')}
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

      <Table loading={false} data={ads} columns={columns} search={setSearch} filter={filter} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableHeading="All Ads" />

      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="dialog-title" aria-describedby="dialog-description" PaperProps={{ sx: { padding: 3, borderRadius: 2, boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)', width: { xs: '90%', sm: '500px' }, maxWidth: '750px' }, }} BackdropProps={{ sx: { backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, }}>
        <DialogTitle>Suspension Reason</DialogTitle>
        <DialogContent>
          <TextArea label="" rows={5} value={reason} onChange={(e) => setReason(e.target.value)}/>
        </DialogContent>
          <DialogActions>
            <Button variant='red' label='Cancel' type='reset' onClick={handleCloseDialog}></Button>
            <Button variant='black' label='Confirm Suspension' type='submit' onClick={handleConfirmSuspend}></Button>
          </DialogActions>
      </Dialog>

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <>
          <CreateAdsModal onClose={closeModal} />
        </>
      </Modal>
    </div>
  );
};

export default Payment;

