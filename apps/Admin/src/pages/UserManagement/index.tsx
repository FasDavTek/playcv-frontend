// import { useState } from 'react';

// import { createColumnHelper } from '@tanstack/react-table';
// import { Modal } from '@mui/material';

// import { formatDate } from '@video-cv/utils';
// import { Button, Table } from '@video-cv/ui-components';
// import { UserModal } from './modals';
// import { useNavigate } from 'react-router-dom';

// type SubAdminTableColumns = {
//   id: number;
//   userName: string;
//   userEmail: string;
//   role: string;
//   status: string;
//   action: 'action';
// };

// type ProfessionalTableColumns = {
//   id: number;
//   userName: string;
//   userEmail: string;
//   phoneNumber: string;
//   dateOfBirth: string;
//   gender: string;
//   institution: string;
//   cvUrl: string;
//   status: string;
//   action: 'action';
// };

// type EmployerTableColumns = {
//   id: number;
//   userName: string;
//   userEmail: string;
//   phoneNumber: string;
//   companyUrl: string;
//   location: string;
//   status: string;
//   action: 'action';
// };

// const generateReports = () => {
//   const roles = ['Admin', 'Sub Admin'];
//   const statuses = ['active', 'suspended'];
//   const getRandomRole = () => roles[Math.floor(Math.random() * roles.length)];
//   const getRandomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];
//   const users = [
//     { id: 1, name: 'John Doe', email: 'johndoe@example.com', role: 'Subadmin', status: 'Active', avatarUrl: 'https://via.placeholder.com/50' },
//     { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', role: 'Professional', status: 'Verified', avatarUrl: 'https://via.placeholder.com/50' },
//     { id: 3, name: 'Acme Corp', email: 'contact@acmecorp.com', role: 'Employer', status: 'Active', avatarUrl: 'https://via.placeholder.com/50' },
//     { id: 4, name: 'Alice Johnson', email: 'alicejohnson@example.com', role: 'Candidate', status: 'Pending', avatarUrl: 'https://via.placeholder.com/50' },
//     { id: 5, name: 'Global Solutions', email: 'info@globalsolutions.com', role: 'Employer', status: 'Inactive', avatarUrl: 'https://via.placeholder.com/50' }
//   ];

//   return users.map((user) => ({
//     id: user.id,
//     userName: user.name,
//     userEmail: user.email,
//     role: getRandomRole(),
//     status: getRandomStatus(),
//   }));
// };

// const generateProfessionalReports = () => {
//   const statuses = ['active', 'suspended'];
//   const getRandomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];
//   const users = [
//     { id: 1, name: 'John Doe', email: 'johndoe@example.com', phoneNumber: '123-456-7890', dateOfBirth: '1990-01-01', gender: 'Male', institution: 'Harvard University', cvUrl: 'https://example.com/cv/johndoe', status: 'Active', companyUrl: 'https://harvard.edu', location: 'Cambridge, MA' },
//     { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', phoneNumber: '234-567-8901', dateOfBirth: '1985-05-15', gender: 'Female', institution: 'Stanford University', cvUrl: 'https://example.com/cv/janesmith', status: 'Suspended', companyUrl: 'https://stanford.edu', location: 'Stanford, CA' },
//     { id: 3, name: 'Alice Wong', email: 'alicewong@example.com', phoneNumber: '345-678-9012', dateOfBirth: '1992-11-22', gender: 'Female', institution: 'MIT', cvUrl: 'https://example.com/cv/alicewong', status: 'Active', companyUrl: 'https://mit.edu', location: 'Cambridge, MA' },
//     { id: 4, name: 'Bob Jones', email: 'bobjones@example.com', phoneNumber: '456-789-0123', dateOfBirth: '1988-07-30', gender: 'Male', institution: 'Oxford University', cvUrl: 'https://example.com/cv/bobjones', status: 'Active', companyUrl: 'https://ox.ac.uk', location: 'Oxford, UK' },
//     { id: 5, name: 'Carol Lee', email: 'carollee@example.com', phoneNumber: '567-890-1234', dateOfBirth: '1995-09-09', gender: 'Female', institution: 'Yale University', cvUrl: 'https://example.com/cv/carollee', status: 'Suspended', companyUrl: 'https://yale.edu', location: 'New Haven, CT' },
//   ];

//   return users.map((user) => ({
//     id: user.id,
//     userName: user.name,
//     userEmail: user.email,
//     phoneNumber: user.phoneNumber,
//     dateOfBirth: user.dateOfBirth,
//     gender: user.gender,
//     institution: user.institution,
//     cvUrl: user.cvUrl,
//     companyUrl: user.companyUrl,
//     location: user.location,
//     status: getRandomStatus(),
//   }));
// };

// const generateEmployerReports = () => {
//   const statuses = ['active', 'suspended'];
//   const getRandomStatus = () => statuses[Math.floor(Math.random() * statuses.length)];
//   const users = [
//     { id: 1, name: 'Company One', email: 'contact@companyone.com', phoneNumber: '789-012-3456', companyUrl: 'https://companyone.com', location: 'New York, NY', status: 'Active' },
//     { id: 2, name: 'Company Two', email: 'contact@companytwo.com', phoneNumber: '890-123-4567', companyUrl: 'https://companytwo.com', location: 'San Francisco, CA', status: 'Suspended' },
//     { id: 3, name: 'Company Three', email: 'contact@companythree.com', phoneNumber: '901-234-5678', companyUrl: 'https://companythree.com', location: 'Chicago, IL', status: 'Active' },
//     { id: 4, name: 'Company Four', email: 'contact@companyfour.com', phoneNumber: '012-345-6789', companyUrl: 'https://companyfour.com', location: 'Los Angeles, CA', status: 'Active' },
//     { id: 5, name: 'Company Five', email: 'contact@companyfive.com', phoneNumber: '123-456-7890', companyUrl: 'https://companyfive.com', location: 'Austin, TX', status: 'Suspended' }
//   ];

//   return users.map((user) => ({
//     id: user.id,
//     userName: user.name,
//     userEmail: user.email,
//     phoneNumber: user.phoneNumber,
//     companyUrl: user.companyUrl,
//     location: user.location,
//     status: getRandomStatus(),
//   }));
// };

// const initialData = {
//   subAdmins: generateReports(),
//   professionals: generateProfessionalReports(),
//   employers: generateEmployerReports(),
// };

// type ModalTypes = null | 'userManagement';

// const UserManagement = () => {
//   const [activeTab, setActiveTab] = useState<'subAdmins' | 'professionals' | 'employers'>('subAdmins');
//   const [data, setData] = useState(initialData);
//   const [openModal, setOpenModal] = useState<ModalTypes>(null);
//   const [selectedUser, setSelectedUser] = useState<ProfessionalTableColumns | EmployerTableColumns | null>(null);

//   const closeModal = () => setOpenModal(null);
//   const navigate = useNavigate();

//   const commonColumns = [
//     {
//       header: 'ID',
//       accessor: 'id',
//       cell: (info: any) => info.getValue(),
//     },
//     {
//       header: 'Username',
//       accessor: 'userName',
//       cell: (info: any) => info.getValue(),
//     },
//     {
//       header: 'Email',
//       accessor: 'userEmail',
//       cell: (info: any) => info.getValue(),
//     },
//     {
//       header: 'Status',
//       accessor: 'status',
//       cell: (info: any) => (
//         <span
//           className={`px-2 py-1.5 text-center items-center rounded-full text-white ${
//             info.getValue() === 'active' ? 'bg-green-300' : 'bg-red-200 text-red-800'
//           }`}
//         >
//           {info.getValue() === 'active' ? 'Active' : 'Suspended'}
//         </span>
//       ),
//     },
//     {
//       header: 'Action',
//       accessor: 'action',
//       cell: ({ row: { original } }: any) => {
//         const handleView = () => {
//           setSelectedUser(original);
//           const viewPath = `/admin/user-management/${activeTab}-view/${original.id}`;
//           navigate(viewPath);
//           console.log(`Viewing user "${original.userName}".`);
//         };

//         const handleStatusToggle = () => {
//           const newStatus = original.status === 'active' ? 'suspended' : 'active';
//           setData((prevData: any) => ({
//             ...prevData,
//             [activeTab]: prevData[activeTab].map((user: { id: number }) =>
//               user.id === original.id ? { ...user, status: newStatus } : user
//             ),
//           }));
//           console.log(`Toggling status for user "${original.userName}".`);
//         };

//         return (
//           <div className="flex gap-2">
//             <Button variant="custom" label="View" onClick={handleView} />
//             {original.status === 'active' ? (
//               <Button variant="red" label="Suspend" onClick={handleStatusToggle} />
//             ) : (
//               <Button variant="success" label="Activate" onClick={handleStatusToggle} />
//             )}
//           </div>
//         );
//       },
//     },
//   ];

//   const professionalColumns = [
//     {
//       header: 'Phone Number',
//       accessor: 'phoneNumber',
//       cell: (info: any) => info.getValue(),
//     },
//     {
//       header: 'Date of Birth',
//       accessor: 'dateOfBirth',
//       cell: (info: any) => info.getValue(),
//     },
//     {
//       header: 'Gender',
//       accessor: 'gender',
//       cell: (info: any) => info.getValue(),
//     },
//     {
//       header: 'Institution',
//       accessor: 'institution',
//       cell: (info: any) => info.getValue(),
//     },
//     {
//       header: 'CV URL',
//       accessor: 'cvUrl',
//       cell: (info: any) => (
//         <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
//           {info.getValue()}
//         </a>
//       ),
//     },
//     ...commonColumns.slice(-2),
//   ];

//   const employerColumns = [
//     {
//       header: 'Phone Number',
//       accessor: 'phoneNumber',
//       cell: (info: any) => info.getValue(),
//     },
//     {
//       header: 'Company URL',
//       accessor: 'companyUrl',
//       cell: (info: any) => (
//         <a href={info.getValue()} target="_blank" rel="noopener noreferrer">
//           {info.getValue()}
//         </a>
//       ),
//     },
//     {
//       header: 'Location',
//       accessor: 'location',
//       cell: (info: any) => info.getValue(),
//     },
//     ...commonColumns.slice(-2),
//   ];

//   const columns = activeTab === 'subAdmins' ? commonColumns : activeTab === 'professionals' ? professionalColumns : employerColumns;

//   const tableData = data[activeTab];

//   console.log('tableData:', tableData);
//   console.log('columns:', columns);

//   return (
//     <div className="min-h-screen px-3 md:px-10 py-10">
//       <div className="flex justify-end mb-3">
//         {/* TODO: This should open up a payment modal */}
//         {activeTab === 'subAdmins' && (
//           <Button
//             label="Create Subadmin"
//             variant="black"
//             onClick={() => setOpenModal('userManagement')}
//           />
//         )}
//       </div>
//       {/* Create Payment */}

//       <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
//         <div className="flex p-1">
//           <button
//             className={`py-2 px-4 text-sm font-medium ${activeTab === 'subAdmins' ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
//             onClick={() => setActiveTab('subAdmins')}
//           >
//             Sub Admins
//           </button>
//           <button
//             className={`py-2 px-4 text-sm font-medium ${activeTab === 'professionals' ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
//             onClick={() => setActiveTab('professionals')}
//           >
//             Professionals
//           </button>
//           <button
//             className={`py-2 px-4 text-sm font-medium ${activeTab === 'employers' ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
//             onClick={() => setActiveTab('employers')}
//           >
//             Employers
//           </button>
//         </div>
//       </div>

//       <div className="mt-4">
//         <Table
//           loading={false}
//           data={tableData}
//           columns={columns}
//           tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
//         />
//       </div>
      
//       <Modal open={openModal === 'userManagement'} onClose={closeModal}>
//         <UserModal onClose={closeModal} />
//       </Modal>
//     </div>
//   );
// };

// export default UserManagement;



























// UserManagement.tsx
import React, { useState } from 'react';
import { Modal } from '@mui/material';
import { Button, Table } from '@video-cv/ui-components';
import { useNavigate } from 'react-router-dom';

import { createColumnHelper } from '@tanstack/react-table';
import { UserModal } from './modals';

type ModalTypes = null | 'userManagement';

// Define the type for each data set
type SubAdmin = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl: string;
};

type Professional = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  institution: string;
  cvUrl: string;
  status: string;
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

type Employer = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  companyUrl: string;
  location: string;
  status: string;
};

const subAdminColumnHelper = createColumnHelper<SubAdmin>();
const professionalColumnHelper = createColumnHelper<Professional>();
const employerColumnHelper = createColumnHelper<Employer>();

const UserManagement = () => {
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [activeTab, setActiveTab] = useState<'subAdmins' | 'professionals' | 'employers'>('subAdmins');
  
  const navigate = useNavigate();

  const subAdminData = [
    { id: 1, name: 'John Doe', email: 'johndoe@example.com', role: 'Subadmin', status: 'Active', avatarUrl: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', role: 'Subadmin', status: 'Suspended', avatarUrl: 'https://via.placeholder.com/50' },
    { id: 3, name: 'Acme Corp', email: 'contact@acmecorp.com', role: 'Subadmin', status: 'Active', avatarUrl: 'https://via.placeholder.com/50' },
    { id: 4, name: 'Alice Johnson', email: 'alicejohnson@example.com', role: 'Admin', status: 'Suspended', avatarUrl: 'https://via.placeholder.com/50' },
    { id: 5, name: 'Global Solutions', email: 'info@globalsolutions.com', role: 'Subadmin', status: 'Suspended', avatarUrl: 'https://via.placeholder.com/50' }
  ];

  const professionalData = [
    { id: 1, name: 'John Doe', email: 'johndoe@example.com', phoneNumber: '123-456-7890', dateOfBirth: '1990-01-01', gender: 'Male', institution: 'Harvard University', cvUrl: 'https://example.com/cv/johndoe', status: 'Active', location: 'Cambridge, MA', nyscStateCode: 'LA12345', qualification: 'B.Sc. Computer Science', courseOfStudy: 'Computer Science', nyscStartDate: '2012-03-01', nyscEndDate: '2013-02-28', businessName: 'Tech Innovators Inc.', businessSector: 'Technology', businessPhone: '234-801-123-4567' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@example.com', phoneNumber: '234-567-8901', dateOfBirth: '1985-05-15', gender: 'Female', institution: 'Stanford University', cvUrl: 'https://example.com/cv/janesmith', status: 'Suspended', location: 'Stanford, CA', nyscStateCode: 'AB67890', qualification: 'M.Sc. Data Science', courseOfStudy: 'Data Science', nyscStartDate: '2010-07-15', nyscEndDate: '2011-06-14', businessName: 'Data Experts LLC', businessSector: 'Analytics', businessPhone: '234-802-234-5678' },
    { id: 3, name: 'Alice Wong', email: 'alicewong@example.com', phoneNumber: '345-678-9012', dateOfBirth: '1992-11-22', gender: 'Female', institution: 'MIT', cvUrl: 'https://example.com/cv/alicewong', status: 'Active', location: 'Cambridge, MA', nyscStateCode: 'OY34567', qualification: 'B.Sc. Mechanical Engineering', courseOfStudy: 'Mechanical Engineering', nyscStartDate: '2013-09-01', nyscEndDate: '2014-08-31', businessName: 'Innovative Solutions', businessSector: 'Engineering', businessPhone: '234-803-345-6789' },
    { id: 4, name: 'Bob Jones', email: 'bobjones@example.com', phoneNumber: '456-789-0123', dateOfBirth: '1988-07-30', gender: 'Male', institution: 'Oxford University', cvUrl: 'https://example.com/cv/bobjones', status: 'Active', location: 'Oxford, UK', nyscStateCode: 'KN89012', qualification: 'Ph.D. Philosophy', courseOfStudy: 'Philosophy', nyscStartDate: '2009-05-10', nyscEndDate: '2010-04-09', businessName: 'Philosophy Insights', businessSector: 'Education', businessPhone: '234-804-456-7890' },
    { id: 5, name: 'Carol Lee', email: 'carollee@example.com', phoneNumber: '567-890-1234', dateOfBirth: '1995-09-09', gender: 'Female', institution: 'Yale University', cvUrl: 'https://example.com/cv/carollee', status: 'Suspended', location: 'New Haven, CT', nyscStateCode: 'EN90123', qualification: 'LL.M. International Law', courseOfStudy: 'Law', nyscStartDate: '2015-11-20', nyscEndDate: '2016-10-19', businessName: 'Global Law Firm', businessSector: 'Legal', businessPhone: '234-805-567-8901' },
    { id: 6, name: 'David Brown', email: 'davidbrown@example.com', phoneNumber: '678-901-2345', dateOfBirth: '1991-03-10', gender: 'Male', institution: 'Princeton University', cvUrl: 'https://example.com/cv/davidbrown', status: 'Active', location: 'Princeton, NJ', nyscStateCode: 'IM67890', qualification: 'M.A. Economics', courseOfStudy: 'Economics', nyscStartDate: '2011-02-14', nyscEndDate: '2012-01-13', businessName: 'Economy Solutions Ltd.', businessSector: 'Finance', businessPhone: '234-806-678-9012' },
    { id: 7, name: 'Emma Wilson', email: 'emmawilson@example.com', phoneNumber: '789-012-3456', dateOfBirth: '1989-06-25', gender: 'Female', institution: 'University of California, Berkeley', cvUrl: 'https://example.com/cv/emmawilson', status: 'Suspended', location: 'Berkeley, CA', nyscStateCode: 'LA01234', qualification: 'B.A. Sociology', courseOfStudy: 'Sociology', nyscStartDate: '2014-04-10', nyscEndDate: '2015-03-09', businessName: 'Sociology Research Group', businessSector: 'Research', businessPhone: '234-807-789-0123' },
    { id: 8, name: 'Frank Harris', email: 'frankharris@example.com', phoneNumber: '890-123-4567', dateOfBirth: '1987-02-14', gender: 'Male', institution: 'University of Chicago', cvUrl: 'https://example.com/cv/frankharris', status: 'Active', location: 'Chicago, IL', nyscStateCode: 'KD45678', qualification: 'B.Sc. Mathematics', courseOfStudy: 'Mathematics', nyscStartDate: '2010-08-18', nyscEndDate: '2011-07-17', businessName: 'Math Solutions', businessSector: 'Education', businessPhone: '234-808-890-1234' },
    { id: 9, name: 'Grace Lee', email: 'gracelee@example.com', phoneNumber: '901-234-5678', dateOfBirth: '1993-12-05', gender: 'Female', institution: 'Columbia University', cvUrl: 'https://example.com/cv/gracelee', status: 'Active', location: 'New York, NY', nyscStateCode: 'KN78901', qualification: 'M.Sc. Computer Engineering', courseOfStudy: 'Computer Engineering', nyscStartDate: '2013-12-01', nyscEndDate: '2014-11-30', businessName: 'Tech Solutions Inc.', businessSector: 'Technology', businessPhone: '234-809-901-2345' },
    { id: 10, name: 'Henry Clark', email: 'henryclark@example.com', phoneNumber: '012-345-6789', dateOfBirth: '1990-04-18', gender: 'Male', institution: 'University of Cambridge', cvUrl: 'https://example.com/cv/henryclark', status: 'Suspended', location: 'Cambridge, UK', nyscStateCode: 'AN34567', qualification: 'B.A. History', courseOfStudy: 'History', nyscStartDate: '2014-06-12', nyscEndDate: '2015-05-11', businessName: 'History Scholars Ltd.', businessSector: 'Education', businessPhone: '234-810-012-3456' },
  ];

  const employerData = [
    { id: 1, name: 'Google LLC', email: 'contact@google.com', phoneNumber: '650-253-0000', companyUrl: 'https://www.google.com', location: 'Mountain View, CA', status: 'Active' },
    { id: 2, name: 'Microsoft Corporation', email: 'contact@microsoft.com', phoneNumber: '425-882-8080', companyUrl: 'https://www.microsoft.com', location: 'Redmond, WA', status: 'Active' },
    { id: 3, name: 'Amazon.com, Inc.', email: 'contact@amazon.com', phoneNumber: '206-266-1000', companyUrl: 'https://www.amazon.com', location: 'Seattle, WA', status: 'Active' },
    { id: 4, name: 'Facebook, Inc.', email: 'contact@facebook.com', phoneNumber: '650-543-4800', companyUrl: 'https://www.facebook.com', location: 'Menlo Park, CA', status: 'Suspended' },
    { id: 5, name: 'Apple Inc.', email: 'contact@apple.com', phoneNumber: '408-996-1010', companyUrl: 'https://www.apple.com', location: 'Cupertino, CA', status: 'Active' },
  ];

  // Manage data state
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>(subAdminData);
  const [professionals, setProfessionals] = useState<Professional[]>(professionalData);
  const [employers, setEmployers] = useState<Employer[]>(employerData);

  const closeModal = () => setOpenModal(null);

  const subAdminColumns = [
    subAdminColumnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    subAdminColumnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    subAdminColumnHelper.accessor('role', {
      header: 'Role',
      cell: (info) => info.getValue(),
    }),
    subAdminColumnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1.5 text-center items-center rounded-full ${
            info.getValue() === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    subAdminColumnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row: { original } }) => {
        const handleView = () => {
          const viewPath = `/admin/user-management/${activeTab}-view/${original.id}`;
          navigate(viewPath, { state: { user: original }});
        };

        const handleStatusToggle = () => {
          const newStatus = original.status === 'Active' ? 'Suspended' : 'Active';
          setSubAdmins((prevData) =>
            prevData.map((user) =>
              user.id === original.id ? { ...user, status: newStatus } : user
            )
          );
        };

        return (
          <div className="flex gap-2">
            <Button variant="custom" label="View" onClick={handleView} />
            {original.status === 'Active' ? (
              <Button variant="red" label="Suspend" onClick={handleStatusToggle} />
            ) : (
              <Button variant="success" label="Activate" onClick={handleStatusToggle} />
            )}
          </div>
        );
      },
    }),
  ];
  
  // Define columns for Professionals
  const professionalColumns = [
    professionalColumnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('phoneNumber', {
      header: 'Phone Number',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('dateOfBirth', {
      header: 'Date of Birth',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    professionalColumnHelper.accessor('gender', {
      header: 'Gender',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('institution', {
      header: 'Institution',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('cvUrl', {
      header: 'CV Url',
      cell: (info) => <a href={info.getValue()} target="_blank" rel="noopener noreferrer">{info.getValue()}</a>,
    }),
    professionalColumnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('nyscStateCode', {
      header: 'NYSC State Code',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('qualification', {
      header: 'Degree Awarded',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('courseOfStudy', {
      header: 'Course of Study',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('nyscStartDate', {
      header: 'NYSC Start Date',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    professionalColumnHelper.accessor('nyscEndDate', {
      header: 'NYSC End Date',
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    professionalColumnHelper.accessor('businessName', {
      header: 'Business Name',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('businessSector', {
      header: 'Business Sector',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('businessPhone', {
      header: 'Business Phone',
      cell: (info) => info.getValue(),
    }),
    professionalColumnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1.5 text-center items-center rounded-full ${
            info.getValue() === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    professionalColumnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row: { original } }) => {
        const handleView = () => {
          const viewPath = `/admin/user-management/${activeTab}-view/${original.id}`;
          navigate(viewPath, { state: { user: original }});
        };

        const handleStatusToggle = () => {
          const newStatus = original.status === 'Active' ? 'Suspended' : 'Active';
          setSubAdmins((prevData) =>
            prevData.map((user) =>
              user.id === original.id ? { ...user, status: newStatus } : user
            )
          );
        };

        return (
          <div className="flex gap-2">
            <Button variant="custom" label="View" onClick={handleView} />
            {original.status === 'Active' ? (
              <Button variant="red" label="Suspend" onClick={handleStatusToggle} />
            ) : (
              <Button variant="success" label="Activate" onClick={handleStatusToggle} />
            )}
          </div>
        );
      },
    }),
  ];
  
  // Define columns for Employers
  const employerColumns = [
    employerColumnHelper.accessor('name', {
      header: 'Company Name',
      cell: (info) => info.getValue(),
    }),
    employerColumnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    employerColumnHelper.accessor('phoneNumber', {
      header: 'Phone Number',
      cell: (info) => info.getValue(),
    }),
    employerColumnHelper.accessor('companyUrl', {
      header: 'Company URL',
      cell: (info) => <a href={info.getValue()} target="_blank" rel="noopener noreferrer">{info.getValue()}</a>,
    }),
    employerColumnHelper.accessor('location', {
      header: 'Location',
      cell: (info) => info.getValue(),
    }),
    employerColumnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <span
          className={`px-2 py-1.5 text-center items-center rounded-full ${
            info.getValue() === 'Active' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    employerColumnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row: { original } }) => {
        const handleView = () => {
          const viewPath = `/admin/user-management/${activeTab}-view/${original.id}`;
          navigate(viewPath, { state: { user: original }});
        };

        const handleStatusToggle = () => {
          const newStatus = original.status === 'Active' ? 'Suspended' : 'Active';
          setSubAdmins((prevData) =>
            prevData.map((user) =>
              user.id === original.id ? { ...user, status: newStatus } : user
            )
          );
        };

        return (
          <div className="flex gap-2">
            <Button variant="custom" label="View" onClick={handleView} />
            {original.status === 'Active' ? (
              <Button variant="red" label="Suspend" onClick={handleStatusToggle} />
            ) : (
              <Button variant="success" label="Activate" onClick={handleStatusToggle} />
            )}
          </div>
        );
      },
    }),
  ];

  // Function to handle status toggle
  const handleStatusToggle = (id: number) => {
    if (activeTab === 'subAdmins') {
      setSubAdmins((prev) =>
        prev.map((admin) =>
          admin.id === id
            ? { ...admin, status: admin.status === 'Active' ? 'Suspended' : 'Active' }
            : admin
        )
      );
    } else if (activeTab === 'professionals') {
      setProfessionals((prev) =>
        prev.map((prof) =>
          prof.id === id
            ? { ...prof, status: prof.status === 'Active' ? 'Suspended' : 'Active' }
            : prof
        )
      );
    } else if (activeTab === 'employers') {
      setEmployers((prev) =>
        prev.map((employer) =>
          employer.id === id
            ? { ...employer, status: employer.status === 'Active' ? 'Suspended' : 'Active' }
            : employer
        )
      );
    }
  };

  // Determine current data and columns based on active tab
  let currentData;
  let currentColumns;
  if (activeTab === 'subAdmins') {
    currentData = subAdmins;
    currentColumns = subAdminColumns;
  } else if (activeTab === 'professionals') {
    currentData = professionals;
    currentColumns = professionalColumns;
  } else {
    currentData = employers;
    currentColumns = employerColumns;
  }

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-3">
        {activeTab === 'subAdmins' && (
          <Button
            label="Create Subadmin"
            variant="black"
            onClick={() => setOpenModal('userManagement')}
          />
        )}
        {/* Similarly, add buttons for other tabs if needed */}
      </div>

      <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
        <div className="flex p-1">
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'subAdmins'
                ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                : 'text-blue-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('subAdmins')}
          >
            Sub Admins
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'professionals'
                ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                : 'text-blue-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('professionals')}
          >
            Professionals
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'employers'
                ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg'
                : 'text-blue-600 hover:text-blue-600'
            }`}
            onClick={() => setActiveTab('employers')}
          >
            Employers
          </button>
        </div>
      </div>

      <div className="mt-4">
        <Table
          loading={false}
          data={currentData}
          columns={currentColumns}
          tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        />
      </div>

      <Modal open={openModal === 'userManagement'} onClose={closeModal}>
        <UserModal onClose={closeModal} />
      </Modal>
    </div>
  );
};

export default UserManagement;
