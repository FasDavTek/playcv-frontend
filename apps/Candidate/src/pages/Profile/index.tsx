import React, { useState, useEffect } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import {
  Input,
  DatePicker,
  Select,
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
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { useNavigate } from 'react-router-dom';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';

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
  userProfile: z.object({
    userDetails: z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().optional(),
      lastName: z.string().min(1, "Surname is required"),
      phoneNo: z.string().min(10, "Phone number must be at least 10 digits").max(11, 'Phone number must not be more than 11 digits'),
      email: z.string().email("Invalid email format"),
      dateOfBirth: z.date().refine(date => dayjs(date).isValid(), {
        message: "Invalid Date of birth",
      }),
      isProfessionalUser: z.boolean(),
    }),
    professionalDetails: z.object({
      nyscStateCode: z.string().min(4, 'NYSC State code is required'),
      nyscStartYear: z.number().int().nullable(),
      nyscEndYear: z.number().int().nullable(),
      course: z.string().min(1, "Course of study is required"),
      degree: z.string().min(1, "Degree awarded is required"),
      degreeTypeId: z.number().optional(),
      institution: z.string().min(1, "Institution attended is required"),
      classOfDegree: z.string().min(1, "Class of degree is required"),
      coverLetter: z.string().min(1, "Cover letter content is required"),
      businessName: z.string().optional(),
      businessProfile: z.string().optional(),
      businessPhoneNumber: z.string().min(10, "Business phone number must be at least 10 digits"),
      industry: z.string().min(1, "Business sector is required"),
    }),
  }),
});

type FormData = z.infer<typeof schema>;

const Profile = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(0);
  const [editField, setEditField] = useState<string | null>(null);
  const [lastEditedField, setLastEditedField] = useState<string | null>(null);
  const { register, control, setValue, watch, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userProfile: {
        userDetails: {},
        professionalDetails: {},
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        if (!token) {
          toast.error('Unable to load user profile');
          return;
        }
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_PROFILE}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resp.userProfile) {
          const { userDetails, professionalDetails } = resp.userProfile;
          
          Object.entries(userDetails).forEach(([key, value]) => {
            if (key in schema.shape.userProfile.shape.userDetails.shape) {
              const fieldKey = key as keyof FormData['userProfile']['userDetails'];
              const fieldSchema = schema.shape.userProfile.shape.userDetails.shape[fieldKey];
              
              if (fieldSchema instanceof z.ZodString && typeof value === 'string') {
                setValue(`userProfile.userDetails.${fieldKey}`, value);
              } else if (fieldSchema instanceof z.ZodDate && value instanceof Date) {
                setValue(`userProfile.userDetails.${fieldKey}`, value);
              }
            }
          });
          Object.entries(professionalDetails).forEach(([key, value]) => {
            if (key in schema.shape.userProfile.shape.professionalDetails.shape) {
              const fieldKey = key as keyof FormData['userProfile']['professionalDetails'];
              const fieldSchema = schema.shape.userProfile.shape.professionalDetails.shape[fieldKey];
              
              if (fieldSchema instanceof z.ZodString && typeof value === 'string') {
                setValue(`userProfile.professionalDetails.${fieldKey}`, value);
              } else if (fieldSchema instanceof z.ZodNumber && typeof value === 'number') {
                setValue(`userProfile.professionalDetails.${fieldKey}`, value);
              }
            }
          });

          setValue('userProfile.userDetails.dateOfBirth', userDetails.dateOfBirth || '')
          setValue('userProfile.professionalDetails.nyscStartYear', professionalDetails.nyscStartYear || '')
          setValue('userProfile.professionalDetails.nyscEndYear', professionalDetails.nyscEndYear || '')
        }
      }
      catch (err) {
        toast.error('Unable to load user profile');
      }
    };
    fetchUserData();
  }, [setValue]);


  const { data: courses, isLoading: isLoadingCourses } = useAllMisc({
    resource: 'course',
    page: 1,
    limit: 100,
    download: false,
  });

  const { data: degreeClasses, isLoading: isLoadingDegreeClasses } = useAllMisc({
    resource: 'degree-class',
    page: 1,
    limit: 100,
    download: false,
  });

  const { data: degreeTypes, isLoading: isLoadingDegreeTypes } = useAllMisc({
    resource: 'degree-type',
    page: 1,
    limit: 100,
    download: false,
  });

  const createNewEntry = async (resource: string, data: any) => {
    try {
      const endpoint = resource === 'course' ? apiEndpoints.COURSE : apiEndpoints.DEGREE_CLASS;
      const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, data);
      if (response.code === "200") {
        toast.success(`New ${resource} created successfully`);
        return response.data;
      } else {
        toast.error(`Failed to create new ${resource}`);
        return null;
      }
    } catch (error) {
      console.error(`Error creating new ${resource}:`, error);
      toast.error(`Error creating new ${resource}`);
      return null;
    }
  };



  useEffect(() => {
    const subscription = watch((data) => data);
    return () => subscription.unsubscribe();
  }, [watch]);




  const onSubmit = async (data: FormData) => {
    setLoading(true);
    
    try {
      let courseId = null;
      let degreeClassId = null;
      let degreeTypeId = null;

      // Handle course
      if (data.userProfile.professionalDetails.course) {
        const existingCourse = courses?.find(c => c.name === data.userProfile.professionalDetails.course);
        if (existingCourse) {
          courseId = existingCourse.id;
        } else {
          const newCourse = await createNewEntry('course', { name: data.userProfile.professionalDetails.course });
          if (newCourse) {
            courseId = newCourse.id;
          }
        }
      }

      // Handle degree class
      if (data.userProfile.professionalDetails.classOfDegree) {
        const existingDegreeClass = degreeClasses?.find(dc => dc.name === data.userProfile.professionalDetails.classOfDegree);
        if (existingDegreeClass) {
          degreeClassId = existingDegreeClass.id;
        } else {
          const newDegreeClass = await createNewEntry('degree-class', { name: data.userProfile.professionalDetails.classOfDegree });
          if (newDegreeClass) {
            degreeClassId = newDegreeClass.id;
          }
        }
      }


      // Handle degree type
      if (data.userProfile.professionalDetails?.degree) {
        const existingDegreeType = degreeTypes?.find(dc => dc.name === data.userProfile.professionalDetails.degree);
        if (existingDegreeType) {
          degreeTypeId = existingDegreeType.id;
        } else {
          const newDegreeType = await createNewEntry('degree', { name: data.userProfile.professionalDetails.degree });
          if (newDegreeType) {
            degreeTypeId = newDegreeType.id;
          }
        }
      }


      const formattedData = {
        ...data,
        userProfile: {
          ...data.userProfile,
          userDetails: {
            ...data.userProfile.userDetails,
            // dateOfBirth: data.userProfile.userDetails.dateOfBirth 
            //   ? dayjs(data.userProfile.userDetails.dateOfBirth).format('DD-MM-YYYY')
            //   : null,
              isProfessionalUser: true,
              degreeTypeId: degreeTypeId,
              degree: degreeTypeId ? null : data.userProfile.professionalDetails.degree,
              courseId: courseId,
              course: courseId ? null : data.userProfile.professionalDetails.course,
              degreeClassId: degreeClassId,
              classOfDegree: degreeClassId ? null : data.userProfile.professionalDetails.classOfDegree,
          },
          professionalDetails: {
            ...data.userProfile.professionalDetails,
            degreeTypeId: degreeTypeId,
            degree: degreeTypeId ? null : data.userProfile.professionalDetails.degree,
            courseId: courseId,
            course: courseId ? null : data.userProfile.professionalDetails.course,
            degreeClassId: degreeClassId,
            classOfDegree: degreeClassId ? null : data.userProfile.professionalDetails.classOfDegree,
            nyscStartYear: data.userProfile.professionalDetails.nyscStartYear 
              ? Number(dayjs(data.userProfile.professionalDetails.nyscStartYear).year())
              : null,
            nyscEndYear: data.userProfile.professionalDetails.nyscEndYear 
              ? Number(dayjs(data.userProfile.professionalDetails.nyscEndYear).year())
              : null,
          }
        }
      };

      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
      if (!token) {
        toast.error('You are not authenticated. Please log in again.');
        return;
      }

      const res = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PROFILE}`, formattedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.code === "00") {
        toast.success(`Wonderful! Your profile has been successfully modified.`);
        
        const updatedUser = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || '{}');
        updatedUser.userProfile = formattedData.userProfile;
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(updatedUser));

        // localStorage.removeItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA);
      } else {
        toast.error(`We couldn't complete your profile update. Another attempt might do the trick.`);
      }
    }
    catch (err: any) {
      toast.error(err);
      toast.error(`We encountered an issue updating your profile. Please try again.`);
    }
    finally {
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
            {editField === 'userDetails.firstName' ? (
                    <Input
                      {...register('userProfile.userDetails.firstName')}
                      label="First Name"
                      type='text'
                      placeholder='First Name'
                      error={errors.userProfile?.userDetails?.firstName}
                    />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.userDetails.firstName')}>
                  <label>First Name</label>
                  <Typography className="input-like">{watch('userProfile.userDetails.firstName')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.userDetails.firstName')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.userDetails.middleName' ? (
                <Input
                  {...register('userProfile.userDetails.middleName')}
                  label="Middle Name"
                  type='text'
                  placeholder='Middle Name'
                  error={errors.userProfile?.userDetails?.middleName}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.userDetails.middleName')}>
                  <label>Middle Name</label>
                  <Typography className="input-like">{watch('userProfile.userDetails.middleName')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.userDetails.middleName')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.userDetails.lastName' ? (
                <Input
                  {...register('userProfile.userDetails.lastName')}
                  label="Surname"
                  type='text'
                  placeholder='Surname'
                  error={errors.userProfile?.userDetails?.lastName}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('lastName')}>
                  <label>Surname</label>
                  <Typography className="input-like">{watch('userProfile.userDetails.lastName')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.userDetails.lastName')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              <Box className="input-box">
                <label>Email Address</label>
                <Typography className="input-like">{watch('userProfile.userDetails.email')}</Typography>
              </Box>
              {editField === 'userProfile.userDetails.phoneNo' ? (
                <Input
                  {...register('userProfile.userDetails.phoneNo')}
                  label="Phone Number"
                  type='text'
                  error={errors.userProfile?.userDetails?.phoneNo}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.userDetails.phoneNo')}>
                  <label>Phone Number</label>
                  <Typography className="input-like">{watch('userProfile.userDetails.phoneNo')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.userDetails.phoneNo')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.userDetails.dateOfBirth' ? (
               <Controller
                control={control}
                name="userProfile.userDetails.dateOfBirth"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Date of birth"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => {field.onChange(date ? date.toDate() : null);}}
                  />
                )}
              />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.userDetails.dateOfBirth')}>
                  <label>Date Of Birth</label>
                  <Typography className="input-like">{watch('userProfile.userDetails.dateOfBirth') ? dayjs(watch('userProfile.userDetails.dateOfBirth')).format('MMMM D, YYYY') : null}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.userDetails.dateOfBirth')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.nyscStateCode' ? (
                <Input
                  {...register('userProfile.professionalDetails.nyscStateCode')}
                  label="NYSC State Code"
                  type='text'
                  error={errors.userProfile?.professionalDetails?.nyscStateCode}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.nyscStateCode')}>
                  <label>NYSC State Code</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.nyscStateCode')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.nyscStateCode')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.nyscStartYear' ? (
               <Controller
                control={control}
                name="userProfile.professionalDetails.nyscStartYear"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="NYSC Service year (start)"
                    value={field.value ? dayjs().year(field.value) : null}
                    onChange={(date) => {field.onChange(date ? date.year() : null);}}
                    views={['year']}
                  />
                )}
              />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.nyscStartYear')}>
                  <label>NYSC Service Year (Start)</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.nyscStartYear') || 'Pick a date'}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.nyscStartYear')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.nyscEndYear' ? (
                <Controller
                  control={control}
                  name="userProfile.professionalDetails.nyscEndYear"
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="NYSC Service year (end)"
                      value={field.value ? dayjs().year(field.value) : null}
                      onChange={(date) => {field.onChange(date ? date.year() : null);}}
                      views={['year']}
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.nyscEndYear')}>
                  <label>NYSC Service Year (End)</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.nyscEndYear') || 'Pick a date'}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.nyscEndYear')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.course' ? (
                <Input
                  {...register('userProfile.professionalDetails.course')}
                  label="Course of Study"
                  type='text'
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.course')}>
                  <label>Course of Study</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.course')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.course')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.degree' ? (
                <Input
                  {...register('userProfile.professionalDetails.degree')}
                  label="Degree / Certificate Awarded"
                  type='text'
                  placeholder='Degree / Certificate Awarded'
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.degree')}>
                  <label>Degree / Certificate Awarded</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.degree')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.degree')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.institution' ? (
                <Input
                  {...register('userProfile.professionalDetails.institution')}
                  label="Institution Attended"
                  type='text'
                  placeholder='Institution Attended'
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.institution')}>
                  <label>Institution Attended</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.institution')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.institution')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.classOfDegree' ? (
                <Controller
                  name='userProfile.professionalDetails.classOfDegree'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      label="Class of Degree"
                      value={watch('userProfile.professionalDetails.classOfDegree')}
                      options={[
                        { value: 'firstClass', label: 'First Class' },
                        { value: 'secondClassUpper', label: 'Second Class Upper' },
                        { value: 'secondClassLower', label: 'Second Class Lower' },
                      ]}
                      onChange={(value) => onChange(value)}
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.classOfDegree')}>
                  <label>Class of Degree</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.classOfDegree')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.classOfDegree')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.coverLetter' ? (
                <Controller
                  name="userProfile.professionalDetails.coverLetter"
                  control={control}
                  defaultValue={watch('userProfile.professionalDetails.coverLetter')}
                  render={({ field }) => (
                    <RichTextEditor
                      value={watch('userProfile.professionalDetails.coverLetter')}
                      onChange={(value) => setValue('userProfile.professionalDetails.coverLetter', value)}
                      placeholder='Write cover letter'
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.coverLetter')}>
                  <label>Cover Letter</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.coverLetter')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.coverLetter')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </div>
            <div className="flex justify-end gap-5 mt-5">
              <Button type='submit' variant='black' label={loading ? "Submitting..." : "Update Profile"} disabled={loading} />
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={values} index={1}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.businessName')}>
                <label>Business Name</label>
                <Typography className="input-like">{watch('userProfile.professionalDetails.businessName')}</Typography>
              </Box>
              {editField === 'userProfile.professionalDetails.businessPhoneNumber' ? (
                <Input
                  {...register('userProfile.professionalDetails.businessPhoneNumber')}
                  label="Business Phone Number"
                  type='text'
                  placeholder='Business Phone Number'
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.businessPhoneNumber')}>
                  <label>Business Phone Number</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.businessPhoneNumber')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.industry' ? (
                <Controller
                  name='userProfile.professionalDetails.industry'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      label="Business Sector"
                      value={value}
                      options={[
                        { value: 'product', label: 'Product' },
                        { value: 'service', label: 'Service' },
                      ]}
                      onChange={(value) => onChange(value)}
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.industry')}>
                  <label>Business Sector</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.industry')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.industry')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.businessProfile' ? (
                <Controller
                  name="userProfile.professionalDetails.businessProfile"
                  control={control}
                  defaultValue={watch('userProfile.professionalDetails.businessProfile')}
                  render={({ field }) => (
                    <RichTextEditor
                      value={watch('userProfile.professionalDetails.businessProfile') || ''}
                      onChange={(value) => setValue('userProfile.professionalDetails.businessProfile', value)}
                      placeholder='Business Profile'
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.businessProfile')}>
                  <label>Business Profile</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.businessProfile')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.businessProfile')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
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