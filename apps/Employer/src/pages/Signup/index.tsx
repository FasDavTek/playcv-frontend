import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Images } from '@video-cv/assets';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Button } from '@video-cv/ui-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { toast } from 'react-toastify';
import { postData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { Controller, useForm } from 'react-hook-form';
import { decodeJWT } from './../../../../../libs/utils/helpers/decoder';
import model from './../../../../../libs/utils/helpers/model';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';
import TextField from '@mui/material/TextField';
import { FormControl, FormHelperText } from '@mui/material';

const schema = z.object({
  employerInfo: z.object({
    businessName: z.string().min(1, "Business name is required"),
    businessEmail: z.string().email("Invalid email format"),
    businessPhoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    fbLink: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    instagramUrl: z.string().url().optional().or(z.literal('')),
    address: z.string().min(10, "Business address is required"),
    industry: z.string().min(3, "Business sector is required"),
    industryId: z.string(),
    contactName: z.string().min(1, "Contact person name is required"),
    contactPosition: z.string().min(1, "Contact person role is required"),
    isActive: z.boolean(),
  }),
  email: z.string().email("Invalid email format"),
  isTracked: z.boolean(),
  userTypeId: z.number(),
  isBusinessUser: z.boolean(),
  isProfessional: z.boolean(),
  password: z.string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const Index = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, control, formState: { errors }, getValues, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isTracked: true,
      userTypeId: 2,
      isBusinessUser: true,
      isProfessional: false,
      employerInfo: {}
    },
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };


  const { data: industry, isLoading: isLoadingIndustries } = useAllMisc({
      resource: 'industries',
      page: 1,
      limit: 100,
      download: false,
  });


  const createNewEntry = async (resource: string, data: any) => {
    try {
      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.INDUSTRY}`, data);
      if (response.statusCode === "200") {
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


  const submitForm = async (data: FormData) => {
    if (!termsAccepted) {
      toast.info("Please accept the Terms of Service to proceed.");
      return;
    }
    setLoading(true);
    try {
      const defaultValues = {
        isTracked: true,
        userTypeId: 2,
        isBusinessUser: true,
        isProfessional: false,
      };


      const employerInfo = {
        businessName: data.employerInfo.businessName,
        businessEmail: data.employerInfo.businessEmail,
        businessPhoneNumber: data.employerInfo.businessPhoneNumber,
        websiteUrl: data.employerInfo.websiteUrl,
        fbLink: data.employerInfo.fbLink,
        twitter: data.employerInfo.twitter,
        instagramUrl: data.employerInfo.instagramUrl,
        address: data.employerInfo.address,
        industryId: data.employerInfo.industryId,
        industry: data.employerInfo.industryId ? null : data.employerInfo.industry,
        contactName: data.employerInfo.contactName,
        contactPosition: data.employerInfo.contactPosition,
        password: data.password,
        isActive: true,
      }

      let industryId = null;

      if (data.employerInfo.industry) {
        const existingIndustry = industry?.find(c => c.name === data.employerInfo.industry);
        if (existingIndustry) {
          industryId = existingIndustry.id;
        } else {
          const newCourse = await createNewEntry('industry', { name: data.employerInfo.industry });
          if (newCourse) {
            industryId = newCourse.id;
          }
        }
      }

      // const payloadData = {
      //   email: data.employerInfo.businessEmail,
      //   password: data.password,
      //   employerInfo: {
      //     ...employerInfo,
      //     industryId: industryId,
      //   },
      //   ...defaultValues,
      // }

      
  
      const combinedData = {
        email: data.employerInfo.businessEmail,
        password: data.password,
        employerInfo: {
          ...employerInfo,
          industryId: industryId,
        },
        ...defaultValues,
      };

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_REGISTER}`, combinedData);

      if (resp.code === "201") {
        toast.success(`You're in! Your account has been successfully created.`);
        toast.info(`Let's get to know you better. Complete your profile for a tailored experience.`);

        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ ...resp, ...defaultValues }));
        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true");
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, resp.user.id);
        localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA, JSON.stringify(data));

        reset();
        setTermsAccepted(false);

        navigate('/auth/login');
      }
      else {
        toast.error(`We couldn't complete your registration. Please verify your details and give it another go.`);
      }
    } 
    catch (err: any) {
      if (err.response.message.includes("User with this email")) {
        toast.error("This email is already registered. Please use a different email or try logging in.");
      }
      else if (err.response.message.includes("User with phone number")) {
          toast.error("This phone number is already registered. Please use a different number or try logging in.");
      }
      else {
          toast.error(err.message || "An error occurred during signup. Please try again.");
      };
    } 
    finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate('/auth/login')
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const watchedFields = watch();

  return (
    <div className="overflow-hidden flex">
      <div className="border w-0 md:flex-1 min-h-screen" style={{ backgroundImage: `url(${Images.AuthBG})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', height: '100%', }}></div>
      <div className="flex-1 flex flex-col my-auto py-8 md:py-0 px-4 md:px-8 overflow-y-auto">
        <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
        {/* <h2 className=' text-center md:text-left text-xl md:text-lg mb-1'>Create Business</h2> */}
        <p className='text-xl mb-7 font-semibold text-center md:text-left text-neutral-300'>Create Your Business Profile</p>
        <form onSubmit={(e) => { 
          e.preventDefault();
          const data = getValues();
          submitForm(data);
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input type='text' label="Business Name" placeholder="Business Name" error={errors?.employerInfo?.businessName} {...register('employerInfo.businessName')} isValid={!errors?.employerInfo?.businessName && !!watchedFields.employerInfo.businessName} />
            <Input type='number' label="Business Phone Number" placeholder="Business Phone Number" error={errors?.employerInfo?.businessPhoneNumber} {...register('employerInfo.businessPhoneNumber')} isValid={!errors?.employerInfo?.businessPhoneNumber && !!watchedFields.employerInfo.businessPhoneNumber} />
            <Input type='email' label="Business Email" placeholder="Business Email" error={errors?.employerInfo?.businessEmail} {...register('employerInfo.businessEmail')} isValid={!errors?.employerInfo?.businessEmail && !!watchedFields.employerInfo.businessEmail} />
            <Input type='text' label="Website" placeholder="Website" error={errors?.employerInfo?.websiteUrl} {...register('employerInfo.websiteUrl')} isValid={!errors?.employerInfo?.websiteUrl && !!watchedFields.employerInfo.websiteUrl} />
            <Input type='text' label="Address" placeholder="Address" error={errors?.employerInfo?.address} {...register('employerInfo.address')} isValid={!errors?.employerInfo?.address && !!watchedFields.employerInfo.address} />
            <Controller
              {...register('employerInfo.industryId')}
              control={control}
              render={({ field }) => (
                <Select
                  name="Business Sector"
                  control={control}
                  defaultValue={Array.isArray(industry) ? industry?.find(i => i.id === watch('employerInfo.industryId')) : null}
                  options={model(industry, 'name', 'id')}
                  handleChange={(newValue) => field.onChange(newValue?.value)}
                  isDisabled={isLoadingIndustries}
                  errors={errors}
                />
              )}
            />
            <Input type='text' label="Contact Person Name" placeholder="Contact Person Name" error={errors?.employerInfo?.contactName} {...register('employerInfo.contactName')} isValid={!errors?.employerInfo?.contactName && !!watchedFields.employerInfo.contactName} />
            <Input type='text' label="Contact Person Position" placeholder="Contact Person Position" error={errors?.employerInfo?.contactPosition} {...register('employerInfo.contactPosition')} isValid={!errors?.employerInfo?.contactPosition && !!watchedFields.employerInfo.contactPosition} />
            <Input type='text' label="Facebook Link" placeholder="Facebook Link" error={errors?.employerInfo?.fbLink} {...register('employerInfo.fbLink')} isValid={!errors?.employerInfo?.fbLink && !!watchedFields.employerInfo.fbLink} />
            <Input type='text' label="Twitter Link" placeholder="Twitter Link" error={errors?.employerInfo?.twitter} {...register('employerInfo.twitter')} isValid={!errors?.employerInfo?.twitter && !!watchedFields.employerInfo.twitter} />
            <Input type='text' label="Instagram Link" placeholder="Instagram Link" error={errors?.employerInfo?.instagramUrl} {...register('employerInfo.instagramUrl')} isValid={!errors?.employerInfo?.instagramUrl && !!watchedFields.employerInfo.instagramUrl} />
            <FormControl>
              <Input type='password' label="Password" id='password' placeholder="Enter Password" error={errors.password} {...register('password')} isValid={!errors?.password && !!watchedFields.password} />
              <FormHelperText>Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.</FormHelperText>
            </FormControl>
            <FormControl>
              <Input type='password' label="Confirm Password" placeholder="Confirm Password" error={errors.confirmPassword} {...register('confirmPassword')} isValid={!errors.confirmPassword && !!watchedFields.confirmPassword} />
              <FormHelperText>Passwords must match.</FormHelperText>
            </FormControl>
          </div>
          <div className="mt-5">
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox" 
                checked={termsAccepted} 
                onChange={handleCheckboxChange} 
              />
              <span className="ml-2 text-sm text-neutral-300">I agree to the <a href="/terms-and-conditions" className="text-green-500 underline">Terms of Service</a></span>
            </label>
          </div>
          <div className="flex justify-start gap-5 mt-5">
            <Button type='submit' variant="black" label={loading ? "Signing up..." : "Sign up"} className='w-[60%]' disabled={loading} />
          </div>
        </form>
        <p className='text-lg mt-5 text-center text-neutral-300'>Already have an account? <span onClick={handleSignIn} className='text-blue-400 font-medium hover:underline cursor-pointer'>Sign In</span></p>
      </div>
    </div>
  );
}

export default Index;