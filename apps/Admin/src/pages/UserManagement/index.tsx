import React, { useEffect, useState } from 'react';
import { Modal } from '@mui/material';
import { Button, RejectionDialog, SelectMenu, Table } from '@video-cv/ui-components';
import { useNavigate } from 'react-router-dom';

import { createColumnHelper } from '@tanstack/react-table';
import { UserModal } from './modals';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
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
  isActive: boolean | null
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
  grade?: string;
  institution: string;
  industry: string;
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
  businessPhone: string;
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
  const [activeTab, setActiveTab] = useState<'subAdmins' | 'professionals' | 'employers' | 'pendingEmployers'>('subAdmins');
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedAction, setSelectedAction] = useState<"reject" | "revoke" | null>(null);
  
  const navigate = useNavigate();

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USERS}?respType=${activeTab === "pendingEmployers" ? "employers" : activeTab}&Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      if (resp.code === '00') {
        const data = await resp;

        const filteredUsers = data?.data?.filter((user: User) => {
          switch (activeTab) {
            case 'subAdmins':
              return user.userBioDetails.type === 'SuperAdmin' && user.userBioDetails.userTypeId === 1;
            case 'professionals':
              return user.userBioDetails.type === 'Professional' && user.userBioDetails.userTypeId === 3;
            case 'employers':
              return user.userBioDetails.type === 'Employer' && user.userBioDetails.userTypeId === 2 && user.userBioDetails.status === 'Active';
            case 'pendingEmployers':
              return user.userBioDetails.type === 'Employer' && user.userBioDetails.userTypeId === 2 && user.userBioDetails.status === 'InReview';
            default:
              return false;
          }
        });

        if (activeTab === "professionals") {
          filteredUsers.forEach((user: Professional) => {
            user.userBioDetails.institution = user.userBioDetails.institution
            user.userBioDetails.qualification = user.userBioDetails.qualification
            user.userBioDetails.courseOfStudy = user.userBioDetails.courseOfStudy
            user.userBioDetails.nyscStateCode = user.userBioDetails.nyscStateCode
            user.userBioDetails.nyscStartDate = user.userBioDetails.nyscStartDate
            user.userBioDetails.nyscEndDate = user.userBioDetails.nyscEndDate
          })
        }

        if (activeTab === "employers" || activeTab === 'pendingEmployers') {
          filteredUsers.forEach((user: Employer) => {
            user.userBioDetails.companyUrl = user.userBioDetails.companyUrl
            user.userBioDetails.location = user.userBioDetails.location
            user.userBioDetails.businessAddress = user.userBioDetails.businessAddress
            user.userBioDetails.contactPersonName = user.userBioDetails.contactPersonName
            user.userBioDetails.contactPersonPosition = user.userBioDetails.contactPersonPosition
            user.userBioDetails.contactPersonPhoneNumber = user.userBioDetails.contactPersonPhoneNumber
            user.userBioDetails.socialMediaLink = user.userBioDetails.socialMediaLink
            user.userBioDetails.industry = user.userBioDetails.industry
          })
        }

        setUsers(filteredUsers);
        console.log(users)
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


  const handleStatusToggle = async (user: User, newStatusId: number, action: "approve" | "reject" | "revoke") => {
    if (action === "reject" || action === "revoke") {
      setSelectedUser(user)
      setSelectedAction(action)
      setRejectionDialogOpen(true)
    } else {
      let statusId = newStatusId
      if (activeTab === "professionals") {
        statusId = action === "approve" ? 1 : 3
      }
      await updateUserStatus(user, newStatusId, action)
    }
  };



  const updateUserStatus = async (user: User, newStatusId: number, action: 'approve' | 'reject' | 'revoke', reason?: string ) => {
    try {
      let endpoint;
      let status: "a" | "d" | "p";
      switch (action) {
        case 'approve':
          status = "a"
          break
        case "reject":
        case "revoke":
          status = "d"
          break
        default:
          throw new Error("Invalid status")
      }

      const payload: any = {
        // statusId: newStatusId,
        action: status,
      }

      if (activeTab === 'subAdmins') {
        toast.info('Admin status cannot be changed.')
        return;
      }
      else if (activeTab === 'pendingEmployers' || activeTab === 'employers') {
        endpoint = apiEndpoints.APPROVE_EMPLOYER_USER;
        payload.businessId = user.userBusinessDetails.id;
        if (reason) {
          payload.reason = reason;
        }
      }
      else if (activeTab === 'professionals') {
        endpoint = apiEndpoints.MANAGE_PROF_EMP_USER
        payload.userId = user.userBioDetails.userId;
        payload.statusId = newStatusId
        payload.isActive = action === 'approve'
        payload.action = 'edit'
        if (reason) {
          payload.reason = reason;
        }
      }

      const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.statusCode === "200" || response.status === 'success') {
        await fetchUsers();
        toast.success('User status updated successfully');
      }
      else {
        throw new Error('Failed to update user status');
      }
    }
    catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  }



  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Suspended", label: "Suspended" },
    { value: "InReview", label: "In Review" },
    { value: "Rejected", label: "Rejected" },
    { value: "Closed", label: "Closed" },
  ]

  const getStatusLabel = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "Approved"
      case 2:
        return "InReview"
      case 3:
        return "Rejected"
      case 4:
        return "Closed"
      default:
        return "Unknown"
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-200 text-green-700"
      case "InReview":
        return "bg-yellow-200 text-yellow-700"
      case "Rejected":
        return "bg-red-200 text-red-700"
      case "Closed":
        return "bg-gray-200 text-gray-700"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }



  const handleRejectionReasonSubmit = (reason: string) => {
    if (selectedUser && selectedAction) {
      updateUserStatus(selectedUser, 3, selectedAction, reason)
      setRejectionDialogOpen(false)
      setSelectedUser(null)
      setSelectedAction(null)
    }
    
  }



  type userStatus = "Active" | "Suspended" | "InReview" | "Rejected" | "Closed"


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
    ...(activeTab === "professionals"
      ? [
          columnHelper.accessor('userBioDetails.gender', {
            header: 'Gender',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor('userBioDetails.dateOfBirth', {
            header: 'Date of birth',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.nyscStateCode", {
            header: "NYSC State Code",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.nyscStartDate", {
            header: "NYSC Start Date",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.nyscEndDate", {
            header: "NYSC End Date",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.courseOfStudy", {
            header: "Course of Study",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.institution", {
            header: "Institution",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor('userBioDetails.businessName', {
            header: 'Business Name',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor('userBioDetails.businessPhone', {
            header: 'Business Phone Number',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor('userBioDetails.grade', {
            header: 'Grade',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.businessSector", {
            header: "Industry",
            cell: (info) => info.getValue(),
          }),
          
        ]
    : []),
    ...(activeTab === "employers" || activeTab === 'pendingEmployers'
      ? [
          columnHelper.accessor('userBioDetails.businessName', {
            header: 'Business Name',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor('userBioDetails.businessPhone', {
            header: 'Business Phone Number',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.businessAddress", {
            header: "Business Address",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.companyUrl", {
            header: "Company Website",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.location", {
            header: "Location",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.contactPersonName", {
            header: "Contact Person",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.contactPersonPosition", {
            header: "Contact Position",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.contactPersonPhoneNumber", {
            header: "Contact Phone",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.socialMediaLink", {
            header: "Social Media",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.industry", {
            header: "Industry",
            cell: (info) => info.getValue(),
          }),
        ]
    : []),
    columnHelper.accessor('userBioDetails.status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as unknown as userStatus
        return (
          <span
            className={`px-2 py-1.5 text-center items-center rounded-full ${getStatusColor(statusOptions.find((option) => option.value === status)?.label || "")}`}
          >
            {statusOptions.find((option) => option.value === status)?.label}
          </span>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {activeTab !== 'subAdmins' && (
            <SelectMenu
              options={
                activeTab === "pendingEmployers"
                ? [
                    { label: "Approve", onClick: () => handleStatusToggle(row.original, 1, 'approve'), value: 1, icon: <RecommendOutlinedIcon />, variant: 'black' },
                    { label: "Reject", onClick: () => handleStatusToggle(row.original, 3, 'reject'), value: 3, icon: <ThumbDownOutlinedIcon />, variant: 'red' },
                    { label: "View", onClick: () => navigate(`/admin/user-management/${activeTab}-view/${row.original.userBioDetails.email}`, { state: { user: row.original }, }), icon: <PreviewOutlinedIcon />, variant: 'black' },
                    { label: "Edit", onClick: () => navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`, { state: { user: row.original }, }), icon: <CreateOutlinedIcon />, variant: 'tertiary' },
                  ]
                : activeTab === "professionals"
                ? [
                    // {
                    //   label: row.original.userBioDetails.status === "Active" ? "Deactivate" : "Activate",
                    //   onClick: () =>
                    //     handleStatusToggle(
                    //       row.original,
                    //       row.original.userBioDetails.status === "Active" ? 3 : 1,
                    //       row.original.userBioDetails.status === "Active" ? "revoke" : "approve",
                    //     ),
                    //   value: row.original.userBioDetails.status === "Active" ? 3 : 1,
                    //   icon:
                    //     row.original.userBioDetails.status === "Active" ? (
                    //       <ThumbDownOutlinedIcon />
                    //     ) : (
                    //       <RecommendOutlinedIcon />
                    //     ),
                    //   variant: row.original.userBioDetails.status === "Active" ? "red" : "success",
                    // },
                    {
                      label: "View",
                      onClick: () =>
                        navigate(`/admin/user-management/${activeTab}-view/${row.original.userBioDetails.email}`, {
                          state: { user: row.original },
                        }),
                      icon: <PreviewOutlinedIcon />,
                      variant: "black",
                    },
                    {
                      label: "Edit",
                      onClick: () =>
                        navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`, {
                          state: { user: row.original },
                        }),
                      icon: <CreateOutlinedIcon />,
                      variant: "tertiary",
                    },
                  ]
                : [
                { label: "Approve", onClick: () => handleStatusToggle(row.original, 1, 'approve'), value: 1, icon: <RecommendOutlinedIcon />, variant: 'success' },
                { label: "Revoke", onClick: () => handleStatusToggle(row.original, 3, 'revoke'), value: 3, icon: <ThumbDownOutlinedIcon />, variant: 'red' },
                { label: "View", onClick: () => navigate(`/admin/user-management/${activeTab}-view/${row.original.userBioDetails.email}`, { state: { user: row.original }, }), icon: <PreviewOutlinedIcon />, variant: 'black' },
                { label: "Edit", onClick: () => navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`, { state: { user: row.original }, }), icon: <CreateOutlinedIcon />, variant: 'tertiary' },
              ]}
            />
          )}
        </div>
      ),
    }),
  ];


  const closeModal = () => setOpenModal(null);

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-3">
        {activeTab && activeTab !== 'pendingEmployers' && (
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
          {['subAdmins', 'professionals', 'employers', 'pendingEmployers'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                  : 'text-blue-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab === "pendingEmployers" ? "Pending Employers" : tab.charAt(0).toUpperCase() + tab.slice(1)}
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
          tableHeading={`All ${activeTab === "pendingEmployers" ? "Pending Employers" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        />
      </div>

      <Modal open={openModal === 'userManagement'} onClose={closeModal}>
        <>
          <UserModal onClose={closeModal} />
        </>
      </Modal>

      <RejectionDialog open={rejectionDialogOpen} onClose={() => setRejectionDialogOpen(false)} onSubmit={handleRejectionReasonSubmit}
      />
    </div>
  );
};

export default UserManagement;