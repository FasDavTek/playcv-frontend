import { Stack } from '@mui/material';
import { Button, Table } from '@video-cv/ui-components'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

interface Video {
  videoTitle: string;
  uploaderName: string;
  uploadDate: string;
  videoStatus: string;
  action: string;
}

const mockData: Video[] = [
  {
    videoTitle: 'Introduction to React',
    uploaderName: 'Alice Johnson',
    uploadDate: '2024-07-01',
    videoStatus: 'Pending',
    action: 'Approve/Reject',
  },
  {
    videoTitle: 'Advanced TypeScript',
    uploaderName: 'Bob Smith',
    uploadDate: '2024-07-05',
    videoStatus: 'Approved',
    action: 'View',
  },
  {
    videoTitle: 'Building REST APIs with Node.js',
    uploaderName: 'Charlie Brown',
    uploadDate: '2024-07-10',
    videoStatus: 'Rejected',
    action: 'View/Edit',
  },
  {
    videoTitle: 'Mastering CSS Grid',
    uploaderName: 'Diana Prince',
    uploadDate: '2024-07-15',
    videoStatus: 'Pending',
    action: 'Approve/Reject',
  },
  {
    videoTitle: 'Introduction to GraphQL',
    uploaderName: 'Edward Nigma',
    uploadDate: '2024-07-20',
    videoStatus: 'Approved',
    action: 'View',
  },
];

const index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
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
    console.log('Setting videos:', mockData);
    setVideos(mockData);
  }, []);

  useEffect(() => {
    console.log('Videos state:', videos);
  }, [videos]);



  // useEffect(() => {
  //   // Simulate receiving a new video notification
  //   const newVideo = {
  //     videoTitle: 'New Video Title',
  //     uploaderName: 'New Uploader',
  //     uploadDate: '2024-07-30',
  //     videoStatus: 'Pending',
  //     action: 'Approve/Reject',
  //   };
  //   toast.info(`New video uploaded: ${newVideo.videoTitle} by ${newVideo.uploaderName}`);
  //   setVideos(prevVideos => [...prevVideos, newVideo]);
  // }, []);



  const notifyCandidate = async (videoTitle: string, status: string) => {
    // Simulate an API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`Notification sent to candidate: ${videoTitle} is ${status}`);
      }, 1000);
    });
  };



  const handleApprove = async (videoTitle: string) => {
    console.log(`Approving video: ${videoTitle}`);
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.videoTitle === videoTitle ? { ...video, videoStatus: 'Approved' } : video
      )
    );
    toast.success(`Video "${videoTitle}" has been approved.`);
    const notification = await notifyCandidate(videoTitle, 'approved');
    console.log(notification);
  };

  const handleReject = async (videoTitle: string, reason: string) => {
    console.log(`Rejecting video: ${videoTitle}`);
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.videoTitle === videoTitle ? { ...video, videoStatus: 'Rejected' } : video
      )
    );
    toast.error(`Video "${videoTitle}" has been rejected.`);
    const notification = await notifyCandidate(videoTitle, 'rejected');
    console.log(notification);
  };

  const columns = [
    { header: 'Video Name', accessorKey: 'videoTitle', cell: (info: any) => info.getValue() },
    { header: 'Uploader', accessorKey: 'uploaderName', cell: (info: any) => info.getValue() },
    { header: 'Upload Date', accessorKey: 'uploadDate', cell: (info: any) => info.getValue() },
    { header: 'Status', accessorKey: 'videoStatus', cell: (info: any) => info.getValue() },
    { header: 'View Video', accessorKey: 'viewVideo', cell: ({ row }: any) => (
        <Button variant='custom' label='View' /* onClick={() => handleApprove(row.original.id)} */ >View</Button>
    ) },
    { header: 'Actions', accessorKey: 'actions', cell: ({ row }: any) => (
      <Stack direction='row' spacing={2}>
        <Button variant='success' label='Approve' className='text-white' onClick={() => handleApprove(row.original.id)} >Approve</Button>
        <Button variant='red' label='Reject' onClick={() => handleReject(row.original.id, 'Provide rejection reason')} >Reject</Button>
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
    </div>
  )
}

export default index