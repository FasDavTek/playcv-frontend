import React, { useState, useEffect, useCallback } from 'react';
import { CloudUpload as CloudUploadIcon, UploadFile } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useForm, Controller } from 'react-hook-form';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Input, TextArea, FileUpload, Select, DatePicker, RichTextEditor } from '@video-cv/ui-components';
import { getData, postData } from '../../../../../../libs/utils/apis/apiMethods';
import CONFIG from '../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from '../../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { Container, Grid } from '@mui/material';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import dayjs from 'dayjs';
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
})

interface IForm {
  firstName: string
  middleName: string
  lastName: string
  userTypeId: number
  phoneNumber: string
  phoneNo: string
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

const CreateEditUSer = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { register, handleSubmit, watch, control, setValue,  formState: { errors }, reset } = useForm<IForm>();

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


  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    try {

      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USER}?userEmail=${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.code === '00') {
        const { userDetails, professionalDetails, businessDetails } = response.userProfile

        // Set user details
        reset({
          ...userDetails,
          isProfessional: userDetails.isProfessionalUser,
          isBusinessUser: userDetails.isBusinessUser,
          phoneNumber: userDetails.phoneNo,
          // Set nested objects
          professionalInfo: userDetails.isProfessionalUser ? {
            ...professionalDetails,
            // Map fields that might have different names
            businessName: professionalDetails.businessName,
            businessPhone: professionalDetails.phoneNumber,
          } : undefined,
          employerInfo: userDetails.isBusinessUser ? {
            ...businessDetails,
            // Map fields that might have different names
            contactPhone: businessDetails.phoneNumber,
          } : undefined,
        });
      } 
      else {
        throw new Error('Unable to fetch user details');
      }
    } 
    catch (error) {
      if (!token) {
        toast.error('Unable to load user profile. Please log in again.');
        navigate('/');
      }
      else {
        console.error('Error fetching user details:', error);
        toast.error('Failed to load user details');
      }
    } 
    finally {
      setLoading(false);
    }
  }, [email, token, reset]);



  useEffect(() => {
    fetchUserDetails();
  }, [email]);



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
      const imageUrl = data.coverURL ? await handleImageUpload(new File([data.coverURL], 'profile.jpg')) : undefined;
      
      const userData = Object.entries({
        ...data,
        coverURL: imageUrl || data.coverURL,
        action: 'edit',
        userEmail: email,
      }).reduce((acc: { [key: string]: any }, [Key, value]) => {
        if (value) {
          acc[Key] = value;
        }
        return acc;
      }, {});

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.MANAGE_PROF_EMP_USER}`, userData);
      if (response.code === "201") {
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
  const renderBusinessFields = () => (
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
    <div className="p-6 bg-gray-50 mb-8">
      <ChevronLeftIcon className="cursor-pointer text-7xl mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" onClick={() => navigate('/admin/user-management')}/>

      <Container className="py-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Input
              label="First Name"
              {...register('firstName', { required: 'First Name is required' })}
            />
            <Input
              label="Middle Name"
              {...register('middleName', { required: 'Middle Name is required' })}
            />
            <Input
              label="Last Name"
              {...register('lastName', { required: 'Last Name is required' })}
            />
            <Input
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              disabled
            />
            <Input
              label="Phone Number"
              type="tel"
              {...register('phoneNumber')}
            />
            <Grid item xs={12} md={6}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Date of Birth"
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.toISOString())}
                  />
                )}
              />
            </Grid>

            {watch('isProfessional') && (
              <>
                {renderProfessionalFields()}
              </>
            )}

            {watch('isBusinessUser') && (
              <>
                {renderBusinessFields()}
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