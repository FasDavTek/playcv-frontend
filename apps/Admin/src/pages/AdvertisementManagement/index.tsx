import { useCallback, useEffect, useRef, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Tooltip, Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, RejectionDialog, SelectMenu, Table, TextArea, useToast } from '@video-cv/ui-components';
import { useNavigate } from 'react-router-dom';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { CreateAdsModal } from './modals';
import { handleDate } from '@video-cv/utils'
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import Filter, { FilterConfig } from "./../../../../../libs/ui-components/Filter";


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



type Advert = {
  id: number;
  status: string;
  statusId: number;
  adName: string;
  redirectUrl: string;
  coverURL: string;
  adType: string;
  adTypeId: number;
  dateCreated: string;
  authorName: string;
  adDescription: string;
  startDate: string;
  endDate: string;
  userType: string;
  userId: string;
  coverUrl: string;
  thumbnailUrl: string
  reasonForRejection?: string
};

type ModalTypes = null | 'confirmationModal' | 'createAds';

const columnHelper = createColumnHelper<Advert>();

const Payment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [ads, setAds] = useState<Advert[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Advert | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [approvedAdverts, setApprovedAdverts] = useState<Advert[]>([]);
  const [pendingAdverts, setPendingAdverts] = useState<Advert[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [selectedAdTitle, setSelectedAdTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(1);
  const [reason, setReason] = useState('');
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);
  const [selectedAction, setSelectedAction] = useState<"approve" | "deny" | "delete" | "deactivate" | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const { showToast } = useToast();

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);
  const [tooltipOpenId, setTooltipOpenId] = useState<number | null>(null);
  const hasShownToast = useRef(false);

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);


  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);

      let adsData: Advert[] = [];
      let adsCount = 0;

      if (activeTab === "active") {
        const queryParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: pageSize.toString(),
          ...filters,
        });

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_ADS}?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resp.succeeded === true) {
          adsData = resp.data;
          adsCount = resp.totalRecords > 0 ? resp.totalRecords : totalRecords;
        }
      } else if (activeTab === "pending") {
        const queryParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: pageSize.toString(),
          Status: "Inactive",
        });
  
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_ADS}?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (resp.succeeded === true) {
          adsData = resp.data;
          adsCount = resp.totalRecords > 0 ? resp.totalRecords : totalRecords;
        }
      }
      const currentTime = Date.now();
      const newAds = adsData.filter((ad: Advert) => new Date(ad.dateCreated).getTime() > lastFetchTime);

      if (newAds.length > 0) {
        showToast(`${newAds.length} new ad(s) uploaded`, 'info');
      }

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      adsData = adsData.slice(startIndex, endIndex);

      setAds(adsData);
      setTotalRecords(adsCount);
      setLastFetchTime(currentTime);

    }
    catch (err) {
      if(!token) {
        showToast('Your session has expired. Please log in again', 'error');
        navigate('/');
      }
      else {
        showToast('Failed to fetch ads', 'error');
      }
    }
    finally {
      setLoading(false)
    }
  }, [activeTab, token, currentPage, pageSize, totalRecords, navigate, filters]);


  useEffect(() => {
    fetchAds()
    const interval = setInterval(fetchAds, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchAds, filters]);


  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);


  const clearFilters = () => {
    setFilters({});
  };


  const handleView = async (item: Advert) => {
      setSelectedItem(item);
      navigate(`/admin/advertisement-management/view/${item.id}`);
  };


  const handleDownloadCSV = useCallback(async () => {
    const queryParams = new URLSearchParams({
      ...filters,
      download: 'true',
    }).toString();

    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_ADS}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response;

      if (!result || !Array.isArray(result)) {
        throw new Error("No data available to download");
      }
  
      // Convert JSON to CSV
      const csvContent = convertJsonToCsv(result);
  
      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'advert.csv';
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
  

  const handleAdAction = async (id: string, action: string, reason?: string) => {
    try {

      const apiData = {
        id,
        action: 'edit',
        reason: action === 'a' ? undefined : reason
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_ADS}`, apiData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchAds();
      showToast(`Ad ${action === 'a' ? 'activated' : 'suspended'} successfully`, 'success');
    } catch (err) {
      showToast(`Failed to ${action === 'a' ? 'activate' : 'suspend'} ad`, 'error');
    };
  };


  const handleStatusToggle = async (ad: Advert, newStatusId: number, action: 'approve' | 'deny' | 'delete' | 'deactivate', reason?: string,) => {
    if (action === "deny") {
      setSelectedAdvert(ad)
      setSelectedAction(action)
      setRejectionDialogOpen(true)
    } else {
      let statusId = newStatusId
      await updateAdvertStatus(ad, action)
    }
  };



  const updateAdvertStatus = async (ad: Advert, action: 'approve' | 'deny' | 'delete' | 'deactivate', reason?: string ) => {
    try {
      let status: "a" | "d" | 'delete' | "p";
      let successMessage: string;

      switch (action) {
        case 'approve':
          status = 'a';
          break
        case 'deny':
          status = 'd';
          break
        case 'delete':
          status = 'delete';
          break
        default:
          throw new Error("Invalid status")
      }

      const payload: any = {
        action: status,
        adId: ad.id
      }

      if (reason) {
        payload.reasonForRejection = reason
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_ADS}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchAds();
      showToast(`${response.message}`, 'success');
    }
    catch (err: any) {
      showToast(`Failed to update ad status: ${err.message}`, 'error');
    }
  }



  const handleRejectionReasonSubmit = (reason: string) => {
    if (selectedAdvert && selectedAction) {
      updateAdvertStatus(selectedAdvert, selectedAction, reason)
      setRejectionDialogOpen(false)
      setSelectedAdvert(null)
      setSelectedAction(null)
    }
    
  }


  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Suspended", label: "Suspended" },
    { value: "InReview", label: "In Review" },
    { value: "Inactive", label: "In Active" },
    { value: "Rejected", label: "Rejected" },
    { value: "Expired", label: "Expired" },
  ]

  const getStatusLabel = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "Approved"
      case 2:
        return "InReview"
      case 3:
        return "Rejected"
      case 4:
        return "Expired"
      case 5:
        return "Inactive"
      default:
        return "Unknown"
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-200 text-green-700"
      case "InReview":
        return "bg-yellow-200 text-yellow-700"
      case "Rejected":
        return "bg-red-200 text-red-700"
      case "Expired":
        return "bg-orange-200 text-orange-700"
      case "Inactive":
        return "bg-red-200 text-red-600"
      default:
        return "bg-gray-200 text-gray-700"
    }
  };


  type userStatus = "Active" | "Suspended" | "InReview" | "Rejected" | "Expired" | 'Inactive'

  
  const advertFilterConfig: FilterConfig[] = [
    {
      id: "adType",
      label: "Advert Type",
      type: "select",
      options: [
        { label: "Image", value: "image" },
        { label: "Video", value: "video" },
      ],
    },
    {
      id: "startDate",
      label: "Start Date",
      type: "date",
    },
    {
      id: "endDate",
      label: "End Date",
      type: "date",
    },
    {
      id: "datePosted",
      label: "Date Posted",
      type: "date",
    },
  ];


  const getRowTooltip = (row: Advert) => {
    if (row.status === "Rejected" && row.reasonForRejection) {
      return (
        <div>
          <p className="font-semibold mb-1">Reason for Rejection:</p>
          <p>{row.reasonForRejection}</p>
        </div>
      )
    }
    return null
  }
  

  const columns = [
    columnHelper.accessor('adName', {
      header: 'Ad Name',
    }),
    // columnHelper.accessor('authorName', {
    //   header: 'User Fullname',
    // }),
    columnHelper.accessor('coverURL', {
      header: 'Ad Link',
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
              Advert Link
            </p>
          </Tooltip>
        );
      },
    }),
    columnHelper.accessor('adType', {
      header: 'Ad Type',
    }),
    columnHelper.accessor('dateCreated', {
      header: 'Date Created',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('adDescription', {
      header: 'Description',
      cell: (info) => truncateText(info.getValue() as string || '', 10),
    }),
    columnHelper.accessor('startDate', {
      header: 'Start Date',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('endDate', {
      header: 'End Date',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as unknown as userStatus
        return (
          <span
            className={`px-2 py-1.5 text-center items-center rounded-full ${getStatusColor(statusOptions.find((option) => option.value === status)?.label || "")}`}
          >
            {statusOptions.find((option) => option.value === status)?.label}
          </span>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        const adStatus = row.original.status
        const options = []
        options.push(
          { label: "Delete", onClick: () => handleStatusToggle(row.original, 1, 'delete'), value: 8, icon: <DeleteOutlinedIcon sx={{ fontSize: 'medium' }} />, },
          { label: "View", onClick: () => handleView(row.original), icon: <PreviewOutlinedIcon sx={{ fontSize: 'medium' }} />, },
        )
        if (adStatus === 'Inactive') {
          options.unshift(
            { label: "Approve", onClick: () => handleStatusToggle(row.original, 1, 'approve'), value: 1, icon: <RecommendOutlinedIcon sx={{ fontSize: 'medium' }} />, },
            { label: "Deny", onClick: () => handleStatusToggle(row.original, 5, 'deny'), value: 5, icon: <ThumbDownOutlinedIcon sx={{ fontSize: 'medium' }} />,},
          )
        }
        return (
          <div className="flex gap-2">
            <SelectMenu options={options} buttonVariant="text" />
          </div>
        )  
      },
    }),
  ];


  const handleTabChange = (tab: 'active' | 'pending') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setAds([]);
  }


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }



  const getCurrentItems = () => {
    switch (activeTab) {
      case 'active':
        return approvedAdverts;
      case 'pending':
        return pendingAdverts;
      default:
        return [];
    }
  };



  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-3">
        <Button
          label="Create Ad"
          variant="black"
          onClick={() => openSetModalFn('confirmationModal')}
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
              {tab === 'active' ? 'Approved Adverts' : 'Pending Adverts'}
            </button>
          ))}
        </div>
      </div>


      <div className=" mt-5 border border-neutral-100 rounded-2xl py-4">
        {advertFilterConfig.length > 0 && (
          <Filter config={advertFilterConfig} onFilterChange={handleFilterChange} filters={filters} />
        )}
      </div>


      <Table loading={loading} data={ads} columns={columns} search={setSearch} filter={filter} filterConfig={advertFilterConfig} onFilterChange={handleFilterChange} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableHeading="All Ads" totalRecords={totalRecords} currentPage={currentPage} pageSize={pageSize} onPageChange={handlePageChange} onDownloadCSV={handleDownloadCSV} getRowTooltip={getRowTooltip} />

      {/* <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="dialog-title" aria-describedby="dialog-description" PaperProps={{ sx: { padding: 3, borderRadius: 2, boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)', width: { xs: '90%', sm: '500px' }, maxWidth: '750px' }, }} BackdropProps={{ sx: { backdropFilter: 'blur(2px)', backgroundColor: 'rgba(0, 0, 0, 0.2)', }, }}>
        <DialogTitle>Suspension Reason</DialogTitle>
        <DialogContent>
          <TextArea label="" rows={5} value={reason} onChange={(e) => setReason(e.target.value)}/>
        </DialogContent>
          <DialogActions>
            <Button variant='red' label='Cancel' type='reset' onClick={handleCloseDialog}></Button>
            <Button variant='black' label='Confirm Suspension' type='submit' onClick={handleConfirmSuspend}></Button>
          </DialogActions>
      </Dialog> */}

      <RejectionDialog open={rejectionDialogOpen} onClose={() => setRejectionDialogOpen(false)} onSubmit={handleRejectionReasonSubmit} />

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <>
          <CreateAdsModal onClose={closeModal} />
        </>
      </Modal>
    </div>
  );
};

export default Payment;

