import React, { useEffect, useState } from 'react'
import { Images } from '@video-cv/assets';
import { FormControl, FormHelperText, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Input, Button, } from '@video-cv/ui-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { postData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

const schema = z.object({
    employerInfo: z.object({
      businessName: z.string().min(1, "Business name is required"),
      businessPhoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
      email: z.string().email("Invalid email format"),
      websiteUrl: z.string().url().optional().or(z.literal('')),
      fbLink: z.string().url().optional().or(z.literal('')),
      twitter: z.string().url().optional().or(z.literal('')),
      instagramUrl: z.string().url().optional().or(z.literal('')),
      address: z.string().min(10, "Business address is required"),
      industry: z.string().min(3, "Business sector is required"),
      industryId: z.number().optional(),
      contactName: z.string().min(1, "Contact person name is required"),
      contactPosition: z.string().min(1, "Contact person role is required"),
    }).nullable(),
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().min(1, "Middle name is required"),
    surname: z.string().min(1, "Surname is required"),
    businessName: z.string().optional(),
    phoneNumber: z.string().min(10, "Phone number must be at least 11 digits"),
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

const index = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, watch, formState: { errors }, getValues, setError } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            isTracked: true,
            userTypeId: 3,
            isBusinessUser: false,
            isProfessional: true,
            employerInfo: null,
        },
    });

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAccepted(e.target.checked);
    };

    const submitForm = async (data: FormData) => {
        if (!termsAccepted) {
            toast.info("Please accept the Terms of Service to proceed.");
            return;
        }

        setLoading(true);

        let resp;

        try {
            const requiredFields = [
                'firstName',
                'surname',
                'phoneNumber',
                'email',
                'password',
                'confirmPassword'
            ];
        
            let hasError = false;
            requiredFields.forEach(field => {
                if (!getValues(field as any)) {
                    setError(field as any, { type: 'required', message: 'This field is required' });
                    hasError = true;
                }
            });
        
            if (hasError) {
                toast.error("Please fill in all required fields.");
                return;
            }

            const defaultValues = {
                isTracked: true,
                userTypeId: 3,
                isBusinessUser: false,
                isProfessional: true,
            };

            const payloadData = {
                email: data.email,
                firstName: data.firstName,
                middleName: data.middleName,
                lastName: data.surname,
                phoneNumber: data.phoneNumber,
                businessName: data.businessName,
                password: data.password,
                employerInfo: null,
            }
          
            const combinedData = {
                ...payloadData,
                ...defaultValues,
            };

            if (data.password !== data.confirmPassword) {
                setError("confirmPassword", { message: "Passwords do not match" });
                return;
            }

            resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_REGISTER}`, combinedData);

            if (resp.code === "201") {
                toast.success(`You're in! Your account has been successfully created.`);
                toast.info(`Please check your email to verify your account before logging in.`);

                localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ ...resp, ...defaultValues }));
                localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true");
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, resp.user.id);
                localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA, JSON.stringify(data));

                reset();
                setTermsAccepted(false);

                navigate('/auth/login');
            }
            else if (resp.code === '400') {
                toast.error(`We couldn't complete your registration. Please verify your details and give it another go.`);
            }
        } 
        catch (err: any) {
            console.log(err)
            if (err.response.data.error.code === "400") {
                if (err.response.data.error.message.includes("User with this email")) {
                    toast.error("This email is already registered. Please use a different email or try logging in.");
                }
                else if (err.response.data.error.message.includes("User with phone number")) {
                    toast.error("This phone number is already registered. Please use a different number or try logging in.");
                }
                else {
                    toast.error(err.message || "An error occurred during signup. Please try again.");
                };
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
            'firstName',
            'surname',
            'phoneNumber',
            'email',
            'password',
            'confirmPassword'
        ];

        const isValid = requiredFields.every(field => !!getValues(field as any)) && termsAccepted && Object.keys(errors).length === 0;
        setIsFormValid(isValid);
    }, [getValues, errors, termsAccepted])
  
  return (
    <div className="overflow-hidden flex">
        <div className="border w-0 md:flex-1 min-h-screen" style={{ backgroundImage: `url(${Images.AuthBG})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', }}></div>
        <div className="flex-1 flex flex-col my-auto p-2 md:px-8 overflow-y-auto">
            <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
            <h2 className='font-semibold text-center md:text-left text-xl md:text-lg mb-1'>Create Account</h2>
            <p className='text-lg mb-7 text-center md:text-left text-neutral-300'>Create Your Professional Profile</p>
                <form onSubmit={(e) => { 
                    e.preventDefault();
                    const data = getValues();
                    submitForm(data);
                }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input label={<span>First Name <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(required)</span></span>} placeholder="First Name" error={errors.firstName} {...register('firstName')} isValid={!errors.firstName && !!watchedFields.firstName} />
                        <Input label="Middle Name" placeholder="Middle Name" error={errors.middleName} {...register('middleName')} isValid={!errors.middleName && !!watchedFields.middleName} />
                        <Input label={<span>Surname <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(required)</span></span>} placeholder="Surname" error={errors.surname} {...register('surname')} isValid={!errors.surname && !!watchedFields.surname} />
                        <Input type='text' label="Business Name" placeholder="Business Name" error={errors.businessName} {...register('businessName')} isValid={!errors.businessName && !!watchedFields.businessName} />
                        <Input label={<span>Phone Number <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(required)</span></span>} placeholder="+234123456789" error={errors.phoneNumber} {...register('phoneNumber')} isValid={!errors.phoneNumber && !!watchedFields.phoneNumber} />
                        <Input label={<span>Email Address <span className="text-red-500">*</span> <span className="text-xs text-gray-500">(required)</span></span>} placeholder="Email Address" error={errors.email} {...register('email')} isValid={!errors.email && !!watchedFields.email} />
                        <FormControl>
                            <Input type='password' label="Password *" id='password' placeholder="Enter Password" error={errors.password} {...register('password')} isValid={!errors?.password && !!watchedFields.password} />
                            <FormHelperText>Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.</FormHelperText>
                        </FormControl>
                        <FormControl>
                            <Input type='password' label="Confirm Password *" placeholder="Confirm Password" error={errors.confirmPassword} {...register('confirmPassword')} isValid={!errors.confirmPassword && !!watchedFields.confirmPassword} />
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
                        <Button type='submit' variant="black" label={loading ? "Signing up..." : "Sign up"} className='w-[60%]' disabled={loading || !isFormValid} />
                    </div>
                </form>
                <p className='text-lg mt-5 text-center text-neutral-300'>Already have an account? <span onClick={handleSignIn} className='text-blue-400 font-medium hover:underline cursor-pointer'>Sign In</span></p>
        </div>
    </div>
  )
}

export default index