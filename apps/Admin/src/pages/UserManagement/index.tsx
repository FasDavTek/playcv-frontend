import React, { useEffect, useState } from 'react';
import { Modal } from '@mui/material';
import { Button, SelectMenu, Table } from '@video-cv/ui-components';
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
  const [activeTab, setActiveTab] = useState<'subAdmins' | 'professionals' | 'employers' | 'pendingEmployers'>('subAdmins');
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


  const handleStatusToggle = async (user: User, newStatusId: number) => {
    try {
      let endpoint;
      let status: "a" | "r" | "p";
      switch (newStatusId) {
        case 1:
          status = "a"
          break
        case 3:
          status = "r"
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
      else if (activeTab === 'pendingEmployers') {
        endpoint = apiEndpoints.APPROVE_EMPLOYER_USER;
        payload.businessId = user.userBusinessDetails.id;
      }
      else if (activeTab === 'professionals') {
        endpoint = apiEndpoints.MANAGE_PROF_EMP_USER
        payload.userId = user.userBioDetails.userId;
        payload.statusId = newStatusId
        payload.isActive = true
      }
      else if (activeTab === 'employers') {
        endpoint = apiEndpoints.APPROVE_EMPLOYER_USER
        payload.businessId = user.userBusinessDetails.id
      }

      const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.statusCode === "200" || response.status === 'success') {
        await fetchUsers();
        toast.success('User status updated successfully');
      } else {
        throw new Error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };


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
    ...(activeTab === "professionals"
      ? [
          columnHelper.accessor("userBioDetails.institution", {
            header: "Institution",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.qualification", {
            header: "Qualification",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.courseOfStudy", {
            header: "Course of Study",
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
        ]
    : []),
    ...(activeTab === "employers" || activeTab === 'pendingEmployers'
      ? [
          columnHelper.accessor("userBioDetails.companyUrl", {
            header: "Company URL",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.location", {
            header: "Location",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBioDetails.businessAddress", {
            header: "Business Address",
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
          {/* <Button 
            variant="custom" 
            label="View" 
            onClick={() => navigate(`/admin/user-management/${activeTab}-view/${row.original.userBioDetails.email}`, { state: { user: row.original } })}
          />
          <Button 
            variant='neutral' 
            label="Edit" 
            onClick={() => navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`, { state: { user: row.original } })}
          /> */}
          {/* <Button 
            variant={row.original.userBioDetails.status === "Active" ? "red" : "success"}
            label={row.original.userBioDetails.status === "Active" ? "Suspend" : "Activate"}
            onClick={() => { handleStatusToggle(row.original); console.log(row.original) }}
          /> */}
          {activeTab !== 'subAdmins' && (
            <SelectMenu
              options={
                activeTab === "pendingEmployers"
                ? [
                    { label: "Approve", onClick: () => handleStatusToggle(row.original, 1), value: 1 },
                    { label: "Reject", onClick: () => handleStatusToggle(row.original, 3), value: 3 },
                    { label: "View", onClick: () => navigate(`/admin/user-management/${activeTab}-view/${row.original.userBioDetails.email}`, { state: { user: row.original }, }), icon: <PreviewOutlinedIcon />, },
                    { label: "Edit", onClick: () => navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`, { state: { user: row.original }, }), icon: <CreateOutlinedIcon />, },
                  ]
                : [
                { label: "Approve", onClick: () => handleStatusToggle(row.original, 1), value: 1 },
                { label: "Revoke", onClick: () => handleStatusToggle(row.original.id, 3), value: 3 },
                { label: "View", onClick: () => navigate(`/admin/user-management/${activeTab}-view/${row.original.userBioDetails.email}`, { state: { user: row.original }, }), icon: <PreviewOutlinedIcon />, },
                { label: "Edit", onClick: () => navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`, { state: { user: row.original }, }), icon: <CreateOutlinedIcon />, },
              ]}
              buttonVariant="text"
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
    </div>
  );
};

export default UserManagement;











































// import React, { useEffect, useState } from 'react';
// import { Modal } from '@mui/material';
// import { Button, SelectMenu, Table } from '@video-cv/ui-components';
// import { useNavigate } from 'react-router-dom';

// import { createColumnHelper } from '@tanstack/react-table';
// import { UserModal } from './modals';
// import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
// import CONFIG from './../../../../../libs/utils/helpers/config';
// import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
// import { toast } from 'react-toastify';
// import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
// import { useQuery } from 'react-query';

// type ModalTypes = null | 'userManagement';

// type User = {
//   userId: string;
//   name: string;
//   email: string;
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   status: string;
//   [key: string]: any;
// };

// // Define the type for each data set
// type SubAdmin = User & {
//   role: string;
//   avatarUrl: string;
// };

// type Professional = User & {
//   phoneNumber: string;
//   dateOfBirth: string;
//   gender: string;
//   institution: string;
//   cvUrl: string;
//   location: string;
//   nyscStateCode: string;
//   qualification: string;
//   courseOfStudy: string;
//   nyscStartDate: string;
//   nyscEndDate: string;
//   businessName: string;
//   businessSector: string;
//   businessPhone: string;
// };

// type Employer = User & {
//   phoneNumber: string;
//   companyUrl: string;
//   location: string;
//   businessName: string;
//   businessAddress: string;
//   contactPersonName: string;
//   contactPersonPosition: string;
//   contactPersonPhoneNumber: string;
//   socialMediaLink: string;
//   industry: string;
// };

// const columnHelper = createColumnHelper<User>();

// const UserManagement = () => {
//   const [openModal, setOpenModal] = useState<ModalTypes>(null);
//   const [activeTab, setActiveTab] = useState<'subAdmins' | 'professionals' | 'employers' | 'pendingEmployers'>('subAdmins');
//   const [users, setUsers] = useState<User[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("");
//   const [globalFilter, setGlobalFilter] = useState<string>('');
//   const [loading, setLoading] = useState(true);
  
//   const navigate = useNavigate();

//   const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
//   const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);


//   useEffect(() => {
//     fetchUsers();
//   }, [activeTab, search, filter]);

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
      
//       const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USERS}?respType=${activeTab === "pendingEmployers" ? "employers" : activeTab}&Page=1&Limit=100`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });


//       if (resp.succeeded === true) {
//         const data = await resp;

//         const filteredUsers = data?.data?.filter((user: User) => {
//           switch (activeTab) {
//             case 'subAdmins':
//               return user.userBioDetails.type === 'SuperAdmin';
//             case 'professionals':
//               return user.userBioDetails.type === 'Professional';
//             case 'employers':
//               return user.userBioDetails.type === 'Employer';
//             default:
//               return false;
//           }
//         });

//         if (activeTab === "professionals") {
//           filteredUsers.forEach((user: Professional) => {
//             user.userBioDetails.institution = user.userBioDetails.institution
//             user.userBioDetails.qualification = user.userBioDetails.qualification
//             user.userBioDetails.courseOfStudy = user.userBioDetails.courseOfStudy
//             user.userBioDetails.nyscStateCode = user.userBioDetails.nyscStateCode
//             user.userBioDetails.nyscStartDate = user.userBioDetails.nyscStartDate
//             user.userBioDetails.nyscEndDate = user.userBioDetails.nyscEndDate
//           })
//         }

//         if (activeTab === "employers") {
//           filteredUsers.forEach((user: Employer) => {
//             user.userBioDetails.companyUrl = user.userBioDetails.companyUrl
//             user.userBioDetails.location = user.userBioDetails.location
//             user.userBioDetails.businessAddress = user.userBioDetails.businessAddress
//             user.userBioDetails.contactPersonName = user.userBioDetails.contactPersonName
//             user.userBioDetails.contactPersonPosition = user.userBioDetails.contactPersonPosition
//             user.userBioDetails.contactPersonPhoneNumber = user.userBioDetails.contactPersonPhoneNumber
//             user.userBioDetails.socialMediaLink = user.userBioDetails.socialMediaLink
//             user.userBioDetails.industry = user.userBioDetails.industry
//           })
//         }

//         setUsers(filteredUsers);
//       }
//     }
//     catch (err) {
//       if(!token) {
//         toast.error('Your session has expired. Please log in again');
//         navigate('/');
//       }
//     }
//     finally {
//       setLoading(false);
//     }
//   };


//   useEffect(() => {
//     fetchUsers();
//   }, [activeTab, searchQuery]);


//   const handleStatusToggle = async (user: User) => {
//     try {
//       const isActive = user.userBioDetails.status === 'Active';
//       const newStatus = isActive ? 'In review' : 'Active';
//       const statusId = isActive ? 2 : 1;

//       const isAdmin = activeTab === 'subAdmins';
//       const isProfessionalUser  = activeTab === 'professionals';
//       const isBusinessUser  = activeTab === 'employers';

//       console.log(user.userBioDetails.status);
//       console.log(newStatus);

//       console.log(user);
//       console.log(user.userBioDetails.userId);

//       const payload = Object.entries({
//         status: newStatus,
//         statusId: statusId,
//         isAdmin: isAdmin,
//         isProfessionalUser:  isProfessionalUser,
//         isBusinessUser:  isBusinessUser,
//         userId: user.userBioDetails.userId,
//         action: 'edit',
//       }).reduce((acc: { [key: string]: any }, [Key, value]) => {
//         if (value) {
//           acc[Key] = value;
//         }
//         return acc;
//       }, {});

//       console.log(payload)
      
//       const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_PROF_EMP_USER}`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.code === "01") {
//         await fetchUsers();
//         const toastMessage = isActive ? 'User  suspended' : 'User  activated';
//         toast.success(toastMessage);
//       } else {
//         throw new Error('Failed to update user status');
//       }
//     } catch (error) {
//       console.error('Error updating user status:', error);
//       toast.error('Failed to update user status');
//     }
//   };


//   const statusOptions = [
//     { value: "Active", label: "Active" },
//     { value: "Suspended", label: "Suspended" },
//     { value: "In Review", label: "In Review" },
//     { value: "Rejected", label: "Rejected" },
//     { value: "Closed", label: "Closed" },
//   ]


//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-200 text-green-700"
//       case "InReview":
//         return "bg-yellow-200 text-yellow-700"
//       case "Rejected":
//         return "bg-red-200 text-red-700"
//       case "Closed":
//         return "bg-gray-200 text-gray-700"
//       default:
//         return "bg-gray-200 text-gray-700"
//     }
//   }


//   type userStatus = "Active" | "Suspended" | "In Review" | "Rejected" | "Closed"


//   const columns = [
//     columnHelper.accessor('userBioDetails.firstName', {
//       header: 'First Name',
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.accessor('userBioDetails.middleName', {
//       header: 'Middle Name',
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.accessor('userBioDetails.lastName', {
//       header: 'Last Name',
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.accessor('userBioDetails.email', {
//       header: 'Email',
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.accessor('userBioDetails.phoneNo', {
//       header: 'Phone Number',
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.accessor('userBioDetails.businessName', {
//       header: 'Business Name',
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.accessor('userBioDetails.gender', {
//       header: 'Gender',
//       cell: (info) => info.getValue(),
//     }),
//     columnHelper.accessor('userBioDetails.dateOfBirth', {
//       header: 'Date of birth',
//       cell: (info) => info.getValue(),
//     }),
//     ...(activeTab === "professionals"
//       ? [
//           columnHelper.accessor("userBioDetails.institution", {
//             header: "Institution",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.qualification", {
//             header: "Qualification",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.courseOfStudy", {
//             header: "Course of Study",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.nyscStateCode", {
//             header: "NYSC State Code",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.nyscStartDate", {
//             header: "NYSC Start Date",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.nyscEndDate", {
//             header: "NYSC End Date",
//             cell: (info) => info.getValue(),
//           }),
//         ]
//     : []),
//     ...(activeTab === "employers"
//       ? [
//           columnHelper.accessor("userBioDetails.companyUrl", {
//             header: "Company URL",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.location", {
//             header: "Location",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.businessAddress", {
//             header: "Business Address",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.contactPersonName", {
//             header: "Contact Person",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.contactPersonPosition", {
//             header: "Contact Position",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.contactPersonPhoneNumber", {
//             header: "Contact Phone",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.socialMediaLink", {
//             header: "Social Media",
//             cell: (info) => info.getValue(),
//           }),
//           columnHelper.accessor("userBioDetails.industry", {
//             header: "Industry",
//             cell: (info) => info.getValue(),
//           }),
//         ]
//     : []),
//     columnHelper.accessor('userBioDetails.status', {
//       header: 'Status',
//       cell: (info) => {
//         const status = info.getValue() as unknown as userStatus
//         return (
//           <span
//             className={`px-2 py-1.5 text-center items-center rounded-full ${getStatusColor(statusOptions.find((option) => option.value === status)?.label || "")}`}
//           >
//             {statusOptions.find((option) => option.value === status)?.label}
//           </span>
//         )
//       },
//     }),
//     columnHelper.display({
//       id: 'actions',
//       header: 'Actions',
//       cell: ({ row }) => (
//         <div className="flex gap-2">
//           <Button 
//             variant="custom" 
//             label="View" 
//             onClick={() => navigate(`/admin/user-management/${activeTab}-view/${row.original.userBioDetails.email}`, { state: { user: row.original } })}
//           />
//           <Button 
//             variant='neutral' 
//             label="Edit" 
//             onClick={() => navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`, { state: { user: row.original } })}
//           />
//           {/* <Button 
//             variant={row.original.userBioDetails.status === "Active" ? "red" : "success"}
//             label={row.original.userBioDetails.status === "Active" ? "Suspend" : "Activate"}
//             onClick={() => { handleStatusToggle(row.original); console.log(row.original) }}
//           /> */}
//           <SelectMenu
//             options={[
//               { label: "Approve", onClick: () => handleStatusChange(row.original.id, 7), value: 7 },
//               {
//                 label: "Reject",
//                 onClick: () => handleOpenRejectDialog(row.original.id, row.original.title),
//                 value: 5,
//               },
//               { label: "Revoke", onClick: () => handleStatusChange(row.original.id, 8), value: 8 },
//               { label: "Decline", onClick: () => handleStatusChange(row.original.id, 9), value: 9 },
//             ]}
//             buttonVariant="text"
//           />
//         </div>
//       ),
//     }),
//   ];


//   const closeModal = () => setOpenModal(null);

//   return (
//     <div className="min-h-screen px-3 md:px-10 py-10">
//       <div className="flex justify-end mb-3">
//         {activeTab && (
//           <Button
//             label={`Create ${activeTab.slice(0, -1)}`}
//             variant="black"
//             // onClick={() => setOpenModal('userManagement')}
//             onClick={() => navigate(`/admin/user-management/create/${activeTab}`)}
//           />
//         )}
//         {/* Similarly, add buttons for other tabs if needed */}
//       </div>

//       <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
//         <div className="flex p-1">
//           {['subAdmins', 'professionals', 'employers'].map((tab) => (
//             <button
//               key={tab}
//               className={`py-2 px-4 text-sm font-medium ${
//                 activeTab === tab
//                   ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
//                   : 'text-blue-600 hover:text-blue-600'
//               }`}
//               onClick={() => setActiveTab(tab as typeof activeTab)}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
          
//         </div>
//       </div>

//       <div className="mt-4">
//         <Table
//           loading={loading}
//           data={users}
//           columns={columns}
//           search={setSearch}
//           filter={filter}
//           globalFilter={globalFilter}
//           setGlobalFilter={setGlobalFilter}
//           tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
//         />
//       </div>

//       <Modal open={openModal === 'userManagement'} onClose={closeModal}>
//         <>
//           <UserModal onClose={closeModal} />
//         </>
//       </Modal>
//     </div>
//   );
// };

// export default UserManagement;