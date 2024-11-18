import React, { useEffect, useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Button, Table, } from '@video-cv/ui-components';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

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

// const data = [
//   {
//     id: '1',
//     authorName: 'John Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'Mathematics',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
//   {
//     id: '2',
//     authorName: 'John Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'Zoology',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
//   {
//     id: '3',
//     authorName: 'Johnson Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'Plant Biology',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
//   {
//     id: '4',
//     authorName: 'John Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'Mechanical Engineering',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
//   {
//     id: '5',
//     authorName: 'John Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'Mathematics',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
//   {
//     id: '6',
//     authorName: 'John Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'Mathematics',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
//   {
//     id: '7',
//     authorName: 'John Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'Mathematics',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
//   {
//     id: '8',
//     authorName: 'John Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'Physics',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
//   {
//     id: '9',
//     authorName: 'John Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'English',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
//   {
//     id: '10',
//     authorName: 'John Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'Geology',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
//   {
//     id: '11',
//     authorName: 'John Smith',
//     email: 'john.smith@example.com',
//     courseOfStudy: 'Civil Engineering',
//     gender: 'Male',
//     phone: '1234567890',
//     stateOfOrigin: 'California',
//     grade: '1st class',
//   },
// ];

const columnHelper = createColumnHelper<Video>();

const VideoManagement = () => {
  const [value, setValue] = React.useState(0);
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
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.EMPLOYER_AUTH_VIDEO_LIST}?Page=1&Limit=10`)
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
  }, []);


  const handleView = async (videoId: string) => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}/${videoId}`);
      if (!response.ok) {
        throw new Error('Error fetching video details');
      }

      const videoDetails = await response.json();
      navigate(`/employer/video-management/:${videoId}`, {
        state: { videoDetails },
      });
    }
    catch (err) {
      console.error('Error fetching video details:', err)
      toast.error('Failed to fetch video details')
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const columns = [
    columnHelper.accessor('title', {
      header: 'Video Name',
    }),
    columnHelper.accessor('authorName', {
      header: 'Full Name',
    }),
    columnHelper.accessor('email', {
      header: 'Email',
    }),
    columnHelper.accessor('courseOfStudy', {
      header: 'Course of Study',
    }),
    columnHelper.accessor('grade', {
      header: 'Grade',
    }),
    columnHelper.accessor('gender', {
      header: 'Gender',
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
    columnHelper.accessor('action', {
      cell: ({ row }: { row: { original: Video } }) => {
        return <Button variant='custom' onClick={() => handleView(row.original.id)} label="View CV" />;
      },
      header: 'Action',
    }),
  ];

  return (
    <section className="">
        {/* Table comes here */}
        {/* filter logic comes here */}
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

        <Table
          loading={false}
          data={videos}
          columns={columns}
          tableHeading="All Video CV"
        />
        
    </section>
  );
};

export default VideoManagement;
