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
import { useAllMisc } from '../../../../../../libs/hooks/useAllMisc'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// const specialisations = [
//   'Software Development',
//   'Data Science',
//   'UI/UX Design',
//   'Project Management',
//   'Digital Marketing',
//   'Business Analysis',
//   'DevOps',
//   'Cybersecurity',
//   'Artificial Intelligence',
//   'Cloud Computing',
// ];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Expired', label: 'Expired' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Rejected', label: 'Rejected' },
];


const vacancySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Job title is required"),
  companyImage: z.string().optional(),
  companyThumbnail: z.string().optional(),
  companyName: z.string().min(1, "Company name is required"),
  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
  jobDetails: z.string().min(1, "Job details are required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  keyResponsibilities: z.string().min(1, "Key responsibilities are required"),
  companyEmail: z.string().email("Invalid email address"),
  linkToApply: z.string().url("Invalid URL"),
  specialisations: z.array(z.string().min(1, "At least one specialisation is required")),
  status: z.enum(['Active', 'Expired', 'Pending', 'Rejected']),
});

type VacancyFormData = z.infer<typeof vacancySchema>;


const Vacancies = () => {
  const { vacancyId } = useParams<{ vacancyId: any }>();
  const [companyImageFile, setCompanyImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [action, setAction] = useState<'create' | 'edit'>('create');

  const navigate = useNavigate();
  const location = useLocation();
  const job = location.state?.job;

  const { data: specialisations, isLoading: isLoadingSpecialisations, error: specialisationsError } = useAllMisc({
    resource: 'specialization',
    page: 1,
    limit: 100,
    download: false,
  });

  const { data: countries, isLoading: isLoadingCountries, error: countriesError } = useAllMisc({
    resource: 'country',
    page: 1,
    limit: 190,
    download: false,
  });

  const { data: states, isLoading: isLoadingStates, error: statesError } = useAllMisc({
    resource: 'state',
    page: 1,
    limit: 100,
    download: false,
  });

  const { register, handleSubmit, control, setValue, reset, watch, formState: { errors } } = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      status: 'Pending',
      specialisations: [],
    },
  });


  useEffect(() => {
    if (vacancyId) {
      fetchJobDetails(vacancyId)
    } else if (location.state?.job) {
      reset(location.state.job)
    }
  }, [vacancyId, location.state, reset]);

  const fetchJobDetails = async (vacancyId: any) => {
    setIsLoading(true);
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_BY_ID}/${vacancyId}`);
      if (!response.Success) {
        const jobData = await response.json()
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

  
  // useEffect(() => {
  //   if (job) {
  //     Object.entries(job).forEach(([key, value]) => {
  //       if (key in vacancySchema.shape) {
  //         const fieldKey = key as keyof VacancyFormData;
          
  //         switch (fieldKey) {
  //           case 'specialisations':
  //             if (Array.isArray(value)) {
  //               setValue(fieldKey, value);
  //             }
  //             break;
  //           case 'status':
  //             if (typeof value === 'string') {
  //               const statusValue = value as VacancyFormData['status'];
  //               if (['Active', 'Expired', 'Pending', 'Rejected'].includes(statusValue)) {---
  //                 setValue(fieldKey, statusValue);
  //               }
  //             }
  //             break;
  //           case 'id':
  //           case 'title':
  //           case 'companyImage':
  //           case 'companyThumbnail':
  //           case 'companyName':
  //           case 'location':
  //           case 'jobDetails':
  //           case 'qualifications':
  //           case 'keyResponsibilities':
  //           case 'companyEmail':
  //           case 'linkToApply':
  //             if (typeof value === 'string') {
  //               setValue(fieldKey, value);
  //             }
  //             break;
  //           default:
  //             console.warn(`Unexpected field: ${key}`);
  //         }
  //       }
  //     });
  //   }
  // }, [job, setValue]);


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

  const onSubmit = async (data: VacancyFormData) => {
    try {
      setIsLoading(true);

      let companyImageUrl = data.companyImage;

      if (companyImageFile) {
        companyImageUrl = await handleImageUpload(companyImageFile);
      }

      const jobData = {
        ...data,
        companyLogoUrl: companyImageUrl,
        action: action,
      };

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.OPEN_VACANCY}`, jobData);

      if (resp.Success) {
        toast.success(action === 'edit' ? 'Job updated successfully' : 'Job posted successfully!');
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                <Input
                    className='rounded-xl'
                    label="Job Title"
                    {...register('title')}
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
                  {watch('companyImage') && (
                    <Typography variant="body2">Current image: {watch('companyImage')}</Typography>
                  )}
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
                    name='countryId'
                    control={control}
                    render={({ field }) => (
                      <Select 
                        label='Country' 
                        value={watch('countryId')} 
                        options={countries.map(country => ({ value: country.id, label: country.name }))}
                        onChange={(value) => {
                          field.onChange(value);
                          setSelectedCountryId(value);
                          setValue('countryId', '');
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='stateId'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Select 
                        label='State' 
                        value={watch('stateId')} 
                        options={states.map(state => ({ value: state.id, label: state.name }))}
                        onChange={(value) => {
                          onChange('stateId', value);
                        }}
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
                  <SelectChip 
                    label='Specialisation'
                    id='specialization-select'
                    options={specialisations.map(spec => spec.name )}
                    value={watch('specialisations')}
                    onChange={(value) => setValue('specialisations', value)} />
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