import React, { useEffect, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
import { PaymentModal } from './modals';
import CreateVideoConfirmationModal from '../VideoManagement/modals/CreateVideoConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';

type ReportTableColumns = {
  id: number;
  videoName: string;
  quantity: number;
  price: string;
  type: 'pinned' | 'upload';
  subTotal: string;
  action: 'action';
};

const data = [
  {
    id: '1', // Unique identifier
    videoName: 'Introduction to TypeScript',
    quantity: 1,
    price: '15.00',
    type: 'upload',
    subTotal: '15.00',
  },
  {
    id: '2',
    videoName: 'Advanced React Patterns',
    quantity: 2,
    price: '25.00',
    type: 'pinned',
    subTotal: '50.00',
  },
  {
    id: '3',
    videoName: 'Node.js Best Practices',
    quantity: 3,
    price: '20.00',
    type: 'upload',
    subTotal: '60.00',
  },
  {
    id: '4',
    videoName: 'CSS Grid Layouts',
    quantity: 1,
    price: '10.00',
    type: 'pinned',
    subTotal: '10.00',
  },
  {
    id: '5',
    videoName: 'Fullstack Development with Next.js',
    quantity: 2,
    price: '30.00',
    type: 'upload',
    subTotal: '60.00',
  },
  {
    id: '6',
    videoName: 'Building REST APIs with Express',
    quantity: 4,
    price: '18.00',
    type: 'pinned',
    subTotal: '72.00',
  },
  {
    id: '7',
    videoName: 'GraphQL for Beginners',
    quantity: 1,
    price: '22.00',
    type: 'upload',
    subTotal: '22.00',
  },
  {
    id: '8',
    videoName: 'JavaScript ES6 Features',
    quantity: 5,
    price: '12.00',
    type: 'pinned',
    subTotal: '60.00',
  },
  {
    id: '9',
    videoName: 'Mastering Vue.js',
    quantity: 2,
    price: '27.00',
    type: 'upload',
    subTotal: '54.00',
  },
  {
    id: '10',
    videoName: 'Understanding Redux',
    quantity: 3,
    price: '19.00',
    type: 'pinned',
    subTotal: '57.00',
  },
];


type ModalTypes = null | 'uploadModal' | 'confirmationModal' | 'paymentModal';

const columnHelper = createColumnHelper<ReportTableColumns>();

const Payment = () => {
  const queryParams = new URLSearchParams(location.search);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const checkPaymentStatus = async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}?Page=1&Limit=10`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      
      if (data) {
        openSetModalFn('confirmationModal');
      } else {
        toast.info('You have an existing payment for video upload that you have not yet completed.');
      }
    } 
    catch (error) {
      console.error('Error checking payment status:', error);
      toast.warning('There was an error checking your payment status. Please try again later.');
    }
  };

  // useEffect(() => {
  //   const uploadModalParam = queryParams.get('uploadModal');
  //   if (uploadModalParam === 'true') {
  //     openSetModalFn('uploadModal');
  //   }
  // }, [queryParams]);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleGenerateInvoice = (id: number) => {
    navigate(`/candidate/payment/details/${id}`); // Navigate to the invoice details page
  };


  const columns = [
    columnHelper.accessor('videoName', {
      header: 'Video Name',
      cell: (info) => info.getValue(),
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
        return <Button variant='custom' label="View Payments" onClick={() => handleGenerateInvoice(original.id)} />;
      },
      header: 'Action',
    }),
  ];


  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end">
        {/* TODO: This should open up a payment modal */}
        <Button
          variant='custom'
          label="Pay for video"
          onClick={checkPaymentStatus}
          // onClick={() => openSetModalFn('confirmationModal')}
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

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <CreateVideoConfirmationModal onClose={closeModal}/>
      </Modal>
    </div>
  );
};

export default Payment;
