import { useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
import { UserModal } from './modals';
import { useNavigate } from 'react-router-dom';

type ReportTableColumns = {
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
  },
  {
    adName: 'Winter Collection',
    fileUrl: 'https://example.com/winter-collection.png',
    createdAt: '2024-11-15T12:00:00Z',
  },
  {
    adName: 'Spring Promo',
    fileUrl: 'https://example.com/spring-promo.png',
    createdAt: '2024-03-21T09:30:00Z',
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
  columnHelper.accessor('action', {
    cell: ({ row: { original } }) => {
      return <Button label="View" />;
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
