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
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { Snackbar, Alert, SnackbarOrigin, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface State extends SnackbarOrigin {
  open: boolean;
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
          <div>{children}</div>
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
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'John',
    middleName: 'Doe',
    surname: 'Smith',
    nyscStateCode: 'AB1234',
    phoneNumber: '+234123456789',
    emailAddress: 'john.doe@example.com',
    nyscStartYear: dayjs('2020-01-01'),
    nyscEndYear: dayjs('2021-01-01'),
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

  const [state, setState] = React.useState<State>({
    open: true,
    vertical: 'bottom',
    horizontal: 'right',
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleEditClick = (fieldName: string) => {
    setEditField(fieldName);
  };

  const onSubmit = (data: any) => {
    setFormData({
      ...data,
      nyscStartYear: dayjs(data.nyscStartYear),
      nyscEndYear: dayjs(data.nyscEndYear),
    });
    setEditField(null);
    console.log('Form submitted', formData);
  };

  const handleSnackbarClick = () => {
    setOpen(true);
  };

  const handleAlertClose = () => {
    setOpen(false);
  };


  return (
    <Box sx={{ width: '90%', marginInline: 'auto' }} >
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Box className="input-box">
                <label>First Name</label>
                <Typography className="input-like">{formData.firstName}</Typography>
              </Box>
              {editField === 'middleName' ? (
                <Input
                  {...register('middleName')}
                  label="Middle Name"
                  value={formData.middleName}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('middleName')}>
                  <label>Middle Name</label>
                  <Typography className="input-like">{formData.middleName}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
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
                  {...register('nyscStateCode')}
                  label="NYSC State Code"
                  value={formData.nyscStateCode}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('nyscStateCode')}>
                  <label>NYSC State Code</label>
                  <Typography className="input-like">{formData.nyscStateCode}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'phoneNumber' ? (
                <Input
                  {...register('phoneNumber')}
                  label="Phone Number"
                  value={formData.phoneNumber}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('phoneNumber')}>
                  <label>Phone Number</label>
                  <Typography className="input-like">{formData.phoneNumber}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'nyscStartYear' ? (
                <Controller
                  name="nyscStartYear"
                  control={control}
                  defaultValue={formData.nyscStartYear}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="NYSC Service year (start)"
                      value={field.value}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('nyscStartYear')}>
                  <label>NYSC Service Year (Start)</label>
                  <Typography className="input-like">{formData.nyscStartYear.format('YYYY-MM-DD')}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'nyscEndYear' ? (
                <Controller
                name="nyscEndYear"
                control={control}
                defaultValue={formData.nyscStartYear}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="NYSC Service year (end)"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('nyscEndYear')}>
                  <label>NYSC Service Year (End)</label>
                  <Typography className="input-like">{formData.nyscEndYear.format('YYYY-MM-DD')}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'courseOfStudy' ? (
                <Input
                  {...register('courseOfStudy')}
                  label="Course of Study"
                  value={formData.courseOfStudy}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('courseOfStudy')}>
                  <label>Course of Study</label>
                  <Typography className="input-like">{formData.courseOfStudy}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'degreeAwarded' ? (
                <Input
                  {...register('degreeAwarded')}
                  label="Degree / Certificate Awarded"
                  value={formData.degreeAwarded}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('degreeAwarded')}>
                  <label>Degree / Certificate Awarded</label>
                  <Typography className="input-like">{formData.degreeAwarded}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'institutionAttended' ? (
                <Input
                  {...register('institutionAttended')}
                  label="Institution Attended"
                  value={formData.institutionAttended}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('institutionAttended')}>
                  <label>Institution Attended</label>
                  <Typography className="input-like">{formData.institutionAttended}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'classOfDegree' ? (
                <Select
                  {...register('classOfDegree')}
                  label="Class of Degree"
                  value={formData.classOfDegree}
                  options={[
                    { value: 'firstClass', label: 'First Class' },
                    { value: 'secondClassUpper', label: 'Second Class Upper' },
                    { value: 'secondClassLower', label: 'Second Class Lower' },
                  ]}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('classOfDegree')}>
                  <label>Class of Degree</label>
                  <Typography className="input-like">{formData.classOfDegree}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'coverLetter' ? (
                <TextArea
                  {...register('coverLetter')}
                  label="Cover Letter"
                  value={formData.coverLetter}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('coverLetter')}>
                  <label>Cover Letter</label>
                  <Typography className="input-like">{formData.coverLetter}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </div>
            <div className="flex justify-end gap-5 mt-5">
              <Button type='submit' variant="custom" label="Update" />
              <Button type='submit' variant='black' label="Update and Continue" />
            </div>
          </form>

          <Snackbar open={state.open} onClose={() => setState({ ...state, open: false })} anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }} action={<IconButton color='info' onClick={handleSnackbarClick}><InfoIcon /></IconButton>} message="Click the icon for more details" >
            <Alert onClick={handleSnackbarClick} variant="filled" severity="info" sx={{ width: '100%', cursor: 'pointer' }} >
              Please click on each field to edit it. Note that some fields are not editable.
            </Alert>
          </Snackbar>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Box className="input-box" onClick={() => handleEditClick('businessName')}>
                <label>Business Name</label>
                <Typography className="input-like">{formData.businessName}</Typography>
              </Box>
              {editField === 'businessPhoneNumber' ? (
                <Input
                  {...register('businessPhoneNumber')}
                  label="Business Phone Number"
                  value={formData.businessPhoneNumber}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('businessPhoneNumber')}>
                  <label>Business Phone Number</label>
                  <Typography className="input-like">{formData.businessPhoneNumber}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'businessSector' ? (
                <Select
                  {...register('businessSector')}
                  label="Business Sector"
                  value={formData.businessSector}
                  options={[
                    { value: 'product', label: 'Product' },
                    { value: 'service', label: 'Service' },
                  ]}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('businessSector')}>
                  <label>Business Sector</label>
                  <Typography className="input-like">{formData.businessSector}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'businessProfile' ? (
                <TextArea
                  {...register('businessProfile')}
                  label="Business Profile"
                  value={formData.businessProfile}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('businessProfile')}>
                  <label>Business Profile</label>
                  <Typography className="input-like">{formData.businessProfile}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
          </div>
          <div className="flex justify-end gap-5 mt-5">
            <Button type='submit' variant='black' label="Update" />
          </div>
        </form>

        <Snackbar open={state.open} onClose={() => setState({ ...state, open: false })} anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }} action={<IconButton color='info' onClick={handleSnackbarClick}><InfoIcon /></IconButton>} message="Click the icon for more details" >
          <Alert onClick={handleSnackbarClick} onClose={handleAlertClose} variant="filled" severity="info" sx={{ width: '100%', cursor: 'pointer' }} >
            Please click on each field to edit it. Note that some fields are not editable.
          </Alert>
        </Snackbar>
      </CustomTabPanel>
    </Box>
  );
};

export default Profile;
