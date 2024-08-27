import { useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
import { UserModal } from './modals';
import { useNavigate } from 'react-router-dom';

type ReportTableColumns = {
  status: string;
  adName: string;
  fileUrl: string;
  createdAt: string;
  action: 'action';
};

const data = [
  {
    adName: 'Summer Sale',
    fileUrl: 'https://example.com/summer-sale.png',
    createdAt: '2024-06-01T10:00:00Z',
    status: 'active',
  },
  {
    adName: 'Winter Collection',
    fileUrl: 'https://example.com/winter-collection.png',
    createdAt: '2024-11-15T12:00:00Z',
    status: 'suspended',
  },
  {
    adName: 'Spring Promo',
    fileUrl: 'https://example.com/spring-promo.png',
    createdAt: '2024-03-21T09:30:00Z',
    status: 'active',
  },
];

type ModalTypes = null | 'createAds';

const columnHelper = createColumnHelper<ReportTableColumns>();

const columns = [
  columnHelper.accessor('adName', {
    header: 'Ad Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('fileUrl', {
    header: 'Ad Link',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('createdAt', {
    header: 'Date Created',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <span className={`px-2 py-1.5 text-center items-center rounded-full text-white ${info.getValue() === 'active' ? 'bg-green-500' : 'bg-red-500'}`}>
        {info.getValue() === 'active' ? 'Active' : 'Suspended'}
      </span>
    ),
  }),
  columnHelper.accessor('action', {
    cell: ({ row: { original } }) => {
      const [status, setStatus] = useState(original.status);

      const handleSuspend = () => {
        // Implement suspend functionality here
        setStatus('suspended');
        console.log(`Ad "${original.adName}" suspended.`);
      };

      const handleActivate = () => {
        // Implement activate functionality here
        setStatus('active');
        console.log(`Ad "${original.adName}" activated.`);
      };

      const handleView = () => {
        // Implement view functionality here, e.g., navigate to a detail page or open a modal
        console.log(`Viewing ad "${original.adName}".`);
        // Example: navigate(`/admin/advertisement-management/view/${original.adName}`);
      };

      return (
        <div className="flex gap-2">
          <Button variant='custom' label="View" onClick={handleView} />
          {status === 'active' ? (
            <Button variant='red' label="Suspend" onClick={handleSuspend} />
          ) : (
            <Button variant='success' label="Activate" onClick={handleActivate} />
          )}
        </div>
      );
    },
    header: 'Action',
  }),
];

const Payment = () => {
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const navigate = useNavigate();

  const closeModal = () => setOpenModal(null);

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end">
        {/* TODO: This should open up a payment modal */}
        <Button
          label="Create Ad Video"
          variant='black'
          onClick={() => navigate('/admin/advertisement-management/create')}
        />
      </div>
      {/* Create Payment */}
      <Table
        loading={false}
        data={data}
        columns={columns}
        tableHeading="All Ads"
      />
      
    </div>
  );
};

export default Payment;
