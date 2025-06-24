import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { getData } from '../../utils/apis/apiMethods';
import { apiEndpoints } from '../../utils/apis/apiEndpoints';
import CONFIG from '../../utils/helpers/config';
import EmailConfirmation from './EmailConfirmation';
import { LOCAL_STORAGE_KEYS } from './../../../libs/utils/localStorage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button, Loader } from '../index';


const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [currentMessage, setCurrentMessage] = useState('Verifying your email...');

  const handleProceedToLogin = () => {
    navigate('/auth/login');
  };


  useEffect(() => {
    const verifyEmail = async () => {
      const queryParams = new URLSearchParams(location.search);
      const userId = queryParams.get('userId');
      const token = queryParams.get('token');

      if (!userId || !token) {
        toast.error('Invalid verification link.');
        setTimeout(() => navigate('/auth/login', { state: { verified: false, message: 'Invalid verification link.' } }), 4000);
        return;
      }

      try {
        setLoading(true);
        const response = await getData(
          `${CONFIG.BASE_URL}${apiEndpoints.VERIFY_MAIL}?userId=${userId}&token=${token}`
        );
        
        if (response.statusCode === '00' && response?.data?.auth === 'ok') {
          const isUserVerified = response.data.isVerified === true || response.data.isVerified === 'true';
          const successMessage = response.message;
          setLoading(false);
          setCurrentMessage(successMessage);
          navigate('/auth/login', { state: { verified: isUserVerified, message: successMessage } });
        }
        else {
          // const isUserVerified = response.data.isVerified === 'false';
          const errorMessage = response.message;
          setLoading(false);
          setCurrentMessage(errorMessage);
          navigate('/auth/login', { state: { verified: false, message: errorMessage } });
        }
      }
      catch (error: any) {
        const errorMessage = error.response?.data?.message;
        setLoading(false);
        setCurrentMessage(errorMessage);
        navigate('/auth/login', { state: { verified: false, message: errorMessage } });
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md relative">
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col gap-6 text-center items-center justify-center">
              <Loader />
              <p className="text-gray-600">{currentMessage}</p>
            </div>
          ) : (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-600">{currentMessage}</p>
            </div>
          )}

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

export default VerifyEmail;