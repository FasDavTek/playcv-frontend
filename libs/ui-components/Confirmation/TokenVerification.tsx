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

interface SignupData {
  email: string;
}

const TokenVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [verificationMessage, setVerificationMessage] = useState<string>('');
  const [isEmailVerification, setIsEmailVerification] = useState<boolean>(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const searchParams = new URLSearchParams(location.search);
      const userId = searchParams.get('userId');
      const token = searchParams.get('token');

      if (!token) {
        setVerificationStatus('error');
        setVerificationMessage('Invalid verification link.');
        return;
      }

      setIsEmailVerification(!!userId);


      try {
        const signupDataString = localStorage.getItem('signupData');
        if (signupDataString) {
          const signupData: SignupData = JSON.parse(signupDataString);
          setEmail(signupData.email);
        }
      } catch (error) {
        console.error('Error retrieving email from localStorage:', error);
      }


      try {
        let response;
        if (isEmailVerification) {
          if (!userId) {
            throw new Error('User ID is required for email verification.');
          }
          response = await getData(
            `${CONFIG.BASE_URL}${apiEndpoints.VERIFY_MAIL}?userId=${userId}&token=${token}`
          );
          if (response.statusCode === '00' && response.message === "Email verification completed") {
            setVerificationStatus('success');
            setVerificationMessage('Email verified successfully.');
            navigate('/auth/login?verified=true');
          }
          else {
            setVerificationStatus("error");
            setVerificationMessage(response.message);
            navigate('/auth/login?verified=false');
          }
        }
        else {
          response = await postData(
            `${CONFIG.BASE_URL}${apiEndpoints.FORGOT_PASSWORD_CONFIRM_TOKEN}`,
            { token }
          );
          if (response.token) {
            setVerificationStatus('success');
            setVerificationMessage('Password reset token verified successfully.');
          }
          else {
            throw new Error(response.message || 'Password reset token verification failed.');
          }
        }
      } catch (error: any) {
        setVerificationStatus('error');
        // setVerificationMessage(error.message || 'Email verification failed.');
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred. Please try again.');
        }
      }
    };

    verifyToken();
  }, [location.search]);

  const handleProceedToLogin = () => {
    navigate('/auth/login');
  };

  const handleResendVerificationEmail = async () => {
    if (!email) {
      toast.error('Email not found. Please try the process again.');
      return;
    }

    try {
      const resp = await postData(
        `${CONFIG.BASE_URL}${apiEndpoints.RESEND_MAIL_CONFIRMATION}`,
        { email }
      );
      if (resp.code === 200) {
        toast.success('A new verification email has been sent to your email.');
      }
    } catch (error: any) {
      // toast.error('Failed to resend verification email. Please try again.');
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred. Please try again.');
      }
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
              {verificationStatus === 'error' && (
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