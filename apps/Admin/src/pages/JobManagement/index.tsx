import React, { useCallback, useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Button, SelectMenu, Table, useToast } from '@video-cv/ui-components';
import { useNavigate } from 'react-router-dom';
import JobStatusModal from './modal/jobStatusModal';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import { useAllCountry } from './../../../../../libs/hooks/useAllCountries';
import { handleDate } from '@video-cv/utils';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { useAllState } from './../../../../../libs/hooks/useAllState';
import { Tooltip } from '@mui/material';
import Filter, { FilterConfig } from './../../../../../libs/ui-components/Filter';

const truncateText = (text: string, wordLimit: number) => {
  if (!text) return "";

  const strippedText = text.replace(/<[^>]*>?/gm, "")

  const words = strippedText.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return strippedText;
};

type Vacancy = {
  vId: number;
  jobTitle: string;
  startDate: string;
  endDate: string;
  location: string;
  companyName: string;
  companyImage: string;
  jobDetails: string;
  qualifications: string;
  keyResponsibilities: string;
  specialization: string;
  companyEmail: string;
  status: string;
  dateCreated: string;
  linkToApply: string;
};



const columnHelper = createColumnHelper<Vacancy>();

const JobManagement = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [jobs, setJobs] = useState<Vacancy[]>([]);
  const [selectedItem, setSelectedItem] = useState<Vacancy | null>(null);
  const [approvedJobs, setApprovedJobs] = useState<Vacancy[]>([]);
  const [pendingJobs, setPendingJobs] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(1);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [selectedJob, setSelectedJob] = useState<Vacancy | null>(null);
  const [selectedAction, setSelectedAction] = useState<"approve" | "deny" | "delete" | "deactivate" | null>(null);

  const { showToast } = useToast();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  const [tooltipOpenId, setTooltipOpenId] = useState<number | null>(null);


  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      let jobsData: Vacancy[] = [];
      let jobsCount = 0;

      if (activeTab === "active") {
          const queryParams = new URLSearchParams({
            Page: currentPage.toString(),
            Limit: pageSize.toString(),
            ...filters,
          });
  
          const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?${queryParams}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (resp.succeeded === true) {
            jobsData = resp.data;
            jobsCount = resp.totalRecords > 0 ? resp.totalRecords : totalRecords;
          }
      } else if (activeTab === "pending") {
        // Fetch only ads with status "InReview" for the Pending tab
        const queryParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: pageSize.toString(),
          Status: "Pending",
        });
  
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (resp.succeeded === true) {
          jobsData = resp.data;
          jobsCount = resp.totalRecords > 0 ? resp.totalRecords : totalRecords;
        }
      }

      const currentTime = Date.now();
      const newJobs = jobsData?.filter((job: Vacancy) => new Date(job.dateCreated).getTime() > lastFetchTime);

      if (newJobs.length > 0) {
        showToast(`${newJobs.length} new job(s) uploaded`, 'info');
      }

      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      jobsData = jobsData.slice(startIndex, endIndex);

      setJobs(jobsData);
      setTotalRecords(jobsCount)
      setLastFetchTime(currentTime);
    }
    catch (err) {
      if(!token) {
        showToast('Your session has expired. Please log in again', 'error');
        navigate('/');
      }
      else {
        showToast('Failed to fetch jobs', 'error');
      }
    }
    finally {
      setLoading(false);
    }
  }, [activeTab, token, currentPage, pageSize, totalRecords, filters]);


  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchJobs, filters]);



  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);


  const clearFilters = () => {
    setFilters({});
  };



  const handleDownloadCSV = useCallback(async () => {
    const queryParams = new URLSearchParams({
      ...filters,
      download: 'true',
    }).toString();

    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response;

      if (!result.vacancies || !Array.isArray(result.vacancies)) {
        throw new Error("No data available to download");
      }
  
      // Convert JSON to CSV
      const csvContent = convertJsonToCsv(result.vacancies);
  
      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vacancies.csv';
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



  const handleStatusToggle = async (job: Vacancy, newStatusId: number, action: 'approve' | 'deny' | 'delete' | 'deactivate', reason?: string,) => {
    if (action === "deny") {
      setSelectedJob(job)
      setSelectedAction(action);
    } else {
      let statusId = newStatusId
      await updateJobStatus(job, action)
    }
  };



  const updateJobStatus = async (job: Vacancy, action: 'approve' | 'deny' | 'delete' | 'deactivate', reason?: string ) => {
    try {
      let status: "a" | "d" | 'delete' | 'deactivate' | "p";
      let successMessage: string;

      switch (action) {
        case 'delete':
          status = 'delete';
          break
        case 'deactivate':
          status = 'deactivate';
          break
        default:
          throw new Error("Invalid status")
      }

      const payload: any = {
        action: status,
        vacancyId: job.vId
      }

      if (reason) {
        payload.reasonForRejection = reason
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_JOBS}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchJobs();
      showToast(`${response.message}`,'success');
    }
    catch (err: any) {
      showToast(`Failed to update ad status: ${err.message}`, 'error');
    }
  }



  const handleView = async (item: Vacancy) => {
    setSelectedItem(item);
    navigate(`/admin/job-management/view/${item.vId}`)
  };


  const handleEdit = async (item: Vacancy) => {
    setSelectedItem(item);
    navigate(`/admin/job-management/vacancy/${item.vId}`)
  };


  const vacancyFilterConfig: FilterConfig[] = [
    {
      id: "jobTitle",
      label: "Job Title",
      type: "text",
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        { label: "Approved", value: "approved" },
        { label: "Pending", value: "pending" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    {
      id: "startDate",
      label: "Start Date",
      type: "date",
    },
    {
      id: "endDate",
      label: "End Date",
      type: "date",
    },
    {
      id: "datePosted",
      label: "Date Posted",
      type: "date",
    },
  ];


  const columns = [
    columnHelper.accessor('jobTitle', {
      header: 'Job Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('companyName', {
      header: 'Employer/Organization Name',
      cell: (info) => truncateText(info.getValue() as string, 10),
    }),
    columnHelper.accessor('companyEmail', {
      header: 'Company Email',
      cell: (info) => truncateText(info.getValue() as string, 10),
    }),
    columnHelper.accessor('linkToApply', {
      header: 'Job URL',
      cell: (info: any) => {
        const redirectUrl = info.getValue() as string;
        const rowId = info.row.original.vId;

        if (!redirectUrl) {
          return null;
        }
    
        const handleCopyLink = () => {
          navigator.clipboard.writeText(redirectUrl).then(() => {
            setTooltipOpenId(rowId);
            setTimeout(() => setTooltipOpenId(null), 2000);
          });
        };
    
        return (
          <Tooltip
            open={tooltipOpenId === rowId}
            title="Link copied!"
            placement="top"
            arrow
          >
            <p
              onClick={handleCopyLink}
              style={{ textTransform: 'none', color: 'blue', textDecoration: 'none', cursor: 'pointer' }}
            >
              Vacancy Link
            </p>
          </Tooltip>
        );
      },
    }),
    columnHelper.accessor('jobDetails', {
      header: 'Job Details',
      cell: (info) => truncateText(info.getValue() as string, 10),
    }),
    columnHelper.accessor('qualifications', {
      header: 'Qualifications',
      cell: (info) => truncateText(info.getValue() as string, 10),
    }),
    columnHelper.accessor('specialization', {
      header: 'Specializations',
      cell: (info) => truncateText(info.getValue() as string, 10),
    }),
    columnHelper.accessor('keyResponsibilities', {
      header: 'Key Responsibilities',
      cell: (info) => truncateText(info.getValue() as string, 10),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('dateCreated', {
      header: 'Start Date',
      cell: (info) => handleDate(info.getValue()),
    }),
    columnHelper.accessor('endDate', {
      header: 'End Date',
      cell: (info) => handleDate(info.getValue()),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const status = info.getValue();
        let bgColor = '';
        let textColor = '';

        switch (status) {
          case 'Active':
            bgColor = 'bg-green-200';
            textColor = 'text-green-700';
            break;
          case 'Expired':
            bgColor = 'bg-orange-200';
            textColor = 'text-orange-700';
            break;
          case 'Pending':
            bgColor = 'bg-yellow-200';
            textColor = 'text-yellow-700';
            break;
          case 'Rejected':
            bgColor = 'bg-red-200';
            textColor = 'text-red-700';
            break;
          default:
            bgColor = 'bg-gray-200';
            textColor = 'text-gray-700';
            break;
        }

        return (
          <span className={`px-2 py-1.5 rounded-full text-center ${bgColor} ${textColor}`}>
            {status}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {/* <Button variant="custom" label="View" onClick={() => handleView(row.original)} />
          <Button variant="success" label="Edit" onClick={() => handleEdit(row.original)} />
          {row.original.status && (
            <Button variant={row.original.status === 'Active' ? 'red' : 'success'} label={row.original.status === 'Active' ? 'Deactivate' : 'Activate'} />
          )} */}
          <SelectMenu
            options={[
              { label: "Delete", onClick: () => handleStatusToggle(row.original, 9, 'delete'), value: 9, icon: <DeleteOutlinedIcon sx={{ fontSize: "medium" }} />,},
              { label: "Deactivate", onClick: () => handleStatusToggle(row.original, 9, 'deactivate'), value: 9, icon: <BlockOutlinedIcon sx={{ fontSize: "medium" }} />,},
              { label: "View", onClick: () => handleView(row.original), icon: <PreviewOutlinedIcon sx={{ fontSize: 'medium' }} />, },
              { label: "Edit", onClick: () => handleEdit(row.original), icon: <CreateOutlinedIcon sx={{ fontSize: 'medium' }} />, },
            ]}
            buttonVariant="text"
          />
        </div>
      ),
    }),
  ];
  

  const handleTabChange = (tab: 'active' | 'pending') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'active') {
      return job.status === 'Active' || job.status === 'Expired';
    } else {
      return job.status === 'Pending' || job.status === 'Rejected';
    }
  });

  const handleAddVacancy = () => {
    navigate('/admin/job-management/vacancy')
  };



  const getCurrentItems = () => {
    switch (activeTab) {
      case 'active':
        return approvedJobs;
      case 'pending':
        return pendingJobs;
      default:
        return [];
    }
  };



  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
        <div className="flex p-1 overflow-auto gap-3">
          {['active', 'pending'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${
                activeTab === tab
                  ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                  : 'text-blue-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab === 'active' ? 'All Vacancies' : 'Pending Vacancies'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-end items-center mb-4">
          <Button label="Add Vacancy" variant="black" onClick={handleAddVacancy} />
        </div>
        <div className=" mt-5 mb-4 border border-neutral-100 rounded-2xl py-4">
          {vacancyFilterConfig.length > 0 && (
            <Filter config={vacancyFilterConfig} onFilterChange={handleFilterChange} filters={filters} />
          )}
        </div>
        <Table
          loading={loading}
          data={jobs}
          columns={columns}
          search={setSearch}
          filter={filter}
          filterConfig={vacancyFilterConfig}
          onFilterChange={handleFilterChange}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          tableHeading={`${
            activeTab === 'active' ? 'All Vacancies' : 'Pending Vacancies'
          }`}
          totalRecords={totalRecords}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onDownloadCSV={handleDownloadCSV}
        />
      </div>

      {/* <JobStatusModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        job={selectedJob!}
        onUpdate={handleUpdate}
      /> */}
    </div>
  );
};

export default JobManagement;