import React, { useEffect, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
import CreateVideoConfirmationModal from '../VideoManagement/modals/CreateVideoConfirmationModal';
import { useNavigate } from 'react-router-dom';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

type ReportTableColumns = {
  id: number;
  videoName: string;
  quantity: number;
  price: string;
  type: string;
  subTotal: string;
  action: 'action';
};


type ModalTypes = null | 'uploadModal' | 'confirmationModal' | 'paymentModal';

const columnHelper = createColumnHelper<ReportTableColumns>();

const Payment = () => {
  const queryParams = new URLSearchParams(location.search);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const navigate = useNavigate(); // Initialize useNavigate

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  const checkPaymentStatus = async () => {
    setLoading(true);
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.data;
      
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
        search={setSearch}
        filter={filter}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        tableHeading="All Payments"
      />
      {/* <Modal open={openModal === 'paymentModal'} onClose={closeModal}>
        <>
          <PaymentModal onClose={closeModal} />
        </>
      </Modal> */}

      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <>
          <CreateVideoConfirmationModal onClose={closeModal}/>
        </>
      </Modal>
    </div>
  );
};

export default Payment;
