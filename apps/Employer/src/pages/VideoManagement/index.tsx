import React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createColumnHelper } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';

import {
  Input,
  DatePicker,
  Select,
  TextArea,
  Button,
  Table,
} from '@video-cv/ui-components';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface IVideoManagementTable {
  fullname: string;
  email: string;
  courseOfStudy: string;
  gender: string;
  phone: string;
  stateOfOrigin: string;
  grade: string;
  action: 'action';
}

const data = [
  {
    id: '1',
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    id: '2',
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Zoology',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    id: '3',
    fullname: 'Johnson Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Plant Biology',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    id: '4',
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mechanical Engineering',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    id: '5',
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    id: '6',
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    id: '7',
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    id: '8',
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Physics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    id: '9',
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'English',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    id: '10',
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Geology',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    id: '11',
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Civil Engineering',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
];

const columnHelper = createColumnHelper<IVideoManagementTable>();

const VideoManagement = () => {
  const [value, setValue] = React.useState(0);

  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleView = (videoId: number) => {
    navigate(`/employer/video-management/:${videoId}`);
  };

  const columns = [
    columnHelper.accessor('fullname', {
      header: 'Full Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('courseOfStudy', {
      header: 'Course of Study',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('grade', {
      header: 'Grade',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('gender', {
      header: 'Gender',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('phone', {
      header: 'Phone',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('action', {
      cell: ({ row }: any) => {
        return <Button variant='custom' onClick={() => handleView(row.original.id)} label="View Profile" />;
      },
      header: 'Action',
    }),
  ];

  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  return (
    <section className="ce-px ce-py">
        {/* Table comes here */}
        {/* filter logic comes here */}
        <Table
          loading={false}
          data={data}
          columns={columns}
          tableHeading="All Video CV"
        />
    </section>
  );
};

export default VideoManagement;
