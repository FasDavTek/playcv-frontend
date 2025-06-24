import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from '@mui/material';
import { Button, RejectionDialog, SelectMenu, Table, useToast } from '@video-cv/ui-components';
import { useNavigate } from 'react-router-dom';

import { createColumnHelper } from '@tanstack/react-table';
import { UserModal } from './modals';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import RecommendOutlinedIcon from '@mui/icons-material/RecommendOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { useQuery } from 'react-query';
import { handleDate } from '@video-cv/utils';
import Filter, { FilterConfig } from './../../../../../libs/ui-components/Filter';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(1);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const { showToast } = useToast();
  
  const navigate = useNavigate();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
  const userId = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID);



  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {

      const queryParams = new URLSearchParams({
        Page: currentPage.toString(),
        Limit: pageSize.toString(),
        ...filters,
      })

      switch (activeTab) {
        case "subAdmins":
          queryParams.append("UserTypeId", "1")
          break
        case "professionals":
          queryParams.append("UserTypeId", "3")
          break
        case "employers":
          queryParams.append("UserTypeId", "2")
          break
        case "pendingEmployers":
          queryParams.append("UserTypeId", "2")
          queryParams.append("StatusId", "2")
          break
      }

      console.log("Query Params:", queryParams.toString());
      
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USERS}?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });


      if (resp.succeeded === true) {
        const data = await resp.data;

        const userCount = resp.totalRecords > 0 ? resp.totalRecords : totalRecords;

        setUsers(data);
        setTotalRecords(userCount);

        // setUsers(filteredUsers);
      }
    }
    catch (err) {
      if(!token) {
        showToast('Your session has expired. Please log in again', 'error');
        navigate('/');
      }
    }
    finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, currentPage, pageSize, filters, totalRecords]);



  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, filters]);



  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, [fetchUsers]);


  const clearFilters = () => {
    setFilters({});
  };


  const handleTabChange = (tab: "subAdmins" | "professionals" | "employers" | "pendingEmployers") => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }


  const handleStatusToggle = async (user: User, newStatusId: number, action: "approve" | "reject" | "revoke" | 'delete' | 'deactivate' | 'activate' | 'reapprove') => {
    if (action === "reject") {
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



  const updateUserStatus = async (user: User, newStatusId: number, action: 'approve' | 'reject' | 'revoke' | 'delete' | 'deactivate' | 'activate' | 'reapprove', reason?: string ) => {
    try {
      let endpoint;
      let status: "a" | "d" | "r" | 'delete' | 'activate' | 'reapprove';
      switch (action) {
        case 'approve':
          status = "a"
          break
        case "reject":
          status = 'd'
          break
        case "delete":
          status = 'delete';
          break
        case "deactivate":
          status = "d"
          break
        case "activate":
          status = 'activate';
          break
        case "reapprove":
          status = "reapprove"
          break
        default:
          throw new Error("Invalid status")
      }

      const payload: any = {
        // statusId: newStatusId,
        action: status,
      }

      if (activeTab === 'subAdmins') {
        endpoint = apiEndpoints.MANAGE_PROF_EMP_USER
        payload.userId = user.userBioDetails.userId;
        payload.statusId = newStatusId;
        payload.action = status;
        if (reason) {
          payload.reason = reason;
        }
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
        payload.action = status
        if (reason) {
          payload.reason = reason;
        }
      }

      const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.statusCode === "200" || response.status === 'success') {
        await fetchUsers();
        showToast(`${response.message}`, 'success');
      }
      else {
        showToast(`${response.message}`, 'error');
      }
    }
    catch (error: any) {
      showToast(`${error.message}`, 'error');
    }
  }



  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "SUSPENDED", label: "Suspended" },
    { value: "INREVIEW", label: "In Review" },
    { value: "REJECTED", label: "Rejected" },
    { value: "CLOSED", label: "Closed" },
    { value: "INACTIVE", label: "Inactive" },
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
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-200 text-green-700"
      case "INREVIEW":
        return "bg-yellow-200 text-yellow-700"
      case "INACTIVE":
        return "bg-yellow-200 text-yellow-700";
      case "REJECTED":
        return "bg-red-200 text-red-700"
      case "CLOSED":
      case "SUSPENDED":
        return "bg-red-200 text-white"
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
  };



  const handleDownloadCSV = useCallback(async () => {
    const queryParams = new URLSearchParams({
      ...filters,
      download: 'true',
    }).toString();

    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USERS}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response;

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error("No data available to download");
      }
  
      // Convert JSON to CSV
      const csvContent = convertJsonToCsv(result.data);
  
      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showToast('Error downloading CSV', 'error');
    }
  }, [filters]);



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



  type userStatus = "Active" | "Suspended" | "InReview" | "Rejected" | "Closed"


  const userFilterConfig: FilterConfig[] = [
    {
      id: "search",
      label: "Search",
      type: "text",
    },
    {
      id: "email",
      label: "Email",
      type: "text",
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      type: "text",
    },
    {
      id: "businessName",
      label: "Business name",
      type: "text",
    },
  ];


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
            cell: (info) => handleDate(info.getValue()),
          }),
          columnHelper.accessor('userProfDetails.classOfDegree', {
            header: 'Grade',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userProfDetails.nyscStateCode", {
            header: "NYSC State Code",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userProfDetails.nyscStartYear", {
            header: "NYSC Start Date",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userProfDetails.nyscEndYear", {
            header: "NYSC End Date",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userProfDetails.course", {
            header: "Course of Study",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userProfDetails.institution", {
            header: "Institution",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor('userProfDetails.businessName', {
            header: 'Business Name',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor('userProfDetails.businessPhone', {
            header: 'Business Phone Number',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userProfDetails.industry", {
            header: "Business Sector",
            cell: (info) => info.getValue(),
          }),
          
        ]
    : []),
    ...(activeTab === "employers" || activeTab === 'pendingEmployers'
      ? [
          columnHelper.accessor('userBusinessDetails.businessName', {
            header: 'Business Name',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor('userBusinessDetails.businessPhone', {
            header: 'Business Phone Number',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBusinessDetails.address", {
            header: "Business Address",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor('userBusinessDetails.businessEmail', {
            header: 'Business Email',
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBusinessDetails.websiteUrl", {
            header: "Business Website",
            cell: (info) => (
              <a href={info.getValue()} target="_blank" rel="noopener noreferrer" className="hover:cursor-pointer">
                {info.getValue()}
              </a>
            ),
          }),
          columnHelper.accessor("userBusinessDetails.industry", {
            header: "Business Sector",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBusinessDetails.contactName", {
            header: "Contact Person",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBusinessDetails.contactPosition", {
            header: "Contact Position",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBusinessDetails.contactPhone", {
            header: "Contact Phone",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("userBusinessDetails.fbLink", {
            header: "Facebook Link",
            cell: (info) => (
              <a href={info.getValue()} target="_blank" rel="noopener noreferrer" className="hover:cursor-pointer">
                {info.getValue()}
              </a>
            ),
          }),
          columnHelper.accessor("userBusinessDetails.twitter", {
            header: "Twitter Link",
            cell: (info) => (
              <a href={info.getValue()} target="_blank" rel="noopener noreferrer" className="hover:cursor-pointer">
                {info.getValue()}
              </a>
            ),
          }),
          columnHelper.accessor("userBusinessDetails.instagramUrl", {
            header: "Instagram Link",
            cell: (info) => (
              <a href={info.getValue()} target="_blank" rel="noopener noreferrer" className="hover:cursor-pointer">
                {info.getValue()}
              </a>
            ),
          }),
        ]
    : []),
    columnHelper.accessor('userBioDetails.status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as string;

        const statusOption = statusOptions.find(
          (option) => option.value === status.toUpperCase()
        );

        return (
          <span
            className={`px-2 py-1.5 text-center items-center rounded-full ${getStatusColor(status)}`}
          >
            {statusOption?.label || status}
          </span>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const userStatus = row.original.userBioDetails.status?.toUpperCase();
        const isActive = row.original.userBioDetails.isActive;
        const options = []
        // options.push(
        //   { label: "Deactivate", onClick: () => handleStatusToggle(row.original, 8, 'deactivate'), value: 8, icon: <BlockOutlinedIcon sx={{ fontSize: 'medium' }} /> },
        //   { label: "Delete", onClick: () => handleStatusToggle(row.original, 8, 'delete'), value: 8, icon: <DeleteOutlinedIcon sx={{ fontSize: 'medium' }} /> },
        //   { label: "View", onClick: () => navigate(`/admin/user-management/${activeTab}-view/${row.original.userBioDetails.email}`), icon: <PreviewOutlinedIcon sx={{ fontSize: 'medium' }} /> },
        // )
        // if (activeTab === 'pendingEmployers' || userStatus === 'InReview') {
        //   options.unshift(
        //     { label: "Approve", onClick: () => handleStatusToggle(row.original, 1, 'approve'), value: 1, icon: <RecommendOutlinedIcon sx={{ fontSize: 'medium' }} /> },
        //     { label: "Disapprove", onClick: () => handleStatusToggle(row.original, 3, 'reject'), value: 3, icon: <ThumbDownOutlinedIcon sx={{ fontSize: 'medium' }} /> },
        //   )
        // }
        // else if (userStatus === 'Rejected') {
        //   options.unshift(
        //     { label: "Approve", onClick: () => handleStatusToggle(row.original, 1, 'approve'), value: 1, icon: <RecommendOutlinedIcon sx={{ fontSize: 'medium' }} /> },
        //   )
        // }
        // else if (activeTab === 'employers' || activeTab === 'professionals') {
        //   options.push(
        //     { label: "Edit", onClick: () => navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`), icon: <CreateOutlinedIcon sx={{ fontSize: 'medium' }} /> },
        //   )
        // }
        // return (
        //   <div className="flex gap-2">
        //     <SelectMenu options={options} buttonVariant="text" />
        //   </div>
        // )

        options.push({ label: "View",  onClick: () => navigate(`/admin/user-management/${activeTab}-view/${row.original.userBioDetails.email}`),  icon: <PreviewOutlinedIcon sx={{ fontSize: 'medium' }} /> });

        // Employer-specific actions
        if (activeTab === 'pendingEmployers' || activeTab === 'employers') {
          if (userStatus === 'INREVIEW' || userStatus === 'INACTIVE') {
            options.unshift(
              {  label: "Approve", onClick: () => handleStatusToggle(row.original, 1, 'approve'), value: 1,  icon: <RecommendOutlinedIcon sx={{ fontSize: 'medium' }} /> },
              {  label: "Disapprove", onClick: () => handleStatusToggle(row.original, 3, 'reject'), value: 3,  icon: <ThumbDownOutlinedIcon sx={{ fontSize: 'medium' }} /> }
            );
          } 
          // For approved employers - show activate/deactivate based on current status
          else if (userStatus === 'ACTIVE') {
            if (isActive) {
              options.unshift({ label: "Deactivate", onClick: () => handleStatusToggle(row.original, 8, 'deactivate'), value: 8, icon: <BlockOutlinedIcon sx={{ fontSize: 'medium' }} />});
            } else {
              options.unshift({ label: "Activate", onClick: () => handleStatusToggle(row.original, 1, 'approve'), value: 1, icon: <RecommendOutlinedIcon sx={{ fontSize: 'medium' }} />});
            }
          }
          // For rejected employers - show re-approve option
          else if (userStatus === 'REJECTED') {
            options.unshift({ label: "Re-Approve", onClick: () => handleStatusToggle(row.original, 1, 'reapprove'), value: 1, icon: <RecommendOutlinedIcon sx={{ fontSize: 'medium' }} />});
          }
          
          // Delete option for all employer statuses
          options.push({ label: "Delete", onClick: () => handleStatusToggle(row.original, 8, 'delete'), value: 8, icon: <DeleteOutlinedIcon sx={{ fontSize: 'medium' }} />});
        }

        else if (activeTab === 'subAdmins') {
          options.unshift(
            { label: "Delete", onClick: () => handleStatusToggle(row.original, 8, 'delete'), value: 8, icon: <DeleteOutlinedIcon sx={{ fontSize: 'medium' }} /> },
            { label: "Edit",  onClick: () => navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`),  icon: <CreateOutlinedIcon sx={{ fontSize: 'medium' }} /> }
          );
          if (isActive) {
            options.unshift({ label: "Deactivate", onClick: () => handleStatusToggle(row.original, 8, 'deactivate'), value: 8, icon: <BlockOutlinedIcon sx={{ fontSize: 'medium' }} />});
          }
        }
        // Professionals and subadmins keep their existing actions
        else {
          if (activeTab === 'professionals') {
            options.unshift(
              { label: "Delete", onClick: () => handleStatusToggle(row.original, 8, 'delete'), value: 8, icon: <DeleteOutlinedIcon sx={{ fontSize: 'medium' }} /> },
              { label: "Edit",  onClick: () => navigate(`/admin/user-management/edit/${activeTab}/${row.original.userBioDetails.email}`),  icon: <CreateOutlinedIcon sx={{ fontSize: 'medium' }} /> }
            );
            if (isActive) {
              options.unshift({ label: "Deactivate", onClick: () => handleStatusToggle(row.original, 8, 'deactivate'), value: 8, icon: <BlockOutlinedIcon sx={{ fontSize: 'medium' }} />});
            }
            // else {
            //   options.unshift({ label: "Activate", onClick: () => handleStatusToggle(row.original, 1, 'approve'), value: 1, icon: <RecommendOutlinedIcon sx={{ fontSize: 'medium' }} />});
            // }
          }
          
          if (userStatus === 'INACTIVE') {
            options.unshift(
              {  label: "Approve", onClick: () => handleStatusToggle(row.original, 1, 'approve'), value: 1, icon: <RecommendOutlinedIcon sx={{ fontSize: 'medium' }} /> },
              {  label: "Disapprove", onClick: () => handleStatusToggle(row.original, 3, 'reject'), value: 3, icon: <ThumbDownOutlinedIcon sx={{ fontSize: 'medium' }} /> }
            );
          }
        }

        return (
          <div className="flex gap-2">
            <SelectMenu options={options} buttonVariant="text" />
          </div>
        );
      },
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
              className={`py-2 px-4 text-xs md:text-sm font-medium ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                  : 'text-blue-600 hover:text-blue-600'
              }`}
              onClick={() => handleTabChange(tab as typeof activeTab)}
            >
              {tab === "pendingEmployers" ? "Pending Employers" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          
        </div>
      </div>

      <div className=" mt-5 border border-neutral-100 rounded-2xl py-4">
        {userFilterConfig.length > 0 && (
          <Filter config={userFilterConfig} onFilterChange={handleFilterChange} filters={filters} />
        )}
      </div>

      <Table
        loading={loading}
        columns={columns}
        data={users}
        search={setSearch}
        filter={filter}
        filterConfig={userFilterConfig}
        onFilterChange={handleFilterChange}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        tableHeading={`All ${activeTab === "pendingEmployers" ? "Pending Employers" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        totalRecords={totalRecords}
        onDownloadCSV={handleDownloadCSV}
      />

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