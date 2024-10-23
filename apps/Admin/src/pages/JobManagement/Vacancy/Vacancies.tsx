import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Typography, Container } from '@mui/material';
import { CloudUpload as CloudUploadIcon, UploadFile } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { Input, Button, RichTextEditor, FileUpload } from '@video-cv/ui-components';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const Vacancies = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyImages, setCompanyImages] = useState<string[]>([]);
  const [companyImageFiles, setCompanyImageFiles] = useState<File[]>([]);
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
      setCompanyImages(job.companyImages || []);
      setCompanyName(job.employerName);
      setCompanyLocation(job.location);
      setJobDetails(job.jobDetails);
      setQualifications(job.qualifications);
      setKeyResponsibilities(job.keyResponsibilities);
      setCompanyEmail(job.companyEmail);
      setApplyLink(job.jobUrl);
    }
  }, [job]);

  const handleImageUpload = async (file: File) => {
    if (!file) throw new Error('File is not defined.');

    try {
      const fileName = `${Date.now()}-${file.name}`;
      const bucketName = import.meta.env.VITE_CLOUDFLARE_R2_BUCKET;

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      });

      await s3Client.send(command);
      const uploadedUrl = `https://${import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_DOMAIN}/${fileName}`;
      return uploadedUrl;
    } catch (err) {
      toast.error(`Image upload failed: ${err}`);
      console.error('Upload failed:', err);
      throw err;
    }
  };

  const handleSubmit = async () => {
    try {
      const uploadedUrls = await Promise.all(
        companyImageFiles.map(file => handleImageUpload(file))
      );
      setCompanyImages(uploadedUrls);

      // Handle the submission of form data
      console.log({
        jobTitle,
        companyImages: uploadedUrls,
        companyName,
        companyLocation,
        jobDetails,
        qualifications,
        keyResponsibilities,
        companyEmail,
        applyLink,
      });

      toast.success('Job posted successfully!');
    } catch (error) {
      toast.error('Error posting job');
      console.error('Error posting job:', error);
    }
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
                  <div className="">
                    <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
                      Upload Company Image
                    </label>
                    <FileUpload
                      uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                      containerClass=""
                      uploadLabel="Drag and Drop or Browse"
                      setFile={(files: File | File[] | null) => {
                        if (files) {
                          if (Array.isArray(files)) {
                            handleImageUpload(files[0]);
                          } else {
                            handleImageUpload(files);
                          }
                        }
                      }}
                    />
                  </div>
                  {companyImages && <Typography>Image uploaded successfully</Typography>}
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
                  <Typography variant="subtitle2">Job Details</Typography>
                  <RichTextEditor value={jobDetails} onChange={setJobDetails} placeholder={'Enter job details'} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Key Responsibilities</Typography>
                  <RichTextEditor value={keyResponsibilities} onChange={setKeyResponsibilities} placeholder={'Enter responsibilities'} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Qualifications</Typography>
                  <RichTextEditor value={qualifications} onChange={setQualifications} placeholder={'Enter qualifications'} />
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