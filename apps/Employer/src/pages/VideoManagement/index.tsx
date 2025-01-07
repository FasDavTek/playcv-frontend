import React, { useCallback, useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Button, Table, } from '@video-cv/ui-components';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

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


const columnHelper = createColumnHelper<Video>();

const VideoManagement = () => {
  const [value, setValue] = React.useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [viewedVideos, setViewedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  const navigate = useNavigate();

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  const fetchVideos = useCallback(async () => {
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.EMPLOYER_AUTH_VIDEO_LIST}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (resp.succeeded === true) {
        const data = await resp.data;
        setVideos(data);
        setLoading(false);

        const currentTime = Date.now();
        const newVideos = data.filter((video: Video) => new Date(video.uploadDate).getTime() > lastFetchTime);
        if (newVideos.length > 0) {
          toast.info(`${newVideos.length} new video(s) uploaded`);
        }
        setLastFetchTime(currentTime);
      }
    }
    catch (err) {
      if(!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/');
      }
      else {
        console.error('Error fetching videos:', err)
        setLoading(false)
        toast.error('Failed to fetch videos')
      }
    }
  }, [token, lastFetchTime]);

  useEffect(() => {
    fetchVideos()
    // Set up interval to fetch videos every 5 minutes
    const interval = setInterval(fetchVideos, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchVideos]);


  const handleView = async (videoId: string) => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const videoDetails = await response.data;

      setViewedVideos(prevVideos => {
        const newVideos = [videoDetails, ...prevVideos];
        // Keep only the last 10 viewed videos
        return newVideos.slice(0, 10);
      });

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
    columnHelper.accessor('action', {
      cell: ({ row }: { row: { original: Video } }) => {
        return <Button variant='custom' onClick={() => handleView(row.original.id)} label="View CV" />;
      },
      header: 'Action',
    }),
  ];

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
        {/* Table comes here */}
        <div className='flex flex-col justify-between gap-8 w-full'>
          <div>
            <Typography variant="subtitle1" className="my-4">
              Recently Viewed Videos
            </Typography>
            {/* {viewedVideos.length > 0 ? (
              
            ) : (
              <p>No viewed videos yet</p>
            )} */}

            <Table
              loading={false}
              data={viewedVideos}
              columns={columns}
              search={setSearch}
              filter={filter}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              tableHeading="Recently Viewed Videos"
            />
          </div>

          <div>
            <Typography variant="subtitle1" marginTop='8' className="mt-20 mb-1">
                My Videos
            </Typography>
            <Table
              loading={false}
              data={videos}
              columns={columns}
              search={setSearch}
              filter={filter}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
              tableHeading="All Video CV"
            />
          </div>
        </div>
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
        
    </div>
  );
};

export default VideoManagement;
