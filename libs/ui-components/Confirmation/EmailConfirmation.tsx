import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import { Button } from '../index';
import { getData, postData } from './../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from './../../../libs/utils/localStorage';

interface EmailConfirmationProps {
  isVerifying?: boolean;
}

interface SignupData {
  email: string;
}

const EmailConfirmation: React.FC<EmailConfirmationProps> = ({ isVerifying = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const emailFromState = location.state?.email

  const handleProceedToLogin = () => {
    navigate('/auth/login');
  };


  useEffect(() => {
    try {
      const emailToUse = emailFromState;
      if (emailToUse) {
        setEmail(emailToUse);
      }
      else {
        const signupDataString = localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA);
        let signUpEmail = '';
        if (signupDataString) {
          const signupData = JSON.parse(signupDataString);
          signUpEmail = signupData?.email;
          setEmail(signUpEmail);
        }
      }
    }
    catch (error) {
      console.error('Error retrieving email', error);
    }
  }, [emailFromState]);


  const handleResendVerificationEmail = async () => {
    if (!email) {
      toast.error('Email not found. Please try the process again.');
      return;
    }

    setResending(true);
    try {
      const resp = await getData(
        `${CONFIG.BASE_URL}${apiEndpoints.RESEND_MAIL_CONFIRMATION}/${email}`,
      );
      if (resp.code === 200) {
        toast.success('A new verification email has been sent to your email.');
        setVerificationMessage(resp.message);
      }
    }
    catch (error: any) {
      // toast.error('Failed to resend verification email. Please try again.');
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
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
              {resending === false ? `Kindly check your email inbox for a verification mail` : verificationMessage}
            </p>
          </div>

          <div className="text-center text-sm text-gray-500 mb-6">
            <p>
              Didn't receive it?{' '}
              <button className="text-blue-600 hover:underline" onClick={handleResendVerificationEmail} disabled={resending}>
                {resending ? 'Resending...' : 'Resend verification email'}
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