import React, { useEffect, useState } from 'react';
import { Container, Tab, Tabs, Typography, Box, TextField, Stack, Modal } from '@mui/material';
import { Button, Input, Table } from '@video-cv/ui-components';
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
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

type PriceItem = {
  id: string;
  price: string;
  typeName?: string
  uploadPrice?: number
  buyPrice?: number
  status: string;
  [key: string]: any;
}

const columnHelper = createColumnHelper<PriceItem>();

const index = () => {
  const [openModal, setOpenModal] = useState<'add' | 'edit' | null>(null);
  const [activeTab, setActiveTab] = useState<'videoUploadTypes' | 'adsTypes' | 'buyVideoTypes'>('videoUploadTypes');
  const [priceItems, setPriceItems] = useState<PriceItem[]>([]);
  const [videoUploadTypes, setVideoUploadTypes] = useState<PriceItem[]>([]);
  const [adsTypes, setAdsTypes] = useState<PriceItem[]>([]);
  const [buyVideoTypes, setBuyVideoTypes] = useState<PriceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PriceItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { authState } = useAuth();

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  
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
      console.info(`No ${activeTab} found:`, err)
      toast.info(activeTab === 'videoUploadTypes' ? `No Video Upload Type found` : activeTab === 'adsTypes' ? `No Ads Type Found` : `No Buy Video Type Found`)
    }
    finally {
      setLoading(false);
    }
  };


  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      
      const newStatus = !currentStatus;
      const endpoint = activeTab === 'videoUploadTypes' ? apiEndpoints.CREATE_VIDEO_TYPE : apiEndpoints.CREATE_AD_TYPE;
      const resp = await postData(`${CONFIG.BASE_URL}${endpoint}`, {
        id,
        status: newStatus,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.code === "00") {
        setPriceItems(priceItems.map(item =>
          (item.id === id || item.typeId === id) ? { ...item, active: newStatus } : item
        ))
        toast.success(`${activeTab === 'videoUploadTypes' ? 'Video type' : 'Ad type'} ${newStatus ? 'activated' : 'suspended'} successfully`)
      }
      else {
        throw new Error(`Failed to update ${activeTab === 'videoUploadTypes' ? 'video type' : 'ad type'} status`)
      }
    }
    catch (err) {
      console.error(`Error updating ${activeTab} status:`, err)
      toast.error(`Failed to update ${activeTab} status`)
    }
  };


  const handleEdit = (item: PriceItem) => {
    setSelectedItem(item);
    setOpenModal('edit');
  };


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
          <Button variant='custom' label='Edit' onClick={() => handleEdit(row.original)} />
          <Button variant={row.original.active ? 'red' : 'success'} label={row.original.active ? 'Suspend' : 'Activate'} onClick={() => handleStatusToggle(row.original.id || row.original.typeId || '', row.original.active)} />
        </div>
      )
    });

    switch (activeTab) {
      case 'videoUploadTypes':
        return [
          ...baseColumn,
          columnHelper.accessor('uploadPrice', { header: 'Price', }),
          statusColumn,
          actionColumn,
        ]

      case 'adsTypes':
        return [
          ...baseColumn,
          columnHelper.accessor('price', { header: 'Price', }),
          columnHelper.accessor('typeDescription', { header: 'Description' }),
          statusColumn,
          actionColumn,
        ]

      case 'buyVideoTypes':
        return [
          ...baseColumn,
          columnHelper.accessor('buyPrice', { header: 'Price', }),
          statusColumn,
          actionColumn,
        ]

      default:
        return [
          ...baseColumn,
          actionColumn,
        ];
    }
  }

  const columns = getColumns();

  // [
  //   columnHelper.accessor('name', {
  //     header: 'Name',
  //     cell: (info) => info.getValue(),
  //   }),
  //   columnHelper.accessor('price', {
  //     header: 'Price',
  //     cell: (info) => `$${info.getValue()}`,
  //   }),
  //   columnHelper.accessor('status', {
  //     header: 'Status',
  //     cell: (info) => (
  //       <span className={`px-2 py-1.5 text-center items-center rounded-full ${
  //         info.getValue() === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
  //       }`}>
  //         {info.getValue()}
  //       </span>
  //     ),
  //   }),
  //   columnHelper.display({
  //     id: 'actions',
  //     header: 'Actions',
  //     cell: ({ row }) => (
  //       <div className="flex gap-2">
  //         <Button 
  //           variant='neutral' 
  //           label="Edit" 
  //           onClick={() => {
  //             setSelectedItem(row.original)
  //             navigate(`/admin/price-management/edit/${activeTab}/${row.original.id}`)
  //           }}
  //         />
  //         <Button 
  //           variant={row.original.status === 'Active' ? 'red' : 'success'} 
  //           label={row.original.status === 'Active' ? 'Deactivate' : 'Activate'}
  //           onClick={() => handleStatusToggle(row.original.id, row.original.status)}
  //         />
  //       </div>
  //     ),
  //   }),
  // ]

  const closeModal = () => setOpenModal(null);


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
          <div className="flex justify-end items-center mb-4">
            {(activeTab === 'videoUploadTypes' || activeTab === 'adsTypes') && (
              <Button label="Add Price" variant="black" onClick={() => setOpenModal('add')} />
            )}
          </div>

          <Table
            loading={false}
            data={getCurrentItems()}
            columns={columns}
            search={setSearch}
            filter={filter}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          />
        </div>

        <Modal open={openModal === 'add' || openModal === 'edit'} onClose={closeModal}>
          <>
            {authState.isAuthenticated && authState.user?.name && (
              <Price onClose={closeModal} currentTab={activeTab} item={selectedItem} open={true} modalType={openModal === 'add' ? 'add' : 'edit'} currentUser={authState?.user?.name} />
            )}
          </>
        </Modal>
      </Box>
    </Container>
  );
};

export default index;
