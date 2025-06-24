import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input,  FileUpload, Select, RichTextEditor, useToast, } from '@video-cv/ui-components';
import { Grid, Typography } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { toast } from 'react-toastify';
import { useAllMisc } from './../../../../../../libs/hooks/useAllMisc';
import { postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { SESSION_STORAGE_KEYS } from './../../../../../../libs/utils/sessionStorage';
import { useAllCountry } from './../../../../../../libs/hooks/useAllCountries';
import { useAllState } from './../../../../../../libs/hooks/useAllState';
import model from './../../../../../../libs/utils/helpers/model'

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
  action: 'view' | 'create' | 'edit' | null;
  onClose: () => void;
  selectedItem?: Partial<ContentItem> | null;
  currentTab: string;
  onContentUpdate: () => void;
}

const CategoryModal = ({
  open,
  action,
  onClose,
  selectedItem,
  currentTab,
  onContentUpdate,
}: CategoryModalProps) => {
  const { register, handleSubmit, watch, setValue, reset, formState: { errors }, control } = useForm<ContentItem>();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const { data: itemData, isLoading, error } = useAllMisc({
    resource: 
      currentTab === 'industry' ? 'industries' :
      currentTab === 'cvguideline' ? 'cv-guideline' :
      currentTab === 'degreeclass' ? 'degree-class' :
      currentTab === 'sitetestimonial' ? 'site-testimonials' :
      currentTab === 'category' ? 'video-category' :
      currentTab,
    page: 1,
    limit: 100,
    enabled: currentTab !== 'country' && currentTab !== 'state',
  });

  const { data: countryData, isLoading: isCountryLoading, error: countryError } = useAllCountry();
  const { data: stateData, isLoading: isStateLoading, error: stateError } = useAllState();

  useEffect(() => {
    if (selectedItem) {
      reset(selectedItem);
    } else {
      reset({});
    }
  }, [selectedItem, reset]);


  
  if (!open) return null;

  const handleFormSubmit = async (data: ContentItem) => {
    if (action === 'view') return;

    const endpoint = apiEndpoints[currentTab.toUpperCase() as keyof typeof apiEndpoints];
    try {
      const formData = new FormData();

      let contentData: any = {
        ...data,
        action: action === 'create' ? 'create' : 'edit',
        ...(action === "edit" && selectedItem?.id && { id: selectedItem.id }),
      }

      if (currentTab === 'siteTestimonials' && profileImageFile) {
        const profileImageUrl = await handleImageUpload(profileImageFile);
        contentData.profileImage = profileImageUrl;
      } else if (profileImageFile && currentTab !== 'country') {
        const profileImageUrl = await handleImageUpload(profileImageFile);
        contentData.profileImage = profileImageUrl;
      } else if (currentTab === 'country') {
        contentData = {
          Name: data.name,
          ShortName: data.shortName,
          Action: action === 'create' ? 'create' : 'edit',
          Id: selectedItem?.id || "",
        };
      } else if (currentTab === 'category') {
        contentData = {
          CategoryName: data.name,
          description: data.description,
          Action: action === 'create' ? 'create' : 'edit',
          Id: selectedItem?.id || "",
        }
      }

      const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
      

      for (const key in contentData) {
        if (contentData.hasOwnProperty(key)) {
          formData.append(key, contentData[key]);
        }
      }

      setLoading(true);

      const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
         },
      });
      if (response.statusCode === "200") {
        showToast(`${action === 'create' ? 'Created' : 'Updated'} successfully`, 'success');
        onContentUpdate();
        onClose();
      } else {
        throw new Error('Failed to submit data');
      }
    } catch (err) {
      showToast('Failed to submit data', 'error');
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
            <Input label="Country Name" {...register('name', { required: true })} disabled={isViewMode} />
            <Input label="Country Code" {...register('shortName', { required: true })} disabled={isViewMode} />
          </>
        );
      case 'state':
        return (
          <>
            <Input label="State Name" {...register('name', { required: true })} disabled={isViewMode} />
            <Input label="Abbreviation" {...register('shortName', { required: true })} disabled={isViewMode} />
            {/* <Input label="Country ID" type="number" {...register('countryId', { required: true })} disabled={isViewMode} /> */}
            <Controller
                name='countryId'
                control={control}
                render={({ field }) => (
                  <Select
                    name="Country"
                    control={control}
                    defaultValue={Array.isArray(countryData) ? countryData?.find(i => i.id === watch('countryId')) : null}
                    options={model(countryData, 'name', 'id')}
                    handleChange={(newValue) => { field.onChange(newValue?.value || newValue?.label); setValue('Country', newValue?.label || ''); }}
                    isDisabled={isCountryLoading}
                    errors={errors}
                    label={`Country`}
                  />
                )}
            />
          </>
        );
      case 'category':
        return (
          <>
            <Input label="Video Category Name" {...register('name', { required: true })} disabled={isViewMode} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Description</Typography>
              <RichTextEditor
                value={watch("description")}
                onChange={(value) => setValue('description', value)}
                placeholder='Enter description'
                maxChars={1200}
              />
            </Grid>
          </>
        );
      case 'institution':
        return (
          <>
            <Input label="Institution Name" {...register('institutionName', { required: true })} disabled={isViewMode} />
            <Controller
              name='countryId'
              control={control}
              render={({ field }) => (
                <Select
                  name="Country"
                  control={control}
                  defaultValue={Array.isArray(countryData) ? countryData?.find(i => i.id === watch('countryId')) : null}
                  options={model(countryData, 'name', 'id')}
                  handleChange={(newValue) => { field.onChange(newValue?.value || newValue?.label); setValue('Country', newValue?.label || ''); }}
                  isDisabled={isCountryLoading}
                  errors={errors}
                  label={`Country`}
                />
              )}
            />
            {/* <Input label="Location" {...register('location', { required: true })} disabled={isViewMode} /> */}
          </>
        );
      case 'course':
        return (
          <>
            <Input label="Course Title" {...register('courseName', { required: true })} disabled={isViewMode} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Description</Typography>
              <RichTextEditor
                value={watch("description")}
                onChange={(value) => setValue('description', value)}
                placeholder='Enter description'
                maxChars={1200}
              />
            </Grid>
          </>
        );
      case 'industry':
        return (
          <>
            <Input label="Industry Name" {...register('name', { required: true })} disabled={isViewMode} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Description</Typography>
              <RichTextEditor
                value={watch("description")}
                onChange={(value) => setValue('description', value)}
                placeholder='Enter description'
                maxChars={1200}
              />
            </Grid>
          </>
        );
      case 'qualification':
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
                maxChars={1200}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Short Description</Typography>
              <RichTextEditor
                value={watch("shortDescription")}
                onChange={(value) => setValue('shortDescription', value)}
                placeholder='Enter description'
                maxChars={500}
              />
            </Grid>
          </>
        );
      case 'sitetestimonial':
        return (
          <>
            <Input label="Name" {...register('name', { required: true })} disabled={isViewMode} />
            <Grid item xs={12}>
              <Typography variant="subtitle2">Testimonial</Typography>
              <RichTextEditor
                value={watch("testimonial")}
                onChange={(value) => setValue('testimonial', value)}
                placeholder='Enter testimonial'
                maxChars={1500}
              />
            </Grid>       
            <Grid item xs={12}>
              <Typography variant="subtitle2">Profile Image</Typography>
              <Controller
                name='profileImage'
                control={control}
                render={({ field: { onChange } }) => (
                  <FileUpload
                    uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                    uploadLabel="Upload Profile Image"
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
          </>
        );
      case 'degreeclass':
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
                maxChars={1200}
              />
            </Grid>
          </>
        );
      case 'cvguideline':
        return (
          <>
            <Input label="Guideline" {...register('guideline', { required: true })} disabled={isViewMode} />
            <RichTextEditor
              value={watch("description")}
              onChange={(value) => setValue('description', value)}
              placeholder='Enter description'
              maxChars={1700}
            />
          </>
        );
      default:
        return null;
    }
  }

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
          label={
            loading
              ? `${action === 'create' ? 'Creating' : 'Updating'} ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}...`
              : selectedItem
              ? `Update ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}`
              : `Create ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}`
          }
        />
      </div>
    </form>
  );
};

export default CategoryModal;
