import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, Input } from '@video-cv/ui-components';
import { Images } from '@video-cv/assets';
// import { useAuth } from '../../context/AuthProvider';

const Login = () => {
  const navigate = useNavigate();

  // const { handleLogin } = useAuth();

  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    debugger;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');

      return;
    }, 1500);
  };

  const handleClick = () => {
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex">
      <div
        className="border w-0 md:flex-1 min-h-screen"
        style={{
          backgroundImage: `url(${Images.AuthBG})`,
          backgroundSize: 'cover', // Adjusted to 'contain'
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center', // Optional: Center the background image
          height: '100%',
        }}
      ></div>
      <div className="border flex-1">
        <form onSubmit={handleSubmit} className=" w-7/12 mx-auto mt-24">
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

          <Button {...{ loading }} className="w-full my-10 text-white" label="Login" onClick={handleClick} />
        </form>
      </div>
    </div>
  );
};

export default Login;
