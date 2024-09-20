import React, { useState } from 'react';
import { Container, Tab, Tabs, Typography, Box, TextField, Stack, Modal } from '@mui/material';
import { Button, Input, Table } from '@video-cv/ui-components';
import { toast } from 'react-toastify';

import { useNavigate } from 'react-router-dom';

import { createColumnHelper } from '@tanstack/react-table';
import Price from './modal/Price';

type VideoUpload = {
  id: number;
  amount: number;
  type: string;
}

type Ads = {
  id: number;
  amount: number;
  type: string;
}

type BuyVideo = {
  id: number;
  amount: number;
  type: string;
}

interface PriceFieldsProps {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
}

const videoUploadColumnHelper = createColumnHelper<VideoUpload>();
const adsColumnHelper = createColumnHelper<Ads>();
const buyVideoColumnHelper = createColumnHelper<BuyVideo>();

const PriceFields: React.FC<PriceFieldsProps> = ({ label, value, onChange }) => {
  return (
    <Input
    //   fullWidth
      label={label}
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      placeholder='0'
      startAdornment={
        <Typography variant="h6">₦</Typography>
      } 
    />
  );
};

const index = () => {
  const [openModal, setOpenModal] = useState<'add' | 'edit' | null>(null);
  const [activeTab, setActiveTab] = useState<'videoUploadPrices' | 'adsPrices' | 'buyVideoPrices'>('videoUploadPrices');
  const [selectedItem, setSelectedItem] = useState<VideoUpload | Ads | BuyVideo | null>(null);

  const navigate = useNavigate();

  const handleTabChange = (tab: 'videoUploadPrices' | 'adsPrices' | 'buyVideoPrices') => {
    setActiveTab(tab);
  };

  const VideoUploadData = [
    { id: 1, type: 'Pinned Video', amount: 1000 },
    { id: 2, type: 'Regular Video', amount: 500 },
  ];

  const AdsData = [
    { id: 1, type: 'Video Ads', amount: 2000 },
    { id: 2, type: 'Image Ads', amount: 1500 },
  ];

  const BuyVideoData = [
    { id: 1, type: 'Pinned Video', amount: 3000 },
    { id: 2, type: 'Regular Video', amount: 2500 },
  ];

  // Manage data state
  const [videoUploads, setVideoUploads] = useState<VideoUpload[]>(VideoUploadData);
  const [ads, setAds] = useState<Ads[]>(AdsData);
  const [buyVideos, setBuyVideos] = useState<BuyVideo[]>(BuyVideoData);

  const closeModal = () => setOpenModal(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
  };

  const videoUploadColumns = [
    videoUploadColumnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => formatCurrency(info.getValue()),
    }),
    videoUploadColumnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => info.getValue(),
    }),
    // videoUploadColumnHelper.accessor('role', {
    //   header: 'Role',
    //   cell: (info) => info.getValue(),
    // }),
    // videoUploadColumnHelper.accessor('status', {
    //   header: 'Status',
    //   cell: (info) => (
    //     <span
    //       className={`px-2 py-1.5 text-center items-center rounded-full ${
    //         info.getValue() === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
    //       }`}
    //     >
    //       {info.getValue()}
    //     </span>
    //   ),
    // }),
    videoUploadColumnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row: { original } }) => {
        const handleEdit = (item: VideoUpload | Ads | BuyVideo) => {
          setOpenModal('edit');
          setSelectedItem(item);
        };

        const handleEditClick = () => handleEdit(original);

        // const handleStatusToggle = () => {
        //   const newStatus = original.status === 'Active' ? 'Suspended' : 'Active';
        //   setSubAdmins((prevData) =>
        //     prevData.map((user) =>
        //       user.id === original.id ? { ...user, status: newStatus } : user
        //     )
        //   );
        // };

        return (
          <div className="flex gap-2">
            <Button variant="custom" label="Edit" onClick={handleEditClick} />
            {/* {original.status === 'Active' ? (
              <Button variant="red" label="Suspend" onClick={handleStatusToggle} />
            ) : (
              <Button variant="success" label="Activate" onClick={handleStatusToggle} />
            )} */}
          </div>
        );
      },
    }),
  ];
  
  // Define columns for Professionals
  const AdsColumns = [
    adsColumnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => formatCurrency(info.getValue()),
    }),
    adsColumnHelper.accessor('type', {
      header: 'Tyoe',
      cell: (info) => info.getValue(),
    }),
    // adsColumnHelper.accessor('phoneNumber', {
    //   header: 'Phone Number',
    //   cell: (info) => info.getValue(),
    // }),
    // AdsColumnHelper.accessor('status', {
    //   header: 'Status',
    //   cell: (info) => (
    //     <span
    //       className={`px-2 py-1.5 text-center items-center rounded-full ${
    //         info.getValue() === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
    //       }`}
    //     >
    //       {info.getValue()}
    //     </span>
    //   ),
    // }),
    adsColumnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row: { original } }) => {
        const handleEdit = (item: VideoUpload | Ads | BuyVideo) => {
          setOpenModal('edit');
          setSelectedItem(item);
        };

        const handleEditClick = () => handleEdit(original);

        // const handleStatusToggle = () => {
        //   const newStatus = original.status === 'Active' ? 'Suspended' : 'Active';
        //   setSubAdmins((prevData) =>
        //     prevData.map((user) =>
        //       user.id === original.id ? { ...user, status: newStatus } : user
        //     )
        //   );
        // };

        return (
          <div className="flex gap-2">
            <Button variant="custom" label="Edit" onClick={handleEditClick} />
            {/* {original.status === 'Active' ? (
              <Button variant="red" label="Suspend" onClick={handleStatusToggle} />
            ) : (
              <Button variant="success" label="Activate" onClick={handleStatusToggle} />
            )} */}
          </div>
        );
      },
    }),
  ];
  
  // Define columns for Employers
  const buyVideoColumns = [
    buyVideoColumnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => formatCurrency(info.getValue()),
    }),
    buyVideoColumnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => info.getValue(),
    }),
    // buyVideoColumnHelper.accessor('phoneNumber', {
    //   header: 'Phone Number',
    //   cell: (info) => info.getValue(),
    // }),
    // buyVideoColumnHelper.accessor('status', {
    //   header: 'Status',
    //   cell: (info) => (
    //     <span
    //       className={`px-2 py-1.5 text-center items-center rounded-full ${
    //         info.getValue() === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
    //       }`}
    //     >
    //       {info.getValue()}
    //     </span>
    //   ),
    // }),
    buyVideoColumnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row: { original } }) => {
        const handleEdit = (item: VideoUpload | Ads | BuyVideo) => {
          setOpenModal('edit');
          setSelectedItem(item);
        };

        const handleEditClick = () => handleEdit(original);

        // const handleStatusToggle = () => {
        //   const newStatus = original.status === 'Active' ? 'Suspended' : 'Active';
        //   setSubAdmins((prevData) =>
        //     prevData.map((user) =>
        //       user.id === original.id ? { ...user, status: newStatus } : user
        //     )
        //   );
        // };

        return (
          <div className="flex gap-2">
            <Button variant="custom" label="Edit" onClick={handleEditClick} />
            {/* {original.status === 'Active' ? (
              <Button variant="red" label="Suspend" onClick={handleStatusToggle} />
            ) : (
              <Button variant="success" label="Activate" onClick={handleStatusToggle} />
            )} */}
          </div>
        );
      },
    }),
  ];

  let currentData;
  let currentColumns;
  if (activeTab === 'videoUploadPrices') {
    currentData = videoUploads;
    currentColumns = videoUploadColumns;
  } else if (activeTab === 'adsPrices') {
    currentData = ads;
    currentColumns = AdsColumns;
  } else {
    currentData = buyVideos;
    currentColumns = buyVideoColumns;
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Box className='bg-neutral-100 items-center rounded-lg'>
          <div className="flex p-1">
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'videoUploadPrices' ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
              onClick={() => setActiveTab('videoUploadPrices')}
            >
              Video Upload Prices
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'adsPrices' ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
              onClick={() => setActiveTab('adsPrices')}
            >
              Ads Prices
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${activeTab === 'buyVideoPrices' ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
              onClick={() => setActiveTab('buyVideoPrices')}
            >
              Buy Video Prices
            </button>
          </div>
        </Box>

        <div className="mt-4">
          <div className="flex justify-end items-center mb-4">
            <Button label="Add Price" variant="black" onClick={() => setOpenModal('add')} />
          </div>

          <Table
            loading={false}
            data={currentData}
            columns={currentColumns}
            tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          />
        </div>

        <Modal open={openModal === 'add' || openModal === 'edit'} onClose={closeModal} sx={{ maxWidth: 'lg' }}>
          <>
            <Price onClose={closeModal} currentTab={activeTab} item={selectedItem} open={true} modalType={openModal === 'add' ? 'add' : 'edit'} />
          </>
        </Modal>
      </Box>
    </Container>
  );
};

export default index;
