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

type PriceItem = {
  id: string;
  price: string;
  type: string;
  status: string;
  [key: string]: any;
}

// type Ads = {
//   id: number;
//   amount: number;
//   type: string;
// }

// type BuyVideo = {
//   id: number;
//   amount: number;
//   type: string;
// }

// interface PriceFieldsProps {
//   label: string;
//   value: number | undefined;
//   onChange: (value: number) => void;
// }

const columnHelper = createColumnHelper<PriceItem>();
// const adsColumnHelper = createColumnHelper<Ads>();
// const buyVideoColumnHelper = createColumnHelper<BuyVideo>();

// const PriceFields: React.FC<PriceFieldsProps> = ({ label, value, onChange }) => {
//   return (
//     <Input
//     //   fullWidth
//       label={label}
//       type="number"
//       value={value}
//       onChange={(e) => onChange(parseFloat(e.target.value))}
//       placeholder='0'
//       startAdornment={
//         <Typography variant="h6">₦</Typography>
//       } 
//     />
//   );
// };

const index = () => {
  const [openModal, setOpenModal] = useState<'add' | 'edit' | null>(null);
  const [activeTab, setActiveTab] = useState<'videoUploadTypes' | 'adsTypes' | 'buyVideoTypes'>('videoUploadTypes');
  const [priceItems, setPriceItems] = useState<PriceItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PriceItem | null>(null)
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { currentUser, loading: userLoading, error: userError } = useCurrentUser();
  
  useEffect(() => {
    fetchPriceItems()
  }, [activeTab]);

  const fetchPriceItems = async () => {
    setLoading(false);
    try {
      const endpoint = activeTab === 'videoUploadTypes' ? apiEndpoints.VIDEO_UPLOAD_TYPE : apiEndpoints.ADS_TYPE;
      const resp = await getData(`${CONFIG.BASE_URL}${endpoint}`);
      if (resp.ok) {
        const data = await resp.json();
        setPriceItems(data);
      }
      else {
        throw new Error(`Unable to fetch ${activeTab}`)
      }
    }
    catch (err) {
      console.error(`Error fetching ${activeTab}:`, err)
      toast.error(`Failed to load ${activeTab}`)
    }
    finally {
      setLoading(false);
    }
  };


  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      const endpoint = activeTab === 'videoUploadTypes' ? apiEndpoints.CREATE_VIDEO_TYPE : apiEndpoints.CREATE_AD_TYPE;
      const resp = await postData(`${CONFIG.BASE_URL}${endpoint}`, {
        id,
        status: newStatus,
      });
      if (resp.ok) {
        setPriceItems(priceItems.map(item =>
          item.id === id ? { ...item, status: newStatus } : item
        ))
        toast.success(`${activeTab === 'videoUploadTypes' ? 'Video type' : 'Ad type'} ${newStatus.toLowerCase()} successfully`)
      }
      else {
        throw new Error(`Failed to update ${activeTab === 'videoUploadTypes' ? 'video type' : 'ad type'} status`)
      }
    }
    catch (err) {
      console.error(`Error updating ${activeTab} status:`, err)
      toast.error(`Failed to update ${activeTab} status`)
    }
  }

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: 'Price',
      cell: (info) => `$${info.getValue()}`,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-2 py-1.5 text-center items-center rounded-full ${
          info.getValue() === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant='neutral' 
            label="Edit" 
            onClick={() => {
              setSelectedItem(row.original)
              navigate(`/admin/price-management/edit/${activeTab}/${row.original.id}`)
            }}
          />
          <Button 
            variant={row.original.status === 'Active' ? 'red' : 'success'} 
            label={row.original.status === 'Active' ? 'Deactivate' : 'Activate'}
            onClick={() => handleStatusToggle(row.original.id, row.original.status)}
          />
        </div>
      ),
    }),
  ]

  const closeModal = () => setOpenModal(null);



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
            data={priceItems}
            columns={columns}
            tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          />
        </div>

        <Modal open={openModal === 'add' || openModal === 'edit'} onClose={closeModal} sx={{ maxWidth: 'lg' }}>
          <>
            {currentUser && (
              <Price onClose={closeModal} currentTab={activeTab} item={selectedItem} open={true} modalType={openModal === 'add' ? 'add' : 'edit'} currentUser={currentUser.name} />
            )}
          </>
        </Modal>
      </Box>
    </Container>
  );
};

export default index;
