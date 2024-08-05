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
import { Snackbar, Alert, SnackbarOrigin, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SaveAsOutlinedIcon from '@mui/icons-material/SaveAsOutlined';

interface State extends SnackbarOrigin {
  open: boolean;
}

const Profile = () => {
  const [editField, setEditField] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
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

  // const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
  //   // Disable click and keydown behavior
  //   noClick: true,
  //   noKeyboard: true,
  // });

  const [state, setState] = React.useState<State>({
    open: true,
    vertical: 'top',
    horizontal: 'center',
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

  const handleSnackbarClick = () => {
    setOpen(true);
  };

  const handleAlertClose = () => {
    setOpen(false);
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
                  <IconButton onClick={() => handleEditClick('businessPhoneNumber')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
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
                  <IconButton onClick={() => handleEditClick('businessSector')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
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
                  <IconButton onClick={() => handleEditClick('businessWebsite')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
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
                  <IconButton onClick={() => handleEditClick('businessSocialMedia')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
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
                  <IconButton onClick={() => handleEditClick('businessAddress')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
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
                  <IconButton onClick={() => handleEditClick('contactPerson')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
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
                  <IconButton onClick={() => handleEditClick('contactPersonRole')} sx={{ position: 'absolute', top: 15, p: 0, right: 9 }}>
                    <SaveAsOutlinedIcon />
                  </IconButton>
                </Box>
              )}
            </div>
            <Button type='submit' variant="black" label="Submit" className='mt-5' />

            <Snackbar open={state.open} onClose={() => setState({ ...state, open: false })} anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }} action={<IconButton color='info' onClick={handleSnackbarClick}><InfoIcon /></IconButton>} message="Click the icon for more details" >
              <Alert onClick={handleSnackbarClick} variant="filled" severity="info" sx={{ width: '100%', cursor: 'pointer' }} >
                Please click on each field to edit it. Note that some fields are not editable.
              </Alert>
            </Snackbar>
        </form>
      </Box>
    </Box>
  );
};

export default Profile;
