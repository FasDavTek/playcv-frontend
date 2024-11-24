import React, { useState, useEffect } from 'react';

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
  RichTextEditor,
} from '@video-cv/ui-components';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { Snackbar, Alert, SnackbarOrigin, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import 'react-quill/dist/quill.snow.css';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { postData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { decodeJWT } from './../../../../../libs/utils/helpers/decoder';
import { useNavigate } from 'react-router-dom';

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

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  surname: z.string().min(1, "Surname is required"),
  nyscStateCode: z.string().min(4, 'NYSC State code is required'),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email format"),
  nyscStartYear: z.date().refine(date => dayjs(date).isValid(), {
    message: "Invalid start year",
  }),
  nyscEndYear: z.date().refine(date => dayjs(date).isValid(), {
    message: "Invalid end year",
  }),
  courseOfStudy: z.string().min(1, "Course of study is required"),
  degreeAwarded: z.string().min(1, "Degree awarded is required"),
  institutionAttended: z.string().min(1, "Institution attended is required"),
  classOfDegree: z.string().min(1, "Class of degree is required"),
  coverLetter: z.string().min(1, "Cover letter content is required"),
  businessName: z.string().optional(),
  businessPhoneNumber: z.string().min(10, "Business phone number must be at least 10 digits"),
  businessSector: z.string().min(1, "Business sector is required"),
  businessProfile: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  confirmPassword: z.string().optional(),
  isTracked: z.boolean(),
  isBusinessUser: z.boolean(),
  isProfessional: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const Profile = () => {
  const navigate = useNavigate();
  const [values, setValues] = React.useState(0);
  const [editField, setEditField] = useState<string | null>(null);
  const [lastEditedField, setLastEditedField] = useState<string | null>(null);
  const { register, control, setValue, watch, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isTracked: true,
      isBusinessUser: false,
      isProfessional: true,
      nyscStartYear: new Date(),
      nyscEndYear: new Date(),
    },
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      const signupData = localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA);
      if (signupData) {
        const parsedData = JSON.parse(signupData);
        Object.entries(parsedData).forEach(([key, value]) => {
          setValue(key as keyof FormData, value as string);
        });
      }
      else {
        const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || '{}');
        Object.entries(userData).forEach(([key, value]) => {
            setValue(key as keyof FormData, value as string);
        });
      }
    };
    loadData();
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((data) => data);
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    // setFormData({
    //   ...data,
    //   nyscStartYear: dayjs(data.nyscStartYear),
    //   nyscEndYear: dayjs(data.nyscEndYear),
    // });
    try {
      const defaultValues = {
        isTracked: true,
        isBusinessUser: false,
        isProfessional: true,
      };
  
      const combinedData = {
        ...data,
        ...defaultValues,
      };

      const res = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PROFILE}`, combinedData);

      if (res.code === "201") {
        toast.success(res.message);
        const token = res.jwtToken;
        const decoded = decodeJWT(token);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ ...res, ...decoded, ...defaultValues }));
        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true");
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, decoded.UserId);
        localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, res.jwtToken);

        localStorage.removeItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA);
        navigate('/');
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating profile");
    } finally {
      setLoading(false);
      setEditField(null);
    }
  };

  const [state, setState] = React.useState<State>({
    open: true,
    vertical: 'top',
    horizontal: 'center',
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValues(newValue);
  };

  const handleEditClick = (fieldName: string) => {
    setEditField(fieldName);
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
          value={values}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Personal Information" {...a11yProps(0)} />
          <Tab label="Business Info" {...a11yProps(1)} />
        </Tabs>
      </Box>
        <form onSubmit={(e) => { 
          e.preventDefault();
          const data = getValues();
          onSubmit(data);
        }}>
          <CustomTabPanel value={values} index={0}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {editField === 'firstName' ? (
                    <Input
                      {...register('firstName')}
                      label="First Name"
                      type='text'
                      placeholder='First Name'
                      error={errors.firstName}
                    />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('firstName')}>
                  <label>First Name</label>
                  <Typography className="input-like">{watch('firstName')}</Typography>
                  <IconButton onClick={() => handleEditClick('firstName')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'middleName' ? (
                <Input
                  {...register('middleName')}
                  label="Middle Name"
                  type='text'
                  placeholder='Middle Name'
                  error={errors.middleName}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('middleName')}>
                  <label>Middle Name</label>
                  <Typography className="input-like">{watch('middleName')}</Typography>
                  <IconButton onClick={() => handleEditClick('middleName')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'surname' ? (
                <Input
                  {...register('surname')}
                  label="Surname"
                  type='text'
                  placeholder='Surname'
                  error={errors.surname}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('surname')}>
                  <label>Surname</label>
                  <Typography className="input-like">{watch('surname')}</Typography>
                  <IconButton onClick={() => handleEditClick('surname')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              <Box className="input-box">
                <label>Email Address</label>
                <Typography className="input-like">{watch('email')}</Typography>
              </Box>
              {editField === 'nyscStateCode' ? (
                <Input
                  {...register('nyscStateCode')}
                  label="NYSC State Code"
                  type='text'
                  error={errors.email}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('nyscStateCode')}>
                  <label>NYSC State Code</label>
                  <Typography className="input-like">{watch('nyscStateCode')}</Typography>
                  <IconButton onClick={() => handleEditClick('nyscStateCode')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'phoneNumber' ? (
                <Input
                  {...register('phoneNumber')}
                  label="Phone Number"
                  type='text'
                  error={errors.phoneNumber}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('phoneNumber')}>
                  <label>Phone Number</label>
                  <Typography className="input-like">{watch('phoneNumber')}</Typography>
                  <IconButton onClick={() => handleEditClick('phoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'nyscStartYear' ? (
               <Controller
                control={control}
                name="nyscStartYear"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="NYSC Service year (start)"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {field.onChange(date);}}
                  />
                )}
              />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('nyscStartYear')}>
                  <label>NYSC Service Year (Start)</label>
                  <Typography className="input-like">{dayjs().format('YYYY-MM-DD')}</Typography>
                  <IconButton onClick={() => handleEditClick('nyscStartYear')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'nyscEndYear' ? (
                <Controller
                  control={control}
                  name="nyscEndYear"
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="NYSC Service year (end)"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => {field.onChange(date);}}
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('nyscEndYear')}>
                  <label>NYSC Service Year (End)</label>
                  <Typography className="input-like">{dayjs().format('YYYY-MM-DD')}</Typography>
                  <IconButton onClick={() => handleEditClick('nyscEndYear')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'courseOfStudy' ? (
                <Input
                  {...register('courseOfStudy')}
                  label="Course of Study"
                  type='text'
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('courseOfStudy')}>
                  <label>Course of Study</label>
                  <Typography className="input-like">{watch('courseOfStudy')}</Typography>
                  <IconButton onClick={() => handleEditClick('courseOfStudy')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'degreeAwarded' ? (
                <Input
                  {...register('degreeAwarded')}
                  label="Degree / Certificate Awarded"
                  type='text'
                  placeholder='Degree / Certificate Awarded'
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('degreeAwarded')}>
                  <label>Degree / Certificate Awarded</label>
                  <Typography className="input-like">{watch('degreeAwarded')}</Typography>
                  <IconButton onClick={() => handleEditClick('degreeAwarded')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'institutionAttended' ? (
                <Input
                  {...register('institutionAttended')}
                  label="Institution Attended"
                  type='text'
                  placeholder='Institution Attended'
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('institutionAttended')}>
                  <label>Institution Attended</label>
                  <Typography className="input-like">{watch('institutionAttended')}</Typography>
                  <IconButton onClick={() => handleEditClick('institutionAttended')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'classOfDegree' ? (
                <Controller
                  name='classOfDegree'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      label="Class of Degree"
                      value={watch('classOfDegree')}
                      options={[
                        { value: 'firstClass', label: 'First Class' },
                        { value: 'secondClassUpper', label: 'Second Class Upper' },
                        { value: 'secondClassLower', label: 'Second Class Lower' },
                      ]}
                      onChange={(value) => onChange('classOfDegree', value)}
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('classOfDegree')}>
                  <label>Class of Degree</label>
                  <Typography className="input-like">{watch('classOfDegree')}</Typography>
                  <IconButton onClick={() => handleEditClick('classOfDegree')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'coverLetter' ? (
                <Controller
                  name="coverLetter"
                  control={control}
                  defaultValue={watch('coverLetter')}
                  render={({ field }) => (
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder='Write cover letter'
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('coverLetter')}>
                  <label>Cover Letter</label>
                  <Typography className="input-like">{watch('coverLetter')}</Typography>
                  <IconButton onClick={() => handleEditClick('coverLetter')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </div>
            <div className="flex justify-end gap-5 mt-5">
              <Button type='submit' variant='black' label={loading ? "Submitting..." : "Update Profile and Continue"} disabled={loading} />
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={values} index={1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Box className="input-box" onClick={() => handleEditClick('businessName')}>
                <label>Business Name</label>
                <Typography className="input-like">{watch('businessName')}</Typography>
              </Box>
              {editField === 'businessPhoneNumber' ? (
                <Input
                  {...register('businessPhoneNumber')}
                  label="Business Phone Number"
                  type='text'
                  placeholder='Business Phone Number'
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('businessPhoneNumber')}>
                  <label>Business Phone Number</label>
                  <Typography className="input-like">{watch('businessPhoneNumber')}</Typography>
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'businessSector' ? (
                <Controller
                  name='businessSector'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      label="Business Sector"
                      value={value}
                      options={[
                        { value: 'product', label: 'Product' },
                        { value: 'service', label: 'Service' },
                      ]}
                      onChange={(value) => onChange('businessSector', value)}
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('businessSector')}>
                  <label>Business Sector</label>
                  <Typography className="input-like">{watch('businessSector')}</Typography>
                  <IconButton onClick={() => handleEditClick('businessSector')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'businessProfile' ? (
                <Controller
                name="coverLetter"
                control={control}
                defaultValue={watch('businessProfile')}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder='Business Profile'
                  />
                )}
              />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('businessProfile')}>
                  <label>Business Profile</label>
                  <Typography className="input-like">{watch('businessProfile')}</Typography>
                  <IconButton onClick={() => handleEditClick('businessProfile')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
          </div>
          {/* <div className="flex justify-end gap-5 mt-5">
            <Button type='submit' variant='black' label={loading ? "Submitting..." : (isSignup ? "Complete Signup" : "Update Profile")} disabled={loading} />
          </div> */}
          </CustomTabPanel>
        </form>

        <Snackbar open={state.open} onClose={() => setState({ ...state, open: false })} anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }} action={<IconButton color='info' onClick={handleSnackbarClick}><InfoIcon /></IconButton>} message="Click the icon for more details" >
          <Alert onClick={handleSnackbarClick} onClose={handleAlertClose} variant="filled" severity="info" sx={{ width: '100%', cursor: 'pointer' }} >
            Please click on each field to edit it. Note that some fields are not editable.
          </Alert>
        </Snackbar>
      
    </Box>
  );
};

export default Profile;