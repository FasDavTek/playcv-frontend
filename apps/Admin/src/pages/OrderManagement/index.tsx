import { useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
import { UserModal } from './modals';

type ReportTableColumns = {
  userName: string;
  userEmail: string;
  role: string;
  action: 'action';
};

const generateReports = () => {
  const roles = ['Admin', 'User', 'Manager', 'Editor', 'Viewer'];
  const getRandomRole = () => roles[Math.floor(Math.random() * roles.length)];
  const users = [
    { name: 'Alice Johnson', email: 'alice.johnson@example.com' },
    { name: 'Bob Smith', email: 'bob.smith@example.com' },
    { name: 'Charlie Brown', email: 'charlie.brown@example.com' },
    { name: 'David Wilson', email: 'david.wilson@example.com' },
    { name: 'Eve Davis', email: 'eve.davis@example.com' },
    { name: 'Frank Harris', email: 'frank.harris@example.com' },
    { name: 'Grace Clark', email: 'grace.clark@example.com' },
    { name: 'Henry Lewis', email: 'henry.lewis@example.com' },
    { name: 'Ivy Walker', email: 'ivy.walker@example.com' },
    { name: 'Jack Young', email: 'jack.young@example.com' },
  ];

  return users.map((user) => ({
    userName: user.name,
    userEmail: user.email,
    role: getRandomRole(),
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
  columnHelper.accessor('role', {
    header: 'Role',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('action', {
    cell: ({ row: { original } }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const navigate = useNavigate();
      return (
        <Button
          onClick={() => navigate('/order-management/123')}
          label="View"
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
