import { useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
import { UserModal } from './modals';

type ReportTableColumns = {
  id: number;
  userName: string;
  userEmail: string;
  role: string;
  price: number;
  datePaid: string;
  phone: string;
  paymentType: string;
  action: 'action';
};

const generateReports = () => {
  const roles = ['Admin', 'User', 'Manager', 'Editor', 'Viewer'];
  const paymentTypes = ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'];
  const getRandomRole = () => roles[Math.floor(Math.random() * roles.length)];
  const getRandomPaymentType = () => paymentTypes[Math.floor(Math.random() * paymentTypes.length)];

  const users = [
    { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com', price: 150.00, datePaid: '2024-08-01', phone: '+1234567890', paymentType: 'Credit Card' },
    { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com', price: 200.00, datePaid: '2024-08-02', phone: '+1234567891', paymentType: 'PayPal' },
    { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com', price: 180.00, datePaid: '2024-08-03', phone: '+1234567892', paymentType: 'Bank Transfer' },
    { id: 4, name: 'David Wilson', email: 'david.wilson@example.com', price: 220.00, datePaid: '2024-08-04', phone: '+1234567893', paymentType: 'Cash' },
    { id: 5, name: 'Eve Davis', email: 'eve.davis@example.com', price: 170.00, datePaid: '2024-08-05', phone: '+1234567894', paymentType: 'Credit Card' },
    { id: 6, name: 'Frank Harris', email: 'frank.harris@example.com', price: 210.00, datePaid: '2024-08-06', phone: '+1234567895', paymentType: 'PayPal' },
    { id: 7, name: 'Grace Clark', email: 'grace.clark@example.com', price: 190.00, datePaid: '2024-08-07', phone: '+1234567896', paymentType: 'Bank Transfer' },
    { id: 8, name: 'Henry Lewis', email: 'henry.lewis@example.com', price: 230.00, datePaid: '2024-08-08', phone: '+1234567897', paymentType: 'Cash' },
    { id: 9, name: 'Ivy Walker', email: 'ivy.walker@example.com', price: 160.00, datePaid: '2024-08-09', phone: '+1234567898', paymentType: 'Credit Card' },
    { id: 10, name: 'Jack Young', email: 'jack.young@example.com', price: 250.00, datePaid: '2024-08-10', phone: '+1234567899', paymentType: 'PayPal' },
  ];

  return users.map((user) => ({
    id: user.id,
    userName: user.name,
    userEmail: user.email,
    role: getRandomRole(),
    price: parseFloat((Math.random() * 1000).toFixed(2)),
    datePaid: new Date().toLocaleDateString(),
    phone: user.phone,
    paymentType: getRandomPaymentType(),
  }));
};

const data = generateReports();

type ModalTypes = null | 'viewPurchase';

const columnHelper = createColumnHelper<ReportTableColumns>();

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
  columnHelper.accessor('price', {
    header: 'Price',
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
  columnHelper.accessor('action', {
    cell: ({ row: { original } }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const navigate = useNavigate();
      return (
        <Button
          onClick={() => navigate(`/admin/order-management/${original.id}`)}
          label="View"
          variant='custom'
        />
      );
    },
    header: 'Action',
  }),
];

const Orders = () => {
  const [openModal, setOpenModal] = useState<ModalTypes>(null);

  const closeModal = () => setOpenModal(null);

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      {/* Create Orders */}
      <Table
        loading={false}
        data={data}
        columns={columns}
        tableHeading="All Orders"
      />
      <Modal open={openModal === 'viewPurchase'} onClose={closeModal}>
        <UserModal onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default Orders;
