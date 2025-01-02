import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../index';
import { Images } from '../../assets/index';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { postData } from '../../utils/apis/apiMethods';
import { apiEndpoints } from '../../utils/apis/apiEndpoints';
import CONFIG from '../../utils/helpers/config';
import { toast } from 'react-toastify';

const schema = z.object({
  username: z.string().email("Invalid email address").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email"),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await postData(
        `${CONFIG.BASE_URL}${apiEndpoints.FORGOT_PASSWORD_GENERATE_TOKEN}`,
        { username: data.username }
      );

      if (response.code === "200") {
        toast.success("Password reset token successfully generated.");
        navigate('/auth/verify-token', { state: { username: data.username } });
      } else {
        toast.error("Failed to generate reset token. Please try again.");
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
          height: '100dvh',
        }}
      ></div>
      <div className="flex-1 flex items-center justify-start">
        <ChevronLeftIcon className="cursor-pointer text-base ml-2 top-4 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.95rem' }} onClick={handleBackClick} />
        <div className="w-[90%] mx-auto flex items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="mt-14">
            <h5 className="font-bold text-3xl">Forgot Password</h5>
            <p className="mt-2 mb-6">Enter your email address to receive a password reset token</p>
            <div className="flex flex-col gap-6">
              <Input type='email' {...register('username')} error={errors.username} label="Email" placeholder="user@email.com" />
            </div>
            <Button type='submit' variant='black' disabled={loading} className="w-full my-10" label={loading ? "Sending..." : "Send Reset Token"} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

