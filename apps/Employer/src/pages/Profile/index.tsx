import React, { useState } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useDropzone } from 'react-dropzone';

import {
  Input,
  Select,
  Button,
} from '@video-cv/ui-components';

const Profile = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessPhoneNumber: '',
    businessSector: '',
    businessEmail: '',
    businessWebsite: '',
    businessSocialMedia: '',
    contactPerson: '',
    contactPersonRole: '',
  });

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your API request logic here
    console.log('Form submitted', formData);
  };

  return (
    <Box sx={{ width: '90%', marginInline: 'auto' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input name='businessName' label="Business Name" placeholder="Business Name" onChange={handleInputChange} />
              <Input name='businessPhoneNumber' label="Phone Number" placeholder="Phone Number" onChange={handleInputChange} />
              <Select name="businessSector" label="Industry" options={[{ value: 'product', label: 'Product' }]} onChange={handleInputChange} />
              <Input name="businessEmail" label="Emmail" placeholder="Emmail" onChange={handleInputChange} />
              <Input name="businessWebsite" label="Website Url (Optional)" placeholder="Website Url (Optional)" onChange={handleInputChange} />
              <Input name="businessSocialMedia" label="Social Media Page Link" placeholder="Social Media Page Link" onChange={handleInputChange} />
              <Input name="businessAddress" label="Office Address" placeholder="Office Address" onChange={handleInputChange} />
              <Input name="contactPerson" label="Contact person name" placeholder="Contact person name" onChange={handleInputChange} />
              <Input name="contactPersonRole" label="Contact person position" placeholder="Contact person position" onChange={handleInputChange} />
            </div>
            <Button type='submit' variant="black" label="Submit" className='mt-5' />
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
