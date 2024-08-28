import { useState } from 'react';

import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';

import { formatDate } from '@video-cv/utils';
import { Button, Table } from '@video-cv/ui-components';
import { UserModal } from './modals';
import { useNavigate } from 'react-router-dom';

type ReportTableColumns = {
  id: number;
  userName: string;
  userEmail: string;
  role: string;
  status: string;
  action: 'action';
};

const generateReports = () => {
  const roles = ['Admin', 'User', 'Manager', 'Editor', 'Viewer'];
  const statuses = ['active', 'suspended'];
  const getRandomRole = () => roles[Math.floor(Math.random() * roles.length)];
  const getRandomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];
  const users = [
    { id: 1, name: 'John Doe', email: 'johndoe@example.com', role: 'Subadmin', status: 'Active', avatarUrl: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', role: 'Professional', status: 'Verified', avatarUrl: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Acme Corp', email: 'contact@acmecorp.com', role: 'Employer', status: 'Active', avatarUrl: 'https://via.placeholder.com/50' },
  ];

  return users.map((user) => ({
    id: user.id,
    userName: user.name,
    userEmail: user.email,
    role: getRandomRole(),
    status: getRandomStatus(),
  }));
};

const initialData = {
  subAdmins: generateReports(),
  professionals: generateReports(),
  employers: generateReports(),
};

type ModalTypes = null | 'userManagement';

const columnHelper = createColumnHelper<ReportTableColumns>();

const Payment = () => {
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [selectedUser, setSelectedUser] = useState<ReportTableColumns | null>(null);
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState<'subAdmins' | 'professionals' | 'employers'>('subAdmins');

  const closeModal = () => setOpenModal(null);

  const navigate = useNavigate();

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
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1.5 text-center items-center rounded-full text-white ${
            info.getValue() === 'active' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {info.getValue() === 'active' ? 'Active' : 'Suspended'}
        </span>
      ),
    }),
    columnHelper.accessor('action', {
      cell: ({ row: { original } }) => {
        const handleView = () => {
          setSelectedUser(original);
          const viewPath = `/admin/user-management/${activeTab}-view/${original.id}`;
          navigate(viewPath);
          console.log(`Viewing user "${original.userName}".`);
          console.log(viewPath)
        };
  
        const handleStatusToggle = () => {
          const newStatus = original.status === 'active' ? 'suspended' : 'active';
          setData((prevData: any) => ({
            ...prevData,
            [activeTab]: prevData[activeTab].map((user: { userName: string; }) =>
              user.userName === original.userName ? { ...user, status: newStatus } : user
            ),
          }));
          console.log(`Toggling status for user "${original.userName}".`);
        };
  
        return (
          <div className="flex gap-2">
            <Button variant="custom" label="View" onClick={handleView} />
            {original.status === 'active' ? (
              <Button variant="red" label="Suspend" onClick={handleStatusToggle} />
            ) : (
              <Button variant="success" label="Activate" onClick={handleStatusToggle} />
            )}
          </div>
        );
      },
      header: 'Action',
    }),
  ];

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-3">
        {/* TODO: This should open up a payment modal */}
        {activeTab === 'subAdmins' && (
          <Button
            label="Create Subadmin"
            variant="black"
            onClick={() => setOpenModal('userManagement')}
          />
        )}
      </div>
      {/* Create Payment */}

      <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
        <div className="flex p-1">
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'subAdmins' ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
            onClick={() => setActiveTab('subAdmins')}
          >
            Sub Admins
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'professionals' ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
            onClick={() => setActiveTab('professionals')}
          >
            Professionals
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'employers' ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
            onClick={() => setActiveTab('employers')}
          >
            Employers
          </button>
        </div>
      </div>

      <div className="mt-4">
        <Table
          loading={false}
          data={data[activeTab]}
          columns={columns}
          tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        />
      </div>
      
      <Modal open={openModal === 'userManagement'} onClose={closeModal}>
        <UserModal onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default Payment;
