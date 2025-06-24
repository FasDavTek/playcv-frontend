import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Typography, Container } from '@mui/material';
import { CloudUpload as CloudUploadIcon, UploadFile } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button, RichTextEditor, FileUpload, TextArea, Select, DatePicker } from '@video-cv/ui-components';
import { toast } from 'react-toastify';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import dayjs from 'dayjs';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { Controller, useForm } from 'react-hook-form';
import { SESSION_STORAGE_KEYS } from './../../../../../../libs/utils/sessionStorage';
import model from './../../../../../../libs/utils/helpers/model';
import { useAllMisc } from './../../../../../../libs/hooks/useAllMisc';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
      secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});

interface IForm {
    firstName: string
    middleName: string
    lastName: string
    userTypeId: number
    phoneNumber: string
    dateOfBirth: string;
    email: string
    password: string
    businessName: string
    isTracked: boolean
    isBusinessUser: boolean
    isProfessional: boolean
    businessId: number
    coverURL?: string
    employerInfo?: {
      userId: string
      businessName: string
      industry: string
      address: string
      websiteUrl: string
      contactPhone: string
      businessEmail: string
      contactName: string
      contactPosition: string
      fbLink: string
      twitter: string
      instagramUrl: string
      industryId: number | null
      isActive: boolean
      id: number;
      businessTypeId: number;
    }
    professionalInfo?: {
      id: number
      nyscStateCode: string
      nyscStartYear: number
      nyscEndYear: number
      course: string
      degree: string
      institution: string
      classOfDegree: string
      coverLetter: string
      dateCreated: string
      degreeTypeId: number | null
      degreeClassId: number | null
      institutionId: number | null
      courseId: number | null
      businessName: string
      industry: string
      address: string
      businessPhone: string
      industryId: number | null
      businessProfile: string
    }
};

const userTypeOptions = [
    { value: 1, label: 'Sub Admin' },
    { value: 2, label: 'Employer' },
    { value: 3, label: 'Professional' },
];

const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
    { value: 'manager', label: 'Manager' },
];

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
];

const CreateUser = () => {
  const { userType } = useParams<{userType: string;}>();
  const [loading, setLoading] = useState(false);
  const [ImageFile, setImageFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

const { register, handleSubmit, control, setValue, reset, watch, formState: { errors } } = useForm<IForm>({
    defaultValues: {
        isBusinessUser: userType === 'employers',
        isProfessional: userType === 'professionals',
        userTypeId: userType === 'subAdmins' ? 1 : userType === 'employers' ? 2 : 3,
    },
});

const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

const { data: courses, isLoading: isLoadingCourses } = useAllMisc({
    resource: 'course',
    page: 1,
    limit: 100,
    download: true,
    structureType: 'full'
});


const { data: degreeClasses, isLoading: isLoadingDegreeClasses } = useAllMisc({
    resource: 'degree-class',
    page: 1,
    limit: 100,
    download: true,
    structureType: 'full'
});

const { data: institutions, isLoading: isLoadingInstitutions } = useAllMisc({
    resource: 'institution',
    page: 1,
    limit: 100,
    download: true,
    structureType: 'full'
});

const { data: industry, isLoading: isLoadingIndustries } = useAllMisc({
    resource: 'industries',
    page: 1,
    limit: 100,
    download: true,
    structureType: 'full'
});

const handleImageUpload = async (file: File) => {
    // if (!file) throw new Error('File is not defined.');

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

const onSubmit = async (data: IForm) => {
    setLoading(true);
    try {
        const userTypeId = userType === 'subAdmins' ? 1 : userType === 'professionals' ? 3 : 2;
        
        let ImageUrl = data.coverURL ? await handleImageUpload(new File([data.coverURL], 'profile.jpg')) : undefined;

        if (ImageFile) {
            ImageUrl = await handleImageUpload(ImageFile);
        }

        const userData = Object.entries({
            ...data,
            // coverURL: ImageUrl || data.coverURL,
            action: 'create',
            industryId: data.employerInfo?.industryId,
            industry: data.employerInfo?.industry,
            isProfessional: userType === 'professionals',
            isBusinessUser: userType === 'employers',
            isAdmin: userType === 'subAdmins',
            userTypeId,
            employerInfo: null,
        }).reduce((acc: { [key: string]: any }, [Key, value]) => {
            if (value) {
                acc[Key] = value;
            }
            return acc;
            }, {});

        const endpoint = userType === 'subAdmins' ? apiEndpoints.CREATE_SUB_ADMIN : apiEndpoints.CREATE_PROF_EMP_USER;
        const resp = await postData(`${CONFIG.BASE_URL}${endpoint}`, userData, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (resp.code === "201") {
            toast.success('User created successfully');
            reset();
            navigate('/admin/user-management');
        }
    }
    catch (err: any) {
        toast.error(err?.response?.data?.error?.message);
    }
    finally {
        setLoading(false);
    }
}


const renderProfessionalFields = () => (
  <>
    <Grid item xs={12}>
        <Input
            label="NYSC State Code"
            {...register('professionalInfo.nyscStateCode')}
        />
    </Grid>
    <Grid item xs={12}>
        <Controller
            control={control}
            name="professionalInfo.nyscStartYear"
            render={({ field }) => (
                <DatePicker
                    {...field}
                    label="NYSC Service year (start)"
                    value={field.value ? dayjs().year(field.value) : null}
                    onChange={(date) => {field.onChange(date ? date.year() : null);}}
                    views={['year']}
                />
            )}
        />
    </Grid>
    <Grid item xs={12}>
        <Controller
            name="professionalInfo.nyscEndYear"
            control={control}
            render={({ field }) => (
                <DatePicker
                    {...field}
                    label="NYSC Service year (end)"
                    value={field.value ? dayjs().year(field.value) : null}
                    onChange={(date) => {field.onChange(date ? date.year() : null);}}
                    views={['year']}
                />
            )}
        />
    </Grid>
    <Grid item xs={12}>
        <Controller
            name='professionalInfo.course'
            control={control}
            render={({ field }) => (
                <Select
                    name="Course of Study"
                    control={control}
                    placeholder='Course of sudy'
                    defaultValue={Array.isArray(courses) && courses?.find(c => c.courseName === watch('professionalInfo.course'))}
                    options={model(courses, "courseName", "id")}
                    handleChange={(newValue) => { 
                    if (newValue.__isNew__) {
                    field.onChange(newValue?.value || newValue?.label);
                    setValue('professionalInfo.course', newValue?.label || '');
                    setValue('professionalInfo.courseId', null);
                    } else {
                    field.onChange(newValue?.value || newValue?.label);
                    setValue('professionalInfo.course', newValue?.label);
                    setValue('professionalInfo.courseId', newValue?.value);
                    } }}
                    isDisabled={isLoadingCourses}
                    errors={errors}
                    allowCreate={true}
                    label='Course of Study'
                />
            )}
        />
    </Grid>
    <Grid item xs={12}>
        <Controller
            name='professionalInfo.classOfDegree'
            control={control}
            render={({ field }) => (
                <Select
                    name="Class of Degree"
                    control={control}
                    placeholder="Class of degree"
                    defaultValue={Array.isArray(degreeClasses) &&  degreeClasses?.find(dc => dc.name === watch('professionalInfo.classOfDegree'))}
                    options={model(degreeClasses, "name", "id")}
                    handleChange={(newValue) => { 
                    if (newValue.__isNew__) {
                    field.onChange(newValue?.value || newValue?.label);
                    setValue('professionalInfo.classOfDegree', newValue?.label || '');
                    setValue('professionalInfo.degreeClassId', null);
                    } else {
                    field.onChange(newValue?.value || newValue?.label);
                    setValue('professionalInfo.classOfDegree', newValue?.label);
                    setValue('professionalInfo.degreeClassId', newValue?.value);
                    } }}
                    isDisabled={isLoadingDegreeClasses}
                    errors={errors}
                    allowCreate={true}
                    label='Class of Degree'
                />
            )}
        />
    </Grid>
    <Grid item xs={12}>
        <Controller
            name='professionalInfo.institution'
            control={control}
            render={({ field }) => (
                <Select
                    name="Institution Attended"
                    control={control}
                    placeholder="Institution attended"
                    defaultValue={Array.isArray(institutions) &&  institutions?.find(i => i.institutionName === watch('professionalInfo.institution'))}
                    options={model(institutions, "institutionName", "id")}
                    handleChange={(newValue) => { 
                    if (newValue.__isNew__) {
                    field.onChange(newValue?.value || newValue?.label);
                    setValue('professionalInfo.institution', newValue?.label || '');
                    setValue('professionalInfo.institutionId', null);
                    } else {
                    field.onChange(newValue?.value || newValue?.label);
                    setValue('professionalInfo.institution', newValue?.label);
                    setValue('professionalInfo.institutionId', newValue?.value);
                    } }}
                    isDisabled={isLoadingInstitutions}
                    errors={errors}
                    allowCreate={true}
                    label='Institution Attended'
                />
            )}
        />
    </Grid>
    <Grid item xs={12}>
        <Input
            label="Business Name (Professional)"
            {...register('professionalInfo.businessName')}
        />
    </Grid>
    <Grid item xs={12}>
        <label>Cover Letter</label>
        <Controller
            name="professionalInfo.coverLetter"
            control={control}
            defaultValue={watch('professionalInfo.coverLetter')}
            render={({ field }) => (
                <RichTextEditor
                    value={watch('professionalInfo.coverLetter')}
                    onChange={(value) => setValue('professionalInfo.coverLetter', value)}
                    placeholder='Write cover letter'
                    maxChars={1200}
                />
            )}
        />
    </Grid>
  </>
);

// Render business fields conditionally
const renderEmployerFields = () => (
  <>
    <Grid item xs={12}>
        <Input
            label="Business Name"
            {...register('employerInfo.businessName')}
        />
    </Grid>
    <Grid item xs={12}>
        <Controller
            name='employerInfo.industry'
            control={control}
            render={({ field }) => (
                <Select
                    name="Business Sector"
                    control={control}
                    defaultValue={Array.isArray(industry) && industry?.find(i => i.name === watch('employerInfo.industry'))}
                    options={model(industry, 'name', 'id')}
                    handleChange={(newValue) => { 
                    if (newValue.__isNew__) {
                    field.onChange(newValue?.value || newValue?.label);
                    setValue('employerInfo.industry', newValue?.label || '');
                    setValue('employerInfo.industryId', null);
                    } else {
                    field.onChange(newValue?.value || newValue?.label);
                    setValue('employerInfo.industry', newValue?.label);
                    setValue('employerInfo.industryId', newValue?.value);
                    } }}
                    isDisabled={isLoadingIndustries}
                    errors={errors}
                    allowCreate={true}
                    label='Business Sector'
                />
            )}
        />
    </Grid>
    <Grid item xs={12}>
        <Input
            label="Address"
            {...register('employerInfo.address')}
        />
    </Grid>
    <Grid item xs={12}>
        <Input
            label="Website URL"
            {...register('employerInfo.websiteUrl')}
        />
    </Grid>
    <Grid item xs={12}>
        <Input
            label="Contact Phone"
            {...register('employerInfo.contactPhone')}
        />
    </Grid>
    <Grid item xs={12}>
        <Input
            label="Business Email"
            {...register('employerInfo.businessEmail')}
        />
    </Grid>
  </>
);
  return (
    <div className='p-6 bg-gray-50 mb-8'>
        <ChevronLeftIcon className="cursor-pointer text-7xl mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" onClick={() => navigate('/admin/user-management')}/>
            
        <Container className='py-3'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Input
                            label="First Name"
                            {...register('firstName', { required: 'First Name is required' })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label="Middle Name"
                            {...register('middleName', { required: 'Middle Name is required' })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label="Last Name"
                            {...register('lastName', { required: 'Last Name is required' })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label="Email"
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label="Phone Number"
                            {...register('phoneNumber')}
                        />
                    </Grid>

                    {userType === 'professionals' && (
                        <>
                            {renderProfessionalFields()}
                        </>
                    )}

                    {userType === 'employers' && (
                        <>
                            {renderEmployerFields()}
                        </>
                    )}

                    <Grid item xs={12}>
                        <label>Profile Picture</label>
                        <Controller
                            name="coverURL"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <FileUpload
                                    uploadIcon={<CloudUploadIcon />}
                                    uploadLabel="Upload Profile Picture"
                                    setFile={(files) => {
                                        const fileArray = Array.isArray(files) ? files : files ? [files] : [];
                                        onChange(fileArray);
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Input
                            label="Password"
                            type='password'
                            {...register('password')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="black"
                            label={loading ? 'Creating...' : 'Create User'}
                            disabled={loading}
                        />
                    </Grid>
                </Grid>
            </form>
        </Container>
    </div>
  )
}

export default CreateUser