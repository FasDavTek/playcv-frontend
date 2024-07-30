import React from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Button, Input } from '@video-cv/ui-components';
import { Images } from '@video-cv/assets';
import { useAuth } from '../../context/AuthProvider';
import { Stack } from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { handleLogin } = useAuth();

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleLogin();
      navigate(location.state?.from || '/');
      return;
    }, 1500);
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
        <form onSubmit={handleSubmit} className=" w-7/12 mx-auto mt-14">
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
            <Input label="Email" placeholder="user@email.com" />
            <Input label="Password" placeholder="user@email.com" />
          </div>

          <Button type='submit' {...{ loading }} className="w-full my-10" label="Login" />
          <Stack mt={1} gap={1}>
            <p className="text-center md:text-left">Don't have an account? Choose your path to get started: </p>
            <Stack direction={{ xs: 'column', md: 'row' }} mt={1} gap={3} >
              <Button type='submit' variant='custom' className="w-full" label="Sign up as Employer" onClick={() => navigate('/employer/profile/:id')} />
              <Button type='submit' variant='black' className="w-full" label="Sign up as Professional" onClick={() => navigate('/candidate/profile/:id')} />
            </Stack>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default Login;
