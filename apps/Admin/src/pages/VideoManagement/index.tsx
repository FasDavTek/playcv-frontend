import { Stack } from '@mui/material';
import { Button, Table, TextArea } from '@video-cv/ui-components'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface Uploader {
  id: number;
  name: string;
  email: string;
}
interface Video {
  id: number;
  videoTitle: string;
  uploaderName: string;
  // uploader: Uploader;
  uploadDate: string;
  videoStatus: string;
  action: string;
}

const mockData: Video[] = [
  {
    id: 1,
    videoTitle: 'Introduction to React',
    uploaderName: 'Alice Johnson',
    uploadDate: '2024-07-01',
    videoStatus: 'Pending',
    action: 'Approve/Reject',
  },
  {
    id: 2,
    videoTitle: 'Advanced TypeScript',
    uploaderName: 'Bob Smith',
    uploadDate: '2024-07-05',
    videoStatus: 'Approved',
    action: 'View',
  },
  {
    id: 3,
    videoTitle: 'Building REST APIs with Node.js',
    uploaderName: 'Charlie Brown',
    uploadDate: '2024-07-10',
    videoStatus: 'Rejected',
    action: 'View/Edit',
  },
  {
    id: 4,
    videoTitle: 'Mastering CSS Grid',
    uploaderName: 'Diana Prince',
    uploadDate: '2024-07-15',
    videoStatus: 'Pending',
    action: 'Approve/Reject',
  },
  {
    id: 5,
    videoTitle: 'Introduction to GraphQL',
    uploaderName: 'Edward Nigma',
    uploadDate: '2024-07-20',
    videoStatus: 'Approved',
    action: 'View',
  },
];

const index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/videos');
      const data = await response.json();
      setVideos(data);
    };
  
    fetchData();
  }, []);

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

  useEffect(() => {
    setVideos(mockData);
  }, []);

  useEffect(() => {
  }, [videos]);



  useEffect(() => {
    // Simulate receiving a new video notification
    const newVideo = {
      id: 6,
      videoTitle: 'New Video Title',
      uploaderName: 'New Uploader',
      uploadDate: '2024-07-30',
      videoStatus: 'Pending',
      action: 'Approve/Reject',
    };
    toast.info(`New video uploaded: ${newVideo.videoTitle} by ${newVideo.uploaderName}`);
    setVideos(prevVideos => [...prevVideos, newVideo]);
  }, []);

  const handleView = (videoId: number) => {
    navigate(`/admin/video-management/:${videoId}`);
  };

  const notifyCandidate = async (videoId: number, videoTitle: string, status: string, /* uploaderId: any, */ reason?: string) => {
    // Simulate an API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Notification sent to candidate: ${videoId} is ${status}`);
        toast.info(`Notification sent to candidate: ${videoTitle} is ${status}`);
      }, 1000);
    });
  };



  const handleApprove = async (videoId: number, videoTitle: string, status: 'approved', /* uploaderId: any */ ) => {
    console.log(`Approving video: ${videoId}`);
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId ? { ...video, videoStatus: 'Approved' } : video
      )
    );
    toast.success(`Video "${videoTitle}" has been approved.`);
    const notification = await notifyCandidate(videoId, videoTitle, status, /* uploaderId */);
    console.log(notification);
  };



  const handleReject = async (videoId: number, videoTitle: string, status: 'rejected', reason: string,  /* uploaderId: any */) => {
    console.log(`Rejecting video: ${videoId}`);
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId ? { ...video, videoStatus: 'Rejected' } : video
      )
    );
    toast.error(`Video "${videoTitle}" has been rejected.`);
    const notification = await notifyCandidate(videoId, videoTitle, status, reason, /* uploaderId */ );
    console.log(notification);
  };



  const handleOpenRejectDialog = (videoId: number, videoTitle: string) => {
    setSelectedVideoId(videoId);
    setSelectedVideoTitle(videoTitle);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleConfirmReject = () => {
    if (selectedVideoId !== null) {
      handleReject(selectedVideoId, selectedVideoTitle, 'rejected', /*  uploaderId, */ reason);
    }
    setReason('');
    setOpen(false);
  };



  const columns = [
    { header: 'Video Name', accessorKey: 'videoTitle', cell: (info: any) => info.getValue() },
    { header: 'Uploader', accessorKey: 'uploaderName', cell: (info: any) => info.getValue() },
    { header: 'Upload Date', accessorKey: 'uploadDate', cell: (info: any) => info.getValue() },
    { header: 'Status', accessorKey: 'videoStatus', cell: (info: any) => info.getValue() },
    { header: 'View Video', accessorKey: 'viewVideo', cell: ({ row }: any) => (
        <Button variant='custom' label='View' onClick={() => handleView(row.original.id)}></Button>
    ) },
    { header: 'Actions', accessorKey: 'actions', cell: ({ row }: any) => (
      <Stack direction='row' spacing={2}>
        <Button variant='success' label='Approve' type='submit' className='text-white' onClick={() => handleApprove(row.original.id, row.original.videoTitle, row.original.status /*, row.original.uploaderId */ )} ></Button>
        <Button variant='red' label='Reject' type='submit' onClick={() => handleOpenRejectDialog(row.original.id, row.original.videoTitle)} ></Button>
      </Stack>
    ) },
  ];
  
  return (
    <div className='p-4'>
        {videos.length > 0 ? (
          <Table loading={false} columns={columns} data={videos} />
        ) : (
          <p>No data available</p>
        )}

        <Dialog open={open} onClose={handleClose} aria-labelledby="dialog-title" aria-describedby="dialog-description" PaperProps={{ sx: { padding: 3, borderRadius: 2, boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)', width: { xs: '90%', sm: '500px' }, maxWidth: '750px' }, }} BackdropProps={{ sx: { backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, }} >
          <DialogTitle>Rejection Reason</DialogTitle>
          <DialogContent>
            <TextArea label="" rows={5} value={reason} onChange={(e) => setReason(e.target.value)}/>
          </DialogContent>
          <DialogActions>
            <Button variant='red' label='Cancel' type='reset' onClick={handleClose}></Button>
            <Button variant='black' label='Submit' type='submit' onClick={handleConfirmReject}></Button>
          </DialogActions>
        </Dialog>
    </div>
  )
}

export default index