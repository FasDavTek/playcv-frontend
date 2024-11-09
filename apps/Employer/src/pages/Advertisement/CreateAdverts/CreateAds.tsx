import { useEffect, useState } from 'react';

import { useForm, Controller, FieldError } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, TextArea, FileUpload, DatePicker, Select, VideoUploadWidget, RichTextEditor } from '@video-cv/ui-components';
import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../../libs/utils/helpers/config';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// interface IForm {
//   name: string;
//   description: string;
//   category: string[];
//   tags: string[];
//   video: File;
//   videoTranscript: string;
// }

type AdFormData = z.infer<typeof advertSchema>;

const CreateAds = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [adTypes, setAdTypes] = useState<{ value: string; label: string }[]>([]);
  const [uploadUrls, setUploadUrls] = useState<string[]>([]);
  const { register, handleSubmit, watch, setValue, reset, control, formState: { errors },} = useForm<AdFormData>({
    resolver: zodResolver(advertSchema),
  });
  console.log('errors', errors);

  const navigate = useNavigate();


  useEffect(() => {
    const fetchAdTypes = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_TYPE}`)
        if (!response.ok) throw new Error('Failed to fetch ad types')
        const data: string[] = await response.json()
        setAdTypes(data.map(type => ({ value: type as 'video' | 'image', label: type })))
      } 
      catch (err) {
        console.error('Error fetching ad types:', err)
        toast.error('Failed to load ad types')
      }
    }

    fetchAdTypes();
}, []);


  const handleFileUpload = async (file: File) => {
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
    } catch (err) {
      toast.error(`Upload Failed: ${err}`);
      console.error('Upload failed:', err);
      throw err;
    }
  };

  const onSubmit = async (data: AdFormData) => {
    try {
      setIsUploading(true);
      toast.info('Uploading files...');

      const files = data.files;
      const uploadedUrls: string[] = [];

      if (Array.isArray(files)) {
        for (const file of files) {
          const uploadedUrl = await handleFileUpload(file);
          uploadedUrls.push(uploadedUrl);
        }
      } else if (files) {
        const uploadedUrl = await handleFileUpload(files);
        uploadedUrls.push(uploadedUrl);
      }

      toast.success('Files uploaded successfully!');

      const adData = {
        ...data,
        media: uploadedUrls.map(url => ({
          type: data.adType,
          url: url
        })),
      };

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_ADS}`, adData);

      if (response.status === 200) {
        toast.success('Advertisement created successfully!');
        reset();
        navigate('/admin/advertisement-management');
      } else {
        throw new Error('Failed to create advertisement');
      }
    } 
    catch (err) {
      toast.error('Error creating advertisement!');
      console.error('Error creating advertisement:', err);
    } 
    finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='p-10 overflow-hidden bg-white'>
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/employer/advertisement')} />
      <form onSubmit={handleSubmit(onSubmit, (err) => console.log('err', err))} className="bg-white px-10">
        <div className="my-5 flex flex-col gap-5">
          <Input label="Ad Title" {...register('adName', { required: true })} error={errors.adName} />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Ad Description
          </label>
          <RichTextEditor
            value={watch('adDescription')}
            onChange={(value) => setValue('adDescription', value)}
            placeholder='Add description for your advert'
          />
          <Input label="Ad Redirect Url" {...register('adUrl', { required: true })} error={errors.adUrl} />
          <Select
            label="Advert Type"
            options={adTypes}
            value={watch('adType')}
            onChange={(value: string) => {
              if (value === "video" || value === "image") {
                setValue('adType', value);
              } else {
                console.error(`Invalid ad type: ${value}`);
              }
            }}
          />
          <div className="">
            <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Media Upload (Multiple Files)
            </label>
            <FileUpload
              uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
              containerClass=""
              uploadLabel="Drag and Drop or Browse"
              {...register('files', { required: true })}
              setFile={(files: File | File[] | null) => {
                if (files) {
                  if (Array.isArray(files)) {
                    setValue('files', [files[0], ...files.slice(1)]);
                  } else {
                    setValue('files', [files]);
                  }
                }
              }}
            />
          </div>

          <Controller name='startDate' control={control} render={({ field: { onChange, value } }) => (
            <DatePicker label="Start Date" value={value} onChange={(newValue) => onChange(dayjs(newValue))} error={errors.startDate as FieldError | undefined} />
          )} />
          <Controller name='endDate' control={control} render={({ field: { onChange, value } }) => (
            <DatePicker label="End Date" value={value} onChange={(newValue) => onChange(dayjs(newValue))} error={errors.endDate as FieldError | undefined} />
          )} />

          {/* categories, tags, file upload */}
          <Button type="submit" variant='black' className="w-full" disabled={isUploading} label={isUploading ? "Uploading..." : "Submit"} />
        </div>
      </form>
    </div>
    
  );
};

export default CreateAds;
