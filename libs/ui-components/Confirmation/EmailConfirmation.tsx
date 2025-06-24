import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
// import { Button } from '../index';
import { getData } from './../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from './../../../libs/utils/localStorage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Alert } from '@mui/material';

// interface EmailConfirmationProps {
//   isVerifying?: boolean;
// }

// interface SignupData {
//   email: string;
// }

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [displayMessage, setDisplayMessage] = useState<string>('');
  const userTypeFromState = location.state?.userType;
  const emailFromState = location.state?.username;
  const [showAlert, setShowAlert] = useState(location.state?.showAlert);

  // const handleProceedToLogin = () => {
  //   navigate('/auth/login');
  // };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 9000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);


  useEffect(() => {
    const setEmailAndMessage = () => {
      try {
        const emailToUse = emailFromState;
        if (emailToUse) {
          setEmail(emailToUse);
        }
        else {
          const signupDataString = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_EMAIL);
          if (signupDataString) {
            setEmail(signupDataString);
          }
        }
  
        if (userTypeFromState === 'professional') {
          setDisplayMessage('Kindly check your email inbox and spam for a verification mail.');
        }
        else {
          setDisplayMessage('Kindly check your email inbox and spam for a verification mail. Your sign-up has been received. We will verify your information. If it passes our KYC process, you will receive your activation email. Please check your inbox or spam in a few hours.');
        }

      }
      catch (error) {
        console.error('Error retrieving email', error);
      }
    }
    setEmailAndMessage();

  }, [emailFromState, userTypeFromState]);


  useEffect(() => {
    if (location.state && (location.state.userType || location.state.username || location.state.showAlert)) {
      const timer = setTimeout(() => {
        navigate(location.pathname, { replace: true, state: {} });
      }, 100);
    }
  }, [navigate, location.state, location.pathname])


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
        setDisplayMessage(resp.message);
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

  const handleBackClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-gray-50 p-4">

      <div className="absolute top-6 left-6">
        <ChevronLeftIcon className="cursor-pointer text-3xl p-1 bg-red-600 text-white hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '2rem', touchAction: "manipulation" }} onClick={handleBackClick} />
      </div>

      {showAlert && (
        <Alert className='mb-20' severity="info">Kindly check your email inbox or spam for a verification mail</Alert>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-md relative">

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <AttachEmailIcon className="text-blue-600 w-48 h-48" />
            </div>
          </div>

          <div className="text-center gap-8 mb-8">
            <h2 className="text-2xl font-semibold mb-2">Registration Successful!</h2>
            {userTypeFromState === 'professional' ? (
              <p className="text-gray-600 text-center">
                {displayMessage}
              </p>
            ):
            (  
              <p className="text-gray-600 text-justify">
                {displayMessage}
              </p>
            )}
          </div>

          <div className="text-center text-sm text-gray-500 mb-6">
            <p>
              Didn't receive it?{' '}
              <button className="text-blue-600 hover:underline" onClick={handleResendVerificationEmail} disabled={resending}>
                {resending ? 'Resending...' : 'Resend verification email'}
              </button>
            </p>
          </div>

          {/* <Button
            variant="black"
            label="Proceed to Login"
            onClick={handleProceedToLogin}
            className="w-full py-3 rounded-md"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;