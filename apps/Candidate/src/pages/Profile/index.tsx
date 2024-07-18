import React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import {
  Input,
  DatePicker,
  Select,
  TextArea,
  Button,
} from '@video-cv/ui-components';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

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

const Profile = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ width: '90%', marginInline: 'auto' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Personal Information" {...a11yProps(0)} />
          <Tab label="Business Info" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="First Name" placeholder="First Name" />
            <Input label="Middle Name" placeholder="Middle Name" />
            <Input label="Surname" placeholder="Surname" />
            <Input label="NYSC State Code" placeholder="NYSC State Code" />
            <Input label="Phone Numner" placeholder="+234123456789" />
            <Input label="Email Address" placeholder="Email Address" />
            <DatePicker label="NYSC Service year(start)" />
            <DatePicker label="NYSC Service year(start)" />
            <Input
              label="Course of Study"
              placeholder="Enter your Course of Study"
            />
            <Input
              label="Degree / certificate awarded"
              placeholder="Enter your degree"
            />
            <Input
              label="Institution Attended"
              placeholder="Institution Attended"
            />
            <Select
              label="Class of Degree"
              options={[
                { value: 0, Label: 'First Class' },
                { value: 1, label: 'Second Class' },
              ]}
            />
            <TextArea label="Cover Letter" placeholder="Cover letter" />
          </div>
          <div className="flex justify-end gap-5 mt-5">
            <Button variant="neutral" label="Update" />
            <Button label="Update & Next" />
          </div>
        </form>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Business Name" placeholder="Business Name" />
            <Input
              label="Business Phone Number"
              placeholder="Business Phone Number"
            />
            <Select
              label="Business Sector"
              options={[{ value: 0, label: 'Product' }]}
            />
            <TextArea
              label="Business Profile (Product & Services)"
              placeholder="Business Profile"
            />
          </div>
          <div className="flex justify-end gap-5 mt-5">
            <Button label="Update" />
          </div>
        </form>
      </CustomTabPanel>
    </Box>
  );
};

export default Profile;
