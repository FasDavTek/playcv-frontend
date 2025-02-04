import { useCallback, useEffect, useState } from 'react';

import { useForm, Controller, FieldError } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, TextArea, FileUpload, DatePicker, Select, VideoUploadWidget, RichTextEditor } from '@video-cv/ui-components';
import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from './../../../../../../libs/utils/localStorage';

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

interface Advert {
  id: number;
  status: string;
  statusId: number;
  adName: string;
  redirectUrl: string;
  adType: string;
  adTypeId: number;
  dateCreated: string;
  authorName: string;
  adDescription: string;
  startDate: string;
  endDate: string;
  userType: string;
  userId: string;
  coverUrl: string;
}

type AdFormData = z.infer<typeof advertSchema>;

interface AdType {
  typeId: number;
  typeName: string;
  // typeDescription: string;
  // price: number;
}

const CreateAds = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [ads, setAds] = useState<Advert | undefined>(location.state?.ads);
  const [adTypes, setAdTypes] = useState<AdType[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [newMedia, setNewMedia] = useState<File[]>([])
  const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);
  const { register, handleSubmit, watch, setValue, reset, control, formState: { errors }, getValues} = useForm<AdFormData>({
    resolver: zodResolver(advertSchema),
  });

  
  const { adRequestId, adTypeId, adTypeName, price, paymentReference, paymentId } = location.state || {};

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  if (!token) {
      toast.error('Your session has expired. Please log in again');
      navigate('/')
  }


  const handleFileUpload = useCallback(async (file: File) => {
          
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

          const uploadedUrl = `https://${import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_DOMAIN}/${fileName}`
          return uploadedUrl
      } catch (err) {
          toast.error(`Upload Failed: ${err}`)
          throw err
      }
  }, []);



  const generateThumbnail = async (file: File) => {
    return new Promise<string>((resolve, reject) => {

      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          video.currentTime = 1;
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
      }
      else if (file.type.startsWith('image/')) {
        resolve(URL.createObjectURL(file));
      }
      else {
        reject(new Error('Unsupported file type'));
      }
    });
  };



  const onSubmit = async (data: AdFormData) => {
    try {

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
              thumbnails.push(uploadedUrl);
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
            thumbnails.push(uploadedUrl);
          }
        }

        thumbnailUrl = thumbnails.length > 0 ? thumbnails[0] : null;
        mediaUrl = uploadedUrls[0];
      };

      const adData = {
        // ...data,
        name: data.adName,
        adTypeId: adTypeId,
        userId: userId,
        description: data.adDescription,
        redirectUrl: data.adUrl,
        startDate: data.startDate,
        endDate: data.endDate,
        action: 'create',
        coverURL: mediaUrl,
      };

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_ADS}`, adData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.code === "00") {
          toast.success('File(s) uploaded successfully!');
          toast.success('Ad uploaded successfully');
          reset();
          navigate('/employer/advertisement');
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


  console.log(ads);


  return (
    <div className='p-10 overflow-hidden bg-white'>
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/employer/advertisement')} />
      <form onSubmit={(e) => { e.preventDefault(); const data = getValues(); onSubmit(data); } } className="bg-white px-10">
        <div className="my-5 flex flex-col gap-5">
          <Input label="Ad Title" {...register('adName', { required: true })} />
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
            <Controller
                name='files'
                control={control}
                render={({ field: { onChange } }) => (
                    <FileUpload
                        uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                        containerClass="mt-3"
                        uploadLabel="Drag and Drop or Browse"
                        uploadRestrictionText="Accepted formats: images, videos (max size: 15MB)"
                        setFile={(files) => {
                            console.log('Files received by FileUpload:', files);
                            const fileArray = Array.isArray(files) ? files : files ? [files] : [];
                            console.log('Selected files:', fileArray);
                            onChange(fileArray);
                        }}
                        // onFilesChange={(files) => {
                        //     console.log('Files changed:', files);
                        //     const fileArray = Array.isArray(files) ? files : [files];
                        //     setNewMedia(fileArray);
                        // }}
                    />
                )}
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
