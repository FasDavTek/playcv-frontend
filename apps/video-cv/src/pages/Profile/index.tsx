import React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useDropzone } from 'react-dropzone';

import {
  Input,
  DatePicker,
  Select,
  TextArea,
  Button,
} from '@video-cv/ui-components';

const Profile = () => {
  const [value, setValue] = React.useState(0);

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ width: '90%', marginInline: 'auto' }}>
      <div className="min-h-[500px] mt-6 flex gap-10">
        <div className="min-h-[200px] flex-1 rounded-xl flex flex-col gap-5">
          <div className="min-h-[200px] bg-white rounded-xl p-5">
            <h5 className="font-bold text-xl mb-5">Profile</h5>
            <div className="flex flex-col items-center">
              <div className="w-[150px] h-[150px] rounded-full border bg-gray-300 mb-2"></div>
              <h5 className="font-semibold text-base mb-5">
                Dragnet Solutions
              </h5>
            </div>
          </div>
          <div className="min-h-[200px] bg-white rounded-xl p-5">
            <p className="font-bold text-xl mb-5">Reset Password</p>
            <form className="flex flex-col gap-5">
              <Input label="Former Password" />
              <Input label="New Password" />
              <Input label="Confirm Password" />
              <Button label="Reset" />
            </form>
          </div>
        </div>
        <div className="h-fit p-10 flex-[2] border bg-white rounded-xl flex flex-col items-center">
          <div className="w-[200px] h-[200px] rounded-full border bg-gray-300 mb-2"></div>
          <Button onClick={open} label="Upload Logo" />
        </div>
      </div>
    </Box>
  );
};

export default Profile;
