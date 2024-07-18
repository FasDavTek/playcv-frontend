import React, { useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
import { PaymentModal } from './modals';

type ReportTableColumns = {
  videoName: string;
  quantity: number;
  price: string;
  type: 'pinned' | 'upload';
  subTotal: string;
  action: 'action';
};

const data = [
  {
    videoName: 'Introduction to TypeScript',
    quantity: 1,
    price: '15.00',
    type: 'upload',
    subTotal: '15.00',
  },
  {
    videoName: 'Advanced React Patterns',
    quantity: 2,
    price: '25.00',
    type: 'pinned',
    subTotal: '50.00',
  },
  {
    videoName: 'Node.js Best Practices',
    quantity: 3,
    price: '20.00',
    type: 'upload',
    subTotal: '60.00',
  },
  {
    videoName: 'CSS Grid Layouts',
    quantity: 1,
    price: '10.00',
    type: 'pinned',
    subTotal: '10.00',
  },
  {
    videoName: 'Fullstack Development with Next.js',
    quantity: 2,
    price: '30.00',
    type: 'upload',
    subTotal: '60.00',
  },
  {
    videoName: 'Building REST APIs with Express',
    quantity: 4,
    price: '18.00',
    type: 'pinned',
    subTotal: '72.00',
  },
  {
    videoName: 'GraphQL for Beginners',
    quantity: 1,
    price: '22.00',
    type: 'upload',
    subTotal: '22.00',
  },
  {
    videoName: 'JavaScript ES6 Features',
    quantity: 5,
    price: '12.00',
    type: 'pinned',
    subTotal: '60.00',
  },
  {
    videoName: 'Mastering Vue.js',
    quantity: 2,
    price: '27.00',
    type: 'upload',
    subTotal: '54.00',
  },
  {
    videoName: 'Understanding Redux',
    quantity: 3,
    price: '19.00',
    type: 'pinned',
    subTotal: '57.00',
  },
];

type ModalTypes = null | 'paymentModal';

const columnHelper = createColumnHelper<ReportTableColumns>();

const columns = [
  columnHelper.accessor('videoName', {
    header: 'Video Name',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.accessor('quantity', {
    header: 'Quantity',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('subTotal', {
    header: 'Subtotal',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('action', {
    cell: ({ row: { original } }) => {
      // REFACTOR: is this necessary
      // const cb = (e: React.MouseEvent<HTMLButtonElement>) => {
      //   // console.log('e', e);
      // };
      return <Button label="Generate Invoice" />;
    },
    header: 'Action',
  }),
];

const Payment = () => {
  const [openModal, setOpenModal] = useState<ModalTypes>(null);

  const closeModal = () => setOpenModal(null);

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end">
        {/* TODO: This should open up a payment modal */}
        <Button
          label="GET STARTED UPLOAD VIDEOCV"
          onClick={() => {
            setOpenModal('paymentModal');
          }}
        />
      </div>
      {/* Create Payment */}
      <Table
        loading={false}
        data={data}
        columns={columns}
        tableHeading="All Payments"
      />
      <Modal open={openModal === 'paymentModal'} onClose={closeModal}>
        <PaymentModal onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default Payment;
