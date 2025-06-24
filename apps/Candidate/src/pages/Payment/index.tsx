import React, { useCallback, useEffect, useState } from 'react';

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
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';

type Payment = {
  id: number;
  customerFullName: string;
  customerEmailAddress: string;
  price: number;
  orderId: string;
  quantity: number;
  dateCreated: Date;
  customerMobileNumber: string;
  paymentMethod: string;
  transactionStatus: string;
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
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(1);

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const navigate = useNavigate(); // Initialize useNavigate

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
  const userId = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID)

  const checkPaymentStatus = async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 'success' && response.hasValidUpploadRequest === true) {
        toast.info('You have an existing payment for video upload that you have not yet completed.');
        navigate('/candidate/video-management/upload', {
          state: {
            uploadTypeId: response.uploadRequest.uploadTypeId,
            uploadTypeName: response.uploadRequest.uploadType,
            uploadRequestId: response.uploadRequest.id,
            paymentDate: response.uploadRequest.paymentDate,
            duration: response.uploadRequest.duration
          }
        });
      }
      else {
        openSetModalFn('confirmationModal');
      }
    } 
    catch (error) {
      console.error('Error checking payment status:', error);
      toast.warning('There was an error checking your payment status. Please try again later.');
    }
  };


    const fetchPayments = useCallback(async () => {
      try {
        const queryParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: pageSize.toString(),
        });

        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.FETCH_ALL_PAYMENTS}?${queryParams}&userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.succeeded === true) {
          const data = await response.data;
          const paymentsCount = response.totalRecords;

          setPayments(data);
          setTotalRecords(paymentsCount);
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
    }, [token, currentPage, pageSize])

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments])
    


  const handleGenerateInvoice = (item: Payment) => {
    setSelectedItem(item);
    navigate(`/candidate/payment/details/${item.id}`)
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
      header: 'Amount',
      cell: (info) => `₦${info.getValue()}`,
    }),
    columnHelper.accessor('dateCreated', {
      header: 'Payment Date',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('transactionStatus', {
      header: 'Payment Status',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          variant='custom'
          label="View"
          onClick={() => handleGenerateInvoice(row.original)}
        />
      ),
    }),
  ];
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


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
        loading={loading}
        data={payments}
        columns={columns}
        search={setSearch}
        filter={filter}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        tableHeading="All Payments"
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
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
