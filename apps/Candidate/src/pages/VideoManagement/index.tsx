import React, { useState, useEffect, useCallback } from 'react';

import { Alert, CircularProgress, Modal, Stack, Tooltip } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, SelectMenu, Table, useToast } from '@video-cv/ui-components';
import { VideoLinks } from '@video-cv/constants';
import { VideoCard, Videos } from '../../components';
import { CreateVideoConfirmationModal } from './modals';
import { routes } from '../../routes/routes';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import { handleDate } from '@video-cv/utils';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';
import model from './../../../../../libs/utils/helpers/model';
import Filter, { FilterConfig } from './../../../../../libs/ui-components/Filter';


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


export type ModalTypes = null | 'confirmationModal' | 'uploadModal';

type Video = {
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
  reasonForRejaction?: string
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
  paymentDetails: {
    amountPaid: number
    totalAmount: number
    paymentStatus: string
    currency: string
    paymentDate: string
  }
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedItem, setSelectedItem] = useState<Video | null>(null);
  const [approvedVideos, setApprovedVideos] = useState<Video[]>([]);
  const [pendingVideos, setPendingVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(1);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showAlert, setShowAlert] = useState(location.state?.showAlert || false);

  const { showToast } = useToast();

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);
  const [tooltipOpenId, setTooltipOpenId] = useState<number | null>(null);

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(true), 7000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const checkPaymentStatus = async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 'success' && response.hasValidUpploadRequest === true) {
        showToast('You have an existing payment for video upload that you have not yet completed.', 'info');
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
        showToast('Your session has expired. Please log in again', 'error');
        navigate('/');
      }
      else {
        showToast('There was an error checking your payment status. Please try again later.', 'warning');
      }
    }
  };


  const fetchVideos = useCallback(async () => {
    try {
      setIsLoading(true);
  
      let videosData: Video[] = [];
      let videosCount = 0;
  
      if (activeTab === "active") {
  
        const countParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: pageSize.toString(),
          ...filters,
        });

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_VIDEO_LIST}?${countParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (resp.succeeded === true) {
          videosData = resp.data;
          videosCount = resp.totalRecords > 0 ? resp.totalRecords : totalRecords;
        }
      } else if (activeTab === "pending") {
        // For pending tab, use server-side pagination as before
        const queryParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: pageSize.toString(),
          Status: "InReview",
        });
  
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_VIDEO_LIST}?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (resp.succeeded === true) {
          videosData = resp.data;
          videosCount = resp.totalRecords > 0 ? resp.totalRecords : totalRecords;
        }
      }
  
      const currentTime = Date.now();
      const newVideos = videosData.filter((video: Video) => new Date(video.dateCreated).getTime() > lastFetchTime);
  
      if (newVideos.length > 0) {
        showToast(`${newVideos.length} new video(s) uploaded`, 'info');
      }
  
      setVideos(videosData);
      setTotalRecords(videosCount);
      setLastFetchTime(currentTime);
  
    } catch (err) {
      if (!token) {
        showToast("Your session has expired. Please log in again", 'error');
        navigate("/");
      } else {
        showToast("Failed to fetch videos", 'error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, token, currentPage, pageSize, totalRecords, navigate, filters]);


  useEffect(() => {
    fetchVideos();
    const interval = setInterval(fetchVideos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchVideos, filters]);


  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);


  const clearFilters = () => {
    setFilters({});
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }


  const handleView = async (item: Video) => {
    setSelectedItem(item);
    navigate(`/candidate/video-management/view/${item.id}`);
  };



  const handleEdit = (item: Video) => {
    setSelectedItem(item);
    navigate(`/candidate/video-management/edit/${item.id}`);
  };



  const handleStatusChange = async (video: Video, newStatusId: number, action: 'delete', reason?: string) => {
    let statusId = newStatusId;
    await updateVideo(video, action);
  }



  const updateVideo = async (video: Video, action: 'delete', reason?: string) => {
    try {
      let status: 'delete'
      switch (action) {
        case 'delete':
          status = "delete"
          break
        default:
          throw new Error("Invalid status")
      }

      const payload = {
        videoId: video.id,
        action: status,
        reasonForRejection: reason,
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PROFESSIONAL_MANAGE_VIDEO}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      await fetchVideos()
      showToast(`Video status updated successfully`, 'success')
    } catch (err) {
      showToast(`Failed to update video status`, 'error')
    }
  }

  const handleVideoAction = async (id: number, action: string, reason?: string) => {
    try {
      const apiData = {
        videoId: id,
        action,
        reasonForRejection: reason,
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_VIDEO}`, apiData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      // if (!response.ok) {
      //   throw new Error(`Failed to ${action} video`)
      // }

      await fetchVideos()
      showToast(`Video ${action === "a" ? "approved" : "rejected"} successfully`, 'success')
    } catch (err) {
      showToast(`Failed to ${action === "a" ? "approve" : "reject"} video`, 'error')
    }
  }



  const statusOptions = [
    { value: "Approved", label: "Approved" },
    { value: "Suspended", label: "Suspended" },
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


  const getRowTooltip = (row: Video) => {
    if (row.status === "Rejected" && row.reasonForRejaction) {
      return (
        <div>
          <p className="font-semibold mb-1">Reason for Rejection:</p>
          <p>{row.reasonForRejaction}</p>
        </div>
      )
    }
    return null
  }


  const columns = [
    { header: 'Video Name', accessorKey: 'title', },
    // { header: 'Video Description', accessorKey: 'description', cell: (info: { getValue: () => string; }):any => truncateText(info.getValue() as string || '', 30), },
    // { header: 'Video Transcript', accessorKey: 'transcript', cell: (info: { getValue: () => string; }):any => truncateText(info.getValue() as string || '', 30), },
    { header: 'Video Link',
      accessorKey: 'videoUrl',
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
    },
    { header: 'Video Type', accessorKey: 'type', },
    { header: 'Video Category', accessorKey: 'category', },
    { header: 'Views', accessorKey: 'views', },
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
    { header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: { row: { original: Video } }) => {
        const video = row.original;
        const options = []
        options.push({ label: "View", onClick: () => handleView(video), icon: <PreviewOutlinedIcon sx={{ fontSize: 'medium' }} />, },)
        if (video.status === 'Approved') {
          options.unshift(
            { label: "Delete", onClick: () => handleStatusChange(row.original, 9, 'delete'), value: 9, icon: <DeleteOutlinedIcon sx={{ fontSize: "medium" }} />,},
          )
        }
        else if (video.status === 'Rejected') {
          options.unshift(
            { label: "Delete", onClick: () => handleStatusChange(row.original, 9, 'delete'), value: 9, icon: <DeleteOutlinedIcon sx={{ fontSize: "medium" }} />,},
          { label: "Edit", onClick: () => handleEdit(video), icon: <CreateOutlinedIcon sx={{ fontSize: 'medium' }} />,},
          )
        }
        else if (video.status === 'InReview') {
          options.push(
            { label: "Delete", onClick: () => handleStatusChange(row.original, 9, 'delete'), value: 9, icon: <DeleteOutlinedIcon sx={{ fontSize: "medium" }} />,},
            { label: "Edit", onClick: () => handleEdit(video), icon: <CreateOutlinedIcon sx={{ fontSize: 'medium' }} />,},
          )
        }
        return (
          <Stack direction='row' spacing={2}>
            <SelectMenu
              options={options}
              buttonVariant="text"
            />
          </Stack>
        )
      } },
  ];


  const handleTabChange = (tab: 'active' | 'pending') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress className="w-8 h-8 animate-spin" />
      </div>
    )
  };



  const getCurrentItems = () => {
    switch (activeTab) {
      case 'active':
        return approvedVideos;
      case 'pending':
        return pendingVideos;
      default:
        return [];
    }
  };

  

  return (
    <section className="px-3 md:px-10 py-10 flex flex-col min-h-screen ">
      {showAlert && (
        <Alert severity="info">Your VideoCV is hidden & will be assessed very soon. If it meets the requirements, admin will enable it to play.</Alert>
      )}
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
          {['active', 'pending'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                  : 'text-blue-600 hover:text-blue-600'
              }`}
              onClick={() => { handleTabChange(tab as typeof activeTab) }}
            >
              {tab === 'active' ? 'All Videos' : 'Pending Videos'}
            </button>
          ))}
        </div>
      </div>

      <div className=" mt-5 border border-neutral-100 rounded-2xl py-4">
        {videoFilterConfig.length > 0 && (
          <Filter config={videoFilterConfig} onFilterChange={handleFilterChange} filters={filters} />
        )}
      </div>

      <Table loading={isLoading} data={videos} columns={columns} search={setSearch} filter={filter} filterConfig={videoFilterConfig} onFilterChange={handleFilterChange} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableHeading={`All My ${activeTab === 'active' ? ' Videos' : 'Pending Videos' }`} totalRecords={totalRecords} currentPage={currentPage} pageSize={pageSize} onPageChange={handlePageChange} getRowTooltip={getRowTooltip} />

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <CreateVideoConfirmationModal onClose={closeModal} />
      </Modal>
      {/* TODO: Add tags field and video upload field */}
    </section>
  );
};

export default Dashboard;