import { useEffect, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
import { UserModal } from './modals';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

type PaymentData = {
  id: number;
  userName: string;
  userEmail: string;
  role: string;
  amount: number;
  datePaid: Date;
  phone: string;
  paymentType: string;
  paymentDescription: string;
};

type ModalTypes = null | 'viewPurchase';

const columnHelper = createColumnHelper<PaymentData>();

const Orders = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [selectedOrder, setSelectedOrder] = useState<PaymentData | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.FETCH_ALL_PAYMENTS}?Page=1&Limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.code === "201") {
          const data = await response.data;
          setPayments(data);
        } else {
          throw new Error('Failed to fetch payments');
        }
      }
      catch (err) {
        toast.error('Error fetching payments');
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchPayments();
  })



  const columns = [
    columnHelper.accessor('userName', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userEmail', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor('role', {
    //   header: 'Role',
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      cell: (info) => `₦${info.getValue().toFixed(2)}`,
    }),
    columnHelper.accessor('datePaid', {
      header: 'Date Paid',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('paymentType', {
      header: 'Payment Type',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('paymentDescription', {
      header: 'Payment Description',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('id', {
      header: 'Action',
      cell: (info) => (
        <Button
          onClick={() => navigate(`/admin/order-management/${info.getValue()}`, { state: { paymentId: info.getValue() } })}
          label="View"
          variant='custom'
        />
      ),
    }),
  ];

  const closeModal = () => setOpenModal(null);

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      {/* Create Orders */}
      <Table
        loading={false}
        data={payments}
        columns={columns}
        tableHeading="All Orders"
      />
      <Modal open={openModal === 'viewPurchase'} onClose={closeModal}>
        <>
          <UserModal onClose={closeModal} />
        </>
      </Modal>
    </div>
  );
};

export default Orders;
