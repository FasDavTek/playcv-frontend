import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Typography, Container } from '@mui/material';
import { CloudUpload as CloudUploadIcon, UploadFile } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, RichTextEditor, FileUpload, SelectChip, Select } from '@video-cv/ui-components';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { Controller, useForm } from 'react-hook-form';
import { useAllCountry } from './../../../../../../libs/hooks/useAllCountries';
import { useAllState } from './../../../../../../libs/hooks/useAllState';
import model from './../../../../../../libs/utils/helpers/model';
import { LOCAL_STORAGE_KEYS } from './../../../../../../libs/utils/localStorage';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const statusOptions = [
  { value: 'true', label: 'Activate' },
  { value: 'false', label: 'Suspend' },
];


const vacancySchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1, "Job title is required"),
  companyLogoUrl: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  countryName: z.string().min(1, "Country is required"),
  countryId: z.string(),
  state: z.string().min(1, "State is required"),
  stateId: z.string(),
  jobDetails: z.string().min(1, "Job details are required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  keyResponsibilities: z.string().min(1, "Key responsibilities are required"),
  companyEmail: z.string().email("Invalid email address"),
  linkToApply: z.string().url("Invalid URL"),
  specialisations: z.string().min(1, "At least one specialisation is required"),
  status: z.enum(['Active', 'Expired', 'Pending', 'Rejected']),
});

type VacancyFormData = z.infer<typeof vacancySchema>;


const Vacancies = (selectedItem: any) => {
  const { vacancyId } = useParams<{ vacancyId: any }>();
  const [companyImageFile, setCompanyImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [action, setAction] = useState<'create' | 'edit'>('create');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state?.job;

  const { data: countryData, isLoading: isCountryLoading, error: countryError } = useAllCountry();
  const { data: stateData, isLoading: isStateLoading, error: stateError } = useAllState();

  const { register, handleSubmit, control, setValue, reset, watch, formState: { errors }, getValues } = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
  });

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  useEffect(() => {
    if (selectedItem && vacancyId) {
      fetchJobDetails(vacancyId)
    } else if (job) {
      reset(job)
    }
  }, [selectedItem, vacancyId, job, reset]);

  const fetchJobDetails = async (vacancyId: any) => {
    setIsLoading(true);
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_BY_ID}/${vacancyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const jobData = await response.data;
        reset(jobData)
        setAction('edit')
      }
      else {
        throw new Error('Unable to fetch job details');
      }
    } 
    catch (err) {
      console.error('Error fetching job details:', err);
      setError('Error fetching job details');
    } 
    finally {
      setIsLoading(false);
    }
  };


  const fetchJobs = async () => {
    try {

      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.data;
      setJobs(data);
      console.log(jobs)
      setLoading(false);
    }
    catch (err) {
      if(!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/');
      }
      else {
        toast.error('Failed to fetch jobs');
      }
    }
    finally {
      setLoading(false);
    }
  };


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
    } 
    catch (err) {
      toast.error(`Image upload failed: ${err}`);
      console.error('Upload failed:', err);
      throw err;
    }
  };

  const onSubmitHandler = async (data: VacancyFormData) => {
    try {
      setIsLoading(true);

      let companyLogoUrl = data.companyLogoUrl;

      if (companyImageFile) {
        companyLogoUrl = await handleImageUpload(companyImageFile);
      }

      const jobData = {
        ...data,
        companyLogoUrl,
        action: action,
      };

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.OPEN_VACANCY}`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.code === "00") {
        toast.success(action === 'edit' ? 'Job updated successfully' : 'Job posted successfully!');
        await fetchJobs();
        navigate('/admin/job-management');
      }
      else {
        throw new Error(action === 'edit' ? 'Unable to update job' : 'Unable to post job');
      }
    } catch (error) {
      toast.error(job ? 'Error updating job' : 'Error posting job');
      console.error('Error posting job:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-6 bg-gray-50 mb-8'>
        <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/job-management')} />

        <Container className='py-3'>
          <form onSubmit={(e) => { e.preventDefault(); const data = getValues(); onSubmitHandler(data) }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <Input
                    className='rounded-xl'
                    label="Job Title"
                    {...register('jobTitle')}
                />
                </Grid>
                <Grid item xs={12}>
                  <div className="">
                    <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
                      Upload Company Image
                    </label>
                    <Controller
                      name='companyLogoUrl'
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <FileUpload
                          uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                          containerClass=""
                          uploadLabel="Drag and Drop or Browse"
                          setFile={(files) => {
                            const file = Array.isArray(files) ? files[0] : files;
                            setCompanyImageFile(file);
                            console.log('Selected files:', file);
                            onChange(file ? URL.createObjectURL(file) : '');
                          }}
                        />
                      )}
                    />
                  </div>
                  {/* {watch('companyLogoUrl') && (
                    <Typography variant="body2">Current logo: {watch('companyLogoUrl')}</Typography>
                  )} */}
                </Grid>
                <Grid item xs={12}>
                  <Input
                      className='rounded-xl'
                      label="Company Name"
                      {...register('companyName')}
                  />
                </Grid>
                <Grid item xs={12}>
                <Controller
                    {...register('countryId')}
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="Country"
                        control={control}
                        defaultValue={Array.isArray(countryData) ? countryData?.find(i => i.id === watch('countryId')) : null}
                        options={model(countryData, 'name', 'id')}
                        handleChange={(newValue) => field.onChange(newValue?.value)}
                        isDisabled={isCountryLoading}
                        errors={errors}
                        label={'Select Country'}
                      />
                    )}
                />
                </Grid>
                <Grid item xs={12}>
                <Controller
                    {...register('stateId')}
                    control={control}
                    render={({ field }) => (
                      <Select
                        name="State"
                        control={control}
                        defaultValue={Array.isArray(stateData) ? stateData?.find(i => i.id === watch('stateId')) : null}
                        options={model(stateData, 'name', 'id')}
                        handleChange={(newValue) => field.onChange(newValue?.value)}
                        isDisabled={isStateLoading}
                        errors={errors}
                        label={'Select State'}
                      />
                    )}
                />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Job Details</Typography>
                  <RichTextEditor value={watch('jobDetails')} onChange={(value) => setValue('jobDetails', value)} placeholder={'Enter job details'} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Key Responsibilities</Typography>
                  <RichTextEditor value={watch('keyResponsibilities')} onChange={(value) => setValue('keyResponsibilities', value)} placeholder={'Enter responsibilities'} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Qualifications</Typography>
                  <RichTextEditor value={watch('qualifications')} onChange={(value) => setValue('qualifications', value)} placeholder={'Enter qualifications'} />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Specialisation</Typography>
                  <RichTextEditor value={watch('specialisations')} onChange={(value) => setValue('specialisations', value)} placeholder={'Enter specialisations'} />
                </Grid>
                <Grid item xs={12}>
                  <Input
                      className='rounded-xl'
                      label="Company Email"
                      {...register('companyEmail')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                      className='rounded-xl'
                      label="Link to Apply"
                      {...register('linkToApply')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type='submit' variant="black" label={action === 'edit' ? 'Update' : 'Submit'} color="primary" disabled={isLoading}></Button>
                </Grid>
            </Grid>
          </form>
        </Container>
    </div>
  );
};

export default Vacancies;