import React, { useState } from 'react';
import { Grid, Typography, Container } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { Input, Button } from '@video-cv/ui-components';
import { toast } from 'react-toastify';

const Vacancies = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyImage, setCompanyImage] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [jobDetails, setJobDetails] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [keyResponsibilities, setKeyResponsibilities] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [applyLink, setApplyLink] = useState('');

  const handleImageUpload = (event: any) => {
    setCompanyImage(event.target.files[0]);
  };

  const handleSubmit = () => {
    // Handle the submission of form data
    console.log({
      jobTitle,
      companyImage,
      companyName,
      companyLocation,
      jobDetails,
      qualifications,
      keyResponsibilities,
      companyEmail,
      applyLink,
    });

    toast.success('Job posted successfully!');
  };

  return (
    <Container maxWidth="md" className='py-3'>
      <Typography variant="h4" gutterBottom>
        Content Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Input
            className='rounded-xl'
            label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="black"
            label='Upload Company Image'
            icon={<CloudUploadIcon />}
          >
            Upload Company Image
            <input
              type="file"
              hidden
              onChange={handleImageUpload}
            />
          </Button>
          {companyImage && <Typography></Typography>}
        </Grid>
        <Grid item xs={12}>
          <Input
            className='rounded-xl'
            label="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            className='rounded-xl'
            label="Company Location"
            value={companyLocation}
            onChange={(e) => setCompanyLocation(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Job Details</Typography>
          <ReactQuill className='custom-quill' value={jobDetails} onChange={setJobDetails} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Qualifications</Typography>
          <ReactQuill className='custom-quill' value={qualifications} onChange={setQualifications} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Key Responsibilities</Typography>
          <ReactQuill className='custom-quill' value={keyResponsibilities} onChange={setKeyResponsibilities} />
        </Grid>
        <Grid item xs={12}>
          <Input
            className='rounded-xl'
            label="Company Email"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            className='rounded-xl'
            label="Link to Apply"
            value={applyLink}
            onChange={(e) => setApplyLink(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="black" label='Submit' color="primary" onClick={handleSubmit}></Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Vacancies;
