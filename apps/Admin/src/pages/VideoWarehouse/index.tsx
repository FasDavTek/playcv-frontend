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
import { Edit } from '@mui/icons-material';

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


const index = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Video | null>(null);
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

      let status: "a" | "d" | "p";
      switch (newStatus) {
        case 1:
        case 7:
          status = "a"
          break
        case 5:
        case 9:
          status = "d"
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
        statusId: newStatus,
        action: status,
        reason,
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_VIDEO}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchVideos();
      toast.success(`Video status updated successfully`);
    }
    catch (err) {
      console.error(`Error updating video status:`, err)
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



  const columns = [
    { header: 'Video Name', accessorKey: 'title', },
    { header: 'Uploader', accessorKey: 'videoUrl', },
    { header: 'Uploader', accessorKey: 'authorProfile.userDetails.fullName', },
    { header: 'Video Type', accessorKey: 'type', },
    { header: 'Email', accessorKey: 'email', },
    { header: 'Phone', accessorKey: 'phone', },
    { header: 'Course of Study', accessorKey: 'courseOfStudy', },
    { header: 'Institution', accessorKey: 'institution', },
    { header: 'Grade', accessorKey: 'grade', },
    { header: 'Gender', accessorKey: 'gender', },
    { header: 'Business Name', accessorKey: 'businessName', },
    { header: 'BusinessPhone', accessorKey: 'businessPhoneNo', },
    { header: 'Industry', accessorKey: 'industry', },
    { header: 'Upload Date', accessorKey: 'dateCreated', cell: (info: any) => handleDate(info.getValue()) },
    { header: 'Status', accessorKey: 'status', },
    // { header: 'View Video', accessorKey: 'viewVideo', cell: ({ row }: { row: { original: Video } }) => (
    //     <Button variant='custom' label='View' onClick={() => handleView(row.original.id)}></Button>
    // ) },
    { header: 'Actions', accessorKey: 'actions', cell: ({ row }: { row: { original: Video } }) => (
      <Stack direction='row' spacing={2}>
        {/* <Button variant='success' label='Approve' type='submit' className='text-white' onClick={() => handleApprove(row.original.id)} disabled={row.original.status !== 'Pending'}></Button>
        <Button variant='red' label='Reject' type='submit' onClick={() => handleOpenRejectDialog(row.original.id, row.original.title)} disabled={row.original.status !== 'Pending'}></Button> */}
        <SelectMenu
          options={[
            { label: "Approve", onClick: () => handleStatusChange(row.original.id, 7), value: 7 },
            {
              label: "Reject",
              onClick: () => handleOpenRejectDialog(row.original.id, row.original.title),
              value: 5,
            },
            { label: "Revoke", onClick: () => handleStatusChange(row.original.id, 8), value: 8 },
            { label: "Decline", onClick: () => handleStatusChange(row.original.id, 9), value: 9 },
          ]}
          buttonVariant="text"
        />
      </Stack>
    ) },
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