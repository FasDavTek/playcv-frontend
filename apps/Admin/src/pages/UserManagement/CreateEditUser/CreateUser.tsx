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

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
      secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});

interface IForm {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    role?: string;
    phoneNumber: string;
    address: string;
    password: string;
    profilePicture?: any;
    institution?: string;
    dateOfBirth?: string;
    gender?: string;
    cvUrl?: string;
    redirectUrl?: string;
    companyUrl?: string;
    businessAddress?: string;
    contactPersonName?: string;
    contactPersonPosition?: string;
    contactPersonPhoneNumber?: string;
    socialMediaLink?: string;
    industry?: string;
    userTypeId: number;
    isBusinessUser: boolean;
    isProfessional: boolean;
    businessName: string;
    isTracked: boolean;
    businessId: number;
    coverURL: string;
    status: string;
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

    const { register, handleSubmit, control, setValue, reset, watch } = useForm<IForm>({
        defaultValues: {
            isBusinessUser: userType === 'employers',
            isProfessional: userType === 'professionals',
            userTypeId: userType === 'subAdmins' ? 1 : userType === 'employers' ? 2 : 3,
        },
    });

    console.log(userType);

    const handleImageUpload = async (file: File | null) => {
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

    const onSubmit = async (data: IForm) => {
        setLoading(true);
        try {
            const userTypeId = userType === 'subAdmins' ? 1 : userType === 'professional' ? 3 : 2;
            
            let ImageUrl = data.coverURL ? await handleImageUpload(new File([data.coverURL], 'profile.jpg')) : undefined;;

            if (ImageFile) {
                ImageUrl = await handleImageUpload(ImageFile);
            }

            const userData = {
                ...data,
                coverURL: ImageUrl || data.coverURL,
                action: 'create',
                isProfessional: userType === 'professionals',
                isBusinessUser: userType === 'employers',
                isAdmin: userType === 'subAdmins',
                userTypeId,
            }

            const endpoint = userType === 'subAdmins' ? apiEndpoints.CREATE_SUB_ADMIN : apiEndpoints.CREATE_PROF_EMP_USER;
            const resp = await postData(`${CONFIG.BASE_URL}${endpoint}`, userData);

            if (resp.Success) {
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
        <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" onClick={() => navigate('/admin/user-management')}/>
            
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
                    <Grid item xs={12}>
                        <Input
                            label="Address"
                            {...register('address')}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="coverURL"
                            control={control}
                            render={({ field }) => (
                                <FileUpload
                                    uploadIcon={<CloudUploadIcon />}
                                    uploadLabel="Upload Profile Picture"
                                    setFile={(file) => {
                                        if (file instanceof File) {
                                            setImageFile(file);
                                            field.onChange(file);
                                        }
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    {userType === 'subAdmins' && (
                        <Grid item xs={12}>
                            <Select
                                label="Role"
                                options={roleOptions}
                                value={watch('role') || ''}
                                onChange={(value) => setValue('role', value)}
                            />
                        </Grid>
                    )}
                    {userType === 'professionals' && (
                        <>
                            <Grid item xs={12}>
                                <Input
                                    label="Redirect URL"
                                    type="url"
                                    {...register('redirectUrl', { required: 'RedirectUrl is required' })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label="Institution"
                                    {...register('institution')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label="Date of Birth"
                                    type="date"
                                    {...register('dateOfBirth')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Select
                                    label="Gender"
                                    options={genderOptions}
                                    value={watch('gender') || ''}
                                    onChange={(value) => setValue('gender', value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label="CV URL"
                                    {...register('cvUrl')}
                                />
                            </Grid>
                        </>
                    )}
                    {userType === 'employers' && (
                        <>
                            <Grid item xs={12}>
                                <Input
                                    label="Redirect URL"
                                    type="url"
                                    {...register('redirectUrl', { required: 'RedirectUrl is required' })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label="Company URL"
                                    {...register('companyUrl')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label="Business Address"
                                    {...register('businessAddress')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label="Contact Person Name"
                                    {...register('contactPersonName')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label="Contact Person Position"
                                    {...register('contactPersonPosition')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label="Contact Person Phone Number"
                                    {...register('contactPersonPhoneNumber')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label="Social Media Link"
                                    {...register('socialMediaLink')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Input
                                    label="Industry"
                                    {...register('industry')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name='status'
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Select
                                        label="Class of Degree"
                                        value={watch('status')}
                                        options={[
                                            { value: '1', label: 'Active' },
                                            { value: '0', label: 'Inactive' },
                                        ]}
                                        onChange={(value) => onChange('status', value)}
                                        />
                                    )}
                                />
                            </Grid>
                        </>
                    )}
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