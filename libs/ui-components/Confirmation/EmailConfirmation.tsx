// ConfirmEmail.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { getData } from '../../utils/apis/apiMethods';
import { apiEndpoints } from '../../utils/apis/apiEndpoints';
import CONFIG from '../../utils/helpers/config';

const ConfirmEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  // Extract query parameters from the URL

  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const userId = queryParams.get('userId');
      const token = queryParams.get('token');
      const skip = queryParams.get('skip');

      if (!userId || !token) {
        toast.error('Invalid verification link.');
        navigate('/login');
        return;
      }

      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VERIFY_MAIL}?userId=${userId}&token=${token}&skip=${skip}`);
        
        if (response.status === 'success') {
          navigate('/login?verified=true');
          // toast.success('Your email has been successfully verified!')
        } else {
          navigate('/login?verified=false');
          // toast.error('Email verification failed. Please try again.')
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        toast.error('An error occurred while verifying your email.');
        navigate('/login?verified=false');
      }
    };

    verifyEmail();
  }, [location, navigate]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Verifying your email...</h1>
      </div>
    );
  }
  return null;
};

export default ConfirmEmail;