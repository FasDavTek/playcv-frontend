import React, { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Button, Table } from '@video-cv/ui-components';
import { useNavigate } from 'react-router-dom';
import JobStatusModal from './modal/jobStatusModal';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { useAllCountry } from './../../../../../libs/hooks/useAllCountries';
import { useAllState } from './../../../../../libs/hooks/useAllState';

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

type Vacancy = {
  id: number;
  jobTitle: string;
  startDate: string;
  location: string;
  createdAt: string;
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
  actions: string;
};



const columnHelper = createColumnHelper<Vacancy>();

const JobManagement = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [jobs, setJobs] = useState<Vacancy[]>([]);
  const [selectedItem, setSelectedItem] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  const fetchJobs = async () => {
    try {

      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.data;
      setJobs(data);
      console.log(jobs)
      setLoading(false);

      const currentTime = Date.now();
      const newJobs = data.filter((job: Vacancy) => new Date(job.createdAt).getTime() > lastFetchTime);
      if (newJobs.length > 0) {
        toast.info(`${newJobs.length} new job(s) uploaded`);
      }
      setLastFetchTime(currentTime);
    }
    catch (err) {
      setLoading(false)
      toast.error('Failed to fetch jobs');
    }
    finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);



  const handleView = async (item: Vacancy) => {
    setSelectedItem(item);
    navigate(`/admin/job-management/view/:${item.id}`, {
      state: { item },
    })
  };


  const handleEdit = async (item: Vacancy) => {
    setSelectedItem(item);
    navigate(`/admin/job-management/vacancy`, {
      state: { item },
    }) 
  };


  const columns = [
    columnHelper.accessor('jobTitle', {
      header: 'Job Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('companyName', {
      header: 'Employer/Organization Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('companyEmail', {
      header: 'Company Email',
      cell: (info) => <a href={`mailto:${info.getValue()}`}>{info.getValue()}</a>,
    }),
    columnHelper.accessor('linkToApply', {
      header: 'Job URL',
      cell: (info) => (
        <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
          {info.getValue()}
        </a>
      ),
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
      cell: (info) => info.getValue(),
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
            bgColor = 'bg-gray-200';
            textColor = 'text-gray-700';
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
      cell: ({ row }) => {
        <div className="flex gap-2">
          <Button variant="custom" label="View" onClick={() => handleView(row.original)} />
          <Button variant="success" label="Edit" onClick={() => handleEdit(row.original)} />
          {row.original.status && (
            <Button variant={row.original.status === 'Active' ? 'red' : 'success'} label={row.original.status === 'Active' ? 'Deactivate' : 'Activate'} />
          )}
        </div>
      },
    }),
  ];


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
              {tab === 'active' ? 'Active/Expired Vacancies' : 'Pending/Rejected Vacancies'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="flex justify-end items-center mb-4">
          <Button label="Add Vacancy" variant="black" onClick={handleAddVacancy} />
        </div>
        <Table
          loading={false}
          data={jobs}
          columns={columns}
          search={setSearch}
          filter={filter}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          tableHeading={`${
            activeTab === 'active' ? 'Active/Expired Vacancies' : 'Pending/Rejected Vacancies'
          }`}
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