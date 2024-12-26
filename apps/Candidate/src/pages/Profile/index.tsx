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
import model from './../../../../../libs/utils/helpers/model';
import courseModel from './../../../../../libs/utils/helpers/courseModel';

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
      middleName: z.string().min(1, "Middle name is required"),
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
      courseId: z.string(),
      degree: z.string().min(1, "Degree awarded is required"),
      degreeTypeId: z.string(),
      institution: z.string().min(1, "Institution attended is required"),
      institutionId: z.string(),
      degreeClass: z.string().min(1, "Class of degree is required"),
      degreeClassId: z.string(),
      coverLetter: z.string().min(1, "Cover letter content is required"),
      businessName: z.string().min(3, "Business Name is required"),
      businessProfile: z.string().min(10, "Business Profile content is required"),
      businessPhoneNumber: z.string().min(10, "Business phone number must be at least 10 digits"),
      industry: z.string().min(1, "Business sector is required"),
      industryId: z.string(),
    }),
  }),
});

type FormData = z.infer<typeof schema>;

const Profile = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(0);
  const [editField, setEditField] = useState<string | null>(null);
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

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  if (!token) {
    toast.error('Unable to load user profile. Please log in again.');
    return;
  };
  
  useEffect(() => {
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
          //       console.log(value)
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

          console.log('Fetched NYSC Start Year:', professionalDetails.nyscStartYear)
          console.log('Fetched NYSC End Year:', professionalDetails.nyscEndYear)
          // setValue('userProfile.userDetails.dateOfBirth', new Date(userDetails.dateOfBirth))
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

  console.log(courses)

  const { data: degreeClasses, isLoading: isLoadingDegreeClasses } = useAllMisc({
    resource: 'degree-class',
    page: 1,
    limit: 100,
    download: false,
  });

  // const { data: degreeTypes, isLoading: isLoadingDegreeTypes } = useAllMisc({
  //   resource: 'degree-type',
  //   page: 1,
  //   limit: 100,
  //   download: false,
  // });

  const { data: institutions, isLoading: isLoadingInstitutions } = useAllMisc({
    resource: 'institution',
    page: 1,
    limit: 100,
    download: false,
  });

  console.log(institutions)

  const { data: industry, isLoading: isLoadingIndustries } = useAllMisc({
    resource: 'industries',
    page: 1,
    limit: 100,
    download: false,
  });

  console.log(industry)

  const createNewEntry = async (resource: string, data: any) => {
    try {
      console.log(resource);
      const endpoint = resource === 'course' ? apiEndpoints.COURSE : resource === 'degree-class' ? apiEndpoints.DEGREE_CLASS : resource === 'industry' ? apiEndpoints.INDUSTRY : apiEndpoints.INSTITUTION;
      const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      let industryId = null;
      let institutionId = null;

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
      if (data.userProfile.professionalDetails.degreeClass) {
        const existingDegreeClass = degreeClasses?.find(dc => dc.name === data.userProfile.professionalDetails.degreeClass);
        if (existingDegreeClass) {
          degreeClassId = existingDegreeClass.id;
        } else {
          const newDegreeClass = await createNewEntry('degree-class', { name: data.userProfile.professionalDetails.degreeClass });
          if (newDegreeClass) {
            degreeClassId = newDegreeClass.id;
          }
        }
      }


      // Handle degree type
      if (data.userProfile.professionalDetails?.degree) {
        const existingInstitution = institutions?.find(dc => dc.name === data.userProfile.professionalDetails.institution);
        if (existingInstitution) {
          institutionId = existingInstitution.id;
        } else {
          const newDegreeType = await createNewEntry('institution', { name: data.userProfile.professionalDetails.institution });
          if (newDegreeType) {
            institutionId = newDegreeType.id;
          }
        }
      }


      if (data.userProfile.professionalDetails.industry) {
        const existingIndustry = industry?.find(c => c.name === data.userProfile.professionalDetails.industry);
        if (existingIndustry) {
          industryId = existingIndustry.id;
        } else {
          const newInstitution = await createNewEntry('industry', { name: data.userProfile.professionalDetails.industry });
          if (newInstitution) {
            industryId = newInstitution.id;
          }
        }
      }


      const formattedData = {
        ...data,
        userProfile: {
          ...data.userProfile,
          userDetails: {
            ...data.userProfile.userDetails,
            dateOfBirth: data.userProfile.userDetails.dateOfBirth || null,
            isProfessionalUser: true,
          },
          professionalDetails: {
            ...data.userProfile.professionalDetails,
            degreeTypeId: degreeTypeId,
            degree: degreeTypeId ? 6 : data.userProfile.professionalDetails.degree,
            courseId: courseId,
            course: courseId ? null : data.userProfile.professionalDetails.course,
            degreeClassId: degreeClassId,
            degreeClass: degreeClassId ? null : data.userProfile.professionalDetails.degreeClass,
            industryId: industryId,
            industry: industryId ? null : data.userProfile.professionalDetails.industry,
            institutionId: institutionId,
            institution: institutionId ? null : data.userProfile.professionalDetails.institution,
            nyscStartYear: data.userProfile.professionalDetails.nyscStartYear,
            nyscEndYear: data.userProfile.professionalDetails.nyscEndYear,
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
                    name='userProfile.professionalDetails.courseId'
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="Course of Study"
                        control={control}
                        placeholder='Course of sudy'
                        defaultValue={Array.isArray(courses) ? courses?.find(c => c.id === watch('userProfile.professionalDetails.courseId')) : null}
                        options={model(courses, "courseName", "id")}
                        handleChange={(newValue) => field.onChange(newValue?.value)}
                        isDisabled={isLoadingCourses}
                        errors={errors}
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
                <Controller
                  name='userProfile.professionalDetails.institutionId'
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="Institution Attended"
                      control={control}
                      placeholder="Institution attended"
                      defaultValue={Array.isArray(institutions) ?  institutions?.find(i => i.id === watch('userProfile.professionalDetails.institutionId')) : null}
                      options={model(institutions, "name", "id")}
                      handleChange={(newValue) => field.onChange(newValue?.value)}
                      isDisabled={isLoadingInstitutions}
                      errors={errors}
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
              {editField === 'userProfile.professionalDetails.degreeClass' ? (
                <Controller
                  {...register('userProfile.professionalDetails.degreeClassId')}
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="Class of Degree"
                      control={control}
                      placeholder="Class of degree"
                      defaultValue={Array.isArray(degreeClasses) ?  degreeClasses?.find(dc => dc.id === watch('userProfile.professionalDetails.degreeClassId')) : null}
                      options={model(degreeClasses, "name", "id")}
                      handleChange={(newValue) => field.onChange(newValue?.value)}
                      isDisabled={isLoadingDegreeClasses}
                      errors={errors}
                    />
                  )}
                />
              ) : (
                <Box className="input-box" onClick={() => handleEditClick('userProfile.professionalDetails.degreeClass')}>
                  <label>Class of Degree</label>
                  <Typography className="input-like">{watch('userProfile.professionalDetails.degreeClass')}</Typography>
                  <IconButton onClick={() => handleEditClick('userProfile.professionalDetails.degreeClass')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
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
              {editField === 'userProfile.professionalDetails.businessName' ? (
                <Input
                  {...register('userProfile.professionalDetails.businessName')}
                  label="Business Name"
                  placeholder='Business Name'
                  error={errors.userProfile?.professionalDetails?.businessPhoneNumber}
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
                  {...register('userProfile.professionalDetails.industryId')}
                  control={control}
                  render={({ field }) => (
                    <Select
                      name="Business Sector"
                      control={control}
                      defaultValue={Array.isArray(industry) ? industry?.find(i => i.id === watch('userProfile.professionalDetails.industryId')) : null}
                      options={model(industry, 'name', 'id')}
                      handleChange={(newValue) => field.onChange(newValue?.value)}
                      isDisabled={isLoadingIndustries}
                      errors={errors}
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