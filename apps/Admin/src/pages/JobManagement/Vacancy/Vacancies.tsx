import React, { useEffect, useState } from 'react';
import { Grid, Typography, Container } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { Input, Button } from '@video-cv/ui-components';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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

  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state?.job;

  useEffect(() => {
    if (job) {
      setJobTitle(job.title);
      setCompanyImage(job.companyImage);
      setCompanyName(job.employerName);
      setCompanyLocation(job.location);
      setJobDetails(job.jobDetails);
      setQualifications(job.qualifications);
      setKeyResponsibilities(job.keyResponsibilities);
      setCompanyEmail(job.companyEmail);
      setApplyLink(job.jobUrl);
    }
  }, [job]);

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
    <div className='p-6 bg-gray-50 mb-8'>
        <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/job-management')} />

        <Container className='py-3'>
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
                <Button type='submit' variant="black" label='Submit' color="primary" onClick={handleSubmit}></Button>
                </Grid>
            </Grid>
        </Container>
    </div>
  );
};

export default Vacancies;
