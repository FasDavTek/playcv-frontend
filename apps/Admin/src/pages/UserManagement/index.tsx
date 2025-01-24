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
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { useQuery } from 'react-query';

type ModalTypes = null | 'userManagement';

type User = {
  userId: string;
  name: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);


  useEffect(() => {
    fetchUsers();
  }, [activeTab, search, filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USERS}?respType=${activeTab}&Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      if (resp.succeeded === true) {
        const data = await resp;

        const filteredUsers = data?.data?.filter((user: User) => {
          switch (activeTab) {
            case 'subAdmins':
              return user.userBioDetails.type === 'SuperAdmin';
            case 'professionals':
              return user.userBioDetails.type === 'Professional';
            case 'employers':
              return user.userBioDetails.type === 'Employer';
            default:
              return false;
          }
        });

        setUsers(filteredUsers);
      }
    }
    catch (err) {
      if(!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/');
      }
    }
    finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, [activeTab, searchQuery]);


  const handleStatusToggle = async (user: User) => {
    try {
      const isActive = user.userBioDetails.status === 'Active';
      const newStatus = isActive ? 'In review' : 'Active';
      const statusId = isActive ? 2 : 1;

      const isAdmin = activeTab === 'subAdmins';
      const isProfessionalUser  = activeTab === 'professionals';
      const isBusinessUser  = activeTab === 'employers';

      console.log(user.userBioDetails.status);
      console.log(newStatus);

      console.log(user);
      console.log(user.userBioDetails.userId);

      const payload = Object.entries({
        status: newStatus,
        statusId: statusId,
        isAdmin: isAdmin,
        isProfessionalUser:  isProfessionalUser,
        isBusinessUser:  isBusinessUser,
        userId: user.userBioDetails.userId,
        action: 'edit',
      }).reduce((acc: { [key: string]: any }, [Key, value]) => {
        if (value) {
          acc[Key] = value;
        }
        return acc;
      }, {});

      console.log(payload)
      
      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_PROF_EMP_USER}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.code === "01") {
        await fetchUsers();
        const toastMessage = isActive ? 'User  suspended' : 'User  activated';
        toast.success(toastMessage);
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const columns = [
    columnHelper.accessor('userBioDetails.firstName', {
      header: 'First Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userBioDetails.middleName', {
      header: 'Middle Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userBioDetails.lastName', {
      header: 'Last Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userBioDetails.email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userBioDetails.phoneNo', {
      header: 'Phone Number',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userBioDetails.businessName', {
      header: 'Business Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userBioDetails.gender', {
      header: 'Gender',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userBioDetails.dateOfBirth', {
      header: 'Date of birth',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('userBioDetails.status', {
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
            onClick={() => navigate(`/admin/user-management/${activeTab}-view/${row.original.userBioDetails.email}`, { state: { user: row.original } })}
          />
          <Button 
            variant='neutral' 
            label="Edit" 
            onClick={() => navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`, { state: { user: row.original } })}
          />
          <Button 
            variant={row.original.userBioDetails.status === "Active" ? "red" : "success"}
            label={row.original.userBioDetails.status === "Active" ? "Suspend" : "Activate"}
            onClick={() => { handleStatusToggle(row.original); console.log(row.original) }}
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
          loading={loading}
          data={users}
          columns={columns}
          search={setSearch}
          filter={filter}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
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
