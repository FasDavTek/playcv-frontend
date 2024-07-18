import React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { createColumnHelper } from '@tanstack/react-table';

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
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
  {
    fullname: 'John Smith',
    email: 'john.smith@example.com',
    courseOfStudy: 'Mathematics',
    gender: 'Male',
    phone: '1234567890',
    stateOfOrigin: 'California',
    grade: '1st class',
  },
];

const columnHelper = createColumnHelper<IVideoManagementTable>();

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
    cell: ({ row: { original } }) => {
      return <Button label="View Profile" />;
    },
    header: 'Action',
  }),
];

const VideoManagement = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

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
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Personal Information" {...a11yProps(0)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input label="First Name" placeholder="First Name" />
            <Input label="Middle Name" placeholder="Middle Name" />
            <Input label="Surname" placeholder="Surname" />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <TextArea label="Label" />
            <TextArea label="Label" />
          </div>
          <div className="flex justify-end gap-5 mt-5">
            <Button label="Update" />
          </div>
        </form>
        {/* Table comes here */}
        {/* filter logic comes here */}
        <Table
          loading={false}
          data={data}
          columns={columns}
          tableHeading="All Payments"
        />
      </CustomTabPanel>
    </section>
  );
};

export default VideoManagement;
