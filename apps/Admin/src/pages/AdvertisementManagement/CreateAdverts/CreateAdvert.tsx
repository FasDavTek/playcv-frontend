import { useEffect, useState, useCallback } from 'react';

import { useForm, Controller, FieldError } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, TextArea, FileUpload, DatePicker, Select, VideoUploadWidget, RichTextEditor } from '@video-cv/ui-components';

import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
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

const CreateAdvertModal = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adTypes, setAdTypes] = useState<{ value: string; label: string }[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, reset, control, formState: { errors },} = useForm<AdFormData>({
    resolver: zodResolver(advertSchema),
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { uploadRequestId, adTypeId, adTypeName, price, paymentReference, paymentId } = location.state || {};



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
      finally {
        setIsLoading(false);
      }
    }

    fetchAdTypes();
}, []);



const handleFileUpload = useCallback(async (file: File) => {
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
}, []);



const generateThumbnail = async (file: File) => {
  return new Promise<string>((resolve, reject) => {
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Capture frame at 1 second
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
            handleFileUpload(thumbnailFile)
              .then(resolve)
              .catch(reject);
          } else {
            reject(new Error('Failed to create thumbnail blob'));
          }
        }, 'image/jpeg');
      };
      video.onerror = () => reject(new Error('Error generating video thumbnail'));
      video.src = URL.createObjectURL(file);
    } else if (file.type.startsWith('image/')) {
      resolve(URL.createObjectURL(file));
    } else {
      reject(new Error('Unsupported file type'));
    }
  });
};



const handleFileChange = async (files: File | File[]) => {
  const fileArray = Array.isArray(files) ? files : [files];
  if (fileArray.length > 0) {
    setValue('files', fileArray as [File, ...File[]]);
    generateThumbnail(fileArray[0])
      .then(thumbnailUrl => setThumbnail(thumbnailUrl))
      .catch(error => {
        console.error('Error generating thumbnail:', error);
        toast.error('Failed to generate thumbnail');
      });
  }
};



const onSubmitHandler = async (data: AdFormData) => {

  try {
    toast.info('Uploading files...');
    setIsUploading(true);

    const files = data.files;
    let mediaUrl = '';
    let thumbnailUrl = thumbnail;

    const uploadedUrls: string[] = [];
    const thumbnails: string[] = [];

    if (data.files && data.files.length > 0) {
      if (Array.isArray(files)) {
        for (const file of files) {
          const uploadedUrl = await handleFileUpload(file);
          uploadedUrls.push(uploadedUrl);

          if (file.type.startsWith('video/')) {
            const thumbnailUrl = await generateThumbnail(file);
            thumbnails.push(thumbnailUrl);
          } 
          else if (file.type.startsWith('image/')) {
            thumbnails.push(uploadedUrl); // Use the image itself as thumbnail
          }
        }
      } else if (files) {
        const uploadedUrl = await handleFileUpload(files);
        uploadedUrls.push(uploadedUrl);

        if (files.type.startsWith('video/')) {
          const thumbnailUrl = await generateThumbnail(files);
          thumbnails.push(thumbnailUrl);
        } 
        else if (files.type.startsWith('image/')) {
          thumbnails.push(uploadedUrl); // Use the image itself as thumbnail
        }
      }

      thumbnailUrl = thumbnails.length > 0 ? thumbnails[0] : null;
      mediaUrl = uploadedUrls[0];
    }

    toast.success('Files uploaded successfully!');

    const adData = {
      // ...data,
      name: data.adName,
      adType: adTypeName,
      adTypeId: adTypeId,
      description: data.adDescription,
      redirectUrl: data.adUrl,
      startDate: data.startDate,
      endDate: data.endDate,
      media: uploadedUrls.map((url: any, index: any) => ({
        type: data.adType,
        url: url,
        thumbnail: thumbnails[index] || null
      })),
      action: 'edit',
      coverURL: thumbnailUrl,
    };

    const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_ADS}`, adData);

    if (response.code === "00") {
      toast.success('Ad uploaded and payment confirmed successfully');
      reset();
      navigate('/admin/advertisement-management');
    }
    else {
      throw new Error('Failed to upload ad');
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



if (isLoading) {
  return <div>Loading...</div>;
}



  return (
    <div className='p-10 overflow-hidden bg-white'>
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/advertisement-management')} />
      <h3 className="text-center font-semibold text-xl">Add Advert</h3>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="bg-white px-10">
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
          {/* <Select
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
          /> */}
          <div className="">
            <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Media Upload (Multiple Files)
            </label>
            <FileUpload
              uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
              containerClass=""
              uploadLabel="Drag and Drop or Browse"
              {...register('files', { required: true })}
              setFile={handleFileChange}
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

export default CreateAdvertModal;
