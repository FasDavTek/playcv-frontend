import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Alert, CircularProgress } from '@mui/material';
import { Button, Input } from '../index';
import { Images } from '../../assets/index';
import { getData, postData } from './../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { z } from 'zod';

interface SignupData {
  email: string;
}

const schema = z.object({
  token: z.string().min(6, "Token must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

const TokenVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showAlert, setShowAlert] = useState(location.state?.showAlert || false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(true), 7000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const email = location.state?.username;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.FORGOT_PASSWORD_CONFIRM_TOKEN}`,
        { token: data.token }
      );

      if (response.token) {
        toast.success("Token verified successfully");
        navigate('/auth/reset-password', { 
          state: { 
            token: data.token,
            email: email
          } 
        });
      } else {
        toast.error(response?.data?.error);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  // const handleResendVerificationEmail = async () => {
  //   if (!email) {
  //     toast.error('Email not found. Please try the process again.');
  //     return;
  //   }

  //   try {
  //     const resp = await getData(
  //       `${CONFIG.BASE_URL}${apiEndpoints.RESEND_MAIL_CONFIRMATION}/${email}`,
  //     );

  //     if (resp.code === 200) {
  //       toast.success('A new verification email has been sent to your email.');
  //       setVerificationMessage(resp.message);
  //     }
  //   } catch (error: any) {
  //     if (error.response?.data?.message) {
  //       toast.error(error.response.data.message);
  //     } else {
  //       toast.error('An error occurred. Please try again.');
  //     }
  //   }
  // };

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
        <div className="w-[90%] mx-auto flex flex-col items-center justify-center">
          {showAlert && (
            <Alert severity="info">Kindly check your email inbox or spam for a verification mail</Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-14 w-full xl:w-[65%]">
            <h5 className="font-semibold text-2xl lg:text-3xl text-center mb-4">Verify Token</h5>
            <div className="flex flex-col gap-6">
              <Input {...register('token')} error={errors.token} label="Verification Token" placeholder="Enter 6-digit token" 
              />
            </div>
            <Button type='submit' variant='black' disabled={loading} className="w-full my-4" label={loading ? "Verifying..." : "Verify Token"} 
            />
            {/* <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Didn't receive the token?{' '}
                <button type="button" onClick={handleResendVerificationEmail} disabled={resending} className="text-blue-600 hover:underline focus:outline-none"
                >
                  {resending ? 'Sending...' : 'Resend Token'}
                </button>
              </p>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default TokenVerification;