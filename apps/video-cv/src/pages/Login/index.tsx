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
import { useAuth } from './../../../../../libs/context/AuthContext';
import { decodeJWT } from './../../../../../libs/utils/helpers/decoder';

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
  const { setAuthState } = useAuth();

  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { username, password } = data;
    const reqBody = {
      username, password,
    }
    try {
      console.log(reqBody);

      const res = await postData(
        `${CONFIG.BASE_URL}${apiEndpoints.AUTH_LOGIN}`,
        reqBody
      );

      console.log(res);

      if (res.code === "200") {

        toast.success(`Welcome aboard once again! Let's continue where we left off.`);

        const token = res.jwtToken;
        const decoded = decodeJWT(token);
        
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.USER,
          JSON.stringify({ ...res, ...decoded })
        );

        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "true");
        localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, res.token);
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID, res.user.id);

          // Update the global auth state
          setAuthState({
            isAuthenticated: true,
            user: {
              id: res.user.id,
              username: username,
              name: res.user.fullName || 'User',
              userTypeId: res.user.userTypeId,
              // Add other relevant user fields
            }
          });

        reset();

        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      }
      else {
        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_USER_EXIST, "false");
        toast.error(`We couldn't verify your identity. Please try again or use the 'Forgot Password' option if needed.`);
      }   
    }
    catch (err: any) {
      toast.error(`Oops! Error 404: Correct credentials not found. But don't worry, let's give it another shot!`);
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
            <Input type='username' {...register('username')} error={errors.username} label="Username" placeholder="user@email.com" />
            <Input type='password' {...register('password')} error={errors.password} label="Password" placeholder="XubYgsanbE" />
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