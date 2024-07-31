import React, { useState } from 'react';

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
  const [editField, setEditField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: 'John',
    middleName: 'Doe',
    surname: 'Smith',
    nyscStateCode: 'AB1234',
    phoneNumber: '+234123456789',
    emailAddress: 'john.doe@example.com',
    nyscStartYear: '2020-01-01',
    nyscEndYear: '2021-01-01',
    courseOfStudy: 'Computer Science',
    degreeAwarded: 'B.Sc',
    institutionAttended: 'University of XYZ',
    classOfDegree: 'firstClass',
    coverLetter: 'Cover letter content',
    businessName: 'Doe Enterprises',
    businessPhoneNumber: '+234987654321',
    businessSector: 'product',
    businessProfile: 'Business profile content',
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name: string, date: any) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleEditClick = (fieldName: string) => {
    setEditField(fieldName);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditField(null);
    console.log('Form submitted', formData);
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
              <Box className="input-box">
                <label>First Name</label>
                <Typography className="input-like">{formData.firstName}</Typography>
              </Box>
              {editField === 'middleName' ? (
                <Input
                  name="middleName"
                  label="Middle Name"
                  value={formData.middleName}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('middleName')}>
                  <label>Middle Name</label>
                  <Typography className="input-like">{formData.middleName}</Typography>
                </Box>
              )}
              <Box className="input-box">
                <label>Surname</label>
                <Typography className="input-like">{formData.surname}</Typography>
              </Box>
              <Box className="input-box">
                <label>Email Address</label>
                <Typography className="input-like">{formData.emailAddress}</Typography>
              </Box>
              {editField === 'nyscStateCode' ? (
                <Input
                  name="nyscStateCode"
                  label="NYSC State Code"
                  value={formData.nyscStateCode}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('nyscStateCode')}>
                  <label>NYSC State Code</label>
                  <Typography className="input-like">{formData.nyscStateCode}</Typography>
                </Box>
              )}
              {editField === 'phoneNumber' ? (
                <Input
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('phoneNumber')}>
                  <label>Phone Number</label>
                  <Typography className="input-like">{formData.phoneNumber}</Typography>
                </Box>
              )}
              {editField === 'nyscStartYear' ? (
                <DatePicker
                  name="nyscStartYear"
                  label="NYSC Service year (start)"
                  value={formData.nyscStartYear}
                  onChange={(date) => handleDateChange('nyscStartYear', date)}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('nyscStartYear')}>
                  <label>NYSC Service Year (Start)</label>
                  <Typography className="input-like">{formData.nyscStartYear}</Typography>
                </Box>
              )}
              {editField === 'nyscEndYear' ? (
                <DatePicker
                  name="nyscEndYear"
                  label="NYSC Service year (end)"
                  value={formData.nyscEndYear}
                  onChange={(date) => handleDateChange('nyscEndYear', date)}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('nyscEndYear')}>
                  <label>NYSC Service Year (End)</label>
                  <Typography className="input-like">{formData.nyscEndYear}</Typography>
                </Box>
              )}
              {editField === 'courseOfStudy' ? (
                <Input
                  name="courseOfStudy"
                  label="Course of Study"
                  value={formData.courseOfStudy}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('courseOfStudy')}>
                  <label>Course of Study</label>
                  <Typography className="input-like">{formData.courseOfStudy}</Typography>
                </Box>
              )}
              {editField === 'degreeAwarded' ? (
                <Input
                  name="degreeAwarded"
                  label="Degree / Certificate Awarded"
                  value={formData.degreeAwarded}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('degreeAwarded')}>
                  <label>Degree / Certificate Awarded</label>
                  <Typography className="input-like">{formData.degreeAwarded}</Typography>
                </Box>
              )}
              {editField === 'institutionAttended' ? (
                <Input
                  name="institutionAttended"
                  label="Institution Attended"
                  value={formData.institutionAttended}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('institutionAttended')}>
                  <label>Institution Attended</label>
                  <Typography className="input-like">{formData.institutionAttended}</Typography>
                </Box>
              )}
              {editField === 'classOfDegree' ? (
                <Select
                  name="classOfDegree"
                  label="Class of Degree"
                  value={formData.classOfDegree}
                  options={[
                    { value: 'firstClass', label: 'First Class' },
                    { value: 'secondClassUpper', label: 'Second Class Upper' },
                    { value: 'secondClassLower', label: 'Second Class Lower' },
                  ]}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('classOfDegree')}>
                  <label>Class of Degree</label>
                  <Typography className="input-like">{formData.classOfDegree}</Typography>
                </Box>
              )}
              {editField === 'coverLetter' ? (
                <TextArea
                  name="coverLetter"
                  label="Cover Letter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('coverLetter')}>
                  <label>Cover Letter</label>
                  <Typography className="input-like">{formData.coverLetter}</Typography>
                </Box>
              )}
            </div>
            <div className="flex justify-end gap-5 mt-5">
              <Button type='submit' variant="custom" label="Update" />
              <Button type='submit' variant='black' label="Update and Continue" />
            </div>
          </form>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Box className="input-box" onClick={() => handleEditClick('businessName')}>
                <label>Business Name</label>
                <Typography className="input-like">{formData.businessName}</Typography>
              </Box>
              {editField === 'businessPhoneNumber' ? (
                <Input
                  name="businessPhoneNumber"
                  label="Business Phone Number"
                  value={formData.businessPhoneNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('businessPhoneNumber')}>
                  <label>Business Phone Number</label>
                  <Typography className="input-like">{formData.businessPhoneNumber}</Typography>
                </Box>
              )}
              {editField === 'businessSector' ? (
                <Select
                  name="businessSector"
                  label="Business Sector"
                  value={formData.businessSector}
                  options={[
                    { value: 'product', label: 'Product' },
                    { value: 'service', label: 'Service' },
                  ]}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('businessSector')}>
                  <label>Business Sector</label>
                  <Typography className="input-like">{formData.businessSector}</Typography>
                </Box>
              )}
              {editField === 'businessProfile' ? (
                <TextArea
                  name="businessProfile"
                  label="Business Profile"
                  value={formData.businessProfile}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('businessProfile')}>
                  <label>Business Profile</label>
                  <Typography className="input-like">{formData.businessProfile}</Typography>
                </Box>
              )}
          </div>
          <div className="flex justify-end gap-5 mt-5">
            <Button type='submit' variant='black' label="Update" />
          </div>
        </form>
      </CustomTabPanel>
    </Box>
  );
};

export default Profile;
