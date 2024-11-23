import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, TextArea, FileUpload, Select, RichTextEditor, } from '@video-cv/ui-components';
import { Grid, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { UploadFile } from '@mui/icons-material';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { toast } from 'react-toastify';
import { useAllMisc } from './../../../../../../libs/hooks/useAllMisc';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

interface ContentItem {
  id?: string;
  [key: string]: any;
}

interface CategoryModalProps {
  open: boolean;
  action: 'view' | 'add' | 'edit' | null;
  onClose: () => void;
  selectedItem?: Partial<ContentItem> | null;
  currentTab: string;
}

const CategoryModal = ({
  open,
  action,
  onClose,
  selectedItem,
  currentTab,
}: CategoryModalProps) => {
  const { register, handleSubmit, watch, setValue, reset, control } = useForm<ContentItem>();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const { data: itemData, isLoading, error } = useAllMisc({
    resource: currentTab,
    page: 1,
    limit: 1,
    // id: selectedItem?.id,
  });

  useEffect(() => {
    if (selectedItem && itemData && itemData.length > 0) {
      reset(itemData[0]);
    } else {
      reset({});
    }
  }, [selectedItem, itemData, reset]);


  
  if (!open) return null;



  const handleFormSubmit = async (data: ContentItem) => {
    if (action === 'view') return;

    const endpoint = apiEndpoints[currentTab.toUpperCase() as keyof typeof apiEndpoints];
    try {
      let profileImageUrl = data.profileImage;

      if (profileImageFile) {
        profileImageUrl = await handleImageUpload(profileImageFile);
      }
      const contentData = {
        ...data,
        profileImage: profileImageUrl,
        action: action === 'add' ? 'create' : 'edit',
      }
      const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, contentData);
      if (response.Success) {
        toast.success(`${action === 'add' ? 'Created' : 'Updated'} successfully`);
        onClose();
      } else {
        throw new Error('Failed to submit data');
      }
    } catch (err) {
      console.error('Error submitting data:', err);
      toast.error('Failed to submit data');
    }
  }; 

  const renderFields = () => {
    const isViewMode = action === 'view';

    switch (currentTab) {
      case 'faq':
        return (
          <>
            <Input label='Question' {...register('question', { required: true })} disabled={isViewMode} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Answer</Typography>
              <RichTextEditor
                value={watch('answer')}
                onChange={(value) => setValue('answer', value)}
                placeholder='Enter your answer'
              />
            </Grid>
          </>
        );
      case 'country':
        return (
          <>
            <Input label="Country Name" {...register('countryName', { required: true })} disabled={isViewMode} />
            <Input label="Country Code" {...register('shortName', { required: true })} disabled={isViewMode} />
          </>
        );
      case 'state':
        return (
          <>
            <Input label="State Name" {...register('name', { required: true })} disabled={isViewMode} />
            <Input label="Abbreviation" {...register('shortName', { required: true })} disabled={isViewMode} />
            <Input label="Country ID" type="number" {...register('countryId', { required: true })} disabled={isViewMode} />
          </>
        );
      case 'institutions':
        return (
          <>
            <Input label="Institution Name" {...register('name', { required: true })} disabled={isViewMode} />
            <Input label="Location" {...register('location', { required: true })} disabled={isViewMode} />
          </>
        );
      case 'courses':
        return (
          <>
            <Input label="Course Title" {...register('courseName', { required: true })} disabled={isViewMode} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Description</Typography>
              <RichTextEditor
                value={watch("description")}
                onChange={(value) => setValue('description', value)}
                placeholder='Enter description'
              />
            </Grid>
          </>
        );
      case 'industry/Sector':
        return (
          <>
            <Input label="Industry Name" {...register('name', { required: true })} disabled={isViewMode} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Description</Typography>
              <RichTextEditor
                value={watch("description")}
                onChange={(value) => setValue('description', value)}
                placeholder='Enter description'
              />
            </Grid>
          </>
        );
      case 'qualifications':
        return (
          <>
            <Input label="Qualification" {...register('name', { required: true })} disabled={isViewMode} />
            <Input label="Short Name" {...register('shortName', { required: true })} disabled={isViewMode} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Description</Typography>
              <RichTextEditor
                value={watch("description")}
                onChange={(value) => setValue('description', value)}
                placeholder='Enter description'
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Short Description</Typography>
              <RichTextEditor
                value={watch("shortDescription")}
                onChange={(value) => setValue('shortDescription', value)}
                placeholder='Enter description'
              />
            </Grid>
          </>
        );
      case 'siteTestimonials':
        return (
          <>
            <Input label="Name" {...register('name', { required: true })} disabled={isViewMode} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Testimonial</Typography>
              <RichTextEditor
                value={watch("testimonial")}
                onChange={(value) => setValue('testimonial', value)}
                placeholder='Enter testimonial'
              />
            </Grid>       
            <Grid item xs={12}>
              <Typography variant="subtitle2">Profile Image</Typography>
              <FileUpload
                uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                uploadLabel="Upload Profile Image"
                setFile={(file) => setValue('profileImage', file)}
              />
            </Grid>
          </>
        );
      case 'degreeClass':
        return (
          <>
            <Input label="Degree Class" {...register('name', { required: true })} disabled={isViewMode} />
            <Input label="Short Name" {...register('shortName', { required: true })} disabled={isViewMode} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Description</Typography>
              <RichTextEditor
                value={watch("description")}
                onChange={(value) => setValue('description', value)}
                placeholder='Enter description'
              />
            </Grid>
          </>
        );
      case 'cvUploadGuideline':
        return (
          <>
            <Input label="Guideline" {...register('guideline', { required: true })} disabled={isViewMode} />
            <RichTextEditor
              value={watch("description")}
              onChange={(value) => setValue('description', value)}
              placeholder='Enter description'
            />
          </>
        );
      default:
        return null;
    }
  }

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

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white p-10 lg:p-14 centered-modal rounded-lg">
      {/* <CloseIcon className='absolute cursor-pointer hover:rounded-full hover:bg-gray-400 hover:text-white top-4 right-6' onClick={onClose} /> */}
        
      <h3 className="text-center font-semibold text-xl">
        {
          action === 'view' ? `View ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}` :
          action === 'edit' ? `Edit ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}` : 
          `Create New ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}`
        }
      </h3>
      <div className="my-5 flex flex-col gap-5">
        {renderFields()}

        <Button
          variant='black'
          type="submit"
          className="w-full"
          label={selectedItem ? `Update ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}` : `Create ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}`}
        />
      </div>
    </form>
  );
};

export default CategoryModal;
