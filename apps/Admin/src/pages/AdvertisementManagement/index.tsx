import { useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
import { UserModal } from './modals';
import { useNavigate } from 'react-router-dom';

type ReportTableColumns = {
  id: string;
  status: string;
  adName: string;
  adUrl: string;
  adType: string;
  createdAt: string;
  userFullname: string;
  description: string;
  startDate: string;
  endDate: string;
  action: 'action';
};

const initialData = [
  {
    id: '1',
    adName: 'Summer Sale',
    adUrl: 'https://example.com/summer-sale.png',
    createdAt: '2024-06-01T10:00:00Z',
    userFullname: 'John Doe',
    status: 'active',
    description: 'This is a summer sale ad',
    startDate: '2024-06-01T10:00:00Z',
    endDate: '2024-06-30T10:00:00Z',
    adType: 'image',
  },
  {
    id: '2',
    adName: 'Winter Collection',
    adUrl: 'https://example.com/winter-collection.png',
    createdAt: '2024-11-15T12:00:00Z',
    userFullname: 'Jane Smith',
    status: 'suspended',
    description: 'This is a winter collection ad',
    startDate: '2024-11-15T12:00:00Z',
    endDate: '2024-12-31T12:00:00Z',
    adType: 'image',
  },
  {
    id: '3',
    adName: 'Spring Promo',
    adUrl: 'https://example.com/spring-promo.png',
    createdAt: '2024-03-21T09:30:00Z',
    userFullname: 'Alice Johnson',
    status: 'active',
    description: 'This is a spring promo ad',
    startDate: '2024-03-21T09:30:00Z',
    endDate: '2024-04-30T09:30:00Z',
    adType: 'video',
  },
];

type ModalTypes = null | 'createAds';

const columnHelper = createColumnHelper<ReportTableColumns>();

const Payment = () => {
  const [data, setData] = useState(initialData);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const navigate = useNavigate();

  const closeModal = () => setOpenModal(null);

  const handleStatusToggle = (adName: string) => {
    setData((prevData) =>
      prevData.map((ad) =>
        ad.adName === adName
          ? { ...ad, status: ad.status === 'active' ? 'suspended' : 'active' }
          : ad
      )
    );
  };

  const columns = [
    columnHelper.accessor('adName', {
      header: 'Ad Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userFullname', {
      header: 'User Fullname',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('adUrl', {
      header: 'Ad Link',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('adType', {
      header: 'Ad Type',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date Created',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => info.getValue(),
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
      cell: (info) => (
        <span
          className={`px-2 py-1.5 text-center items-center rounded-full text-white ${
            info.getValue() === 'active' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {info.getValue() === 'active' ? 'Active' : 'Suspended'}
        </span>
      ),
    }),
    columnHelper.accessor('action', {
      cell: ({ row: { original } }) => {
        const handleView = () => {
          console.log(`Viewing ad "${original.adName}".`);
          navigate(`/admin/advertisement-management/view/${original.id}`, { state: { ad: original }});
        };

        const handleStatusClick = () => {
          handleStatusToggle(original.adName);
        };

        return (
          <div className="flex gap-2">
            <Button variant="custom" label="View" onClick={handleView} />
            {original.status === 'active' ? (
              <Button variant="red" label="Suspend" onClick={handleStatusClick} />
            ) : (
              <Button variant="success" label="Activate" onClick={handleStatusClick} />
            )}
          </div>
        );
      },
      header: 'Action',
    }),
  ];

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end">
        <Button
          label="Create Ad"
          variant="black"
          onClick={() => navigate('/admin/advertisement-management/create')}
        />
      </div>
      <Table loading={false} data={data} columns={columns} tableHeading="All Ads" />
    </div>
  );
};

export default Payment;

