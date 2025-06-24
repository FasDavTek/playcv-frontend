import React, { useCallback, useEffect, useState } from 'react';
import { Container, Tab, Tabs, Typography, Box, TextField, Stack, Modal } from '@mui/material';
import { Button, Input, SelectMenu, Table, useToast } from '@video-cv/ui-components';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';

import { createColumnHelper } from '@tanstack/react-table';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import Price from './modal/Price';
import VideoUploadTypes from './../../../../Candidate/src/pages/VideoManagement/VideoManagement-Types/VideoUploadTypes';
import { useCurrentUser } from './../../../../../libs/hooks/useCurrentUser';
import { useAuth } from './../../../../../libs/context/AuthContext';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';

type PriceItem = {
  id: number;
  price: string;
  typeName?: string;
  name?: string;
  uploadPrice?: number;
  buyPrice?: number;
  status: string;
  [key: string]: any;
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

const columnHelper = createColumnHelper<PriceItem>();

const index = () => {
  const [openModal, setOpenModal] = useState<'add' | 'edit' | null>(null);
  const [activeTab, setActiveTab] = useState<'videoUploadTypes' | 'adsTypes' | 'buyVideoTypes'>('videoUploadTypes');
  const [priceItems, setPriceItems] = useState<PriceItem[]>([]);
  const [videoUploadTypes, setVideoUploadTypes] = useState<PriceItem[]>([]);
  const [adsTypes, setAdsTypes] = useState<PriceItem[]>([]);
  const [reasonForRejection, setReasonForRejection] = useState('');
  const [buyVideoTypes, setBuyVideoTypes] = useState<PriceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PriceItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<PriceItem | null>(null);
  const [selectedAction, setSelectedAction] = useState<"reject" | "revoke" | null>(null);

  const { showToast } = useToast();

  const navigate = useNavigate();
  const { authState } = useAuth();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
  const userId = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID);
  
  useEffect(() => {
    fetchPriceItems()
  }, [activeTab]);

  const fetchPriceItems = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'videoUploadTypes' ? apiEndpoints.VIDEO_UPLOAD_TYPE : apiEndpoints.ADS_TYPE;
      const resp = await getData(`${CONFIG.BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.code === "00") {
        let data = resp?.data?.map((item: any) => ({
          id: item?.id?.toString(),
          name: item.name,
          description: item.description,
          uploadPrice: item.uploadPrice,
          buyPrice: item.buyPrice,
          dateCreated: item.dateCreated,
          dateUpdated: item.dateUpdated,
          createdBy: item.createdBy,
          active: item.active,
        }));
        setVideoUploadTypes(data);

        console.log(videoUploadTypes);
        setBuyVideoTypes(data);

        console.log(buyVideoTypes)
        setPriceItems(data || []);
      }
      else if (activeTab === 'adsTypes') {
        let data = resp.map((item: any) => ({
          id: item.typeId.toString(),
          name: item.typeName,
          typeDescription: item.typeDescription,
          dateCreated: item.dateCreated,
          price: item.price,
          dateUpdated: item.dateUpdated,
          createdBy: item.createdBy,
          active: true
        }));

        setPriceItems(data);
        setAdsTypes(data);
      }
    }
    catch (err) {
      if(!token) {
        showToast('Your session has expired. Please log in again', 'error');
        navigate('/');
      }
      else {
        showToast(activeTab === 'videoUploadTypes' ? `No Video Upload Type found` : activeTab === 'adsTypes' ? `No Ads Type Found` : `No Buy Video Type Found`, 'error');
      }
    }
    finally {
      setLoading(false);
    }
  };



  const handleDownloadCSV = useCallback(async () => {
    const queryParams = new URLSearchParams({
      download: 'true',
    }).toString();

    try {
      const endpoint = (activeTab === 'videoUploadTypes' || activeTab === 'buyVideoTypes') ? apiEndpoints.VIDEO_UPLOAD_TYPE : apiEndpoints.ADS_TYPE;
      const response = await getData(`${CONFIG.BASE_URL}${endpoint}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let result;
      
      if (activeTab === 'videoUploadTypes') {
        result = await response.data;
      }
      else if (activeTab === 'adsTypes') {
        result = await response;
      }

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
      a.download = 'price.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showToast('Error downloading CSV', 'error');
    }
  }, []);



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



  const handleEdit = (item: PriceItem) => {
    setSelectedItem(item);
    setOpenModal('edit');
  };

  const handleSubmitSuccess = useCallback(() => {
    fetchPriceItems()
  }, [fetchPriceItems])


  const getColumns = () => {
    const baseColumn = [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
    ]

    const statusColumn = columnHelper.accessor('active', {
      header: 'Status',
      cell: (info: any) => (
        <span className={`px-2 py-1.5 text-center items-center rounded-full ${
          info.getValue() ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
        }`}>
          {info.getValue() ? 'Active' : 'Suspended'}
        </span>
      ),
    })

    const actionColumn = columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          {/* <Button variant='custom' label='Edit' onClick={() => handleEdit(row.original)} />
          <Button variant={row.original.active ? 'red' : 'success'} label={row.original.active ? 'Suspend' : 'Activate'} onClick={() => handleStatusToggle(row.original)} /> */}
          {activeTab !== 'buyVideoTypes' && (
            <SelectMenu
              options={[
                // { label: "Activate", onClick: () => handleStatusToggle(row.original), icon: <RecommendOutlinedIcon sx={{ fontSize: 'medium' }} />, },
                // { label: "Deactivate", onClick: () => handleStatusToggle(row.original), icon: <BlockOutlinedIcon sx={{ fontSize: 'medium' }} />, },
                { label: "Edit", onClick: () => handleEdit(row.original), icon: <CreateOutlinedIcon sx={{ fontSize: 'medium' }} />, },
              ]}
              buttonVariant="text"
            />
          )}
        </div>
      )
    });

    switch (activeTab) {
      case 'videoUploadTypes':
        return [
          ...baseColumn,
          columnHelper.accessor('uploadPrice', { header: 'Price', }),
          columnHelper.accessor('description', { header: 'Description', cell: (info) => truncateText(info.getValue() as string || '', 7), }),
          statusColumn,
          actionColumn,
        ]

      case 'adsTypes':
        return [
          ...baseColumn,
          columnHelper.accessor('price', { header: 'Price', }),
          columnHelper.accessor('typeDescription', { header: 'Description', cell: (info) => truncateText(info.getValue() as string || '', 7), }),
          statusColumn,
          actionColumn,
        ]

      case 'buyVideoTypes':
        return [
          ...baseColumn,
          columnHelper.accessor('buyPrice', { header: 'Price', }),
          statusColumn,
          // actionColumn,
        ]

      default:
        return [
          ...baseColumn,
          actionColumn,
        ];
    }
  }

  const columns = getColumns();

  const closeModal = () => setOpenModal(null);


  const handleTabChange = (tab: 'videoUploadTypes' | 'adsTypes' | 'buyVideoTypes') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'videoUploadTypes':
        return videoUploadTypes;
      case 'adsTypes':
        return adsTypes;
      case 'buyVideoTypes':
        return buyVideoTypes;
      default:
        return [];
    }
  };




  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box className='bg-neutral-100 items-center rounded-lg'>
          <div className="flex p-1">
            {['videoUploadTypes', 'adsTypes', 'buyVideoTypes'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 text-sm font-medium ${activeTab === tab ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
                onClick={() => setActiveTab(tab as typeof activeTab)}
              >
                {`${tab === 'videoUploadTypes' ? 'Video Upload Type' : tab === 'adsTypes' ? 'Ad Type' : 'Buy Video Type'}`}
              </button>
            ))}
          </div>
        </Box>

        <div className="mt-4">
          {/* <div className="flex justify-end items-center mb-4">
            {(activeTab === 'videoUploadTypes' || activeTab === 'adsTypes') && (
              <Button label="Add Price" variant="black" onClick={() => setOpenModal('add')} />
            )}
          </div> */}

          <Table
            loading={loading}
            data={getCurrentItems()}
            columns={columns}
            search={setSearch}
            filter={filter}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            totalRecords={totalRecords}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onDownloadCSV={handleDownloadCSV}
          />
        </div>

        <Modal open={openModal === 'add' || openModal === 'edit'} onClose={closeModal}>
          <>
            {authState.isAuthenticated && authState.user?.name && (
              <Price onClose={closeModal} currentTab={activeTab} item={selectedItem} open={true} modalType={openModal === 'add' ? 'add' : 'edit'} currentUser={authState?.user?.name} onSubmitSuccess={handleSubmitSuccess} />
            )}
          </>
        </Modal>
      </Box>
    </Container>
  );
};

export default index;
