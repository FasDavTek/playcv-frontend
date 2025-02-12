import { useEffect, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Input, Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, RejectionDialog, SelectMenu, Table, TextArea } from '@video-cv/ui-components';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { CreateAdsModal } from './modals';
import { handleDate } from '@video-cv/utils'
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';


const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};



const truncateLetter = (text: string, charLimit: number) => {
  if (text.length > charLimit) {
    return text.slice(0, charLimit) + '...';
  }
  return text;
};



type Advert = {
  id: number;
  status: string;
  statusId: number;
  adName: string;
  redirectUrl: string;
  adType: string;
  adTypeId: number;
  dateCreated: string;
  authorName: string;
  adDescription: string;
  startDate: string;
  endDate: string;
  userType: string;
  userId: string;
  coverUrl: string;
};

type ModalTypes = null | 'confirmationModal' | 'createAds';

const columnHelper = createColumnHelper<Advert>();

const Payment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [ads, setAds] = useState<Advert[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Advert | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [approvedAdverts, setApprovedAdverts] = useState<Advert[]>([]);
  const [pendingAdverts, setPendingAdverts] = useState<Advert[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [selectedAdTitle, setSelectedAdTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [reason, setReason] = useState('');
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);
  const [selectedAction, setSelectedAction] = useState<"approve" | "deny" | "delete" | "deactivate" | null>(null);

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);


  const fetchAds = async () => {
    setLoading(true);
    try {

      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_ADS}?Dowload=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data;
      if (resp.succeeded === true) {
        data = await resp.data;
        setAds(data);
      }

      const currentTime = Date.now();
      const newAds = data.filter((ad: Advert) => new Date(ad.dateCreated).getTime() > lastFetchTime);

      const videosApproved = data.filter((ad: Advert) => ad.status === 'Active');
      const videosPending = data.filter((ad: Advert) => ['Rejected', 'Inactive', 'InReview'].includes(ad.status));
      setApprovedAdverts(videosApproved);
      setPendingAdverts(videosPending);

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
        console.error('Error fetching ads:', err)
        toast.error('Failed to fetch ads')
      }
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


  const handleView = async (item: Advert) => {
      setSelectedItem(item);
      navigate(`/admin/advertisement-management/view/${item.id}`, {
        state: { ads: item },
      });
  };
  

  const handleAdAction = async (id: string, action: string, reason?: string) => {
    try {

      const apiData = {
        id,
        action: 'edit',
        reason: action === 'a' ? undefined : reason
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


  const handleStatusToggle = async (ad: Advert, newStatusId: number, action: 'approve' | 'deny' | 'delete' | 'deactivate', reason?: string) => {
    if (action === "deny" || action === "delete" || action === "deactivate") {
      setSelectedAdvert(ad)
      setSelectedAction(action)
      setRejectionDialogOpen(true)
    } else {
      let statusId = newStatusId
      await updateAdvertStatus(ad, action)
    }

    
  };



  const updateAdvertStatus = async (ad: Advert, action: 'approve' | 'deny' | 'delete' | 'deactivate', reason?: string ) => {
    try {
      let status: "a" | "d" | "p" | 'del' | 'deactivate';
      switch (action) {
        case 'approve':
          status = "a"
          break
        case 'deny':
          status = "d"
          break
        case 'delete':
          status = 'del'
          break
        case 'deactivate':
          status = "deactivate"
          break
        default:
          throw new Error("Invalid status")
      }

      const payload: any = {
        action: status,
        adId: ad.id
      }

      if (reason) {
        payload.reasonForRejection = reason
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_ADS}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchAds();
      toast.success(`Video status updated successfully`);
    }
    catch (err) {
      console.error('Error updating ad status:', err)
      toast.error('Failed to update ad status')
    }
  }



  const handleRejectionReasonSubmit = (reason: string) => {
    if (selectedAdvert && selectedAction) {
      updateAdvertStatus(selectedAdvert, selectedAction, reason)
      setRejectionDialogOpen(false)
      setSelectedAdvert(null)
      setSelectedAction(null)
    }
    
  }


  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Suspended", label: "Suspended" },
    { value: "InReview", label: "In Review" },
    { value: "Inactive", label: "In Active" },
    { value: "Rejected", label: "Rejected" },
    { value: "Closed", label: "Closed" },
  ]

  const getStatusLabel = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "Approved"
      case 2:
        return "InReview"
      case 3:
        return "Rejected"
      case 4:
        return "Closed"
      case 5:
        return "Inactive"
      default:
        return "Unknown"
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-200 text-green-700"
      case "InReview":
        return "bg-yellow-200 text-yellow-700"
      case "Rejected":
        return "bg-red-200 text-red-700"
      case "Closed":
        return "bg-gray-200 text-gray-700"
      case "Inactive":
        return "bg-red-200 text-red-600"
      default:
        return "bg-gray-200 text-gray-700"
    }
  };


   type userStatus = "Active" | "Suspended" | "InReview" | "Rejected" | "Closed" | 'Inactive'



  const columns = [
    columnHelper.accessor('adName', {
      header: 'Ad Name',
    }),
    columnHelper.accessor('authorName', {
      header: 'User Fullname',
    }),
    columnHelper.accessor('redirectUrl', {
      header: 'Ad Link',
      cell: (info) => truncateLetter(info.getValue() as string || '', 30),
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
      cell: (info) => {
        const status = info.getValue() as unknown as userStatus
        return (
          <span
            className={`px-2 py-1.5 text-center items-center rounded-full ${getStatusColor(statusOptions.find((option) => option.value === status)?.label || "")}`}
          >
            {statusOptions.find((option) => option.value === status)?.label}
          </span>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <SelectMenu
            options={[
              { label: "Activate", onClick: () => handleStatusToggle(row.original, 1, 'approve'), value: 1, icon: <RecommendOutlinedIcon sx={{ fontSize: 'medium' }} />, },
              { label: "Deny", onClick: () => handleStatusToggle(row.original, 5, 'deny'), value: 5, icon: <ThumbDownOutlinedIcon sx={{ fontSize: 'medium' }} />,},
              { label: "Delete", onClick: () => handleStatusToggle(row.original, 1, 'delete'), value: 8, icon: <DeleteOutlinedIcon sx={{ fontSize: 'medium' }} />, },
              { label: "Deactivate", onClick: () => handleStatusToggle(row.original, 5, 'deactivate'), value: 5, icon: <BlockOutlinedIcon sx={{ fontSize: 'medium' }} />,},
              { label: "View", onClick: () => handleView(row.original), icon: <PreviewOutlinedIcon sx={{ fontSize: 'medium' }} />, },
            ]}
            buttonVariant="text"
          />
        </div>
      ),
    }),
  ];



  const getCurrentItems = () => {
    switch (activeTab) {
      case 'active':
        return approvedAdverts;
      case 'pending':
        return pendingAdverts;
      default:
        return [];
    }
  };



  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-3">
        <Button
          label="Create Ad"
          variant="black"
          onClick={() => openSetModalFn('confirmationModal')}
        />
      </div>


      <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
        <div className="flex p-1">
          {['active', 'pending'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                  : 'text-blue-600 hover:text-blue-600'
              }`}
              onClick={() => { setActiveTab(tab as typeof activeTab) }}
            >
              {tab === 'active' ? 'Approved Adverts' : 'Pending Adverts'}
            </button>
          ))}
        </div>
      </div>


      <Table loading={false} data={getCurrentItems()} columns={columns} search={setSearch} filter={filter} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableHeading="All Ads" />

      {/* <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="dialog-title" aria-describedby="dialog-description" PaperProps={{ sx: { padding: 3, borderRadius: 2, boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)', width: { xs: '90%', sm: '500px' }, maxWidth: '750px' }, }} BackdropProps={{ sx: { backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, }}>
        <DialogTitle>Suspension Reason</DialogTitle>
        <DialogContent>
          <TextArea label="" rows={5} value={reason} onChange={(e) => setReason(e.target.value)}/>
        </DialogContent>
          <DialogActions>
            <Button variant='red' label='Cancel' type='reset' onClick={handleCloseDialog}></Button>
            <Button variant='black' label='Confirm Suspension' type='submit' onClick={handleConfirmSuspend}></Button>
          </DialogActions>
      </Dialog> */}

      <RejectionDialog open={rejectionDialogOpen} onClose={() => setRejectionDialogOpen(false)} onSubmit={handleRejectionReasonSubmit} />

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <>
          <CreateAdsModal onClose={closeModal} />
        </>
      </Modal>
    </div>
  );
};

export default Payment;

