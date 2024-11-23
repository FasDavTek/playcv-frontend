import React, { useEffect, useState } from 'react';
import { Modal } from '@mui/material';
import { Button, Table } from '@video-cv/ui-components';
import { useNavigate } from 'react-router-dom';

import { createColumnHelper } from '@tanstack/react-table';
import { UserModal } from './modals';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';

type ModalTypes = null | 'userManagement';

type User = {
  id: string;
  name: string;
  email: string;
  status: string;
  [key: string]: any;
};

// Define the type for each data set
type SubAdmin = User & {
  role: string;
  avatarUrl: string;
};

type Professional = User & {
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  institution: string;
  cvUrl: string;
  location: string;
  nyscStateCode: string;
  qualification: string;
  courseOfStudy: string;
  nyscStartDate: string;
  nyscEndDate: string;
  businessName: string;
  businessSector: string;
  businessPhone: string;
};

type Employer = User & {
  phoneNumber: string;
  companyUrl: string;
  location: string;
  businessName: string;
  businessAddress: string;
  contactPersonName: string;
  contactPersonPosition: string;
  contactPersonPhoneNumber: string;
  socialMediaLink: string;
  industry: string;
};

const columnHelper = createColumnHelper<User>();

const UserManagement = () => {
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [activeTab, setActiveTab] = useState<'subAdmins' | 'professionals' | 'employers'>('subAdmins');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USERS}?respType=${activeTab}`)
      if (resp.ok) {
        const data = await resp.json();
        setUsers(data);
      }
      else {
        throw new Error('Unable to fetch users');
      }
    }
    catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load users');
    }
    finally {
      setLoading(false);
    }
  };


  const handleStatusToggle = async (email: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_PROF_EMP_USER}`, {
        userEmail: email,
        status: newStatus
      });
      if (response.ok) {
        setUsers(users.map(user => 
          user.email === email ? { ...user, status: newStatus } : user
        ));
        toast.success(`User ${newStatus.toLowerCase()} successfully`);
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    ...activeTab === 'subAdmins' ? [
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => info.getValue(),
      }),
    ] : activeTab === 'professionals' ? [
      columnHelper.accessor('phoneNumber', {
        header: 'Phone Number',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('gender', {
        header: 'Gender',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('cvUrl', {
        header: 'CV Url',
        cell: (info) => <a href={info.getValue()} target="_blank" rel="noopener noreferrer">{info.getValue()}</a>,
      }),
      columnHelper.accessor('qualification', {
        header: 'Qualification(s)',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('courseOfStudy', {
        header: 'Course of Study',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('institution', {
        header: 'Institution of Study',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('businessName', {
        header: 'Business Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('businessSector', {
        header: 'Business Sector',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('businessPhone', {
        header: 'Business Phone number',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('nyscStateCode', {
        header: 'NYSC State Code',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('nyscStartDate', {
        header: 'NYSC Start Date',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('nyscEndDate', {
        header: 'NYSC End Date',
        cell: (info) => info.getValue(),
      }),
    ] : [
      columnHelper.accessor('businessName', {
        header: 'Business Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('businessAddress', {
        header: 'Business Address',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('industry', {
        header: 'Business Sector',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('phoneNumber', {
        header: 'Phone Number',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('companyUrl', {
        header: 'Company URL',
        cell: (info) => <a href={info.getValue()} target="_blank" rel="noopener noreferrer">{info.getValue()}</a>,
      }),
      columnHelper.accessor('location', {
        header: 'Business Location',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('contactPersonName', {
        header: 'Contact Person',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('contactPersonPosition', {
        header: 'Contact Person Role',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('contactPersonPhoneNumber', {
        header: 'Contact Phone Number',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('socialMediaLink', {
        header: 'Social Media Link',
        cell: (info) => info.getValue(),
      }),
    ],
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span className={`px-2 py-1.5 text-center items-center rounded-full ${
          info.getValue() === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
        }`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button 
            variant="custom" 
            label="View" 
            onClick={() => navigate(`/admin/user-management/${activeTab}-view/${row.original.email}`, { state: { user: row.original } })}
          />
          <Button 
            variant='neutral' 
            label="Edit" 
            onClick={() => navigate(`/admin/user-management/edit/${activeTab}/${row.original.email}`)}
          />
          <Button 
            variant={row.original.status === 'Active' ? 'red' : 'success'} 
            label={row.original.status === 'Active' ? 'Suspend' : 'Activate'}
            onClick={() => handleStatusToggle(row.original.email, row.original.status)}
          />
        </div>
      ),
    }),
  ];


  const closeModal = () => setOpenModal(null);

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-3">
        {activeTab && (
          <Button
            label={`Create ${activeTab.slice(0, -1)}`}
            variant="black"
            // onClick={() => setOpenModal('userManagement')}
            onClick={() => navigate(`/admin/user-management/create/${activeTab}`)}
          />
        )}
        {/* Similarly, add buttons for other tabs if needed */}
      </div>

      <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
        <div className="flex p-1">
          {['subAdmins', 'professionals', 'employers'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                  : 'text-blue-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          
        </div>
      </div>

      <div className="mt-4">
        <Table
          loading={false}
          data={users}
          columns={columns}
          tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        />
      </div>

      <Modal open={openModal === 'userManagement'} onClose={closeModal}>
        <>
          <UserModal onClose={closeModal} />
        </>
      </Modal>
    </div>
  );
};

export default UserManagement;
