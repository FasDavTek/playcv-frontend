import React, { useState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Input, Select, Button, DatePicker } from '@video-cv/ui-components';
import dayjs from 'dayjs';
import { Snackbar, Alert, SnackbarOrigin, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';

interface State extends SnackbarOrigin {
  open: boolean;
}

const schema = z.object({
  userProfile: z.object({
    userDetails: z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().optional(),
      lastName: z.string().min(1, "Surname is required"),
      email: z.string().email("Invalid email format"),
      phoneNo: z.string().min(10, "Phone number must be at least 10 digits").max(11, 'Phone number must not be more than 11 digits'),
      dateOfBirth: z.date().refine(date => dayjs(date).isValid(), {
        message: "Invalid Date of birth",
      }),
      isBusinessUser: z.boolean(),
    }),
    businessDetails: z.object({
      businessName: z.string().min(1, "Business name is required"),
      businessPhoneNumber: z.string().min(10, "Business phone number must be at least 10 digits"),
      industry: z.string().min(1, "Business sector is required"),
      industryId: z.number().optional(),
      businessEmail: z.string().email("Invalid email format"),
      websiteUrl: z.string().url().optional().or(z.literal('')),
      fbLink: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
      instagramUrl: z.string().url().optional().or(z.literal('')),
      address: z.string().min(1, "Business address is required"),
      contactName: z.string().min(1, "Contact person name is required"),
      contactPosition: z.string().min(1, "Contact person role is required"),
      contactPhone: z.string().min(10, "Contact person's phone number must be at least 10 digits"),
    }),
  }),
})

// const schema = baseSchema.refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

type FormData = z.infer<typeof schema>;

const Profile = () => {
  const navigate = useNavigate();
  const [editField, setEditField] = useState<string | null>(null);
  const [lastEditedField, setLastEditedField] = useState<string | null>(null);
  const { register, control, setValue, watch, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userProfile: {
        userDetails: {},
        businessDetails: {},
      }
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(true);

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
          const { userDetails, businessDetails } = resp.userProfile;

          Object.entries(userDetails).forEach(([key, value]) => {
            if (key in schema.shape.userProfile.shape.userDetails.shape) {
              const fieldKey = key as keyof FormData['userProfile']['userDetails'];
              const fieldSchema = schema.shape.userProfile.shape.userDetails.shape[fieldKey];
              
              if (fieldSchema instanceof z.ZodString && typeof value === 'string') {
                setValue(`userProfile.userDetails.${fieldKey}`, value);
              }
              else if (fieldSchema instanceof z.ZodDate && value instanceof Date) {
                setValue(`userProfile.userDetails.${fieldKey}`, value);
              }
            }
          });
          Object.entries(businessDetails).forEach(([key, value]) => {
            if (key in schema.shape.userProfile.shape.businessDetails.shape) {
              const fieldKey = key as keyof FormData['userProfile']['businessDetails'];
              const fieldSchema = schema.shape.userProfile.shape.businessDetails.shape[fieldKey];
              
              if (fieldSchema instanceof z.ZodString && typeof value === 'string') {
                setValue(`userProfile.businessDetails.${fieldKey}`, value);
              } 
              else if (fieldSchema instanceof z.ZodNumber && typeof value === 'number') {
                setValue(`userProfile.businessDetails.${fieldKey}`, value);
              }
            }
          });

          setValue('userProfile.userDetails.dateOfBirth', userDetails.dateOfBirth || '')
          setValue('userProfile.businessDetails.websiteUrl', businessDetails.websiteUrl || '')
          setValue('userProfile.businessDetails.fbLink', businessDetails.fbLink || '')
          setValue('userProfile.businessDetails.twitter', businessDetails.twitter || '')
          setValue('userProfile.businessDetails.instagramUrl', businessDetails.instagramUrl || '')
        }
      }
      catch (err) {
        toast.error('Unable to load user profile');
      }
    };
    fetchUserData();
  }, [setValue]);



  const { data: industry, isLoading: isLoadingDegreeClasses } = useAllMisc({
    resource: 'industry',
    page: 1,
    limit: 100,
    download: false,
  });



  const createNewEntry = async (resource: string, data: any) => {
    try {
      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.INDUSTRY}`, data);
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




  const submitForm = async (data: FormData) => {
    // console.log("Submit form called", data);
    setLoading(true);
    
    try {
      let industryId = null;

      if (data.userProfile.businessDetails.industry) {
        const existingIndustry = industry?.find(c => c.name === data.userProfile.businessDetails.industry);
        if (existingIndustry) {
          industryId = existingIndustry.id;
        } else {
          const newCourse = await createNewEntry('industry', { name: data.userProfile.businessDetails.industry });
          if (newCourse) {
            industryId = newCourse.id;
          }
        }
      }

      const combinedData = {
        ...data,
        userProfile: {
          ...data.userProfile,
          userDetails: {
            ...data.userProfile.userDetails,
            isBusinessUser: true,
          },
          businessDetails: {
            ...data.userProfile.businessDetails,
            industryId: industryId,
            course: industryId ? null : data.userProfile.businessDetails.industry,
          }
        }
      };

      const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
      if (!token) {
        toast.error('You are not authenticated. Please log in again.');
        return;
      }

      // const endpoint = isSignup ? apiEndpoints.AUTH_REGISTER : apiEndpoints.PROFILE;
      const res = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PROFILE}`, combinedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.code === "201") {
        toast.success(`Wonderful! Your profile has been successfully modified.`);
        
        const updatedUser = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || '{}');
        updatedUser.userProfile = combinedData.userProfile;
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ updatedUser }));

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

  const handleEditClick = (fieldName: string) => {
    setEditField(fieldName);
    setLastEditedField(fieldName);
  };

  const handleSnackbarClick = () => {
    setOpen(true);
  };

  const handleAlertClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: '90%', marginInline: 'auto' }}>
      <Box >
        <form onSubmit={(e) => { 
          e.preventDefault();
          const data = getValues();
          submitForm(data);
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-8">
            {editField === 'firstName' ? (
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
              <Box className="input-box" onClick={() => handleEditClick('userProfile.userDetails.lastName')}>
                <label>Surname</label>
                <Typography className="input-like">{watch('userProfile.userDetails.lastName')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.userDetails.lastName')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.userDetails.email' ? (
              <Input
                {...register('userProfile.userDetails.email')}
                label="Email"
                type='email'
                placeholder='Email'
                error={errors.userProfile?.userDetails?.email}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.userDetails.email')}>
                <label>Email</label>
                <Typography className="input-like">{watch('userProfile.userDetails.email')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.userDetails.email')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.userDetails.phoneNo' ? (
              <Input
                {...register('userProfile.userDetails.phoneNo')}
                label="Phone Number"
                type='tel'
                placeholder='Phone Number'
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
            {editField === 'userProfile.businessDetails.businessName' ? (
              <Input
                {...register('userProfile.businessDetails.businessName')}
                label="Business Name"
                placeholder='Business Name'
                error={errors.userProfile?.businessDetails?.businessPhoneNumber}
              />
            ) : (
              <Box className="input-box">
                <label>Business Name</label>
                <Typography className="input-like">{watch('userProfile.businessDetails.businessName')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.businessName')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.businessPhoneNumber' ? (
              <Input
                {...register('userProfile.businessDetails.businessPhoneNumber')}
                label="Business Phone Number"
                type='tel'
                placeholder='Business Phone Number'
                error={errors.userProfile?.businessDetails?.businessPhoneNumber}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.businessPhoneNumber')}>
                <label>Business Phone Number</label>
                <Typography className="input-like" >{watch('userProfile.businessDetails.businessPhoneNumber')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.industry' ? (
              <Controller
                {...register('userProfile.businessDetails.industry')}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    label="Industry"
                    value={value}
                    {...register('userProfile.businessDetails.industry')}
                    options={[{ value: 'product', label: 'Product' }]}
                    onChange={(value) => onChange(value)}
                  />
                )}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.industry')}>
                <label>Industry</label>
                <Typography className="input-like" >{watch('userProfile.businessDetails.industry')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.industry')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.websiteUrl' ? (
              <Input
                {...register("userProfile.businessDetails.websiteUrl")}
                label="Website Url (Optional)"
                type='text'
                placeholder='Website Url'
                error={errors.userProfile?.businessDetails?.websiteUrl}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.websiteUrl')}>
                <label>Website URL (Optional)</label>
                <p className="input-like">
                    <a href={watch('userProfile.businessDetails.websiteUrl')} target="_blank" rel="noopener noreferrer">
                      {watch('userProfile.businessDetails.websiteUrl')}
                    </a>
                </p>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.websiteUrl')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.fbLink' ? (
              <Input
                {...register("userProfile.businessDetails.fbLink")}
                label="Facebook Page Link"
                type='text'
                placeholder='Facebook Page Link'
                error={errors.userProfile?.businessDetails?.fbLink}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.fbLink')}>
                <label>Facebook Page Link</label>
                <p className="input-like">
                  <a href={watch('userProfile.businessDetails.fbLink')} target="_blank" rel="noopener noreferrer">
                      {watch('userProfile.businessDetails.fbLink')}
                  </a>
                </p>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.fbLink')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.twitter' ? (
              <Input
                {...register("userProfile.businessDetails.twitter")}
                label="Twitter Page Link"
                type='text'
                placeholder='Twitter Page Link'
                error={errors.userProfile?.businessDetails?.twitter}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.twitter')}>
                <label>Twitter Page Link</label>
                <p className="input-like">
                  <a href={watch('userProfile.businessDetails.twitter')} target="_blank" rel="noopener noreferrer">
                      {watch('userProfile.businessDetails.twitter')}
                  </a>
                </p>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.twitter')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.instagramUrl' ? (
              <Input
                {...register("userProfile.businessDetails.instagramUrl")}
                label="Instagram Page Link"
                type='text'
                placeholder='Instagram Page Link'
                error={errors.userProfile?.businessDetails?.instagramUrl}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.instagramUrl')}>
                <label>Instagram Page Link</label>
                <Typography className="input-like">{watch('userProfile.businessDetails.instagramUrl')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.instagramUrl')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.address' ? (
              <Input
                {...register("userProfile.businessDetails.address")}
                label="Office Address"
                type='text'
                placeholder='Office Address'
                error={errors.userProfile?.businessDetails?.address}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.address')}>
                <label>Office Address</label>
                <Typography className="input-like">{watch('userProfile.businessDetails.address')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.address')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.contactName' ? (
              <Input
                {...register("userProfile.businessDetails.contactName")}
                label="Contact Person Name"
                type='text'
                placeholder='Contact Person Name'
                error={errors.userProfile?.businessDetails?.contactName}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.contactName')}>
                <label>Contact Person Name</label>
                <Typography className="input-like">{watch('userProfile.businessDetails.contactName')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.contactName')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.contactPosition' ? (
              <Input
                {...register("userProfile.businessDetails.contactPosition")}
                label="Contact Person Position"
                type='text'
                placeholder='Contact Person Position'
                error={errors.userProfile?.businessDetails?.contactPosition}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.contactPosition')}>
                <label>Contact Person Position</label>
                <Typography className="input-like">{watch('userProfile.businessDetails.contactPosition')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.contactPosition')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.contactPhone' ? (
              <Input
                {...register('userProfile.businessDetails.contactPhone')}
                label="Phone Number"
                type='tel'
                placeholder='Phone Number'
                error={errors.userProfile?.businessDetails?.contactPhone}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.contactPhone')}>
                <label>Contact Person Phone Number</label>
                <Typography className="input-like">{watch('userProfile.businessDetails.contactPhone')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.contactPhone')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </div>

          <Button type='submit' variant="black" disabled={loading} label={loading ? "Submitting..." : "Update Profile"} className='mt-5' />
        </form>
      </Box>
      <Snackbar open={state.open} autoHideDuration={6000} onClose={() => setState({ ...state, open: false })} anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }} action={<IconButton color='info' onClick={handleSnackbarClick}><InfoIcon /></IconButton>} message="Click the icon for more details">
        <Alert onClick={handleSnackbarClick} variant='filled' severity="info" sx={{ width: '100%', cursor: 'pointer' }}>
          {"Click on each field to edit your profile information."}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default Profile;