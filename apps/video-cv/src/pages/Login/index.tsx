import React, { useCallback, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Input } from '@video-cv/ui-components';
import { Images } from '@video-cv/assets';
import { Stack } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useForm } from 'react-hook-form';
import { getData, postData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';
import { useAuth } from './../../../../../libs/context/AuthContext';
import { decodeJWT } from './../../../../../libs/utils/helpers/decoder';
import { useCart } from '../../context/CartProvider';
import { useProfileCompletionNotice } from './../../../../../libs/utils/helpers/profileCompletionNotice';
import { useFirstLogin } from './../../../../../libs/hooks/useFirstLogin';

const ErrorMessages: any = {
  required: (field: any) => `${field} is required`,
};

const schema = z.object({
  username: z.string({
    required_error: ErrorMessages.required('Username'),
  })
  .min(1, "Username is required"),

  password: z.string({
    required_error: ErrorMessages.required('Password'),
  })
  .min(6, "Password must be at least 6 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[\W_]/, "Password must contain at least one special character"),
});

type FormData = z.infer<typeof schema>;

interface UserProfile {
  // id: string;
  name: string;
  // email: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useCart();
  const { setAuthState, authState } = useAuth();
  const { markNoticeAsShown } = useProfileCompletionNotice()

  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { completeFirstLogin } = useFirstLogin();

  useEffect(() => {
    if (location.state) {
      const { verified, message } = location.state as { verified?: boolean; message?: string; };

      if (verified === true) {
        toast.success(message);
      } else if (verified === false) {
        toast.error(message);
      }

      navigate(location.pathname, { replace: true, state: {} }); 
    }
  }, [location, navigate]);

  const handleForgotPassword = () => {
    navigate('/auth/forgot-password');
  };




  const fetchUserProfile = async (token: string) => {
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_PROFILE}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (resp.code === "00") {
        return resp.userProfile
      } else {
        throw new Error(resp.message || "Failed to fetch user profile")
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      throw error
    }
  }



  const fetchCart = async () => {
    const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.FETCH_MY_CART}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.code === '00') {
        dispatch({ type: 'SET_CART', payload: response.data });
      }
    } catch (err) {
      console.error('Unable to load cart items');
    }
  };



  // useEffect(() => {
  //   fetchCart();
  // }, [dispatch]);




  const onSubmit = useCallback(async (data: FormData) => {
    setLoading(true);
    const { username, password } = data;
    const reqBody = {
      username, password,
    }
    try {

      const res = await postData(
        `${CONFIG.BASE_URL}${apiEndpoints.AUTH_LOGIN}`,
        reqBody
      );

      if (res.code === "200") {
        const userId = res.user.id;
        const { isFirstLogin } = useFirstLogin(userId);

        const token = res.token;
        const decoded = decodeJWT(token);

        if (isFirstLogin) {
          completeFirstLogin();
        }

        sessionStorage.setItem(SESSION_STORAGE_KEYS.TOKEN, res.token);

        const userToken = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
        let userProfile;
        try {
          userProfile = await fetchUserProfile(userToken || '')
        }
        catch (profileError) {
          toast.warning("Logged in successfully, but there was an issue fetching your profile.")
        }

        const userData = {
          ...res,
          ...decoded,
          profile: userProfile,
        }

        sessionStorage.setItem(SESSION_STORAGE_KEYS.USER,JSON.stringify({ userData }) );

        sessionStorage.setItem(SESSION_STORAGE_KEYS.IS_USER_EXIST, "true");
        sessionStorage.setItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID, res.user.id);

          // Update the global auth state
          setAuthState({
            isAuthenticated: true,
            user: {
              id: res.user.id,
              email: res.user.userTypeId === 2 ?  userProfile.businessDetails?.businessEmail : res.user.email,
              username: res.user.userTypeId === 2 ?  userProfile.businessDetails?.businessEmail : res.user.email,
              name: res.user.userTypeId === 2 ? userProfile.businessDetails?.businessName : res.user.fullName || "User",
              userTypeId: res.user.userTypeId,
              firstName: res.user.firstName,
              lastName: res.user.lastName,
              phone: res.user.userTypeId === 2 ? userProfile.businessDetails?.contactPhone : res.user.mobile,
              businessName: userProfile.businessDetails?.businessName,
              businessEmail: userProfile.businessDetails?.businessEmail,
              // Add other relevant user fields
            }
          });

        markNoticeAsShown();

        toast.success(isFirstLogin ? `Welcome! Let's get started by completing your profile.` : `Welcome aboard once again! Let's continue where we left off.`);
        reset();

        const from = location.state?.from || '/';
        navigate(from, { replace: true, state: {  showAlert: true } });

        if (res.user.userTypeId === 1) {
          navigate('/admin/dashboard')
        }

        if (res?.user?.userTypeId === 2) {
          await fetchCart();
        }
        
      }
      else {
        sessionStorage.setItem(SESSION_STORAGE_KEYS.IS_USER_EXIST, "false");
        toast.error(`We couldn't verify your identity. Please try again or use the 'Forgot Password' option if needed.`);
      }   
    }
    catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      }
      else if (err.response?.data?.error) {
        toast.error(err.response.data.error)
      }
      else {
        console.error(err);
        toast.error('An error occurred. Please try again.');
      }
    } 
    finally {
      setLoading(false);
    }
  }, [markNoticeAsShown, dispatch, authState]);


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
          height: '100%',
        }}
      ></div>
      <div className="flex-1 items-center justify-start">
        <ChevronLeftIcon className="cursor-pointer text-base ml-2 top-4 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.95rem' }} onClick={handleBackClick} />
        <div className="w-[90%] h-full mx-auto flex items-center justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="my-auto">
            <h5 className="font-bold text-3xl">Login</h5>
            <p className="">Enter your login details to Sign in</p>

            {location.search.includes('verified=true') && (
              <div className="my-3 mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  ✓ Your email has been successfully verified. You can now log in to your account.
                </p>
              </div>
            )}
            {location.search.includes('verified=false') && (
              <div className="my-3 mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">
                  ✕ Email verification failed. Please try again or contact support for assistance.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-5 my-5 mt-10">
              <Button
                className="w-full"
                variant="neutral"
                label="Sign in with NYSC Jobs"
              />
            </div>
            <div className="flex gap-3 items-center my-4">
              <hr className="flex-1" />
              or Sign in with email
              <hr className="flex-1" />
            </div>
            <div className="flex flex-col gap-6">
              <Input type='username' {...register('username')} error={errors.username} label="Username" placeholder="user@email.com" />
              <Input type='password' {...register('password')} error={errors.password} label="Password" placeholder="XubYgsanbE" />
            </div>

            <div className='w-full flex items-end justify-end'>
              <p className='text-sm mt-3 text-center text-blue-400 hover:underline cursor-pointer' onClick={handleForgotPassword}>Forgot Password</p>
            </div>

            <Button type='submit' variant='black' disabled={loading} className="w-full my-10" label={loading ? "Submitting..." : "Login"} />
            <Stack mt={1} gap={1}>
              <p className="text-center md:text-left">Don't have an account? Choose your path to get started: </p>
              <Stack direction={{ xs: 'column', md: 'row' }} mt={1} gap={3} >
                <Button type='button' variant='custom' className="w-full" label="Sign up as Employer" onClick={() => navigate('/auth/employer-signup')} />
                <Button type='button' variant='black' className="w-full" label="Sign up as Professional" onClick={() => navigate('/auth/professional-signup')} />
              </Stack>
            </Stack>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;