import React, { useState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Input, Select, Button } from '@video-cv/ui-components';
import { Snackbar, Alert, SnackbarOrigin, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { decodeJWT } from './../../../../../libs/utils/helpers/decoder';

interface State extends SnackbarOrigin {
  open: boolean;
}

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  businessName: z.string().min(1, "Business name is required"),
  businessPhoneNumber: z.string().min(10, "Business phone number must be at least 10 digits"),
  businessSector: z.string().min(1, "Business sector is required"),
  businessEmail: z.string().email("Invalid email format"),
  businessWebsite: z.string().url().optional().or(z.literal('')),
  businessSocialMedia: z.string().optional(),
  businessAddress: z.string().min(1, "Business address is required"),
  contactPerson: z.string().min(1, "Contact person name is required"),
  contactPersonRole: z.string().min(1, "Contact person role is required"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  confirmPassword: z.string().optional(),
  isTracked: z.boolean(),
  isBusinessUser: z.boolean(),
  isProfessional: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

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
      isTracked: true,
      isBusinessUser: true,
      isProfessional: false,
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_PROFILE}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resp.data) {
          const parsedData = JSON.parse(resp.data);
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
      }
      catch (err) {
        toast.error('Unable to load user profile');
      }
    };
    fetchUserData();
  }, [setValue]);

  useEffect(() => {
    const subscription = watch((data) => data);
    return () => subscription.unsubscribe();
  }, [watch]);



  const submitForm = async (data: FormData) => {
    // console.log("Submit form called", data);
    setLoading(true);
    
    try {
      const defaultValues = {
        isTracked: true,
        isBusinessUser: true,
        isProfessional: false,
      };
  
      const combinedData = {
        ...data,
        ...defaultValues,
      };

      // const endpoint = isSignup ? apiEndpoints.AUTH_REGISTER : apiEndpoints.PROFILE;
      const res = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PROFILE}`, combinedData);

      if (res.code === "201") {
        toast.success(`Wonderful! Your profile has been successfully modified.`);
        
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ ...res, ...defaultValues }));

        // localStorage.removeItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA);
      } else {
        toast.error(`We couldn't complete your profile update. Another attempt might do the trick.`);
      }
    }
    catch (err) {
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
            {editField === 'email' ? (
              <Input
                {...register('email')}
                label="Email"
                type='email'
                placeholder='Email'
                error={errors.email}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('email')}>
                <label>Email</label>
                <Typography className="input-like">{watch('email')}</Typography>
                <IconButton onClick={() => handleEditClick('email')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'phoneNumber' ? (
              <Input
                {...register('phoneNumber')}
                label="Phone Number"
                type='tel'
                placeholder='Phone Number'
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
            <Box className="input-box">
              <label>Business Name</label>
              <Typography className="input-like">{watch('businessName')}</Typography>
            </Box>
            {editField === 'businessPhoneNumber' ? (
              <Input
                {...register('businessPhoneNumber')}
                label="Business Phone Number"
                type='tel'
                placeholder='Business Phone Number'
                error={errors.businessPhoneNumber}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('businessPhoneNumber')}>
                <label>Business Phone Number</label>
                <Typography className="input-like" >{watch('businessPhoneNumber')}</Typography>
                <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'businessSector' ? (
              <Controller
                {...register('businessSector')}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    label="Industry"
                    value={value}
                    {...register('businessSector')}
                    options={[{ value: 'product', label: 'Product' }]}
                    onChange={(value) => onChange('classOfDegree', value)}
                  />
                )}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('businessSector')}>
                <label>Industry</label>
                <Typography className="input-like" >{watch('businessSector')}</Typography>
                <IconButton onClick={() => handleEditClick('businessSector')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'businessWebsite' ? (
              <Input
                {...register("businessWebsite")}
                label="Website Url (Optional)"
                type='text'
                placeholder='Website Url'
                error={errors.businessWebsite}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('businessWebsite')}>
                <label>Website URL (Optional)</label>
                <Typography className="input-like">{watch('businessWebsite')}</Typography>
                <IconButton onClick={() => handleEditClick('businessWebsite')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'businessSocialMedia' ? (
              <Input
                {...register("businessSocialMedia")}
                label="Social Media Page Link"
                type='text'
                placeholder='Social Media Page Link'
                error={errors.businessSocialMedia}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('businessSocialMedia')}>
                <label>Social Media Page Link</label>
                <Typography className="input-like">{watch('businessSocialMedia')}</Typography>
                <IconButton onClick={() => handleEditClick('businessSocialMedia')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'businessAddress' ? (
              <Input
                {...register("businessAddress")}
                label="Office Address"
                type='text'
                placeholder='Office Address'
                error={errors.businessAddress}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('businessAddress')}>
                <label>Office Address</label>
                <Typography className="input-like">{watch('businessAddress')}</Typography>
                <IconButton onClick={() => handleEditClick('businessAddress')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'contactPerson' ? (
              <Input
                {...register("contactPerson")}
                label="Contact Person Name"
                type='text'
                placeholder='Contact Person Name'
                error={errors.contactPerson}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('contactPerson')}>
                <label>Contact Person Name</label>
                <Typography className="input-like">{watch('contactPerson')}</Typography>
                <IconButton onClick={() => handleEditClick('contactPerson')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'contactPersonRole' ? (
              <Input
                {...register("contactPersonRole")}
                label="Contact Person Position"
                type='text'
                placeholder='Contact Person Position'
                error={errors.contactPersonRole}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('contactPersonRole')}>
                <label>Contact Person Position</label>
                <Typography className="input-like">{watch('contactPersonRole')}</Typography>
                <IconButton onClick={() => handleEditClick('contactPersonRole')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'password' ? (
              <Input
                {...register('password')}
                label="Password"
                type='password'
                placeholder='Password'
                error={errors.password}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('password')}>
                <label>Password</label>
                <Typography className="input-like">{watch('password')}</Typography>
                <IconButton onClick={() => handleEditClick('password')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                  <SaveAsOutlinedIcon />
                </IconButton>
              </Box>
            )}
            {editField === 'confirmPassword' ? (
              <Input
                {...register('confirmPassword')}
                label="Confirm Password"
                type='password'
                placeholder='Confirm Password'
                error={errors.confirmPassword}
              />
            ) : (
              <Box className="input-box" onClick={() => handleEditClick('confirmPassword')}>
                <label>Confirm Password</label>
                <Typography className="input-like">{watch('confirmPassword')}</Typography>
                <IconButton onClick={() => handleEditClick('confirmPassword')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
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













































// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { Input } from '@video-cv/ui-components';
// import { Box, IconButton, Typography, Snackbar, Alert } from '@mui/material';
// import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';
// import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

// const Profile = () => {
//   const { register, setValue, watch } = useForm();
//   const [editField, setEditField] = useState<string | null>(null);
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');

  
//   useEffect(() => {
//     const fetchUserData = () => {
//       const resp.data = localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA);
//       const userData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || '{}');
      
//       if (signupData) {
//         const parsedData = JSON.parse(signupData);
//         Object.entries(parsedData).forEach(([key, value]) => {
//           setValue(key, value);
//         });
//       } else {
//         Object.entries(userData).forEach(([key, value]) => {
//           setValue(key, value);
//         });
//       }
//     };
//     loadData();
//   }, [setValue]);

  
//   const submitForm = () => {
//     const data = {
//       firstName: watch("firstName"),
//       middleName: watch("middleName"),
//       surname: watch("surname"),
//       email: watch("email"),
//       phoneNumber: watch("phoneNumber"),
//       businessName: watch("businessName"),
//       businessPhoneNumber: watch("businessPhoneNumber"),
//       businessSector: watch("businessSector"),
//       businessEmail: watch("businessEmail"),
//       businessWebsite: watch("businessWebsite"),
//       businessSocialMedia: watch("businessSocialMedia"),
//       businessAddress: watch("businessAddress"),
//       contactPerson: watch("contactPerson"),
//       contactPersonRole: watch("contactPersonRole"),
//       password: watch("password"),
//       confirmPassword: watch("confirmPassword"),
//     };

//     console.log("Submitting data:", data);
//     try {
    //   const endpoint = isSignup ? apiEndpoints.AUTH_REGISTER : apiEndpoints.PROFILE;
    //   const res = await postData(`${CONFIG.BASE_URL}${endpoint}`, data);

    //   if (res.code === "201") {
    //     toast.success(res.message);
    //     const token = res.jwtToken;
    //     const decoded = decodeJWT(token);
    //     localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ ...res, ...decoded }));
    //     localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true");
    //     localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, decoded.UserId);
    //     localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, res.jwtToken);

    //     if (isSignup) {
    //       localStorage.removeItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA);
    //       navigate('/');
    //     }
    //   } else {
    //     toast.error(res.message);
    //   }
    // } catch (err) {
    //   console.error(err);
    //   toast.error(isSignup ? "An error occurred during signup" : "An error occurred while updating profile");
    // } finally {
    //   setLoading(false);
    //   setEditField(null);
    // }
//   };

  
//   const handleEditClick = (fieldName: string) => {
//     setEditField(fieldName);
//   };

  
//   const renderEditableField = (fieldName: string, label: string, type = 'text') => (
//     editField === fieldName ? (
//       <Input
//         {...register(fieldName)}
//         label={label}
//         type={type}
//         placeholder={label}
//         onBlur={() => setEditField(null)}
//       />
//     ) : (
//       <Box className="input-box" key={fieldName}>
//         <label>{label}</label>
//         <Typography className="input-like" onClick={() => handleEditClick(fieldName)}>
//           {watch(fieldName) || 'Click to edit'}
//         </Typography>
//         <IconButton onClick={() => handleEditClick(fieldName)} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
//           <SaveAsOutlinedIcon />
//         </IconButton>
//       </Box>
//     )
//   );

  
//   const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') {
//       return;
//     }
//     setSnackbarOpen(false);
//   };

//   return (
//     <Box sx={{ width: '90%', marginInline: 'auto' }}>
//       <Box>
//         <form onSubmit={(e) => {
//           e.preventDefault();
//           submitForm();
//         }}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-8">
//             {renderEditableField("firstName", "First Name")}
//             {renderEditableField("middleName", "Middle Name")}
//             {renderEditableField("surname", "Surname")}
//             {renderEditableField("email", "Email", "email")}
//             {renderEditableField("phoneNumber", "Phone Number", "tel")}
//             {renderEditableField("businessName", "Business Name")}
//             {renderEditableField("businessPhoneNumber", "Business Phone Number", "tel")}
//             {renderEditableField("businessSector", "Business Sector")}
//             {renderEditableField("businessWebsite", "Business Website", "url")}
//             {renderEditableField("businessSocialMedia", "Business Social Media")}
//             {renderEditableField("businessAddress", "Business Address")}
//             {renderEditableField("contactPerson", "Contact Person")}
//             {renderEditableField("contactPersonRole", "Contact Person Role")}
//             {renderEditableField("password", "Password", "password")}
//             {renderEditableField("confirmPassword", "Confirm Password", "password")}
//           </div>
//           <Button type='submit' variant="black" disabled={loading} label={loading ? "Submitting..." : (isSignup ? "Complete Signup" : "Update Profile")} className='mt-5' />
//         </form>
//       </Box>
      
//       <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
//         <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
//           {snackbarMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Profile;
