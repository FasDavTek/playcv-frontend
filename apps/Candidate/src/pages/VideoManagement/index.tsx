import React, { useState, useEffect, useCallback } from 'react';

import { CircularProgress, Modal, Stack } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, SelectMenu, Table } from '@video-cv/ui-components';
import { VideoLinks } from '@video-cv/constants';
import { VideoCard, Videos } from '../../components';
import { CreateVideoConfirmationModal } from './modals';
import { routes } from '../../routes/routes';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { handleDate } from '@video-cv/utils';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';


const truncateText = (text: string, charLimit: number) => {
  if (text.length > charLimit) {
    return text.slice(0, charLimit) + '...';
  }
  return text;
};


export type ModalTypes = null | 'confirmationModal' | 'uploadModal';

type Video = {
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
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedItem, setSelectedItem] = useState<Video | null>(null);
  const [approvedVideos, setApprovedVideos] = useState<Video[]>([]);
  const [pendingVideos, setPendingVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  const checkPaymentStatus = async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 'success' && response.hasValidUpploadRequest === true) {
        toast.info('You have an existing payment for video upload that you have not yet completed.');
        navigate('/candidate/video-management/upload', {
          state: {
            uploadTypeId: response.uploadRequest.uploadTypeId,
            uploadTypeName: response.uploadRequest.uploadType,
            uploadRequestId: response.uploadRequest.id,
            paymentDate: response.uploadRequest.paymentDate,
            duration: response.uploadRequest.duration
          }
        });
      }
      else {
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




  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_VIDEO_LIST}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data;
      if (resp.code === '00') {
        data = await resp.videos;
      }

      const currentTime = Date.now();

      const newVideos = data.filter((video: Video) => new Date(video.dateCreated).getTime() > lastFetchTime);

      const videosApproved = data.filter((video: Video) => video.status === 'Approved');
      const videosPending = data.filter((video: Video) => ['Pending', 'Rejected', 'InReview'].includes(video.status));
      setApprovedVideos(videosApproved);
      setPendingVideos(videosPending);

      console.log(`Current tab ${activeTab}`, videos)

      newVideos.forEach((video: Video) => {
        if (video.status === 'Approved') {
          toast.success(`Your video "${video.title}" has been approved!`)
        } 
        else if (video.status === 'Rejected') {
          toast.error(`Your video "${video.title}" has been rejected. Reason: ${video.rejectionReason}`)
        }
      })

      setLastFetchTime(currentTime)

    }
    catch (err) {
      if(!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/');
      }
      else {
        console.error('Error fetching videos: ', err);
        setError('Failed to load videos. Please try again later.');
        toast.warning('Failed to load videos. Please try again later.');
      }
    }
    finally {
      setIsLoading(false);
    }
  }




  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [])




  const handleView = async (item: Video) => {
    setSelectedItem(item);
    navigate(`/candidate/video-management/view/:${item.id}`, {
      state: { video: item },
    });
  };



  const statusOptions = [
    { value: "Approved", label: "Approved" },
    { value: "Suspended", label: "Suspended" },
    { value: "InReview", label: "In Review" },
    { value: "Rejected", label: "Rejected" },
    { value: "Closed", label: "Closed" },
  ]


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-200 text-green-700"
      case "InReview":
        return "bg-yellow-200 text-yellow-700"
      case "Rejected":
        return "bg-red-200 text-red-700"
      case "Closed":
        return "bg-gray-200 text-gray-700"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }


  const columns = [
    { header: 'Video Name', accessorKey: 'title', },
    { header: 'Video Link', accessorKey: 'videoUrl',  cell: (info: { getValue: () => string; }):any => truncateText(info.getValue() as string || '', 30), },
    { header: 'Uploader', accessorKey: 'authorProfile.userDetails.fullName', },
    { header: 'Video Type', accessorKey: 'type', },
    { header: 'Email', accessorKey: 'email', },
    { header: 'Course of Study', accessorKey: 'courseOfStudy', },
    { header: 'Institution', accessorKey: 'institution', },
    { header: 'Grade', accessorKey: 'grade', },
    { header: 'Gender', accessorKey: 'gender', },
    { header: 'Business Name', accessorKey: 'businessName', },
    { header: 'BusinessPhone', accessorKey: 'businessPhoneNo', },
    { header: 'Industry', accessorKey: 'industry', },
    { header: 'Upload Date', accessorKey: 'dateCreated', cell: (info: any) => handleDate(info.getValue()) },
    { header: 'Status', accessorKey: 'status', 
      cell: (info: any) => {
        const status = info.getValue()
        return (
          <span
            className={`px-2 py-1.5 text-center items-center rounded-full ${getStatusColor(statusOptions.find((option) => option.value === status)?.label || "")}`}
          >
            {statusOptions.find((option) => option.value === status)?.label}
          </span>
        )
      },
    },
    { header: 'Actions', accessorKey: 'actions', cell: ({ row }: { row: { original: Video } }) => (
      <Stack direction='row' spacing={2}>
        {/* <Button variant='success' label='Approve' type='submit' className='text-white' onClick={() => handleApprove(row.original.id)} disabled={row.original.status !== 'Pending'}></Button>
        <Button variant='red' label='Reject' type='submit' onClick={() => handleOpenRejectDialog(row.original.id, row.original.title)} disabled={row.original.status !== 'Pending'}></Button> */}
        <SelectMenu
          options={[
            { label: "View", onClick: () => handleView(row.original), icon: <PreviewOutlinedIcon />, },
          ]}
          buttonVariant="text"
        />
      </Stack>
    ) },
  ];





  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress className="w-8 h-8 animate-spin" />
      </div>
    )
  };



  const getCurrentItems = () => {
    switch (activeTab) {
      case 'active':
        return approvedVideos;
      case 'pending':
        return pendingVideos;
      default:
        return [];
    }
  };

  

  return (
    <section className="px-3 md:px-10 py-10 min-h-screen ">
      <div className="flex justify-end mb-5">
        <Button
          variant='custom'
          label="Upload your Video"
          onClick={checkPaymentStatus}
          // onClick={() => openSetModalFn('confirmationModal')}
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
              onClick={() => { setActiveTab(tab as typeof activeTab);console.log('Clicked ' + tab, 'Current ' + activeTab, videos)}}
            >
              {tab === 'active' ? 'Approved Videos' : 'Pending Videos'}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-4'>
        <Table loading={false} data={getCurrentItems()} columns={columns} search={setSearch} filter={filter} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableHeading={`All My ${activeTab === 'active' ? 'Approved Videos' : 'Pending Videos' }`} />
      </div>

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <CreateVideoConfirmationModal onClose={closeModal} />
      </Modal>
      {/* TODO: Add tags field and video upload field */}
    </section>
  );
};

export default Dashboard;