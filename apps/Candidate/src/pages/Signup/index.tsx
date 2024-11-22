import React, { useState } from 'react'
import { Images } from '@video-cv/assets';
import { useTheme } from '@mui/material';
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
import { decodeJWT } from './../../../../../libs/utils/helpers/decoder';

const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().min(1, "Middle name is required"),
    surname: z.string().min(1, "Surname is required"),
    businessName: z.string().min(1, "Business name is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 11 digits"),
    email: z.string().email("Invalid email format"),
    password: z.string()
      .min(8, "Password must be at least 6 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    confirmPassword: z.string().optional(),
    isTracked: z.boolean(),
    userTypeId: z.number(),
    businessId: z.number(),
    isBusinessUser: z.boolean(),
    isProfessional: z.boolean(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
  
type FormData = z.infer<typeof schema>;

const index = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            isTracked: true,
            userTypeId: 3,
            isBusinessUser: false,
            isProfessional: true,
        },
    });

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTermsAccepted(e.target.checked);
    };

    const generateBusinessId = (): number => {
        return Math.floor(100000 + Math.random() * 900000);
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
                businessId: generateBusinessId(),
            }
          
            const combinedData = {
                ...payloadData,
                ...defaultValues,
            };

            const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_REGISTER}`, combinedData);
            console.log(CONFIG.BASE_URL);

            if (resp.isSuccess) {
                toast.success(resp.message);
                const token = resp.jtwToken;
                const decoded = decodeJWT(token);
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify({ ...resp, ...decoded, ...defaultValues }));
                localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true");
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, decoded.UserId);
                localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, resp.jwtToken);
                localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA, JSON.stringify(data));
                navigate('/candidate/profile');
            }
            else {
                toast.error(resp.message);
            }
        } 
        catch (err) {
            console.error(err);
            toast.error("An error occurred during signup");
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
                        <Input label="First Name" placeholder="First Name" error={errors.firstName} {...register('firstName')} />
                        <Input label="Middle Name" placeholder="Middle Name" error={errors.middleName} {...register('middleName')} />
                        <Input label="Surname" placeholder="Surname" error={errors.surname} {...register('surname')} />
                        <Input type='text' label="Business Name" placeholder="Business Name" error={errors.businessName} {...register('businessName')} />
                        <Input label="Phone Number" placeholder="+234123456789" error={errors.phoneNumber} {...register('phoneNumber')} />
                        <Input label="Email Address" placeholder="Email Address" error={errors.email} {...register('email')} />
                        <Input type='password' label="Password" placeholder="Enter Password" error={errors.password} {...register('password')}  />
                        <Input type='password' label="Confirm Password" placeholder="Confirm Password" error={errors.confirmPassword} {...register('confirmPassword')}  />
                    </div>
                    <div className="mt-5">
                        <label className="inline-flex items-center">
                            <input 
                                type="checkbox" 
                                className="form-checkbox" 
                                checked={termsAccepted} 
                                onChange={handleCheckboxChange} 
                            />
                            <span className="ml-2 text-sm text-neutral-300">I agree to the <a href="/terms" className="text-green-500 underline">Terms of Service</a></span>
                        </label>
                    </div>
                    <div className="flex justify-start gap-5 mt-5">
                        <Button type='submit' variant="black" label={loading ? "Signing up..." : "Sign up"} className='w-[60%]' disabled={loading} />
                    </div>
                </form>
                <p className='text-lg mt-5 text-center text-neutral-300'>Already have an account? <span onClick={handleSignIn} className='text-blue-400 font-medium hover:underline cursor-pointer'>SignIn</span></p>
        </div>
    </div>
  )
}

export default index