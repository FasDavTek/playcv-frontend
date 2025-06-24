import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../index';
import { Images } from '../../assets/index';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { postData } from './../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';

const schema = z.object({
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

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await postData(
        `${CONFIG.BASE_URL}${apiEndpoints.FORGOT_PASSWORD_RESET_PASSWORD}`,
        { 
          username: location.state?.email,
          password: data.password,
          confirmPassword: data.confirmPassword
        }
      );

      if (response.message === "Password reset successfully. Please login with your new password.") {
        toast.success(response.message);
        navigate('/auth/login');
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="border w-0 md:flex-1 min-h-screen"
        style={{
          backgroundImage: `url(${Images.AuthBG})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '100%',
        }}
      ></div>
      <div className="flex-1 flex items-center justify-start">
        <ChevronLeftIcon className="cursor-pointer text-base ml-2 top-4 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.95rem' }} onClick={handleBackClick} />
        <div className="w-[90%] mx-auto flex items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="mt-14 w-full xl:w-[65%]">
                <h5 className="font-bold text-3xl">Reset Password</h5>
                <p className="mt-2 mb-6">Enter your new password</p>
                <div className="flex flex-col gap-6">
                    <Input type='password' {...register('password')} error={errors.password} label="New Password" placeholder="Enter new password" />
                    <Input type='password' {...register('confirmPassword')} error={errors.confirmPassword} label="Confirm Password" placeholder="Confirm new password" />
                </div>
                <Button type='submit' variant='black' disabled={loading} className="w-full my-10" label={loading ? "Resetting..." : "Reset Password"} />
            </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;