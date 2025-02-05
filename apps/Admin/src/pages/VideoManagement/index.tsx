import { CircularProgress, Stack } from '@mui/material';
import { Button, SelectMenu, Table, TextArea } from '@video-cv/ui-components'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { handleDate } from '@video-cv/utils';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import { Edit } from '@mui/icons-material';
import { createColumnHelper } from '@tanstack/react-table';

interface Uploader {
  id: number;
  name: string;
  email: string;
}
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
  totalRecords: number
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

const columnHelper = createColumnHelper<Video>();

const index = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedItem, setSelectedItem] = useState<Video | null>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  const fetchVideos = async () => {
    setLoading(true);
    try {  

      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data;
      if (resp.code === '00') {
        data = await resp.videos;
        setVideos(data || []);
      }

      const currentTime = Date.now();
      const newVideos = data.filter((video: Video) => new Date(video.dateCreated).getTime() > lastFetchTime);
      if (newVideos.length > 0) {
        toast.info(`${newVideos.length} new video(s) uploaded`);
      }
      setLastFetchTime(currentTime);
    }
    catch (err) {
      setLoading(false)
      toast.info('No video found')
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVideos()
    // Set up interval to fetch videos every 5 minutes
    const interval = setInterval(fetchVideos, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // const { fetchVideos, approveVideo, rejectVideo } = useAdminApi();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const videoData = await fetchVideos();
  //     setVideos(videoData);
  //   };
  //   fetchData();
  // }, []);

  // const handleApprove = async (id: any) => {
  //   await approveVideo(id);
  //   setVideos(prevVideos => prevVideos.map(video => video.id === id ? { ...video, status: 'approved' } : video));
  // };

  // const handleReject = async (id: any, reason: string) => {
  //   await rejectVideo(id, reason);
  //   setVideos(prevVideos => prevVideos.map(video => video.id === id ? { ...video, status: 'rejected', rejectionReason: reason } : video));
  // };

  const handleStatusChange = async (id: number, newStatus: number, reason?: string) => {
    try {

      let status: "a" | "r" | "p";
      switch (newStatus) {
        case 1:
        case 7:
          status = "a"
          break
        case 5:
        case 9:
          status = "r"
          break
        case 4:
        case 8:
          status = "p"
          break
        default:
          throw new Error("Invalid status")
      }

      const payload = {
        videoId: id,
        action: status,
        reasonForRejection: reason,
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_VIDEO}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchVideos();
      toast.success(`Video status updated successfully`);
    }
    catch (err) {
      toast.error(`Failed to update video status`)
    }
  }

  const handleView = async (item: Video) => {
    setSelectedItem(item);
    navigate(`/admin/video-management/${item.id}`, {
      state: { video: item },
    });
  };

  const handleVideoAction = async (id: number, action: string, reason?: string) => {
    try {
      const apiData = {
        id,
        action,
        reason,
      };

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_VIDEO}`, apiData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // if (!response.ok) {
      //   throw new Error(`Failed to ${action} video`)
      // }

      await fetchVideos();
      toast.success(`Video ${action === 'a' ? 'approved' : 'rejected'} successfully`)
    } 
    catch (err) {
      console.error(`Error ${action === 'a' ? 'approving' : 'rejecting'} video:`, err)
      toast.error(`Failed to ${action === 'a' ? 'approve' : 'reject'} video`)
    }
  }

  const handleApprove = (id: number, action: string) => handleVideoAction(id, 'a')
  const handleReject = (id: number, reason: string) => handleVideoAction(id, 'd', reason)

  const notifyCandidate = async (id: string, title: string, status: string, /* uploaderId: any, */ reason?: string) => {
    // Simulate an API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Notification sent to candidate: ${id} is ${status}`);
        toast.info(`Notification sent to candidate: ${title} is ${status}`);
      }, 1000);
    });
  };



  const handleOpenRejectDialog = (id: number, title: string) => {
    setSelectedVideoId(id);
    setSelectedVideoTitle(title);
    setOpen(true);
  };
  
  const handleClose = () => {
    setReason('');
    setOpen(false);
  };
  
  const handleConfirmReject = () => {
    if (selectedVideoId !== null) {
      handleReject(selectedVideoId, reason);
    }
    handleClose();
  };


  const statusOptions = [
    { value: "Approved", label: "Approved" },
    { value: "Pending", label: "Pending" },
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
    columnHelper.accessor('title', {
      header: 'Video Name',
    }),
    columnHelper.accessor('authorProfile.userDetails.fullName', {
      header: 'Uploader',
    }),
    columnHelper.accessor('type', {
      header: 'Video Type',
    }),
    columnHelper.accessor('authorProfile.userDetails.email', {
      header: 'Email',
    }),
    columnHelper.accessor('authorProfile.userDetails.gender', {
      header: 'Gender',
    }),
    columnHelper.accessor('authorProfile.userDetails.phoneNo', {
      header: 'Phone',
    }),
    columnHelper.accessor('dateCreated', {
      header: 'Upload Date',
      cell: (info: any) => handleDate(info.getValue())
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue()
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
      id: 'actions', header: 'Actions', cell: ({ row }) => (
        <Stack direction='row' spacing={2}>
          {/* <Button variant='success' label='Approve' type='submit' className='text-white' onClick={() => handleApprove(row.original.id)} disabled={row.original.status !== 'Pending'}></Button>
          <Button variant='red' label='Reject' type='submit' onClick={() => handleOpenRejectDialog(row.original.id, row.original.title)} disabled={row.original.status !== 'Pending'}></Button> */}
          <SelectMenu
            options={[
              { label: "Approve", onClick: () => handleStatusChange(row.original.id, 1), value: 1 },
              {
                label: "Reject",
                onClick: () => handleOpenRejectDialog(row.original.id, row.original.title),
                value: 5,
              },
              { label: "View", onClick: () => handleView(row.original), icon: <PreviewOutlinedIcon />, },
            ]}
            buttonVariant="text"
          />
        </Stack>
      )
    })
  ];
  
  return (
    <div className='p-4 mb-8'>
      {/* {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <CircularProgress className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        videos.length > 0 ? (
          
        ) : (
          <p>No videos available</p>
        )
      )} */}

      <Table loading={false} columns={columns} data={videos} search={setSearch} filter={filter} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />

      <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" aria-describedby="dialog-description" PaperProps={{ sx: { padding: 3, borderRadius: 2, boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)', width: { xs: '90%', sm: '500px' }, maxWidth: '750px' }, }} BackdropProps={{ sx: { backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, }} >
        <DialogTitle>Rejection Reason</DialogTitle>
        <DialogContent>
          <TextArea label="" rows={5} value={reason} onChange={(e) => setReason(e.target.value)}/>
        </DialogContent>
        <DialogActions>
          <Button variant='red' label='Cancel' type='reset' onClick={handleClose}></Button>
          <Button variant='black' label='Confirm Rejection' type='submit' onClick={handleConfirmReject}></Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default index