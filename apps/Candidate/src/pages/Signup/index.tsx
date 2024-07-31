import React, { useState } from 'react'
import { Images } from '@video-cv/assets';
import { Box, Tabs, Tab, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

const index = () => {
    const [value, setValue] = React.useState(0);
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        surname: '',
        nyscStateCode: '',
        phoneNumber: '',
        emailAddress: '',
        nyscStartYear: '',
        nyscEndYear: '',
        courseOfStudy: '',
        degreeAwarded: '',
        institutionAttended: '',
        classOfDegree: '',
        coverLetter: '',
        businessName: '',
        businessPhoneNumber: '',
        businessSector: '',
        businessProfile: '',
    });

    const theme = useTheme();
    const navigate = useNavigate();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add your API request logic here
        console.log('Form submitted', formData);
        navigate('/');
    };
  
  return (
    <div className="min-h-screen flex">
        <div className="border w-0 md:flex-1 min-h-screen" style={{ backgroundImage: `url(${Images.AuthBG})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: '100%', }}></div>
        <div className="flex-1 p-2 md:p-4">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
                    <Tab label="Personal Information" {...a11yProps(0)} dir={theme.direction} />
                    <Tab label="Business Info" {...a11yProps(1)} dir={theme.direction} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input name="firstName" label="First Name" placeholder="First Name" onChange={handleInputChange} />
                        <Input name="middleName" label="Middle Name" placeholder="Middle Name" onChange={handleInputChange} />
                        <Input name="surname" label="Surname" placeholder="Surname" onChange={handleInputChange} />
                        <Input name="nyscStateCode" label="NYSC State Code" placeholder="NYSC State Code" onChange={handleInputChange} />
                        <Input name="phoneNumber" label="Phone Number" placeholder="+234123456789" onChange={handleInputChange} />
                        <Input name="emailAddress" label="Email Address" placeholder="Email Address" onChange={handleInputChange} />
                        <DatePicker name="nyscStartYear" label="NYSC Service year (start)" onChange={(date) => setFormData({ ...formData, nyscStartYear: date })} />
                        <DatePicker name="nyscEndYear" label="NYSC Service year (end)" onChange={(date) => setFormData({ ...formData, nyscEndYear: date })} />
                        <Input name="courseOfStudy" label="Course of Study" placeholder="Enter your Course of Study" onChange={handleInputChange} />
                        <Input name="degreeAwarded" label="Degree / Certificate Awarded" placeholder="Enter your degree" onChange={handleInputChange} />
                        <Input name="institutionAttended" label="Institution Attended" placeholder="Institution Attended" onChange={handleInputChange} />
                        <Select
                        name='classOfDegree'
                        label="Class of Degree"
                        options={[
                            { value: 'firstClass', label: 'First Class' },
                            { value: 'secondClassUpper', label: 'Second Class Upper' },
                            { value: 'secondClassLower', label: 'Second Class Lower' },
                        ]}
                        onChange={handleInputChange}
                        />
                        <TextArea name="coverLetter" label="Cover Letter" placeholder="Cover letter" onChange={handleInputChange} />
                    </div>
                    <div className="flex justify-end gap-5 mt-5">
                        <Button type='submit' variant="custom" label="Submit" />
                        <Button type='submit' variant='black' label="Submit and Continue" />
                    </div>
                </form>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input name='businessName' label="Business Name" placeholder="Business Name" onChange={handleInputChange} />
                        <Input name='businessPhoneNumber' label="Business Phone Number" placeholder="Business Phone Number" onChange={handleInputChange} />
                        <Select
                        name="businessSector"
                        label="Business Sector"
                        options={[{ value: 'product', label: 'Product' }]}
                        onChange={handleInputChange}
                        />
                        <TextArea
                        name="businessProfile"
                        label="Business Profile (Product & Services)"
                        placeholder="Business Profile"
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex justify-end gap-5 mt-5">
                        <Button type='submit' variant='black' label="Submit" />
                    </div>
                </form>
            </CustomTabPanel>
        </div>
    </div>
  )
}

export default index