import React, { useCallback, useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Button, SelectMenu, Table, useToast, } from '@video-cv/ui-components';
import { deleteData, getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import { Stack, Tooltip } from '@mui/material';
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined"
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Videos from '../../components/Videos';
import Filter, { FilterConfig } from "./../../../../../libs/ui-components/Filter"
import { useAllMisc } from "./../../../../../libs/hooks/useAllMisc"
import model from "./../../../../../libs/utils/helpers/model"


const truncateText = (text: string, wordLimit: number) => {
  if (!text) return "";

  const strippedText = text.replace(/<[^>]*>?/gm, "")

  const words = strippedText.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return strippedText;
};


const truncateLetter = (text: string, charLimit: number) => {
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
  description: string
  categoryId: number
  category: string | null
  userId: string
  dateCreated: string
  views: number
  videoUrl: string
  thumbnailUrl: string
  status: string
  totalRecords: number
  videoDescription: string;
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
    businessDetails: {
      userId: string;
      businessName: string;
      industry: string;
      address: string;
      websiteUrl: string;
      contactPhone: string;
      businessEmail: string;
      businessTypeId: string;
      contactName: string;
      contactPosition: string;
      fbLink: string;
      id: string;
      industryId: string;
      instagramUrl: string;
      isActive: boolean;
      twitter: string;
    }
    professionalDetails: {
      id: string;
      nyscStateCode: string;
      nyscStartYear: number;
      nyscEndYear: number;
      address: string;
      businessName: string;
      businessPhone: string;
      businessProfile: string;
      classOfDegree: string;
      course: string;
      courseId: number;
      coverLetter: string;
      dateCreated: string;
      degree: string;
      degreeClassId: number;
      degreeTypeId: number;
      industry: string;
      industryId: number;
      institution: string;
      institutionId: number;
    }
  }
  hasSubscription: {
      userId: number,
      subscriptionId: number,
      videoId: number,
      totalAmountPaid: number,
      canAccessProduct: string,
      datePaid: string,
      checkOutId: number
  },
}


const columnHelper = createColumnHelper<Video>();

const VideoManagement = () => {
  const [value, setValue] = React.useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [viewedVideos, setViewedVideos] = useState<Video[]>([]);
  const [activeTab, setActiveTab] = useState<'videos' | 'viewed'>('videos');
  const [selectedItem, setSelectedItem] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(1);
  const [tooltipOpenId, setTooltipOpenId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const { showToast } = useToast();

  const navigate = useNavigate();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  const fetchVideos = useCallback(async () => {
    try {

      let videosData: Video[] = [];
      let videosCount = 0;

      const queryParams = new URLSearchParams({
        Page: currentPage.toString(),
        Limit: pageSize.toString(),
        ...filters,
      });

      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.EMPLOYER_AUTH_VIDEO_LIST}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (resp.succeeded === true) {
        const data = await resp.data;
        const videosCount = resp.totalRecords > 0 ? resp.totalRecords : totalRecords;

        setVideos(data);
        setTotalRecords(videosCount);
        setLoading(false);

        const currentTime = Date.now();
        const newVideos = data.filter((video: Video) => new Date(video.dateCreated).getTime() > lastFetchTime);
        if (newVideos.length > 0) {
          showToast(`${newVideos.length} new video(s) uploaded`, 'info');
        }
        setLastFetchTime(currentTime);
      }
    }
    catch (err) {
      if(!token) {
        showToast('Your session has expired. Please log in again', 'error');
        navigate('/');
      }
      else {
        setLoading(false)
        showToast('Failed to fetch videos', 'error')
      }
    }
  }, [token, currentPage, pageSize, totalRecords, navigate, filters]);



  const handleDeleteFromWatchHistory = async (videoId: number) => {
    try {
      const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
      const resp = await deleteData(`${CONFIG.BASE_URL}${apiEndpoints.DELETE_FROM_WATCH_HISTORY}?videoId=${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (resp.succeeded === true) {
        showToast('Video removed from watch history', 'success');
        setViewedVideos((prevVideos) => prevVideos.filter((video) => video.id !== videoId));
      } else {
        showToast('Failed to delete video from watch history', 'error');
      }
    } catch (err) {
      console.error('Error deleting video from watch history:', err);
      showToast('Failed to delete video from watch history', 'error');
    }
  };
  


  useEffect(() => {
    fetchVideos();
    // Set up interval to fetch videos every 5 minutes
    const interval = setInterval(fetchVideos, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchVideos, filters]);



  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);


  const clearFilters = () => {
    setFilters({});
  };



  const handleView = async (item: Video) => {
    setSelectedItem(item);
    navigate(`/employer/video-management/${item.id}`);
  };


  const { data: videoCategories, isLoading: isLoadingCategories } = useAllMisc({
    resource: "video-category",
    download: true,
  });


  const transformedCategories = model(videoCategories, "name", "id");



  const videoFilterConfig: FilterConfig[] = [
    {
      id: "title",
      label: "Video Name",
      type: "text",
    },
    {
      id: "category",
      label: "Category",
      type: "select",
      options: isLoadingCategories ? [] : transformedCategories || [],
      defaultValueKey: "id",
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Approved", value: "approved" },
        { label: "Pending", value: "pending" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    {
      id: "dateCreated",
      label: "Upload Date",
      type: "date",
    },
  ];


  const columns = [
    columnHelper.accessor('title', {
      header: 'Video Name',
    }),
    columnHelper.accessor('videoUrl', {
      header: 'Video Link',
      cell: (info: any) => {
        const redirectUrl = info.getValue() as string;
        const rowId = info.row.original.id;
    
        const handleCopyLink = () => {
          navigator.clipboard.writeText(redirectUrl).then(() => {
            setTooltipOpenId(rowId);
            setTimeout(() => setTooltipOpenId(null), 2000);
          });
        };
    
        return (
          <Tooltip
            open={tooltipOpenId === rowId}
            title="Link copied!"
            placement="top"
            arrow
          >
            <p
              onClick={handleCopyLink}
              style={{ textTransform: 'none', color: 'blue', textDecoration: 'none', cursor: 'pointer' }}
            >
              Video Link
            </p>
          </Tooltip>
        );
      },
    }),
    columnHelper.accessor('authorProfile.userDetails', {
      header: 'Full Name',
      cell: (info) => {
        if (activeTab === 'videos') {
          return info.getValue()?.fullName || '';
        } else {
          const { firstName, lastName } = info.getValue() || {};
          return `${firstName || ''} ${lastName || ''}`.trim();
        }
      },
    }),
    columnHelper.accessor('authorProfile.userDetails.email', {
      header: 'Email',
    }),
    columnHelper.accessor('authorProfile.userDetails.phoneNo', {
      header: 'Phone Number',
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const options = []
        options.push({ label: "View", onClick: () => handleView(row.original), icon: <PreviewOutlinedIcon /> })
        if (activeTab === 'viewed') {
          options.push({ label: "Delete", onClick: () => handleDeleteFromWatchHistory(row.original.id), icon: <DeleteOutlinedIcon />, });
        }

        return (
          <Stack direction="row" spacing={2}>
            <SelectMenu options={options} buttonVariant="text" />
          </Stack>
        )
      },
    }),
  ];



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className="min-h-screen px-3 md:px-10 py-10">

        <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
          <div className="flex p-1">
            {['videos', 'viewed'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === tab
                    ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                    : 'text-blue-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab(tab as typeof activeTab)}
              >
                {tab === "videos" ? 'Video Archive' : 'History'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'videos' && (
          <div className=" mt-5 border border-neutral-100 rounded-2xl py-4">
            {videoFilterConfig.length > 0 && (
              <Filter config={videoFilterConfig} onFilterChange={handleFilterChange} filters={filters} />
            )}
          </div>
        )}

        <div className='mt-4'>
          {activeTab === 'videos' ? (
            <Table loading={loading} data={videos} columns={columns} search={setSearch} filter={filter} filterConfig={videoFilterConfig} onFilterChange={handleFilterChange} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableHeading={`${'Video Archive'}`} totalRecords={totalRecords} currentPage={currentPage} pageSize={pageSize} onPageChange={handlePageChange} />
          ) :
          (
            <Videos filterConfig={videoFilterConfig} />
          )}
        </div>

    </div>
  );
};

export default VideoManagement;
