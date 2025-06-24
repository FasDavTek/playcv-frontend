import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Images } from '@video-cv/assets';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Button, useToast } from '@video-cv/ui-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { toast } from 'react-toastify';
import { postData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { Controller, useForm } from 'react-hook-form';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';
import { FormControl, FormHelperText, Alert } from '@mui/material';
import model from './../../../../../libs/utils/helpers/model';

const schema = z.object({
  employerInfo: z.object({
    businessName: z.string().min(1, "Business name is required"),
    businessEmail: z.string().email("Invalid email").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
    businessPhoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number"),
    websiteUrl: z.string().url().optional().or(z.literal('')),
    fbLink: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    instagramUrl: z.string().url().optional().or(z.literal('')),
    address: z.string().min(10, "Business address is required"),
    industry: z.string().min(3, "Business sector is required"),
    industryId: z.number().nullable(),
    contactName: z.string().min(1, "Contact person name is required"),
    contactPosition: z.string().min(1, "Contact person role is required"),
  }),
  professionalInfo: z.object({
    nyscStateCode: z.string().min(4, 'NYSC State code is required'),
    nyscStartYear: z.number().int().nullable(),
    nyscEndYear: z.number().int().nullable(),
    course: z.string().min(1, "Course of study is required"),
    degree: z.string().min(1, "Degree awarded is required"),
    institution: z.string().min(1, "Institution attended is required"),
    classOfDegree: z.string().min(1, "Class of degree is required"),
    coverLetter: z.string().min(1, "Cover letter content is required"),
    degreeTypeId: z.number().nullable(),
    degreeClassId: z.number().nullable(),
    institutionId: z.number().nullable(),
    courseId: z.number().nullable(),
    businessName: z.string().min(3, "Business Name is required"),
    industry: z.string().min(1, "Business sector is required"),
    address: z.string().min(10, "Business address is required"),
    businessPhone: z.string().min(10, "Business phone number must be at least 10 digits"),
    industryId: z.number().nullable(),
    businessProfile: z.string().min(10, "Business Profile content is required"),
  }).nullable(),
  firstName: z.string().min(1, "First name is required"),
  surname: z.string().min(1, "Surname is required"),
  phoneNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/, "Invalid phone number"),
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
  const { register, handleSubmit, reset, watch, control, formState: { errors }, getValues, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isTracked: true,
      userTypeId: 2,
      isBusinessUser: true,
      isProfessional: false,
      professionalInfo: null,
      employerInfo: {}
    },
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const { showToast } = useToast();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  const { data: industry, isLoading: isLoadingIndustries } = useAllMisc({
    resource: 'industries',
    page: 1,
    limit: 100,
    download: false,
  });

  const submitForm = async (data: FormData) => {
    if (!termsAccepted) {
      showToast("Please accept the Terms of Service to proceed.", 'info');
      return;
    }

    // if (!isFormValid) {
    //   showToast("Please fill in all required fields correctly.", 'error');
    //   return;
    // }

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
        websiteUrl: data.employerInfo.websiteUrl || null,
        fbLink: data.employerInfo.fbLink || null,
        twitter: data.employerInfo.twitter || null,
        instagramUrl: data.employerInfo.instagramUrl || null,
        address: data.employerInfo.address,
        industryId: data.employerInfo.industryId,
        industry: data.employerInfo.industry,
        contactName: data.employerInfo.contactName,
        contactPosition: data.employerInfo.contactPosition,
        professionalInfo: null,
      };

      const combinedData = {
        email: data.employerInfo.businessEmail,
        password: data.password,
        firstName: data.firstName,
        surname: data.surname,
        phoneNumber: data.phoneNumber,
        employerInfo: {
          ...employerInfo,
        },
        ...defaultValues,
      };

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_REGISTER}`, combinedData);

      if (resp.code === "201") {
        showToast(`You're in! Your account has been successfully created.`, 'success');
        showToast(`Your sign up is received. We will verify your information. If it passes our KYC process, you will receive your activation email. Please check your inbox or spam in a few hours.`, 'info');

        // sessionStorage.setItem(SESSION_STORAGE_KEYS.USER, JSON.stringify({ ...resp, ...defaultValues }));
        sessionStorage.setItem(SESSION_STORAGE_KEYS.IS_USER_EXIST, "true");
        sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID, resp.user.id);
        sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_EMAIL, combinedData.email);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_EMAIL, combinedData.email);
        sessionStorage.setItem(SESSION_STORAGE_KEYS.SIGNUP_DATA, JSON.stringify(data));

        reset();
        setTermsAccepted(false);

        navigate('/auth/email-confirmation', { state: { email: data.employerInfo.businessEmail, userType: 'employer', showAlert: true } });
        <Alert severity="info">Your sign up is received. We will verify your information. If it passes our KYC process, you will receive your activation email. Please check your inbox or spam in a few hours.</Alert>
      } else {
        showToast(`We couldn't complete your registration. Please verify your details and give it another go.`, 'error');
      }
    }
    catch (err: any) {
      if (err.response?.data?.error?.code === "400") {
        if (err.response?.data?.error?.message?.includes("User with this email")) {
          const email = err.response.data.error.message.match(/[\w.-]+@[\w.-]+\.\w+/)[0];
          showToast(`This email ${email} is already registered. Please use a different email or try logging in.`, 'error');
        }
        else if (err.response?.data?.error?.message?.includes("User with this phone number")) {
          const phoneNumber = err.response.data.error.message.match(/(\+234|0)[789][01]\d{8}/)[0];
          showToast(`This phone number ${phoneNumber} is already registered. Please use a different number or try logging in.`, 'error');
        }
        else {
          showToast(err.response?.data?.error?.message, 'error');
        }
      }
      else {
        if (err.response?.data?.message) {
            showToast(err.response.data.message, 'error');
        } 
        else {
            showToast('An error occurred. Please try again.', 'error');
        }
      }
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

  useEffect(() => {
    const requiredFields = [
      'employerInfo.businessName',
      'employerInfo.businessEmail',
      'employerInfo.businessPhoneNumber',
      'employerInfo.address',
      'employerInfo.industry',
      'employerInfo.contactName',
      'employerInfo.contactPosition',
      'firstName',
      'surname',
      'phoneNumber',
      'password',
      'confirmPassword'
    ];

    const isValid = requiredFields.every(field => !!getValues(field as any)) && termsAccepted && Object.keys(errors).length === 0;
    setIsFormValid(isValid);
  }, [getValues, errors, termsAccepted]);

  return (
    <div className="overflow-hidden flex">
      <div
        className="border w-0 lg:flex-1 min-h-screen" 
        style={{
          backgroundImage: `url(${Images.AuthBG})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="flex-1 flex flex-col my-auto p-2 md:px-8 overflow-y-auto">
        <ChevronLeftIcon className="cursor-pointer text-base top-2 ticky p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
        {/* <div className="w-[90%] h-full mx-auto flex items-center justify-center"> */}
          <form onSubmit={handleSubmit(submitForm)}>
            <p className='text-xl mb-7 font-semibold text-center text-neutral-300'>Create Your Business Profile</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-2">
              <div>
                <Input label={<span>First Name <span className="text-red-500">*</span></span>} placeholder="First Name" error={errors.firstName} {...register('firstName')} isValid={!errors.firstName && !!watchedFields.firstName} />
              </div>
              <div>
                <Input label={<span>Surname <span className="text-red-500">*</span></span>} placeholder="Surname" error={errors.surname} {...register('surname')} isValid={!errors.surname && !!watchedFields.surname} />
              </div>
              <div>
                <Input label={<span>Phone Number <span className="text-red-500">*</span></span>} placeholder="+234123456789" error={errors.phoneNumber} {...register('phoneNumber')} isValid={!errors.phoneNumber && !!watchedFields.phoneNumber} />
              </div>
              <div>
                <Input type='text' label={<span>Business Name <span className="text-red-500">*</span></span>} placeholder="Business Name" error={errors?.employerInfo?.businessName} {...register('employerInfo.businessName')} isValid={!errors?.employerInfo?.businessName && !!watchedFields.employerInfo?.businessName} />
              </div>
              <div>
                <Input type='tel' label={<span>Business Phone Number <span className="text-red-500">*</span></span>} placeholder="Business Phone Number" error={errors?.employerInfo?.businessPhoneNumber} {...register('employerInfo.businessPhoneNumber')} isValid={!errors?.employerInfo?.businessPhoneNumber && !!watchedFields.employerInfo?.businessPhoneNumber} />
              </div>
              <div>
                <Input type='email' label={<span>Business Email <span className="text-red-500">*</span></span>} placeholder="Business Email" error={errors?.employerInfo?.businessEmail} {...register('employerInfo.businessEmail')} isValid={!errors?.employerInfo?.businessEmail && !!watchedFields.employerInfo?.businessEmail} />
              </div>
              <Input type='url' label="Website" placeholder="Website" error={errors?.employerInfo?.websiteUrl} {...register('employerInfo.websiteUrl')} isValid={!errors?.employerInfo?.websiteUrl && !!watchedFields.employerInfo?.websiteUrl} />
              <div>
                <Input type='text' label={<span>Address <span className="text-red-500">*</span></span>} placeholder="Address" error={errors?.employerInfo?.address} {...register('employerInfo.address')} isValid={!errors?.employerInfo?.address && !!watchedFields.employerInfo?.address} />
              </div>
              <Controller
                name='employerInfo.industry'
                control={control}
                rules={{ required: 'Business Sector is required' }}
                render={({ field }) => (
                  <div>
                    <Select
                      name="Business Sector"
                      control={control}
                      defaultValue={Array.isArray(industry) && industry?.find(i => i.name === watch('employerInfo.industry'))}
                      options={model(industry, 'name', 'id')}
                      handleChange={(newValue) => {
                        if (newValue.__isNew__) {
                          field.onChange(newValue?.value || newValue?.label);
                          setValue('employerInfo.industry', newValue?.label || '');
                          setValue('employerInfo.industryId', null);
                        } else {
                          field.onChange(newValue?.value || newValue?.label);
                          setValue('employerInfo.industry', newValue?.label);
                          setValue('employerInfo.industryId', newValue?.value);
                        }}}
                      isDisabled={isLoadingIndustries}
                      errors={errors}
                      placeholder='Business Sector'
                      label={<span>Business Sector <span className="text-red-500">*</span></span>}
                      allowCreate={true}
                    />
                    {errors?.employerInfo?.industry && (
                      <p className="text-red-500 text-sm mt-1">{errors.employerInfo.industry.message}</p>
                    )}
                  </div>
                )}
              />
              <div>
                <Input type='text' label={<span>Contact Person Name <span className="text-red-500">*</span></span>} placeholder="Contact Person Name" error={errors?.employerInfo?.contactName} {...register('employerInfo.contactName')} isValid={!errors?.employerInfo?.contactName && !!watchedFields.employerInfo?.contactName} />
              </div>
              <div>
                <Input type='text' label={<span>Contact Person Position <span className="text-red-500">*</span></span>} placeholder="Contact Person Position" error={errors?.employerInfo?.contactPosition} {...register('employerInfo.contactPosition')} isValid={!errors?.employerInfo?.contactPosition && !!watchedFields.employerInfo?.contactPosition} />
              </div>
              <Input type='url' label="Facebook Link" placeholder="Facebook Link" error={errors?.employerInfo?.fbLink} {...register('employerInfo.fbLink')} isValid={!errors?.employerInfo?.fbLink && !!watchedFields.employerInfo?.fbLink} />
              <Input type='url' label="Twitter Link" placeholder="Twitter Link" error={errors?.employerInfo?.twitter} {...register('employerInfo.twitter')} isValid={!errors?.employerInfo?.twitter && !!watchedFields.employerInfo?.twitter} />
              <Input type='url' label="Instagram Link" placeholder="Instagram Link" error={errors?.employerInfo?.instagramUrl} {...register('employerInfo.instagramUrl')} isValid={!errors?.employerInfo?.instagramUrl && !!watchedFields.employerInfo?.instagramUrl} />
              <FormControl>
                <div>
                  <Input type='password' label={<span>Password <span className="text-red-500">*</span></span>} id='password' placeholder="Enter Password" error={errors.password} {...register('password')} isValid={!errors?.password && !!watchedFields.password} />
                </div>
                <FormHelperText>Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.</FormHelperText>
              </FormControl>
              <FormControl>
                <div>
                  <Input type='password' label={<span>Confirm Password <span className="text-red-500">*</span></span>} placeholder="Confirm Password" error={errors.confirmPassword} {...register('confirmPassword')} isValid={!errors.confirmPassword && !!watchedFields.confirmPassword} />
                </div>
                <FormHelperText>Passwords must match.</FormHelperText>
              </FormControl>
            </div>
            <div className="mt-5 px-2">
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
            <div className="flex justify-start gap-5 mt-3 px-2">
              <Button type='submit' variant="black" label={loading ? "Signing up..." : "Sign up"} className='w-[60%]' disabled={loading} />
            </div>
          </form>
        {/* </div> */}
        
        <p className='text-lg text-center text-neutral-300'>Already have an account? <span onClick={handleSignIn} className='text-blue-400 font-medium hover:underline cursor-pointer'>Sign In</span></p>
      </div>
    </div>
  );
}

export default Index;