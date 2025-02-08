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



const truncateText = (text: string, charLimit: number) => {
  if (text.length > charLimit) {
    return text.slice(0, charLimit) + '...';
  }
  return text;
};


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
  businessName?: string
  businessPhone?: string
  industry?: string
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
      courseOfStudy?: string;
      grade?: string
    }
  }
}


const columnHelper = createColumnHelper<Video>();

const VideoManagement = () => {
  const [value, setValue] = React.useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState<'viewed' | 'vidoes'>('viewed');
  const [viewedVideos, setViewedVideos] = useState<Video[]>([]);
  const [selectedItem, setSelectedItem] = useState<Video | null>(null);
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
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.EMPLOYER_AUTH_VIDEO_LIST}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (resp.code === '00') {
        const data = await resp.videos;
        setVideos(data);
        setLoading(false);

        const currentTime = Date.now();
        const newVideos = data.filter((video: Video) => new Date(video.dateCreated).getTime() > lastFetchTime);
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
    columnHelper.accessor('videoUrl', {
      header: 'Video Link',
      cell: (info) => truncateText(info.getValue() as string || '', 30),
    }),
    columnHelper.accessor('authorProfile.userDetails.fullName', {
      header: 'Full Name',
    }),
    columnHelper.accessor('authorProfile.userDetails.email', {
      header: 'Email',
    }),
    columnHelper.accessor('authorProfile.userDetails.courseOfStudy', {
      header: 'Course of Study',
    }),
    columnHelper.accessor('authorProfile.userDetails.grade', {
      header: 'Grade',
    }),
    columnHelper.accessor('authorProfile.userDetails.gender', {
      header: 'Gender',
    }),
    columnHelper.accessor('businessName', {
      header: 'Business Name',
    }),
    columnHelper.accessor('businessPhone', {
      header: 'Business Phone',
    }),
    columnHelper.accessor('industry', {
      header: 'Industry',
    }),
    columnHelper.accessor('status', {
      header: 'Status',
    }),
  ];

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">

        <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
          <div className="flex p-1">
            {['viewed', 'videos'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                    : 'text-blue-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab(tab as typeof activeTab)}
              >
                {tab === "viewed" ? "Viewed Video CVs" : 'All Video CV'}
              </button>
            ))}
          </div>
        </div>

        <div className='mt-4'>
          <Table loading={false} data={`${activeTab === 'viewed' ? viewedVideos : videos}`} columns={columns} search={setSearch} filter={filter} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableHeading={`All My ${activeTab === "viewed" ? "Viewed Video CVs" : 'New Video CVs'}`} />
        </div>

    </div>
  );
};

export default VideoManagement;
