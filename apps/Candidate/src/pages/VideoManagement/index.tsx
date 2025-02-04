import React, { useState, useEffect } from 'react';

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

export type ModalTypes = null | 'confirmationModal' | 'uploadModal';

type Video = {
  id: string;
  title: string;
  status: string;
  startDate: Date;
  endDate: Date;
  authorName: string;
  search: string;
  category: string;
  userType: string;
  userId: string;
  rejectionReason?: string
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
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
    setError(null);
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_VIDEO_LIST}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.code === '00') {
        const data = await resp.videos;
        const currentTime = Date.now();
        console.log(data);
        setVideos(data);

        const newVideos = data.filter((video: Video) => new Date(video.startDate).getTime() > lastFetchTime);
        const approved = data.filter((video: Video) => video.status === 'approved');
        const pending = data.filter((video: Video) => ['pending', 'rejected', 'InReview'].includes(video.status));
        setVideos(data);
        setApprovedVideos(approved);
        setPendingVideos(pending);

        newVideos.forEach((video: Video) => {
          if (video.status === 'approved') {
            toast.success(`Your video "${video.title}" has been approved!`)
          } 
          else if (video.status === 'rejected') {
            toast.error(`Your video "${video.title}" has been rejected. Reason: ${video.rejectionReason}`)
          }
        })

        setLastFetchTime(currentTime)
      }
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
    fetchVideos()
    const interval = setInterval(fetchVideos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [])




  const handleView = async (id: string) => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // if (!response.ok) {
      //   throw new Error('Error fetching video details');
      // }

      const videoDetails = await response.json();
      navigate(`/admin/video-management/:${id}`, {
        state: { videoDetails },
      });
    }
    catch (err) {
      console.error('Error fetching video details:', err)
      toast.error('Failed to fetch video details')
    }
  };



  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Suspended", label: "Suspended" },
    { value: "In Review", label: "In Review" },
    { value: "Rejected", label: "Rejected" },
    { value: "Closed", label: "Closed" },
  ]


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
      default:
        return "bg-gray-200 text-gray-700"
    }
  }


  const columns = [
    { header: 'Video Name', accessorKey: 'title', },
    { header: 'Uploader', accessorKey: 'authorProfile.userDetails.fullName', },
    { header: 'Video Type', accessorKey: 'type', },
    { header: 'Email', accessorKey: 'email', },
    { header: 'Course of Study', accessorKey: 'courseOfStudy', },
    { header: 'Grade', accessorKey: 'grade', },
    { header: 'Gender', accessorKey: 'gender', },
    { header: 'Phone', accessorKey: 'phone', },
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
            { label: "View", onClick: () => handleView(row.original.id) },
            // {
            //   label: "Reject",
            //   onClick: () => handleOpenRejectDialog(row.original.id, row.original.title),
            //   value: 5,
            // },
            // { label: "Revoke", onClick: () => handleStatusChange(row.original.id, 8), value: 8 },
            // { label: "Decline", onClick: () => handleStatusChange(row.original.id, 9), value: 9 },
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
  }

  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen">
  //       <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
  //       <p className="text-lg font-semibold text-red-500">{error}</p>
  //     </div>
  //   )
  // }
  

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
          {['pending', 'approved'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                  : 'text-blue-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab === "pending" ? "Pending Videos" : 'Approved Videos'}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-4'>
        <Table loading={false} data={`${activeTab === 'pending' ? pendingVideos : approvedVideos}`} columns={columns} search={setSearch} filter={filter} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableHeading={`All My ${activeTab === "pending" ? "Pending Videos" : 'Approved Videos'}`} />
      </div>

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <CreateVideoConfirmationModal onClose={closeModal} />
      </Modal>
      {/* TODO: Add tags field and video upload field */}
    </section>
  );
};

export default Dashboard;