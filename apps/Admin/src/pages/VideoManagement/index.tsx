import { Stack, Tooltip } from "@mui/material"
import { Button, RejectionDialog, SelectMenu, Table, TextArea, useToast } from "@video-cv/ui-components"
import { useCallback, useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import { getData, postData } from "./../../../../../libs/utils/apis/apiMethods"
import CONFIG from "./../../../../../libs/utils/helpers/config"
import { apiEndpoints } from "./../../../../../libs/utils/apis/apiEndpoints"
import { SESSION_STORAGE_KEYS } from "./../../../../../libs/utils/sessionStorage"
import { handleDate } from "@video-cv/utils"
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined"
import RecommendOutlinedIcon from "@mui/icons-material/RecommendOutlined"
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined"
import { createColumnHelper } from "@tanstack/react-table"
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Filter, { FilterConfig } from "./../../../../../libs/ui-components/Filter"
import { useAllMisc } from "./../../../../../libs/hooks/useAllMisc"
import model from "./../../../../../libs/utils/helpers/model"

interface Uploader {
  id: number
  name: string
  email: string
}
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
  reasonForRejaction?: string;
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

interface VideosProps {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  title?: string
  authorName?: string
  status?: any
  category?: string
  categoryId?: number
  download?: boolean
  userType?: string
  userId?: string
  type?: "pinned" | "latest" | "category"
}

const truncateText = (text: string, wordLimit: number) => {
  if (!text) return "";

  const strippedText = text.replace(/<[^>]*>?/gm, "")

  const words = strippedText.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return strippedText;
};

const columnHelper = createColumnHelper<Video>()

const index = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"active" | "pending">("active")
  const [videos, setVideos] = useState<Video[]>([])
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [selectedItem, setSelectedItem] = useState<Video | null>(null)
  const [approvedVideos, setApprovedVideos] = useState<Video[]>([])
  const [pendingVideos, setPendingVideos] = useState<Video[]>([])
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null)
  const [selectedVideoTitle, setSelectedVideoTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(1)
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedAction, setSelectedAction] = useState<"approve" | "deny" | "delete" | "deactivate" | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const { showToast } = useToast();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN)

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
  
      let videosData: Video[] = [];
      let videosCount = 0;
  
      if (activeTab === "active") {
        const queryParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: pageSize.toString(),
          ...filters,
        });


        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?${queryParams}`, {
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
  
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?${queryParams}`, {
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

      // const startIndex = (currentPage - 1) * pageSize;
      // const endIndex = startIndex + pageSize;
      // videosData = videosData.slice(startIndex, endIndex);
  
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
      setLoading(false);
    }
  }, [activeTab, token, currentPage, pageSize, totalRecords, navigate, filters]);


  useEffect(() => {
    fetchVideos()
    const interval = setInterval(fetchVideos, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchVideos, filters])



  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);


  const clearFilters = () => {
    setFilters({});
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }


  const handleDownloadCSV = useCallback(async () => {
    const queryParams = new URLSearchParams({
      ...filters,
      download: 'true',
    }).toString();

    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response;

      if (!result.videos || !Array.isArray(result.videos)) {
        throw new Error("No data available to download");
      }
  
      // Convert JSON to CSV
      const csvContent = convertJsonToCsv(result.videos);
  
      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'videos.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showToast('Error downloading CSV', 'error');
    }
  }, [filters]);



  const convertJsonToCsv = (data: any[]) => {
    if (data.length === 0) return "";
  
    // Flatten nested objects
    const flattenObject = (obj: any, prefix = "") => {
      return Object.keys(obj).reduce((acc, key) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          Object.assign(acc, flattenObject(obj[key], newKey));
        } else {
          acc[newKey] = obj[key];
        }
        return acc;
      }, {} as any);
    };
  
    const flattenedData = data.map((item) => flattenObject(item));
  
    // Extract headers from the first flattened object
    const headers = Object.keys(flattenedData[0]).join(",");
  
    // Map each object to a CSV row
    const rows = flattenedData.map((item) =>
      Object.values(item)
        .map((value) => {
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    );
  
    return [headers, ...rows].join("\n");
  };



  const handleStatusChange = async (video: Video, newStatusId: number, action: 'approve' | 'deny' | 'delete' | 'deactivate', reason?: string) => {
    if (action === 'deny') {
      setSelectedVideo(video)
      setSelectedAction(action)
      setRejectionDialogOpen(true)
    }
    else {
      let statusId = newStatusId;
      await updateStatusChange(video, action);
    }
  }


  const updateStatusChange = async (video: Video, action: 'approve' | 'deny' | 'delete' | 'deactivate', reason?: string) => {
    try {
      let status: "a" | "r" | "p" | 'delete' | 'd';

      switch (action) {
        case 'approve':
          status = "a";
          break
        case 'deny':
          status = "d"
          break
        case 'delete':
          status = 'delete'
          break
        default:
          throw new Error("Invalid status")
      }

      const payload: any = {
        videoId: video.id,
        action: status,

      }

      if (reason) {
        payload.reasonForRejection = reason
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_VIDEO}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      await fetchVideos()
      showToast(`Video status updated successfully`, 'success');
    } catch (err) {
      showToast(`Failed to update video status`, 'error');
    }
  }

  const handleView = async (item: Video) => {
    setSelectedItem(item)
    navigate(`/admin/video-management/${item.id}`)
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
      showToast(`Video ${action === "a" ? "approved" : "rejected"} successfully`, 'success');
    } catch (err) {
      showToast(`Failed to ${action === "a" ? "approve" : "reject"} video`, 'error');
    }
  }

  const handleApprove = (id: number, action: string) => handleVideoAction(id, "a")
  const handleReject = (id: number, reason: string) => handleVideoAction(id, "d", reason)

  const notifyCandidate = async (id: string, title: string, status: string, /* uploaderId: any, */ reason?: string) => {
    // Simulate an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Notification sent to candidate: ${id} is ${status}`)
        showToast(`Notification sent to candidate: ${title} is ${status}`, 'info');
      }, 1000)
    })
  }

  const handleOpenRejectDialog = (id: number, title: string) => {
    setSelectedVideoId(id)
    setSelectedVideoTitle(title)
    setOpen(true)
  }

  const handleClose = () => {
    setReason("")
    setOpen(false)
  }

  const handleConfirmReject = (reason: string) => {
    if (selectedVideo && selectedAction) {
      updateStatusChange(selectedVideo, selectedAction, reason);
      setRejectionDialogOpen(false);
      setSelectedVideo(null);
      setSelectedAction(null);
    }
  }


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
      id: "startDate",
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
    columnHelper.accessor("title", {
      header: "Video Name",
    }),
    columnHelper.accessor("authorProfile.userDetails.fullName", {
      header: "Uploader",
    }),
    columnHelper.accessor("type", {
      header: "Video Type",
    }),
    columnHelper.accessor("authorProfile.userDetails.email", {
      header: "Email",
    }),
    columnHelper.accessor("authorProfile.userDetails.gender", {
      header: "Gender",
    }),
    columnHelper.accessor("authorProfile.userDetails.phoneNo", {
      header: "Phone",
    }),
    columnHelper.accessor("dateCreated", {
      header: "Upload Date",
      cell: (info: any) => handleDate(info.getValue()),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const video = info.row.original as Video;
        const rejectionReason = video.status === 'Rejected' ? video.reasonForRejaction : null;
        return (
          <Tooltip
            title={rejectionReason || ''}
            arrow
            placement="top"
            disableHoverListener={!rejectionReason} // Only show tooltip if there's a rejection reason
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "rgba(97, 97, 97, 0.92)",
                  "& .MuiTooltip-arrow": {
                    color: "rgba(97, 97, 97, 0.92)",
                  },
                  borderRadius: "4px",
                  padding: "8px 12px",
                  maxWidth: "300px",
                },
              },
            }}
          >
            <span
              className={`px-2 py-1.5 text-center items-center rounded-full ${getStatusColor(statusOptions.find((option) => option.value === status)?.label || "")}`}
            >
              {statusOptions.find((option) => option.value === status)?.label}
            </span>
          </Tooltip>
        )
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const videoStatus = row.original.status
        const options = []
        options.push({ label: "View", onClick: () => handleView(row.original), icon: <PreviewOutlinedIcon /> })
        if (videoStatus === 'Approved') {
          options.unshift(
            { label: "Delete", onClick: () => handleStatusChange(row.original, 9, 'delete'), value: 9, icon: <DeleteOutlinedIcon sx={{ fontSize: "medium" }} />,},
          )
        }
        else if (videoStatus === "InReview") {
          options.unshift(
            { label: "Approve", onClick: () => handleStatusChange(row.original, 1, 'approve'), value: 1, icon: <RecommendOutlinedIcon sx={{ fontSize: "medium" }} />, },
            { label: "Reject", onClick: () => handleStatusChange(row.original, 5, 'deny'), value: 5, icon: <ThumbDownOutlinedIcon sx={{ fontSize: "medium" }} />, },
            { label: "Delete", onClick: () => handleStatusChange(row.original, 9, 'delete'), value: 9, icon: <DeleteOutlinedIcon sx={{ fontSize: "medium" }} />,},
          )
        }
        else if (videoStatus === 'Rejected') {
          options.unshift(
            { label: "Delete", onClick: () => handleStatusChange(row.original, 9, 'delete'), value: 9, icon: <DeleteOutlinedIcon sx={{ fontSize: "medium" }} />,},
          )
        }

        return (
          <Stack direction="row" spacing={2}>
            <SelectMenu options={options} buttonVariant="text" />
          </Stack>
        )
      },
    }),
  ]

  const handleTabChange = (tab: "active" | "pending") => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  // const handlePageSizeChange = (size: number) => {
  //   setPageSize(size)
  //   setCurrentPage(1)
  // }

  // const getCurrentItems = () => {
  //   switch (activeTab) {
  //     case 'active':
  //       return approvedVideos;
  //     case 'pending':
  //       return pendingVideos;
  //     default:
  //       return [];
  //   }
  // };

  return (
    <div className="p-4 mb-8">
      <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
        <div className="flex p-1">
          {["active", "pending"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === tab
                  ? "text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg"
                  : "text-blue-600 hover:text-blue-600"
              }`}
              onClick={() => {
                handleTabChange(tab as typeof activeTab)
              }}
            >
              {tab === "active" ? "All Videos" : "Pending Videos"}
            </button>
          ))}
        </div>
      </div>


      <div className=" mt-5 border border-neutral-100 rounded-2xl py-4">
        {videoFilterConfig.length > 0 && (
          <Filter config={videoFilterConfig} onFilterChange={handleFilterChange} filters={filters} />
        )}
      </div>

      <Table
        loading={loading}
        columns={columns}
        data={videos}
        search={setSearch}
        filter={filter}
        filterConfig={videoFilterConfig}
        onFilterChange={handleFilterChange}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onDownloadCSV={handleDownloadCSV}
        getRowTooltip={getRowTooltip}
      />

      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        PaperProps={{
          sx: {
            padding: 3,
            borderRadius: 2,
            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
            width: { xs: "90%", sm: "500px" },
            maxWidth: "750px",
          },
        }}
        BackdropProps={{ sx: { backdropFilter: "blur(2px)", backgroundColor: "rgba(0, 0, 0, 0.2)" } }}
      >
        <DialogTitle>Rejection Reason</DialogTitle>
        <DialogContent>
          <TextArea label="" rows={5} value={reason} onChange={(e) => setReason(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button variant="red" label="Cancel" type="reset" onClick={handleClose}></Button>
          <Button variant="black" label="Confirm Rejection" type="submit" onClick={handleConfirmReject}></Button>
        </DialogActions>
      </Dialog> */}

      <RejectionDialog open={rejectionDialogOpen} onClose={() => setRejectionDialogOpen(false)} onSubmit={handleConfirmReject} />
    </div>
  )
}

export default index