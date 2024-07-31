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
  const [editField, setEditField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    businessName: 'Doe Enterprises',
    businessPhoneNumber: '+234987654321',
    businessSector: 'product',
    businessEmail: 'business@example.com',
    businessWebsite: 'https://example.com',
    businessSocialMedia: '@doeenterprises',
    businessAddress: '123 Business St.',
    contactPerson: 'John Doe',
    contactPersonRole: 'Manager',
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

  const handleEditClick = (fieldName: string) => {
    setEditField(fieldName);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditField(null);
    console.log('Form submitted', formData);
  };

  return (
    <Box sx={{ width: '90%', marginInline: 'auto' }}>
      <Box >
        <form onSubmit={(e) => handleSubmit(e)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-8">
              <Box className="input-box">
                <label>Business Name</label>
                <Typography className="input-like">{formData.businessName}</Typography>
              </Box>
              {editField === 'businessPhoneNumber' ? (
                <Input
                  name='businessPhoneNumber'
                  label="Phone Number"
                  value={formData.businessPhoneNumber}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box">
                  <label>Phone Number</label>
                  <Typography className="input-like" onClick={() => handleEditClick('businessPhoneNumber')}>{formData.businessPhoneNumber}</Typography>
                </Box>
              )}
              {editField === 'businessSector' ? (
                <Select
                  name="businessSector"
                  label="Industry"
                  value={formData.businessSector}
                  options={[{ value: 'product', label: 'Product' }]}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box">
                  <label>Industry</label>
                  <Typography className="input-like" onClick={() => handleEditClick('businessSector')}>{formData.businessSector}</Typography>
                </Box>
              )}
              <Box className="input-box">
                <label>Email</label>
                <Typography className='input-like'>{formData.businessEmail}</Typography>
              </Box>
              {editField === 'businessWebsite' ? (
                <Input
                  name="businessWebsite"
                  label="Website Url (Optional)"
                  value={formData.businessWebsite}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box">
                  <label>Website URL (Optional)</label>
                  <Typography className="input-like" onClick={() => handleEditClick('businessWebsite')}>{formData.businessWebsite}</Typography>
                </Box>
              )}
              {editField === 'businessSocialMedia' ? (
                <Input
                  name="businessSocialMedia"
                  label="Social Media Page Link"
                  value={formData.businessSocialMedia}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box">
                  <label>Social Media Page Link</label>
                  <Typography className="input-like" onClick={() => handleEditClick('businessSocialMedia')}>{formData.businessSocialMedia}</Typography>
                </Box>
              )}
              {editField === 'businessAddress' ? (
                <Input
                  name="businessAddress"
                  label="Office Address"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box">
                  <label>Office Address</label>
                  <Typography className="input-like" onClick={() => handleEditClick('businessAddress')}>{formData.businessAddress}</Typography>
                </Box>
              )}
              {editField === 'contactPerson' ? (
                <Input
                  name="contactPerson"
                  label="Contact Person Name"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box">
                  <label>Contact Person Name</label>
                  <Typography className="input-like" onClick={() => handleEditClick('contactPerson')}>{formData.contactPerson}</Typography>
                </Box>
              )}
              {editField === 'contactPersonRole' ? (
                <Input
                  name="contactPersonRole"
                  label="Contact Person Position"
                  value={formData.contactPersonRole}
                  onChange={handleInputChange}
                />
              ) : (
                <Box className="input-box">
                  <label>Contact Person Position</label>
                  <Typography className="input-like" onClick={() => handleEditClick('contactPersonRole')}>{formData.contactPersonRole}</Typography>
                </Box>
              )}
            </div>
            <Button type='submit' variant="black" label="Submit" className='mt-5' />
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
