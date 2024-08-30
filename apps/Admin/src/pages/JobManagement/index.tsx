import React, { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Button, Table } from '@video-cv/ui-components';
import { useNavigate } from 'react-router-dom';
import JobStatusModal from './modal/jobStatusModal';

type Vacancy = {
  id: number;
  title: string;
  startDate: string;
  location: string;
  employerName: string;
  companyImage: string;
  jobDetails: string;
  qualifications: string;
  keyResponsibilities: string;
  companyEmail: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Rejected';
  jobUrl: string;
  actions: 'actions';
};

const columnHelper = createColumnHelper<Vacancy>();

const generateSampleVacancies = (type: 'active' | 'pending') => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short', // You can use 'long' for full month names
      year: 'numeric',
    });
  };

  if (type === 'active') {
    return [
      {
        id: 1,
        title: 'Software Engineer',
        startDate: formatDate('2024-09-01'),
        location: 'San Francisco, CA',
        employerName: 'TechCorp Inc.',
        companyImage: '/images/techcorp.png',
        jobDetails: 'Developing and maintaining software applications.',
        qualifications: 'BSc in Computer Science or related field.',
        keyResponsibilities: 'Writing clean, scalable code.',
        companyEmail: 'hr@techcorp.com',
        status: 'Active',
        jobUrl: 'https://techcorp.com/jobs/123',
      },
      {
        id: 2,
        title: 'Product Manager',
        startDate: formatDate('2024-08-15'),
        location: 'New York, NY',
        employerName: 'BizSolutions',
        companyImage: '/images/bizsolutions.png',
        jobDetails: 'Overseeing product development and strategy.',
        qualifications: 'MBA or equivalent experience.',
        keyResponsibilities: 'Defining product vision and strategy.',
        companyEmail: 'contact@bizsolutions.com',
        status: 'Expired',
        jobUrl: 'https://bizsolutions.com/jobs/456',
      },
      {
        id: 3,
        title: 'Data Analyst',
        startDate: formatDate('2024-08-05'),
        location: 'Austin, TX',
        employerName: 'DataCorp',
        companyImage: '/images/datacorp.png',
        jobDetails: 'Analyzing and interpreting complex data.',
        qualifications: 'Experience with SQL and Python.',
        keyResponsibilities: 'Generating actionable insights from data.',
        companyEmail: 'jobs@datacorp.com',
        status: 'Active',
        jobUrl: 'https://datacorp.com/jobs/789',
      },
      {
        id: 4,
        title: 'HR Specialist',
        startDate: formatDate('2024-07-30'),
        location: 'Seattle, WA',
        employerName: 'HRTech',
        companyImage: '/images/hrtech.png',
        jobDetails: 'Managing recruitment and employee relations.',
        qualifications: 'Experience in HR management.',
        keyResponsibilities: 'Developing HR policies and procedures.',
        companyEmail: 'hr@hrtech.com',
        status: 'Expired',
        jobUrl: 'https://hrtech.com/jobs/1011',
      },
    ];
  } else {
    return [
      {
        id: 5,
        title: 'Graphic Designer',
        startDate: formatDate('2024-07-20'),
        location: 'Los Angeles, CA',
        employerName: 'CreativeWorks',
        companyImage: '/images/creativeworks.png',
        jobDetails: 'Designing creative assets for marketing campaigns.',
        qualifications: 'Proficiency in Adobe Creative Suite.',
        keyResponsibilities: 'Creating visual content for digital platforms.',
        companyEmail: 'design@creativeworks.com',
        status: 'Pending',
        jobUrl: 'https://creativeworks.com/jobs/789',
      },
      {
        id: 6,
        title: 'Marketing Specialist',
        startDate: formatDate('2024-06-10'),
        location: 'Chicago, IL',
        employerName: 'MarketLeads',
        companyImage: '/images/marketleads.png',
        jobDetails: 'Executing marketing strategies and campaigns.',
        qualifications: 'Experience in digital marketing.',
        keyResponsibilities: 'Developing marketing materials.',
        companyEmail: 'marketing@marketleads.com',
        status: 'Rejected',
        jobUrl: 'https://marketleads.com/jobs/1011',
      },
      {
        id: 7,
        title: 'Sales Manager',
        startDate: formatDate('2024-05-15'),
        location: 'Miami, FL',
        employerName: 'SalesCorp',
        companyImage: '/images/salescorp.png',
        jobDetails: 'Managing the sales team and driving revenue.',
        qualifications: 'Experience in sales management.',
        keyResponsibilities: 'Achieving sales targets.',
        companyEmail: 'sales@salescorp.com',
        status: 'Pending',
        jobUrl: 'https://salescorp.com/jobs/1213',
      },
      {
        id: 8,
        title: 'Operations Manager',
        startDate: formatDate('2024-04-25'),
        location: 'Dallas, TX',
        employerName: 'OpsGlobal',
        companyImage: '/images/opsglobal.png',
        jobDetails: 'Overseeing daily operations and logistics.',
        qualifications: 'Experience in operations management.',
        keyResponsibilities: 'Streamlining operational processes.',
        companyEmail: 'ops@opsglobal.com',
        status: 'Rejected',
        jobUrl: 'https://opsglobal.com/jobs/1415',
      },
    ];
  }
};

const JobManagement = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Vacancy | null>(null);
  const navigate = useNavigate();

  const columns = [
    columnHelper.accessor('title', {
      header: 'Job Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('employerName', {
      header: 'Employer/Organization Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('companyEmail', {
      header: 'Company Email',
      cell: (info) => <a href={`mailto:${info.getValue()}`}>{info.getValue()}</a>,
    }),
    columnHelper.accessor('jobUrl', {
      header: 'Job URL',
      cell: (info) => (
        <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor('qualifications', {
      header: 'Qualifications',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('jobDetails', {
      header: 'Job Details',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('keyResponsibilities', {
      header: 'Key Responsibilities',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('startDate', {
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
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: ({ row: { original } }) => {
        const handleEdit = (job: Vacancy) => {
          navigate(`/admin/job-management/vacancy`, {
            state: { job },
          });
          console.log(`Editing vacancy ID: ${original.id}`);
        };

        const handleManage = (job: Vacancy) => {
          setSelectedJob(job);
          navigate(`/admin/job-management/manage/${original.id}`, {
            state: { job, status: job.status },
          });
          // setSelectedJob(original);
          // setModalOpen(true);
          console.log(`Managing vacancy ID: ${original.id}`);
        };

        return (
          <div className="flex gap-2">
            <Button variant="success" label="Edit" onClick={() => handleEdit(original)} />
            <Button variant="custom" label="Manage" onClick={() => handleManage(original)} />
          </div>
        );
      },
    }),
  ];

  const data = generateSampleVacancies(activeTab);

  const handleAddVacancy = () => {
    navigate('/admin/job-management/vacancy')
  };

  const handleUpdate = async (id: number, updates: { status: string }) => {
    // Implement update logic here
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
          data={data}
          columns={columns}
          tableHeading={`${
            activeTab === 'active' ? 'Active/Expired Vacancies' : 'Pending/Rejected Vacancies'
          }`}
        />
      </div>

      <JobStatusModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        job={selectedJob!}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default JobManagement;