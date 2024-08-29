import React, { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Button, Table } from '@video-cv/ui-components';

type Vacancy = {
  id: number;
  title: string;
  startDate: string;
  location: string;
  employerName: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Rejected';
  jobUrl: string;
  actions: 'actions';
};

const columnHelper = createColumnHelper<Vacancy>();

const generateSampleVacancies = (type: 'active' | 'pending') => {
  if (type === 'active') {
    return [
      {
        id: 1,
        title: 'Software Engineer',
        startDate: '2024-09-01',
        location: 'San Francisco, CA',
        employerName: 'TechCorp Inc.',
        status: 'Active',
        jobUrl: 'https://techcorp.com/jobs/123',
      },
      {
        id: 2,
        title: 'Product Manager',
        startDate: '2024-08-15',
        location: 'New York, NY',
        employerName: 'BizSolutions',
        status: 'Expired',
        jobUrl: 'https://bizsolutions.com/jobs/456',
      },
    ];
  } else {
    return [
      {
        id: 3,
        title: 'Graphic Designer',
        startDate: '2024-07-20',
        location: 'Los Angeles, CA',
        employerName: 'CreativeWorks',
        status: 'Pending',
        jobUrl: 'https://creativeworks.com/jobs/789',
      },
      {
        id: 4,
        title: 'Marketing Specialist',
        startDate: '2024-06-10',
        location: 'Chicago, IL',
        employerName: 'MarketLeads',
        status: 'Rejected',
        jobUrl: 'https://marketleads.com/jobs/1011',
      },
    ];
  }
};

const JobManagement = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'pending'>('active');

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('employerName', {
      header: 'Employer/Organization Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
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
    columnHelper.accessor('jobUrl', {
      header: 'Job URL',
      cell: (info) => (
        <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
          {info.getValue()}
        </a>
      ),
    }),
    columnHelper.accessor('actions', {
      header: 'Actions',
      cell: ({ row: { original } }) => {
        const handleEdit = () => {
          // Handle edit action
          console.log(`Editing vacancy ID: ${original.id}`);
        };

        const handleManage = () => {
          // Handle manage action
          console.log(`Managing vacancy ID: ${original.id}`);
        };

        return (
          <div className="flex gap-2">
            <Button variant="success" label="Edit" onClick={handleEdit} />
            <Button variant="blue" label="Manage" onClick={handleManage} />
          </div>
        );
      },
    }),
  ];

  const data = generateSampleVacancies(activeTab);

  const handleAddVacancy = () => {
    // Handle the "Add Vacancy" action
    console.log('Adding a new vacancy...');
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
    </div>
  );
};

export default JobManagement;




























// import React, { useState } from 'react';
// import { Grid, Typography, Container } from '@mui/material';
// import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // import styles
// import { Input, Button } from '@video-cv/ui-components';
// import { toast } from 'react-toastify';

// const JobManagement = () => {
//   const [jobTitle, setJobTitle] = useState('');
//   const [companyImage, setCompanyImage] = useState(null);
//   const [companyName, setCompanyName] = useState('');
//   const [companyLocation, setCompanyLocation] = useState('');
//   const [jobDetails, setJobDetails] = useState('');
//   const [qualifications, setQualifications] = useState('');
//   const [keyResponsibilities, setKeyResponsibilities] = useState('');
//   const [companyEmail, setCompanyEmail] = useState('');
//   const [applyLink, setApplyLink] = useState('');

//   const handleImageUpload = (event: any) => {
//     setCompanyImage(event.target.files[0]);
//   };

//   const handleSubmit = () => {
//     // Handle the submission of form data
//     console.log({
//       jobTitle,
//       companyImage,
//       companyName,
//       companyLocation,
//       jobDetails,
//       qualifications,
//       keyResponsibilities,
//       companyEmail,
//       applyLink,
//     });

//     toast.success('Job posted successfully!');
//   };

//   return (
//     <Container maxWidth="md" className='py-3'>
//       <Typography variant="h4" gutterBottom>
//         Content Management
//       </Typography>
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <Input
//             className='rounded-xl'
//             label="Job Title"
//             value={jobTitle}
//             onChange={(e) => setJobTitle(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Button
//             variant="black"
//             label='Upload Company Image'
//             icon={<CloudUploadIcon />}
//           >
//             Upload Company Image
//             <input
//               type="file"
//               hidden
//               onChange={handleImageUpload}
//             />
//           </Button>
//           {companyImage && <Typography></Typography>}
//         </Grid>
//         <Grid item xs={12}>
//           <Input
//             className='rounded-xl'
//             label="Company Name"
//             value={companyName}
//             onChange={(e) => setCompanyName(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Input
//             className='rounded-xl'
//             label="Company Location"
//             value={companyLocation}
//             onChange={(e) => setCompanyLocation(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Typography variant="h6">Job Details</Typography>
//           <ReactQuill className='custom-quill' value={jobDetails} onChange={setJobDetails} />
//         </Grid>
//         <Grid item xs={12}>
//           <Typography variant="h6">Qualifications</Typography>
//           <ReactQuill className='custom-quill' value={qualifications} onChange={setQualifications} />
//         </Grid>
//         <Grid item xs={12}>
//           <Typography variant="h6">Key Responsibilities</Typography>
//           <ReactQuill className='custom-quill' value={keyResponsibilities} onChange={setKeyResponsibilities} />
//         </Grid>
//         <Grid item xs={12}>
//           <Input
//             className='rounded-xl'
//             label="Company Email"
//             value={companyEmail}
//             onChange={(e) => setCompanyEmail(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Input
//             className='rounded-xl'
//             label="Link to Apply"
//             value={applyLink}
//             onChange={(e) => setApplyLink(e.target.value)}
//           />
//         </Grid>
//         <Grid item xs={12}>
//           <Button variant="black" label='Submit' color="primary" onClick={handleSubmit}></Button>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default JobManagement;
