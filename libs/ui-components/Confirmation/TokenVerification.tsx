// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm } from 'react-hook-form';
// import { Button, Input } from '../index';
// import { Images } from '../../assets/index';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import { postData } from './../../../libs/utils/apis/apiMethods';
// import { apiEndpoints } from './../../../libs/utils/apis/apiEndpoints';
// import CONFIG from './../../../libs/utils/helpers/config';
// import { toast } from 'react-toastify';

// const schema = z.object({
//   token: z.string().min(1, "Token is required"),
// });

// type FormData = z.infer<typeof schema>;

// const TokenVerification = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [loading, setLoading] = useState(false);
//   const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
//     resolver: zodResolver(schema),
//   });

//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     try {
//       const response = await postData(
//         `${CONFIG.BASE_URL}${apiEndpoints.FORGOT_PASSWORD_CONFIRM_TOKEN}`,
//         { token: data.token, email: location.state?.email }
//       );

//       if (response.token) {
//         toast.success("Token has been validated");
//         navigate('/auth/reset-password', { state: { token: response.token, email: location.state?.email } });
//       } else {
//         toast.error("Invalid token. Please try again.");
//       }
//     } catch (error) {
//       toast.error("An error occurred. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendToken = async () => {
//     try {
//       await postData(
//         `${CONFIG.BASE_URL}${apiEndpoints.RESEND_2FA}`,
//         { email: location.state?.email }
//       );
//       toast.success("A new token has been sent to your email.");
//     } catch (error) {
//       toast.error("Failed to resend token. Please try again.");
//     }
//   };

//   const handleBackClick = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="min-h-screen flex">
//       <div
//         className="border w-0 md:flex-1 min-h-screen"
//         style={{
//           backgroundImage: `url(${Images.AuthBG})`,
//           backgroundSize: 'cover',
//           backgroundRepeat: 'no-repeat',
//           backgroundPosition: 'center',
//           height: '100vh',
//         }}
//       ></div>
//       <div className="flex-1 flex items-center justify-start">
//         <ChevronLeftIcon className="cursor-pointer text-base ml-2 top-4 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.95rem' }} onClick={handleBackClick} />
//         <div className="w-[90%] mx-auto flex items-center justify-center">
//             <form onSubmit={handleSubmit(onSubmit)} className="lg:w-[70%] mt-14">
//                 <h5 className="font-bold text-3xl">Verify Token</h5>
//                 <p className="mt-2 mb-6">Enter the token sent to your email</p>
//                 <div className="flex flex-col gap-6">
//                     <Input type='text' {...register('token')} error={errors.token} label="Token" placeholder="Enter token" />
//                 </div>
//                 <Button type='submit' variant='black' disabled={loading} className="w-full my-10" label={loading ? "Verifying..." : "Verify Token"} />
//                 <p className="text-center">
//                     Didn't receive the token? <span className="text-blue-400 cursor-pointer hover:underline" onClick={handleResendToken}>Resend Token</span>
//                 </p>
//             </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TokenVerification;













import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import { Button } from '../index';
import { Images } from '../../assets/index';
import { getData, postData } from './../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';

const TokenVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [verificationMessage, setVerificationMessage] = useState<string>('');

  const isEmailVerification = location.pathname.includes('verify-email');

  useEffect(() => {
    const verifyToken = async () => {
      const searchParams = new URLSearchParams(location.search);
      const userId = searchParams.get('userId');
      const token = searchParams.get('token');

      if (!userId || !token) {
        setVerificationStatus('error');
        setVerificationMessage('Invalid verification link.');
        return;
      }

      try {
        let response;
        if (isEmailVerification) {
          response = await getData(
            `${CONFIG.BASE_URL}${apiEndpoints.VERIFY_MAIL}?userId=${userId}&token=${token}`
          );
        } else {
          response = await postData(
            `${CONFIG.BASE_URL}${apiEndpoints.FORGOT_PASSWORD_CONFIRM_TOKEN}`,
            { token, userId }
          );
        }
        
        if (response.status === 'success' || response.token) {
          setVerificationStatus('success');
          setVerificationMessage(isEmailVerification ? 'Email verified successfully.' : 'Password reset token verified successfully.');
        } else {
          throw new Error('Verification failed');
        }
      } catch (error) {
        setVerificationStatus('error');
        setVerificationMessage(isEmailVerification ? 'Email verification failed.' : 'Password reset token verification failed.');
      }
    };

    verifyToken();
  }, [isEmailVerification, location.search]);

  const handleProceedToLogin = () => {
    navigate('/auth/login');
  };

  const handleResendVerificationEmail = async () => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');

    if (!email) {
      toast.error('Email not found in the URL. Please try the process again.');
      return;
    }

    try {
      await postData(
        `${CONFIG.BASE_URL}${apiEndpoints.RESEND_MAIL_CONFIRMATION}`,
        { email }
      );
      toast.success('A new verification email has been sent to your email.');
    } catch (error) {
      toast.error('Failed to resend verification email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-[90%] max-w-md bg-white rounded-lg shadow-md p-8">
          {verificationStatus === 'pending' ? (
            <div className="text-center">
              <CircularProgress className="w-16 h-16 text-blue-600" />
              <h2 className="text-2xl font-bold mt-4">Verifying...</h2>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full">
                  <AttachEmailIcon className="text-blue-600 w-24 h-24" />
                </div>
              </div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-2">
                  {verificationStatus === 'success' ? 'Verification Successful!' : 'Verification Failed'}
                </h2>
                <p className="text-gray-600">{verificationMessage}</p>
              </div>
              {verificationStatus === 'error' && isEmailVerification && (
                <div className="text-center text-sm text-gray-500 mb-6">
                  <p>
                    Didn't receive it?{' '}
                    <button className="text-blue-600 hover:underline" onClick={handleResendVerificationEmail}>
                      Resend verification email
                    </button>
                  </p>
                </div>
              )}
              <Button
                variant="black"
                label="Proceed to Login"
                onClick={handleProceedToLogin}
                className="w-full py-3 rounded-md"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenVerification;