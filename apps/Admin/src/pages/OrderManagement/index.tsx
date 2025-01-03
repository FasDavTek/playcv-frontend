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
import { handleDate } from '@video-cv/utils';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

type PaymentData = {
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

type ModalTypes = null | 'viewPurchase';

const columnHelper = createColumnHelper<PaymentData>();

const Orders = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [selectedItem, setSelectedItem] = useState<PaymentData | null>(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<PaymentData | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.FETCH_ALL_PAYMENTS}?Page=1&Limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.succeeded === true) {
          const data = await response.data;
          console.log("", data);
          setPayments(data);
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
  }, []);

  const handleView = (item: PaymentData) => {
    setSelectedItem(item);
    navigate(`/admin/order-management/${item.id}`, {
      state: { payments: item }
    })
  }



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
    columnHelper.accessor('paymentMethod', {
      header: 'Payment Method',
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantity',
    }),
    columnHelper.accessor('price', {
      header: 'Amount',
      cell: (info) => `₦${info.getValue()}`,
    }),
    columnHelper.accessor('dateCreated', {
      header: 'Date Created',
      cell: (info) => handleDate(info.getValue()),
    }),
    columnHelper.accessor('transactionStatus', {
      header: 'Payment Status',
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          onClick={() => handleView(row.original)}
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
        search={setSearch}
        filter={filter}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
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
