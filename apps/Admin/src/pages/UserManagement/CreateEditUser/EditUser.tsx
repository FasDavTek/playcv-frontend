import React, { useState, useEffect } from 'react';
import { CloudUpload as CloudUploadIcon, UploadFile } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, TextArea, FileUpload, Select } from '@video-cv/ui-components';
import { getData, postData } from '../../../../../../libs/utils/apis/apiMethods';
import CONFIG from '../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from '../../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { Container, Grid } from '@mui/material';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})

interface IForm {
  name: string;
  email: string;
  role?: string;
  phoneNumber: string;
  address: string;
  profilePicture: File | null;
  institution?: string;
  dateOfBirth?: string;
  gender?: string;
  cvUrl?: string;
  companyUrl?: string;
  businessAddress?: string;
  contactPersonName?: string;
  contactPersonPosition?: string;
  contactPersonPhoneNumber?: string;
  socialMediaLink?: string;
  industry?: string;
}

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
  { value: 'manager', label: 'Manager' },
];

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const CreateEditUSer: React.FC = () => {
  const { userType, email } = useParams<{ userType: string; email: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, watch, control, setValue, reset } = useForm<IForm>();

  useEffect(() => {
    if (email) {
      fetchUserDetails(email);
    }
  }, [email]);

  const fetchUserDetails = async (userEmail: string) => {
    setLoading(true);
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USER}/${userEmail}`);
      if (response.ok) {
        const userData = await response.json();
        Object.keys(userData).forEach((key) => {
          setValue(key as keyof IForm, userData[key]);
        });
      } 
      else {
        throw new Error('Failed to fetch user details');
      }
    } 
    catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
    } 
    finally {
      setLoading(false);
    }
  };



  const handleImageUpload = async (file: File) => {
    try {
      const fileName = `${Date.now()}-${file.name}`
      const bucketName = import.meta.env.VITE_CLOUDFLARE_R2_BUCKET

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      })

      await s3Client.send(command)
      return `https://${import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_DOMAIN}/${fileName}`
    } catch (err) {
      toast.error(`Image upload failed: ${err}`)
      console.error('Upload failed:', err)
      throw err
    }
  }



  const onSubmit = async (data: IForm) => {
    setLoading(true);
    try {
      const endpoint = userType === 'subAdmins' ? apiEndpoints.CREATE_SUB_ADMIN : apiEndpoints.MANAGE_PROF_EMP_USER;

      let imageUrl = data.profilePicture ? await handleImageUpload(data.profilePicture) : undefined
      
      const userData = {
        ...data,
        userImage: imageUrl,
        userEmail: email,
      }

      const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, userData);
      if (response.ok) {
        toast.success(`User updated successfully`);
        navigate('/admin/user-management');
      } 
    } 
    catch (error) {
      console.error(`Error updating user:`, error);
      toast.error(`Failed to update user`);
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 mb-8">
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" onClick={() => navigate('/admin/user-management')}/>

      <Container className="py-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Input
              label="Name"
              {...register('name', { required: 'Name is required' })}
            />
            <Input
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
            />
            <Input
              label="Phone Number"
              type="tel"
              {...register('phoneNumber')}
            />
            <TextArea
              label="Address"
              {...register('address')}
            />
            <Controller
              name="profilePicture"
              control={control}
              render={({ field }) => (
                <FileUpload
                  uploadIcon={<CloudUploadIcon />}
                  uploadLabel="Profile Picture"
                  setFile={(file) => {
                    if (file instanceof File) {
                        setImageFile(file);
                        field.onChange(file);
                    }
                }}
                />
              )}
            />
            {userType === 'subAdmins' && (
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field: { onChange, value } }) => (
                  <Select
                    label="Role"
                    options={roleOptions}
                    value={watch('role') || ''}
                    onChange={(value) => setValue('role', value)}
                  />
                )}
              />
            )}
            {userType === 'professionals' && (
              <>
                <Input
                  label="Institution"
                  {...register('institution')}
                />
                <Input
                  label="Date of Birth"
                  type="date"
                  {...register('dateOfBirth')}
                />
                <Select
                  label="Gender"
                  options={genderOptions}
                  value={watch('gender') || ''}
                  onChange={(value) => setValue('gender', value)}
                />
                <Input
                  label="CV URL"
                  {...register('cvUrl')}
                />
              </>
            )}
            {userType === 'employers' && (
              <>
                <Input
                  label="Company URL"
                  {...register('companyUrl')}
                />
                <TextArea
                  label="Business Address"
                  {...register('businessAddress')}
                />
                <Input
                  label="Contact Person Name"
                  {...register('contactPersonName')}
                />
                <Input
                  label="Contact Person Position"
                  {...register('contactPersonPosition')}
                />
                <Input
                  label="Contact Person Phone Number"
                  {...register('contactPersonPhoneNumber')}
                />
                <Input
                  label="Social Media Link"
                  {...register('socialMediaLink')}
                />
                <Input
                  label="Industry"
                  {...register('industry')}
                />
              </>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant='black'
                label={loading ? 'Processing...' : 'Update User' }
                disabled={loading}
              />
            </Grid>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default CreateEditUSer;