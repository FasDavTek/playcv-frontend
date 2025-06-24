import React, { useState, useEffect, useRef } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Input, DatePicker, Select, Button, RichTextEditor, useToast, } from '@video-cv/ui-components';
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
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import { useNavigate } from 'react-router-dom';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';
import model from './../../../../../libs/utils/helpers/model';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface State extends SnackbarOrigin {
  open: boolean;
}

const truncateText = (text: string, wordLimit: number) => {
  if (!text) return "";

  const strippedText = text.replace(/<[^>]*>?/gm, "")

  const words = strippedText.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return strippedText;
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
      middleName: z.string().min(1, "Middle name is required"),
      lastName: z.string().min(1, "Surname is required"),
      gender: z.string().min(1, "Gender is required"),
      genderId: z.number().nullable(),
      phoneNo: z.string().min(10, "Phone number must be at least 10 digits").max(11, 'Phone number must not be more than 11 digits'),
      email: z.string().email("Invalid email format"),
      dateOfBirth: z.date().refine(date => dayjs(date).isValid(), {
        message: "Invalid Date of birth",
      }),
      isProfessionalUser: z.boolean(),
      userId: z.string(),
    }),
    professionalDetails: z.object({
      nyscStateCode: z.string().min(4, 'NYSC State code is required'),
      nyscStartYear: z.number().int().nullable(),
      nyscEndYear: z.number().int().nullable(),
      course: z.string().min(1, "Course of study is required"),
      courseId: z.number().nullable(),
      degree: z.string().min(1, "Degree awarded is required"),
      degreeTypeId: z.number().nullable(),
      institution: z.string().min(1, "Institution attended is required"),
      institutionId: z.number().nullable(),
      classOfDegree: z.string().min(1, "Class of degree is required"),
      degreeClassId: z.number().nullable(),
      coverLetter: z.string().min(1, "Cover letter content is required"),
      businessName: z.string().min(3, "Business Name is required"),
      businessProfile: z.string().min(10, "Business Profile content is required"),
      businessPhone: z.string().min(10, "Business phone number must be at least 10 digits"),
      industry: z.string().min(1, "Business sector is required"),
      industryId: z.number().nullable(),
    }),
  }),
});

type FormData = z.infer<typeof schema>;

const Profile = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(0);
  const [editField, setEditField] = useState<string | null>(null);
  const fetchedCoursesRef = useRef(false);
  const { register, control, setValue, watch, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userProfile: {
        userDetails: {},
        professionalDetails: {},
      },
    },
  });

  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
  const userId = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID);
  

  const fetchUserData = async () => {
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_PROFILE}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.userProfile) {
        const { userDetails, professionalDetails } = resp.userProfile;
        
        // Object.entries(userDetails).forEach(([key, value]) => {
        //   if (key in schema.shape.userProfile.shape.userDetails.shape) {
        //     const fieldKey = key as keyof FormData['userProfile']['userDetails'];
        //     const fieldSchema = schema.shape.userProfile.shape.userDetails.shape[fieldKey];
            
        //     if (fieldSchema instanceof z.ZodString && typeof value === 'string') {
        //       setValue(`userProfile.userDetails.${fieldKey}`, value);
        //     }
        //     else if (fieldSchema instanceof z.ZodDate && value instanceof Date) {
        //       setValue(`userProfile.userDetails.${fieldKey}`, new Date(value));
        //     }
        //   }
        // });

        Object.entries(userDetails).forEach(([key, value]) => {
          if (key === 'dateOfBirth' && value) {
            if (typeof value === 'string' || typeof value === 'number') {
              setValue('userProfile.userDetails.dateOfBirth', new Date(value));
            }
          } 
          else {
            if (key in schema.shape.userProfile.shape.userDetails.shape) {
              const fieldKey = key as keyof FormData['userProfile']['userDetails'];
              const fieldSchema = schema.shape.userProfile.shape.userDetails.shape[fieldKey];

              if (fieldSchema instanceof z.ZodString && typeof value === 'string') {
                setValue(`userProfile.userDetails.${fieldKey}`, value);
              }
              else if (fieldSchema instanceof z.ZodBoolean && typeof value === 'boolean') {
                setValue(`userProfile.userDetails.${fieldKey}`, value);
              }
            }
          }
        });

        // Object.entries(professionalDetails).forEach(([key, value]) => {
        //   if (key in schema.shape.userProfile.shape.professionalDetails.shape) {
        //     const fieldKey = key as keyof FormData['userProfile']['professionalDetails'];
        //     const fieldSchema = schema.shape.userProfile.shape.professionalDetails.shape[fieldKey];
            
        //     if (fieldSchema instanceof z.ZodString && typeof value === 'string') {
        //       setValue(`userProfile.professionalDetails.${fieldKey}`, value);
        //     } 
        //     else if (fieldSchema instanceof z.ZodNumber && typeof value === 'number') {
        //       // setValue('userProfile.professionalDetails.nyscStartYear', professionalDetails.nyscStartYear)
        //       // setValue('userProfile.professionalDetails.nyscEndYear', professionalDetails.nyscEndYear)
        //       setValue(`userProfile.professionalDetails.${fieldKey}`, Number(value));
      
        //     }
        //   }
        // });


        Object.entries(professionalDetails).forEach(([key, value]) => {
          if ((key === 'nyscStartYear' || key === 'nyscEndYear') && value) {
            setValue(`userProfile.professionalDetails.${key}`, Number(value));
          } else {
              if (key in schema.shape.userProfile.shape.professionalDetails.shape) {
                const fieldKey = key as keyof FormData['userProfile']['professionalDetails'];
                const fieldSchema = schema.shape.userProfile.shape.professionalDetails.shape[fieldKey];
                
                if (fieldSchema instanceof z.ZodString && typeof value === 'string') {
                  setValue(`userProfile.professionalDetails.${fieldKey}`, value);
                }
              }
          }
        });

        // setValue('userProfile.userDetails.dateOfBirth', new Date(userDetails.dateOfBirth))
      }
    }
    catch (err) {
      if(!token) {
        showToast('Your session has expired. Please log in again', 'error');
        navigate('/');
      }
      else {
        showToast('Unable to load user profile', 'error');
      }
    }
  };


  useEffect(() => {
    fetchUserData();
  }, [setValue]);


  const { data: courses, isLoading: isLoadingCourses } = useAllMisc({
    resource: 'course',
    page: 1,
    limit: 100,
    download: true,
    structureType: 'full'
  });


  const { data: degreeClasses, isLoading: isLoadingDegreeClasses } = useAllMisc({
    resource: 'degree-class',
    page: 1,
    limit: 100,
    download: true,
    structureType: 'full'
  });

  const { data: qualifications, isLoading: isLoadingQualifications } = useAllMisc({
    resource: 'qualification',
    page: 1,
    limit: 100,
    download: true,
  });

  const { data: institutions, isLoading: isLoadingInstitutions } = useAllMisc({
    resource: 'institution',
    page: 1,
    limit: 100,
    download: true,
    structureType: 'full'
  });


  const { data: industry, isLoading: isLoadingIndustries } = useAllMisc({
    resource: 'industries',
    page: 1,
    limit: 100,
    download: true,
    structureType: 'full'
  });


  const genders = [
    { id: 1, genderName: 'Male' },
    { id: 2, genderName: 'Female' },
    { id: 3, genderName: 'Other' },
  ];


  useEffect(() => {
    if (courses && degreeClasses && institutions && industry && !fetchedCoursesRef.current) {
      fetchedCoursesRef.current = true; // Mark as fetched
    }
  }, [courses, degreeClasses, industry, institutions]);



  const submitForm = async (data: FormData) => {
    setLoading(true);

    try {


      const formattedData = {
        userProfile: {
          userDetails: {
            ...data.userProfile.userDetails,
            dateOfBirth: data.userProfile.userDetails.dateOfBirth || null,
            isProfessionalUser: true,
            userId: userId,
          },
          professionalDetails: {
            ...data.userProfile.professionalDetails,
            nyscStartYear: data.userProfile.professionalDetails.nyscStartYear,
            nyscEndYear: data.userProfile.professionalDetails.nyscEndYear,
            institution: data.userProfile.professionalDetails.institution,
            institutionId: data.userProfile.professionalDetails.institutionId,
            // nyscStartYear: Number(dayjs(data.userProfile.professionalDetails.nyscStartYear).year()),
            // nyscEndYear: data.userProfile.professionalDetails.nyscEndYear 
            //   ? Number(dayjs(data.userProfile.professionalDetails.nyscEndYear).year())
            //   : null,
          }
        }
      };

      const res = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PROFILE}`, formattedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.code === "00") {
        await fetchUserData();

        toast.success(`Wonderful! Your profile has been successfully modified.`);
        
        const updatedUser = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.USER) || '{}');
        updatedUser.userProfile = formattedData.userProfile;
        sessionStorage.setItem(SESSION_STORAGE_KEYS.USER, JSON.stringify(updatedUser));

        // sessionStorage.removeItem(SESSION_STORAGE_KEYS.SIGNUP_DATA);
      } else {
        showToast(`We couldn't complete your profile update. Another attempt might do the trick.`, 'error');
      }
    }
    catch (err: any) {
      if(!token) {
        showToast('Your session has expired. Please log in again', 'error');
        navigate('/');
      }
      else {
        showToast(err, 'error');
        showToast(`We encountered an issue updating your profile. Please try again.`, 'error');
      }
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
          submitForm(data);
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
              {editField === 'userProfile.userDetails.gender' ? (
                <Controller
                  name='userProfile.userDetails.gender'
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="Gender"
                      control={control}
                      placeholder='Select Gender'
                      defaultValue={genders.find(g => g.genderName === watch('userProfile.userDetails.gender'))}
                      options={genders.map(gender => ({ value: gender.id, label: gender.genderName }))}
                      handleChange={(newValue) => {
                        if (newValue.__isNew__) {
                          field.onChange(newValue?.value || newValue?.label);
                          setValue('userProfile.userDetails.gender', newValue?.label || '');
                          setValue('userProfile.userDetails.genderId', null);
                        } else {
                          field.onChange(newValue?.value || newValue?.label);
                          setValue('userProfile.userDetails.gender', newValue?.label);
                          setValue('userProfile.userDetails.genderId', newValue?.value);
                      } }}
                      isDisabled={false}
                      errors={errors}
                      allowCreate={false}
                    />
                  )}
                />
            
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.userDetails.gender')}>
                  <label>Gender</label>
                  <Typography className="input-like">{watch('userProfile.userDetails.gender')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.userDetails.gender')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
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
                  <Typography className="input-like">{watch('userProfile.professionalDetails.nyscStartYear')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.nyscStartYear')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.nyscEndYear' ? (
                <Controller
                  name="userProfile.professionalDetails.nyscEndYear"
                  control={control}
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
                  <Typography component='data' className="input-like">{watch('userProfile.professionalDetails.nyscEndYear')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.nyscEndYear')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.course' ? (
                <Controller
                    name='userProfile.professionalDetails.course'
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="Course of Study"
                        control={control}
                        placeholder='Course of sudy'
                        defaultValue={Array.isArray(courses) && courses?.find(c => c.courseName === watch('userProfile.professionalDetails.course'))}
                        options={model(courses, "courseName", "id")}
                        handleChange={(newValue) => { 
                        if (newValue.__isNew__) {
                          field.onChange(newValue?.value || newValue?.label);
                          setValue('userProfile.professionalDetails.course', newValue?.label || '');
                          setValue('userProfile.professionalDetails.courseId', null);
                        } else {
                          field.onChange(newValue?.value || newValue?.label);
                          setValue('userProfile.professionalDetails.course', newValue?.label);
                          setValue('userProfile.professionalDetails.courseId', newValue?.value);
                        } }}
                        isDisabled={isLoadingCourses}
                        errors={errors}
                        allowCreate={true}
                      />
                    )}
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
                <Controller
                  name='userProfile.professionalDetails.degree'
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="Degree / Certificate Awarded"
                      control={control}
                      placeholder="Institution attended"
                      defaultValue={Array.isArray(qualifications) &&  qualifications?.find(i => i.name === watch('userProfile.professionalDetails.degree'))}
                      options={model(qualifications, "name", "id")}
                      handleChange={(newValue) => { 
                      if (newValue.__isNew__) {
                        field.onChange(newValue?.value || newValue?.label);
                        setValue('userProfile.professionalDetails.degree', newValue?.label || '');
                        setValue('userProfile.professionalDetails.degreeTypeId', null);
                      } else {
                        field.onChange(newValue?.value || newValue?.label);
                        setValue('userProfile.professionalDetails.degree', newValue?.label);
                        setValue('userProfile.professionalDetails.degreeTypeId', newValue?.value);
                      } }}
                      isDisabled={isLoadingQualifications}
                      errors={errors}
                      allowCreate={true}
                    />
                  )}
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
                <Controller
                  name='userProfile.professionalDetails.institution'
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="Institution Attended"
                      control={control}
                      placeholder="Institution attended"
                      defaultValue={Array.isArray(institutions) &&  institutions?.find(i => i.institutionName === watch('userProfile.professionalDetails.institution'))}
                      options={model(institutions, "institutionName", "id")}
                      handleChange={(newValue) => { 
                      if (newValue.__isNew__) {
                        field.onChange(newValue?.value || newValue?.label);
                        setValue('userProfile.professionalDetails.institution', newValue?.label || '');
                        setValue('userProfile.professionalDetails.institutionId', null);
                      } else {
                        field.onChange(newValue?.value || newValue?.label);
                        setValue('userProfile.professionalDetails.institution', newValue?.label);
                        setValue('userProfile.professionalDetails.institutionId', newValue?.value);
                      } }}
                      isDisabled={isLoadingInstitutions}
                      errors={errors}
                      allowCreate={true}
                    />
                  )}
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
                  render={({ field }) => (
                    <Select
                      name="Class of Degree"
                      control={control}
                      placeholder="Class of degree"
                      defaultValue={Array.isArray(degreeClasses) &&  degreeClasses?.find(dc => dc.name === watch('userProfile.professionalDetails.classOfDegree'))}
                      options={model(degreeClasses, "name", "id")}
                      handleChange={(newValue) => { 
                      if (newValue.__isNew__) {
                        field.onChange(newValue?.value || newValue?.label);
                        setValue('userProfile.professionalDetails.classOfDegree', newValue?.label || '');
                        setValue('userProfile.professionalDetails.degreeClassId', null);
                      } else {
                        field.onChange(newValue?.value || newValue?.label);
                        setValue('userProfile.professionalDetails.classOfDegree', newValue?.label);
                        setValue('userProfile.professionalDetails.degreeClassId', newValue?.value);
                      } }}
                      isDisabled={isLoadingDegreeClasses}
                      errors={errors}
                      allowCreate={true}
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
                      maxChars={1200}
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.coverLetter')}>
                  <label>Cover Letter</label>
                  <Typography className="input-like">{truncateText(watch('userProfile.professionalDetails.coverLetter') || '', 1)}</Typography>
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
              {editField === 'userProfile.professionalDetails.businessName' ? (
                <Input
                  {...register('userProfile.professionalDetails.businessName')}
                  label="Business Name"
                  placeholder='Business Name'
                  error={errors.userProfile?.professionalDetails?.businessPhone}
                />
              ) : (
                <Box className="input-box">
                  <label>Business Name</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.businessName')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.businessName')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                      <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.businessPhone' ? (
                <Input
                  {...register('userProfile.professionalDetails.businessPhone')}
                  label="Business Phone Number"
                  type='text'
                  placeholder='Business Phone Number'
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.businessPhone')}>
                  <label>Business Phone Number</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.businessPhone')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.businessPhone')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
              {editField === 'userProfile.professionalDetails.industry' ? (
                <Controller
                  name='userProfile.professionalDetails.industry'
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="Business Sector"
                      control={control}
                      defaultValue={Array.isArray(industry) && industry?.find(i => i.name === watch('userProfile.professionalDetails.industry'))}
                      options={model(industry, 'name', 'id')}
                      handleChange={(newValue) => { 
                      if (newValue.__isNew__) {
                        field.onChange(newValue?.value || newValue?.label);
                        setValue('userProfile.professionalDetails.industry', newValue?.label || '');
                        setValue('userProfile.professionalDetails.industryId', null);
                      } else {
                        field.onChange(newValue?.value || newValue?.label);
                        setValue('userProfile.professionalDetails.industry', newValue?.label);
                        setValue('userProfile.professionalDetails.industryId', newValue?.value);
                      } }}
                      isDisabled={isLoadingIndustries}
                      errors={errors}
                      allowCreate={true}
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
                      value={watch('userProfile.professionalDetails.businessProfile')}
                      onChange={(value) => setValue('userProfile.professionalDetails.businessProfile', value)}
                      placeholder='Business Profile'
                      maxChars={600}
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.businessProfile')}>
                  <label>Business Profile</label>
                  <Typography className="input-like">{truncateText(watch('userProfile.professionalDetails.businessProfile') || '', 1)}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.businessProfile')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
          </div>
          <div className="flex justify-end gap-5 mt-5">
            <Button type='submit' variant='black' label={loading ? "Submitting..." : "Update Profile"} disabled={loading} />
          </div>
          </CustomTabPanel>
        </form>

        <Snackbar open={state.open} onClose={() => setState({ ...state, open: false })} anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }} action={<IconButton color='info' onClick={handleSnackbarClick}><InfoIcon /></IconButton>} message="Click the icon for more details" >
          <Alert onClick={handleSnackbarClick} onClose={handleAlertClose} severity="info" sx={{ width: '100%', cursor: 'pointer' }} >
            Please click on each field to edit it. Note that some fields are not editable.
          </Alert>
        </Snackbar>
      
    </Box>
  );
};

export default Profile;