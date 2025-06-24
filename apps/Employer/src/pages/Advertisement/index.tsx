import React, { useCallback, useEffect, useState } from 'react';
import { Button, SelectMenu, Table, TextArea, useToast } from '@video-cv/ui-components';
import { createColumnHelper } from '@tanstack/react-table';
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, duration, Input, Modal, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { formatDate, handleDate } from '@video-cv/utils';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { CreateAdsConfirmModal } from './modals';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
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

// Define your ad data type
type Advert = {
  id: string;
  status: string;
  statusId: number;
  adName: string;
  redirectUrl: string;
  adType: string;
  adTypeId: number;
  dateCreated: string;
  authorName: string;
  adDescription: string;
  startDate: string;
  endDate: string;
  userType: string;
  userId: string;
  coverURL: string;
  thumbnailUrl: string
  rejectionReason?: string
};


type ModalTypes = null | 'confirmationModal' | 'createAds';

const columnHelper = createColumnHelper<Advert>();

const Advertisement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [ads, setAds] = useState<Advert[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Advert | null>(null);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [selectedAdTitle, setSelectedAdTitle] = useState('');
  const [reason, setReason] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(1);
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);
  const [selectedAction, setSelectedAction] = useState<"delete" | "deactivate" | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const { showToast } = useToast();

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);
  const [tooltipOpenId, setTooltipOpenId] = useState<number | null>(null);

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
  const userId = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID);


  const checkPaymentStatus = async () => {
    try {

      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_STATUS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.adRequest;
      
      if (response.status === 'success' && response.hasValidAdRequest === true) {
        showToast('You have an existing payment for ad upload request that you have not yet completed.', 'info');

        const storedDuration = sessionStorage.getItem(SESSION_STORAGE_KEYS.AD_DURATION);

        navigate(`/employer/advertisement/create`, { 
          state: { 
            adTypeId: data.adTypeId,
            adType: response.adType,
            adRequestId: data.id,
            paymentDate: data.paymentDate,
            duration: storedDuration && parseInt(storedDuration),
          } 
        });
      } else {
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

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_AUTH_ADS}?${queryParams}`, {
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
  
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_AUTH_ADS}?${queryParams}`, {
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

      // const startIndex = (currentPage - 1) * pageSize;
      // const endIndex = startIndex + pageSize;
      // adsData = adsData.slice(startIndex, endIndex);

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


  const handleStatusToggle = async (ad: Advert, newStatusId: number, action: 'delete' | 'deactivate', ) => {
    // if (action === "delete" || action === "deactivate") {
    //   setSelectedAdvert(ad)
    //   setSelectedAction(action)
    // } else {
      let statusId = newStatusId
      await updateAdvertStatus(ad, action)
    // }
  };


  const updateAdvertStatus = async (ad: Advert, action: 'delete' | 'deactivate' ) => {
    try {
      let status: "d" | 'delete' | 'deactivate';
      switch (action) {
        case 'delete':
          status = 'delete'
          break
        default:
          throw new Error("Invalid status")
      }

      const payload: any = {
        action: status,
        adId: ad.id
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.EMPLOYER_MANAGE_ADS}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchAds();
      showToast(response.message, 'success');
    }
    catch (err) {
      showToast('Failed to update ad status', 'error');
    }
  }


  // const updateAdvertStatus = async (ad: Advert, action: 'delete' | 'deactivate' ) => {
  //   try {
  //     let status: "d" | 'del' | 'deactivate';
  //     switch (action) {
  //       case 'delete':
  //         status = 'del'
  //         break
  //       case 'deactivate':
  //         status = 'deactivate'
  //         break
  //       default:
  //         throw new Error("Invalid status")
  //     }

  //     let endpoint = `${CONFIG.BASE_URL}${apiEndpoints.EMPLOYER_MANAGE_ADS}`;

  //     const payload: any = {
  //       action: status,
  //       adId: ad.id
  //     }

  //     // const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.EMPLOYER_MANAGE_ADS}`, payload, {
  //     //   headers: { Authorization: `Bearer ${token}` },
  //     // });

  //     if (action === 'delete') {
  //       await deleteData(`${endpoint}?adId=${ad.id}&action=${status}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //     } else if (action === 'deactivate') {
  //       await postData(endpoint, payload, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //     }

  //     await fetchAds();
  //     // toast.success(`Video status updated successfully`);
  //     toast.success(`Ad ${action === 'delete' ? 'deleted' : 'deactivated'} successfully`);
  //   }
  //   catch (err) {
  //     // toast.error('Failed to update ad status')
  //     toast.error(`Failed to ${action} ad`);
  //   }
  // }
  
  const handleView = async (item: Advert, isEditing: boolean = false) => {
    setSelectedItem(item)
    navigate(`/employer/advertisement/view/${item.id}`, {
      state: { isEditing },
    });
  };


  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Suspended", label: "Suspended" },
    { value: "InReview", label: "In Review" },
    { value: "Inactive", label: "In Active" },
    { value: "Rejected", label: "Rejected" },
    { value: "Expired", label: "Expired" },
  ]


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


  type userStatus = "Active" | "Suspended" | "InReview" | "Rejected" | "Expired" | 'Inactive';


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
    if (row.status === "Rejected" && row.rejectionReason) {
      return (
        <div>
          <p className="font-semibold mb-1">Reason for Rejection:</p>
          <p>{row.rejectionReason}</p>
        </div>
      )
    }
    return null
  }


  const columns = [
    columnHelper.accessor('adName', {
      header: 'Ad Name',
    }),
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
      cell: (info) => handleDate(info.getValue()),
    }),
    columnHelper.accessor('adDescription', {
      header: 'Description',
      cell: (info) => truncateText(info.getValue() as string || '', 10),
    }),
    columnHelper.accessor('startDate', {
      header: 'Start Date',
      cell: (info) => handleDate(info.getValue()),
    }),
    columnHelper.accessor('endDate', {
      header: 'End Date',
      cell: (info) => handleDate(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as unknown as userStatus
        const row = info.row.original
        return (
          <div className="flex items-center gap-1">
            <span
              className={`px-2 py-1.5 text-center items-center rounded-full ${getStatusColor(statusOptions.find((option) => option.value === status)?.label || "")}`}
            >
              {statusOptions.find((option) => option.value === status)?.label}
            </span>

            {status === "Rejected" && row.rejectionReason && (
              <InfoOutlinedIcon fontSize="small" className="text-red-500 cursor-help" />
            )}
          </div>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => {
        const adStatus = row.original.status
        const options = []
        options.push({ label: "View", onClick: () => handleView(row.original) , icon: <PreviewOutlinedIcon sx={{ fontSize: 'medium' }} />, },)
        if (adStatus === 'Active') {
          options.unshift(
            { label: "Delete", onClick: () => handleStatusToggle(row.original, 1, 'delete'), value: 8, icon: <DeleteOutlinedIcon sx={{ fontSize: 'medium' }} />, },
          )
        }
        else if (adStatus === 'Rejected' || adStatus === 'Expired') {
          options.unshift(
            { label: "Delete", onClick: () => handleStatusToggle(row.original, 1, 'delete'), value: 8, icon: <DeleteOutlinedIcon sx={{ fontSize: 'medium' }} />, },
          )
        }
        else if (adStatus === 'Inactive') {
          options.push (
            { label: "Delete", onClick: () => handleStatusToggle(row.original, 1, 'delete'), value: 8, icon: <DeleteOutlinedIcon sx={{ fontSize: 'medium' }} />, },
            { label: "Edit", onClick: () => handleView(row.original, true), icon: <CreateOutlinedIcon sx={{ fontSize: 'medium' }} /> },
          )
        }
        return (
          <div className="flex gap-2">
            <SelectMenu
              options={options}
              buttonVariant="text"
            />
          </div>
        )
      },
    }),
  ];


  const handleTabChange = (tab: 'active' | 'pending') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-4">
        <Button
          label="Create Ad"
          variant="black"
          onClick={checkPaymentStatus}
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

      <Table loading={loading} data={ads} columns={columns} search={setSearch} filter={filter} filterConfig={advertFilterConfig} onFilterChange={handleFilterChange} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} tableHeading="All My Ads" totalRecords={totalRecords} currentPage={currentPage} pageSize={pageSize} onPageChange={handlePageChange} getRowTooltip={getRowTooltip} />

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <>
          <CreateAdsConfirmModal onClose={closeModal} />
        </>
      </Modal>
    </div>
  );
};

export default Advertisement;
