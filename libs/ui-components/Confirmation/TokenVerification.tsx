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
  token: z.string().min(1, "Token is required"),
});

type FormData = z.infer<typeof schema>;

const TokenVerification = () => {
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
        `${CONFIG.BASE_URL}${apiEndpoints.FORGOT_PASSWORD_CONFIRM_TOKEN}`,
        { token: data.token, email: location.state?.email }
      );

      if (response.token) {
        toast.success("Token has been validated");
        navigate('/auth/reset-password', { state: { token: response.token, email: location.state?.email } });
      } else {
        toast.error("Invalid token. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendToken = async () => {
    try {
      await postData(
        `${CONFIG.BASE_URL}${apiEndpoints.RESEND_2FA}`,
        { email: location.state?.email }
      );
      toast.success("A new token has been sent to your email.");
    } catch (error) {
      toast.error("Failed to resend token. Please try again.");
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
          height: '100vh',
        }}
      ></div>
      <div className="flex-1 flex items-center justify-start">
        <ChevronLeftIcon className="cursor-pointer text-base ml-2 top-4 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.95rem' }} onClick={handleBackClick} />
        <div className="w-[90%] mx-auto flex items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="lg:w-[70%] mt-14">
                <h5 className="font-bold text-3xl">Verify Token</h5>
                <p className="mt-2 mb-6">Enter the token sent to your email</p>
                <div className="flex flex-col gap-6">
                    <Input type='text' {...register('token')} error={errors.token} label="Token" placeholder="Enter token" />
                </div>
                <Button type='submit' variant='black' disabled={loading} className="w-full my-10" label={loading ? "Verifying..." : "Verify Token"} />
                <p className="text-center">
                    Didn't receive the token? <span className="text-blue-400 cursor-pointer hover:underline" onClick={handleResendToken}>Resend Token</span>
                </p>
            </form>
        </div>
      </div>
    </div>
  );
};

export default TokenVerification;

