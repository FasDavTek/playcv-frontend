import React, { useCallback, useEffect, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
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
  orderId: string;
  quantity: number;
  price: number;
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
    


  
   

  // useEffect(() => {
  //   const uploadModalParam = queryParams.get('uploadModal');
  //   if (uploadModalParam === 'true') {
  //     openSetModalFn('uploadModal');
  //   }
  // }, [queryParams]);

  const handleGenerateInvoice = (item: Payment) => {
    setSelectedItem(item);
    navigate(`/employer/payment/details/${item.id}`)
  };


  const columns = [
    columnHelper.accessor('customerFullName', {
      header: 'Name',
    }),
    columnHelper.accessor('customerEmailAddress', {
      header: 'Email',
    }),
    columnHelper.accessor('customerMobileNumber', {
      header: 'Phone Number',
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
    </div>
  );
};

export default Payment;
