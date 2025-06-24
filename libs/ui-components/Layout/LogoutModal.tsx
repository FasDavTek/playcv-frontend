import React from 'react';
import Button from '../Button';
import { Typography } from '@mui/material';

// import * as Assets from '@video-cv/assets';

const LogoutModal = ({
  onClose,
  onLogout,
}: {
  onClose: () => void;
  onLogout: () => void;
}) => {
  return (
    <div className="bg-white p-10 lg:p-14 centered-modal md:centered-modal-md rounded-lg">
      <div className="flex flex-col items-center space-y-8 lg:space-y-14">
        {/* <img src={Assets.Icons.LogoutModalIcon} alt="confirm icon" /> */}

        <Typography variant='h4' className="text-center text-base font-semibold" gutterBottom>Confirm Sign Out</Typography>

        <Typography variant='h6' component='span' className="text-center text-sm lg:text-2xl">
          You are about to sign out of your account. Any unsaved changes may be lost. Are you sure you want to proceed?
        </Typography>

        <div className="flex items-center space-x-16 lg:space-x-24">
          <Button variant='black' label='Cancel' onClick={onClose}></Button>

          <Button variant='red' label='Sign out' onClick={onLogout}></Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
