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
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';
import model from './../../../../../libs/utils/helpers/model'

interface State extends SnackbarOrigin {
  open: boolean;
}

const schema = z.object({
  userProfile: z.object({
    userDetails: z.object({
      firstName: z.string().min(1, "First name is required"),
      middleName: z.string().min(1, "Middle name is required"),
      lastName: z.string().min(1, "Surname is required"),
      email: z.string().email("Invalid email format"),
      phoneNo: z.string().min(10, "Phone number must be at least 10 digits").max(11, 'Phone number must not be more than 11 digits'),
      isBusinessUser: z.boolean(),
    }),
    businessDetails: z.object({
      businessName: z.string().min(1, "Business name is required"),
      businessPhoneNumber: z.string().min(10, "Business phone number must be at least 10 digits"),
      industry: z.string().min(1, "Business sector is required"),
      industryId: z.number().nullable(),
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

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
  const userId = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID);


  const fetchUserData = async () => {
    try {
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
          }
        });
        Object.entries(businessDetails).forEach(([key, value]) => {
          if (key in schema.shape.userProfile.shape.businessDetails.shape) {
            const fieldKey = key as keyof FormData['userProfile']['businessDetails'];
            const fieldSchema = schema.shape.userProfile.shape.businessDetails.shape[fieldKey];
            
            if (fieldSchema instanceof z.ZodString && typeof value === 'string') {
              setValue(`userProfile.businessDetails.${fieldKey}`, value);
            } 
            // else if (fieldSchema instanceof z.ZodNumber && typeof value === 'number') {
            //   setValue(`userProfile.businessDetails.${fieldKey}`, value);
            // }
          }
        });

        setValue('userProfile.businessDetails.websiteUrl', businessDetails.websiteUrl || '')
        setValue('userProfile.businessDetails.fbLink', businessDetails.fbLink || '')
        setValue('userProfile.businessDetails.twitter', businessDetails.twitter || '')
        setValue('userProfile.businessDetails.instagramUrl', businessDetails.instagramUrl || '')
      }
    }
    catch (err) {
      if(!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/');
      }
      else {
        toast.error('Unable to load user profile');
      }
    }
  };


  useEffect(() => {
    fetchUserData();
  }, [setValue]);



  const { data: industry, isLoading: isLoadingIndustries } = useAllMisc({
    resource: 'industries',
    page: 1,
    limit: 100,
    download: true,
  });


  useEffect(() => {
    const subscription = watch((data) => data);
    return () => subscription.unsubscribe();
  }, [watch]);




  // const submitForm = async (data: FormData) => {
  //   setLoading(true);
    
  //   try {

  //     const combinedData = {
  //       ...data,
  //       userProfile: {
  //         ...data.userProfile,
  //         userDetails: {
  //           ...data.userProfile.userDetails,
  //           isBusinessUser: true,
  //           userId: userId,
  //         },
  //         businessDetails: {
  //           ...data.userProfile.businessDetails,
  //           industryId: data.userProfile.businessDetails.industryId,
  //           industry: data.userProfile.businessDetails.industry,
  //         }
  //       }
  //     };

  //     // const endpoint = isSignup ? apiEndpoints.AUTH_REGISTER : apiEndpoints.PROFILE;
  //     const res = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PROFILE}`, combinedData, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     if (res.code === "00") {
  //       toast.success(`Wonderful! Your profile has been successfully modified.`);
        
  //       const updatedUser = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.USER) || '{}');
  //       updatedUser.userProfile = combinedData.userProfile;
  //       sessionStorage.setItem(SESSION_STORAGE_KEYS.USER, JSON.stringify({ updatedUser }));

  //       // sessionStorage.removeItem(SESSION_STORAGE_KEYS.SIGNUP_DATA);
  //     } else {
  //       toast.error(`We couldn't complete your profile update. Another attempt might do the trick.`);
  //     }
  //   }
  //   catch (err: any) {
  //     if(!token) {
  //       toast.error('Your session has expired. Please log in again');
  //       navigate('/');
  //     }
  //     else {
  //       toast.error(err.response?.data?.errors);
  //       toast.error(`We encountered an issue updating your profile. Please try again.`);
  //     }
  //   }
  //   finally {
  //     setLoading(false);
  //     setEditField(null);
  //   }
  // };
  

  const submitForm = async (data: FormData) => {
    setLoading(true);
    
    try {
      const combinedData = {
        userProfile: {
          ...data.userProfile,
          userDetails: {
            ...data.userProfile.userDetails,
            isBusinessUser: true,
            userId: userId,
          },
          businessDetails: {
            ...data.userProfile.businessDetails,
            industry: data.userProfile.businessDetails.industry,
            industryId: data.userProfile.businessDetails.industryId,
          }
        }
      };

      const res = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PROFILE}`, combinedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.code === "00") {
        await fetchUserData();

        toast.success(`Wonderful! Your profile has been successfully modified.`);
        
        const updatedUser = JSON.parse(sessionStorage.getItem(SESSION_STORAGE_KEYS.USER) || '{}');
        updatedUser.userProfile = combinedData.userProfile;
        sessionStorage.setItem(SESSION_STORAGE_KEYS.USER, JSON.stringify(updatedUser));

      } else {
        toast.error(`We couldn't complete your profile update. Another attempt might do the trick.`);
      }
    }
    catch (err: any) {
      if(!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/');
      }
      else {
        toast.error(err.response?.data?.errors);
        toast.error(`We encountered an issue updating your profile. Please try again.`);
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
        <form onSubmit={(e) => { e.preventDefault(); const data = getValues(); submitForm(data); }}>
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
            {editField === 'userProfile?.userDetails?.middleName' ? (
              <Input
                {...register('userProfile.userDetails.middleName')}
                label="Middle Name"
                type='text'
                placeholder='Middle Name'
                error={errors.userProfile?.userDetails?.middleName}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile?.userDetails?.middleName')}>
                <label>Middle Name</label>
                <Typography className="input-like">{watch('userProfile.userDetails.middleName')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile?.userDetails?.middleName')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
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
            {editField === 'userProfile.businessDetails.businessEmail' ? (
              <Input
                {...register('userProfile.businessDetails.businessEmail')}
                label="Business Email"
                type='businessEmail'
                placeholder='Business Email'
                error={errors.userProfile?.businessDetails?.businessEmail}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.businessEmail')}>
                <label>Business Email</label>
                <Typography className="input-like">{watch('userProfile.businessDetails.businessEmail')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.businessEmail')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.contactPhone' ? (
              <Input
                {...register('userProfile.businessDetails.contactPhone')}
                label="Business/Contact Phone Number"
                type='tel'
                placeholder='Phone Number'
                error={errors.userProfile?.businessDetails?.contactPhone}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('userProfile.businessDetails.contactPhone')}>
                <label>Business/Contact Person Phone Number</label>
                <Typography className="input-like">{watch('userProfile.businessDetails.contactPhone')}</Typography>
                <IconButton onClick={() => handleEditClick('userProfile.businessDetails.contactPhone')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'userProfile.businessDetails.industry' ? (
              <Controller
                name='userProfile.businessDetails.industry'
                control={control}
                render={({ field }) => (
                  <Select
                    name="Business Sector"
                    control={control}
                    placeholder='Industry'
                    defaultValue={Array.isArray(industry) && industry?.find(i => i.name === watch('userProfile.businessDetails.industry'))}
                    options={model(industry, 'name', 'id')}
                    handleChange={(newValue) => { 
                    if (newValue.__isNew__) {
                      field.onChange(newValue?.value || newValue?.label);
                      setValue('userProfile.businessDetails.industry', newValue?.label || '');
                      setValue('userProfile.businessDetails.industryId', null);
                    } else {
                      field.onChange(newValue?.value || newValue?.label);
                      setValue('userProfile.businessDetails.industry', newValue?.label);
                      setValue('userProfile.businessDetails.industryId', newValue?.value);
                    } }}
                    isDisabled={isLoadingIndustries}
                    errors={errors}
                    allowCreate={true}
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
            {/* {editField === 'userProfile.businessDetails.contactPhone' ? (
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
            )} */}
          </div>

          <Button type='submit' variant="black" disabled={loading} label={loading ? "Submitting..." : "Update Profile"} className='mt-5' />
        </form>
      </Box>
      <Snackbar open={state.open} autoHideDuration={6000} onClose={() => setState({ ...state, open: false })} anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }} action={<IconButton color='info' onClick={handleSnackbarClick}><InfoIcon /></IconButton>} message="Click the icon for more details">
        <Alert onClick={handleSnackbarClick} severity="info" color="info" sx={{ width: '100%', cursor: 'pointer' }}>
          {"Click on each field to edit your profile information."}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default Profile;