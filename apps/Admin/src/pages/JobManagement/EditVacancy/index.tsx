import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Typography, Container } from '@mui/material';
import { CloudUpload as CloudUploadIcon, UploadFile } from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { Input, Button, RichTextEditor, FileUpload, SelectChip, Select, DatePicker } from '@video-cv/ui-components';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { Controller, FieldError, useForm } from 'react-hook-form';
import { useAllCountry } from './../../../../../../libs/hooks/useAllCountries';
import { useAllState } from './../../../../../../libs/hooks/useAllState';
import model from './../../../../../../libs/utils/helpers/model';
import { SESSION_STORAGE_KEYS } from './../../../../../../libs/utils/sessionStorage';

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

const isDayjs = (value: any): value is dayjs.Dayjs => {
  return dayjs.isDayjs(value);
};

const vacancySchema = z.object({
  vId: z.string().optional(),
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
  startDate: z.custom(isDayjs, { message: "Invalid date", }),
  endDate: z.custom(isDayjs, { message: "Invalid date", }),
});


interface Vacancy {
  vId: number;
  jobTitle: string;
  companyName: string;
  companyLogoUrl: string;
  jobDetails: string;
  specialization: string;
  location: string;
  keyResponsibilities: string;
  qualifications: string;
  companyEmail: string;
  linkToApply: string;
  status: string;
  dateCreated: string;
  dateUpdated: string | null;
  startDate: string;
  endDate: string;
}


type VacancyFormData = z.infer<typeof vacancySchema>;


const Vacancies = () => {
  const { vId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [job, setJob] = useState<Vacancy>();
  const [companyImageFile, setCompanyImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  

  const { data: countryData, isLoading: isCountryLoading, error: countryError } = useAllCountry();
  const { data: stateData, isLoading: isStateLoading, error: stateError } = useAllState();

  const { register, handleSubmit, control, setValue, reset, watch, formState: { errors }, getValues } = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
  });

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);


  useEffect(() => {
      fetchJobDetails()
  }, []);


  const fetchJobDetails = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_BY_ID}?VacancyId=${vId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      
        const jobData = await response;
        setJob(jobData);
        Object.keys(jobData).forEach((key) => {
            setValue(key as keyof VacancyFormData, jobData[key]);
        })
        // reset(jobData)
    } 
    catch (err) {
      setError('Error fetching job details');
    } 
    finally {
      setIsLoading(false);
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
        vacancyId: vId,
        companyLogoUrl,
        action: 'edit',
      };

      const resp = await postData(`${CONFIG.BASE_URL}${apiEndpoints.OPEN_VACANCY}`, jobData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.code === "00") {
        toast.success('Job updated successfully');
        navigate('/admin/job-management');
      }
      else {
        throw new Error('Unable to update job');
      }
    } catch (error) {
      toast.error(job ? 'Error updating job' : 'Error posting job');
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
                  <Controller
                      name="countryId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...register('countryId')}
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
                  <Input
                      className='rounded-xl'
                      label="Company Name"
                      {...register('companyName')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Job Details</Typography>
                  <RichTextEditor value={watch('jobDetails')} onChange={(value) => setValue('jobDetails', value)} placeholder={'Enter job details'} maxChars={1500} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Key Responsibilities</Typography>
                  <RichTextEditor value={watch('keyResponsibilities')} onChange={(value) => setValue('keyResponsibilities', value)} placeholder={'Enter responsibilities'} maxChars={1500} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Qualifications</Typography>
                  <RichTextEditor value={watch('qualifications')} onChange={(value) => setValue('qualifications', value)} placeholder={'Enter qualifications'} maxChars={1500} />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Specialisation</Typography>
                  <RichTextEditor value={watch('specialisations')} onChange={(value) => setValue('specialisations', value)} placeholder={'Enter specialisations'} maxChars={1500} />
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
                  <Controller name='startDate' control={control} render={({ field: { onChange, value } }) => (
                    <DatePicker label="Start Date" value={value ? dayjs(value) : null} onChange={(newValue) => onChange(dayjs(newValue))} error={errors.startDate as FieldError | undefined} />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Controller name='endDate' control={control} render={({ field: { onChange, value } }) => (
                    <DatePicker label="End Date" value={value ? dayjs(value) : null} onChange={(newValue) => onChange(dayjs(newValue))} error={errors.endDate as FieldError | undefined} />
                  )} />
                </Grid>
                <Grid item xs={12}>
                  <Button type='submit' variant="black" label={'Update'} color="primary" disabled={isLoading}></Button>
                </Grid>
            </Grid>
          </form>
        </Container>
    </div>
  );
};

export default Vacancies;