import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Typography, Container } from '@mui/material';
import { CloudUpload as CloudUploadIcon, UploadFile } from '@mui/icons-material';
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
import { LOCAL_STORAGE_KEYS } from './../../../../../../libs/utils/localStorage';
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
        industryId: number
        isActive: boolean
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

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

    const { data: industry, isLoading: isLoadingIndustries } = useAllMisc({
        resource: 'industries',
        page: 1,
        limit: 100,
        download: false,
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
            console.error('Upload failed:', err);
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
        catch (err) {
            console.error('Error creating user:', err);
            toast.error('Failed to create user');
        }
        finally {
            setLoading(false);
        }
    }
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
                    {watch("userTypeId") === 2 && (
                        <>
                            <Grid item xs={12}>
                            <Controller
                                name='employerInfo.industry'
                                control={control}
                                rules={{ required: 'Business Sector is required' }}
                                render={({ field }) => (
                                    <div>
                                    <Select
                                        name="Business Sector"
                                        control={control}
                                        defaultValue={Array.isArray(industry) && industry?.find(i => i.name === watch('employerInfo.industry'))}
                                        options={model(industry, 'name', 'id')}
                                        handleChange={(newValue) => {
                                        if (newValue.__isNew__) {
                                            field.onChange(newValue?.value || newValue?.label);
                                            setValue('employerInfo.industry', newValue?.label || '');
                                            setValue('employerInfo.industryId', newValue?.value);
                                        } else {
                                            field.onChange(newValue?.value || newValue?.label);
                                            setValue('employerInfo.industry', newValue?.label);
                                            setValue('employerInfo.industryId', newValue?.value);
                                        }}}
                                        isDisabled={isLoadingIndustries}
                                        errors={errors}
                                        placeholder='Business Sector'
                                        label={<span>Business Sector <span className="text-red-500">*</span></span>}
                                        allowCreate={true}
                                    />
                                    {errors?.employerInfo?.industry && (
                                        <p className="text-red-500 text-sm mt-1">{errors.employerInfo.industry.message}</p>
                                    )}
                                    </div>
                                )}
                            />
                            </Grid>
                            <Grid item xs={12}>
                                <Input label="Address" {...register("employerInfo.address")} />
                            </Grid>
                            <Grid item xs={12}>
                                <Input label="Website URL" {...register("employerInfo.websiteUrl")} />
                            </Grid>
                            <Grid item xs={12}>
                                <Input label="Contact Phone" {...register("employerInfo.contactPhone")} />
                            </Grid>
                            <Grid item xs={12}>
                                <Input label="Business Email" {...register("employerInfo.businessEmail")} />
                            </Grid>
                            <Grid item xs={12}>
                                <Input label="Contact Name" {...register("employerInfo.contactName")} />
                            </Grid>
                            <Grid item xs={12}>
                                <Input label="Contact Position" {...register("employerInfo.contactPosition")} />
                            </Grid>
                            <Grid item xs={12}>
                                <Input label="Facebook Link" {...register("employerInfo.fbLink")} />
                            </Grid>
                            <Grid item xs={12}>
                                <Input label="Twitter" {...register("employerInfo.twitter")} />
                            </Grid>
                            <Grid item xs={12}>
                                <Input label="Instagram URL" {...register("employerInfo.instagramUrl")} />
                            </Grid>
                        </>
                    )}
                    <Grid item xs={12}>
                        <Input
                            label="Business Name"
                            {...register('businessName')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="coverURL"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <FileUpload
                                    uploadIcon={<CloudUploadIcon />}
                                    uploadLabel="Upload Profile Picture"
                                    setFile={(files) => {
                                        console.log('Files received by FileUpload:', files);
                                        const fileArray = Array.isArray(files) ? files : files ? [files] : [];
                                        console.log('Selected files:', fileArray);
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