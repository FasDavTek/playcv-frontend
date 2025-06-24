import { useCallback, useEffect, useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { formatDate } from '@video-cv/utils';
import { Button, Table, useToast } from '@video-cv/ui-components';
import { UserModal } from './modals';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { handleDate } from '@video-cv/utils';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';

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
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<PaymentData | null>(null);
  const navigate = useNavigate();

  const { showToast } = useToast();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const queryParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: pageSize.toString(),
        })

        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.FETCH_ALL_PAYMENTS}?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.succeeded === true) {
          const data = await response.data;
          const paymentCount = response.totalRecords > 0 ? response.totalRecords : totalRecords;

          setPayments(data);
          setTotalRecords(paymentCount);
        }
      }
      catch (err) {
        if(!token) {
          showToast('Your session has expired. Please log in again', 'error');
          navigate('/');
        }
        else {
          showToast('Error fetching payments', 'error');
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
    navigate(`/admin/order-management/${item.id}`)
  };



  const handleDownloadCSV = useCallback(async () => {
    const queryParams = new URLSearchParams({
      download: 'true',
    }).toString();

    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.FETCH_ALL_PAYMENTS}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response;

      if (!result.transactions || !Array.isArray(result.transactions)) {
        throw new Error("No data available to download");
      }
  
      // Convert JSON to CSV
      const csvContent = convertJsonToCsv(result.transactions);
  
      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showToast('Error downloading CSV', 'error');
    }
  }, []);



  const convertJsonToCsv = (data: any[]) => {
    if (data.length === 0) return "";
  
    // Flatten nested objects
    const flattenObject = (obj: any, prefix = "") => {
      return Object.keys(obj).reduce((acc, key) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          Object.assign(acc, flattenObject(obj[key], newKey));
        } else {
          acc[newKey] = obj[key];
        }
        return acc;
      }, {} as any);
    };
  
    const flattenedData = data.map((item) => flattenObject(item));
  
    // Extract headers from the first flattened object
    const headers = Object.keys(flattenedData[0]).join(",");
  
    // Map each object to a CSV row
    const rows = flattenedData.map((item) =>
      Object.values(item)
        .map((value) => {
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    );
  
    return [headers, ...rows].join("\n");
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
          onClick={() => handleView(row.original)}
          label="View"
          variant='custom'
        />
      ),
    }),
  ];

  const closeModal = () => setOpenModal(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      {/* Create Orders */}
      <Table
        loading={isLoading}
        data={payments}
        columns={columns}
        search={setSearch}
        filter={filter}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        tableHeading="All Orders"
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onDownloadCSV={handleDownloadCSV}
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
