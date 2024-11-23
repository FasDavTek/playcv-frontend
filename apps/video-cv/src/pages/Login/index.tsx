import React from 'react';
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
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import { decodeJWT } from './../../../../../libs/utils/helpers/decoder';
import { useAuth } from './../../../../../libs/context/AuthContext'

const ErrorMessages: any = {
  required: (field: any) => `${field} is required`,
};

const schema = z.object({
  email: z.string({
    required_error: ErrorMessages.required('Email'),
  })
  .min(1, "Email is required")
  .email("Invalid email format"),

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
  const { setAuthState } = useAuth();

  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fetchUserProfile = async (userId: string): Promise<UserProfile | undefined | null | void> => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.PROFILE}/${userId}?Page=1&Limit=10`);
      if (response.ok) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA, JSON.stringify(response.data));
        console.log("User profile fetched successfully");
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { email, password } = data;
    const reqBody = {
      email, password,
    }
    try {
      const res = await postData(
        `${CONFIG.BASE_URL}${apiEndpoints.AUTH_LOGIN}`,
        reqBody
      );

      if (res.ok) {
        toast.success(res.message);
        const token = res.jwtToken;
        const decoded = decodeJWT(token);
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.USER,
          JSON.stringify({ ...res, ...decoded })
        );
        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true");
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, decoded.UserId);
        localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, res.jwtToken);

        const userProfile = await fetchUserProfile(decoded.UserId);

        if (userProfile) {
          // Update the global auth state
          setAuthState({
            isAuthenticated: true,
            user: {
              id: decoded.UserId,
              email: email,
              name: userProfile.name || 'User', // Adjust based on your user profile structure
              // Add other relevant user fields
            }
          });
        }

        reset();

        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      }
      else {
        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "false");
        toast.error(res.message);
      }   
    }
    catch (err) {
      console.error(err);
      toast.error("An error occurred during login");
    } 
    finally {
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
          height: '100%',
        }}
      ></div>
      <div className="border flex-1">
        <ChevronLeftIcon className="cursor-pointer text-base ml-2 top-2 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
        <form onSubmit={handleSubmit(onSubmit)} className="w-[90%] md:w-7/12 mx-auto mt-14">
          <h5 className="font-bold text-3xl">Login</h5>
          <p className="">Enter your login details to Sign in</p>
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
            <Input type='email' {...register('email')} error={errors.email} label="Email" placeholder="user@email.com" />
            <Input type='password' {...register('password')} error={errors.password} label="Password" placeholder="user@email.com" />
          </div>

          <Button type='submit' variant='black' disabled={loading} className="w-full my-10" label={loading ? "Submitting..." : "Login"} />
          <Stack mt={1} gap={1}>
            <p className="text-center md:text-left">Don't have an account? Choose your path to get started: </p>
            <Stack direction={{ xs: 'column', md: 'row' }} mt={1} gap={3} >
              <Button type='submit' variant='custom' className="w-full" label="Sign up as Employer" onClick={() => navigate('/auth/employer-signup')} />
              <Button type='submit' variant='black' className="w-full" label="Sign up as Professional" onClick={() => navigate('/auth/professional-signup')} />
            </Stack>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default Login;