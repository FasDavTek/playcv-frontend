import { CircularProgress, Stack } from '@mui/material';
import { Button, Table, TextArea } from '@video-cv/ui-components'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';

interface Uploader {
  id: number;
  name: string;
  email: string;
}
interface Video {
  id: string;
  title: string;
  status: string;
  startDate: Date;
  endDate: Date;
  uploadDate: Date
  authorName: string;
  search: string;
  category: string;
  userType: string;
  userId: string;
  email: string;
  courseOfStudy: string;
  gender: string;
  phone: string;
  stateOfOrigin: string;
  grade: string;
  action: string;
}

// const mockData: Video[] = [
//   {
//     id: 1,
//     title: 'Introduction to React',
//     authorName: 'Alice Johnson',
//     startDate: '2024-07-01',
//     status: 'Pending',
//     action: 'Approve/Reject',
//   },
//   {
//     id: 2,
//     title: 'Advanced TypeScript',
//     authorName: 'Bob Smith',
//     startDate: '2024-07-05',
//     status: 'Approved',
//     action: 'View',
//   },
//   {
//     id: 3,
//     title: 'Building REST APIs with Node.js',
//     authorName: 'Charlie Brown',
//     startDate: '2024-07-10',
//     status: 'Rejected',
//     action: 'View/Edit',
//   },
//   {
//     id: 4,
//     title: 'Mastering CSS Grid',
//     authorName: 'Diana Prince',
//     startDate: '2024-07-15',
//     status: 'Pending',
//     action: 'Approve/Reject',
//   },
//   {
//     id: 5,
//     title: 'Introduction to GraphQL',
//     authorName: 'Edward Nigma',
//     startDate: '2024-07-20',
//     status: 'Approved',
//     action: 'View',
//   },
// ];

const index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?Page=1&Limit=10`)
      if (!resp.ok) {
        throw new Error("Failed to fetch videos");
      }

      const data = await resp.json();
      setVideos(data);
      setLoading(false);

      const currentTime = Date.now();
      const newVideos = data.filter((video: Video) => new Date(video.uploadDate).getTime() > lastFetchTime);
      if (newVideos.length > 0) {
        toast.info(`${newVideos.length} new video(s) uploaded`);
      }
      setLastFetchTime(currentTime);
    }
    catch (err) {
      console.error('Error fetching videos:', err)
      setLoading(false)
      toast.error('Failed to fetch videos')
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

  // const handleApprove = async (videoId: any) => {
  //   await approveVideo(videoId);
  //   setVideos(prevVideos => prevVideos.map(video => video.id === videoId ? { ...video, status: 'approved' } : video));
  // };

  // const handleReject = async (videoId: any, reason: string) => {
  //   await rejectVideo(videoId, reason);
  //   setVideos(prevVideos => prevVideos.map(video => video.id === videoId ? { ...video, status: 'rejected', rejectionReason: reason } : video));
  // };

  const handleView = async (videoId: string) => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}/${videoId}`);
      if (!response.ok) {
        throw new Error('Error fetching video details');
      }

      const videoDetails = await response.json();
      navigate(`/admin/video-management/:${videoId}`, {
        state: { videoDetails },
      });
    }
    catch (err) {
      console.error('Error fetching video details:', err)
      toast.error('Failed to fetch video details')
    }
  };

  const handleVideoAction = async (videoId: string, action: string, reason?: string) => {
    try {
      const apiData = {
        videoId,
        action,
        reason,
      };

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_VIDEO}`, apiData)
      if (!response.ok) {
        throw new Error(`Failed to ${action} video`)
      }

      await fetchVideos();
      toast.success(`Video ${action === 'a' ? 'approved' : 'rejected'} successfully`)
    } 
    catch (err) {
      console.error(`Error ${action === 'a' ? 'approving' : 'rejecting'} video:`, err)
      toast.error(`Failed to ${action === 'a' ? 'approve' : 'reject'} video`)
    }
  }

  const handleApprove = (videoId: string) => handleVideoAction(videoId, 'a')
  const handleReject = (videoId: string, reason: string) => handleVideoAction(videoId, 'd', reason)

  const notifyCandidate = async (videoId: string, title: string, status: string, /* uploaderId: any, */ reason?: string) => {
    // Simulate an API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Notification sent to candidate: ${videoId} is ${status}`);
        toast.info(`Notification sent to candidate: ${title} is ${status}`);
      }, 1000);
    });
  };



  const handleOpenRejectDialog = (videoId: string, title: string) => {
    setSelectedVideoId(videoId);
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
    { header: 'Uploader', accessorKey: 'authorName', },
    { header: 'Email', accessorKey: 'email', },
    { header: 'Course of Study', accessorKey: 'courseOfStudy', },
    { header: 'Grade', accessorKey: 'grade', },
    { header: 'Gender', accessorKey: 'gender', },
    { header: 'Phone', accessorKey: 'phone', },
    { header: 'Upload Date', accessorKey: 'startDate', },
    { header: 'Status', accessorKey: 'status', },
    { header: 'View Video', accessorKey: 'viewVideo', cell: ({ row }: { row: { original: Video } }) => (
        <Button variant='custom' label='View' onClick={() => handleView(row.original.id)}></Button>
    ) },
    { header: 'Actions', accessorKey: 'actions', cell: ({ row }: { row: { original: Video } }) => (
      <Stack direction='row' spacing={2}>
        <Button variant='success' label='Approve' type='submit' className='text-white' onClick={() => handleApprove(row.original.id)} disabled={row.original.status !== 'Pending'}></Button>
        <Button variant='red' label='Reject' type='submit' onClick={() => handleOpenRejectDialog(row.original.id, row.original.title)} disabled={row.original.status !== 'Pending'}></Button>
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

      <Table loading={false} columns={columns} data={videos} />

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