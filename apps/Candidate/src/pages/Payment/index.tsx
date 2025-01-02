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

type Payment = {
  id: number;
  customerFullName: string;
  customerEmailAddress: string;
  orderId: string;
  quantity: number;
  price: string;
  type: string;
  subTotal: string;
};


type ModalTypes = null | 'uploadModal' | 'confirmationModal' | 'paymentModal';

const columnHelper = createColumnHelper<Payment>();

const Payment = () => {
  const queryParams = new URLSearchParams(location.search);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [selectedItem, setSelectedItem] = useState<Payment | null>(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const navigate = useNavigate(); // Initialize useNavigate

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID)

  const checkPaymentStatus = async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.data;
      
      if (!data || !data.checkoutId) {
        openSetModalFn('confirmationModal');
      } else {
        toast.info('You have an existing payment for video upload that you have not yet completed.');
        navigate(`/candidate/video-management/upload`, { 
          state: { 
            checkoutId: data.checkoutId,
          } 
        });
      }
    } 
    catch (error) {
      console.error('Error checking payment status:', error);
      toast.warning('There was an error checking your payment status. Please try again later.');
    }
  };


  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.FETCH_ALL_PAYMENTS}?Page=1&Limit=100&userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response);

        if (response.succeeded === true) {
          const data = await response.data;
          console.log("", data);
          setPayments(data);
        } else {
          throw new Error('Failed to fetch payments');
        }
      }
      catch (err) {
        if(!token) {
          toast.error('Your session has expired. Please log in again');
          navigate('/');
        }
        else {
          toast.error('Error fetching payments');
        }
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchPayments();
  }, [])
    


  
   

  // useEffect(() => {
  //   const uploadModalParam = queryParams.get('uploadModal');
  //   if (uploadModalParam === 'true') {
  //     openSetModalFn('uploadModal');
  //   }
  // }, [queryParams]);

  const handleGenerateInvoice = (item: Payment) => {
    // navigate(`/candidate/payment/details/${id}`); // Navigate to the invoice details page
    setSelectedItem(item);
    console.log(item)
    console.log(setSelectedItem)
    navigate(`/candidate/payment/details/${item.id}`, {
      state: { payments: item }
    })
  };


  const columns = [
    columnHelper.accessor('customerFullName', {
      header: 'Name',
    }),
    columnHelper.accessor('customerEmailAddress', {
      header: 'Email',
    }),
    columnHelper.accessor('orderId', {
      header: 'Order Id',
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
    }),
    columnHelper.accessor('price', {
      header: 'Price',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          variant='custom'
          label="View Payment"
          onClick={() => handleGenerateInvoice(row.original)}
        />
      ),
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
        data={payments}
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
