// // ConfirmEmail.js
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify';
// import { getData } from '../../utils/apis/apiMethods';
// import { apiEndpoints } from '../../utils/apis/apiEndpoints';
// import CONFIG from '../../utils/helpers/config';

// const ConfirmEmail = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [isVerifying, setIsVerifying] = useState(true);

//   // Extract query parameters from the URL

//   useEffect(() => {
//     const verifyEmail = async () => {
//       const queryParams = new URLSearchParams(location.search);
//       const userId = queryParams.get('userId');
//       const token = queryParams.get('token');
//       const skip = queryParams.get('skip');

//       if (!userId || !token) {
//         toast.error('Invalid verification link.');
//         navigate('/login');
//         return;
//       }

//       try {
//         const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VERIFY_MAIL}?userId=${userId}&token=${token}&skip=${skip}`);
        
//         if (response.status === 'success') {
//           navigate('/login?verified=true');
//           // toast.success('Your email has been successfully verified!')
//         } else {
//           navigate('/login?verified=false');
//           // toast.error('Email verification failed. Please try again.')
//         }
//       } catch (error) {
//         console.error('Error verifying email:', error);
//         toast.error('An error occurred while verifying your email.');
//         navigate('/login?verified=false');
//       }
//     };

//     verifyEmail();
//   }, [location, navigate]);

//   if (isVerifying) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <h1 className="text-2xl font-bold">Verifying your email...</h1>
//       </div>
//     );
//   }
//   return null;
// };

// export default ConfirmEmail;












import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import { Button } from '../index';
import { postData } from './../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';

interface EmailConfirmationProps {
  isVerifying?: boolean;
  email?: string;
}

const EmailConfirmation: React.FC<EmailConfirmationProps> = ({ isVerifying = false, email }) => {
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);

  const handleProceedToLogin = () => {
    navigate('/auth/login');
  };

  const handleResendVerificationEmail = async () => {
    if (!email) {
      toast.error('Email not found. Please try the process again.');
      return;
    }

    setResending(true);
    try {
      await postData(
        `${CONFIG.BASE_URL}${apiEndpoints.RESEND_MAIL_CONFIRMATION}`,
        { email: 'tubiobaloluwa@gmail.com' }
      );
      toast.success('A new verification email has been sent to your email.');
    }
    catch (error) {
      toast.error('Failed to resend verification email. Please try again.');
    }
    finally {
      setResending(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <CircularProgress className="w-8 h-8" />
          <h2 className="text-2xl font-bold mt-4">Verifying your email...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">

      <div className="w-full max-w-md bg-white rounded-lg shadow-md relative">

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <AttachEmailIcon className="text-blue-600 w-48 h-48" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Registration Successful!</h2>
            <p className="text-gray-600">
              Kindly check your email inbox for a verification mail
            </p>
          </div>

          <div className="text-center text-sm text-gray-500 mb-6">
            <p>
              Didn't receive it?{' '}
              <button className="text-blue-600 hover:underline" onClick={handleResendVerificationEmail}>
                Resend verification email
              </button>
            </p>
          </div>

          <Button
            variant="black"
            label="Proceed to Login"
            onClick={handleProceedToLogin}
            className="w-full py-3 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;