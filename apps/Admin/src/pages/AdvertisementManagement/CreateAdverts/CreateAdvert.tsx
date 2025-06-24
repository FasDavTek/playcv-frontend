import { useEffect, useState, useCallback } from 'react';

import { useForm, Controller, FieldError } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, TextArea, FileUpload, DatePicker, Select, VideoUploadWidget, RichTextEditor, useToast } from '@video-cv/ui-components';

import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { SESSION_STORAGE_KEYS } from './../../../../../../libs/utils/sessionStorage';

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
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { adTypeId, adTypeName, duration } = location.state || {};
  const userId = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID);

  const { showToast } = useToast();

  const { register, handleSubmit, watch, setValue, reset, control, formState: { errors }, getValues} = useForm<AdFormData>({
    resolver: zodResolver(advertSchema),
    defaultValues: {
      adType: adTypeName || '',
      adTypeId: adTypeId || "",
      userId: userId || "",
    },
  });

  console.log(duration);

  const adType = watch('adType');
  const acceptFileType = adType === 'image' ? 'image/*' : adType === 'video' ? 'video/*' : undefined;

  useEffect(() => {
    setValue("startDate", dayjs())
  }, [setValue]);

  const handleFileUpload = useCallback(async (file: File) => {
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

      const result = await s3Client.send(command);
      const uploadedUrl = `https://${import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_DOMAIN}/${fileName}`;
      return uploadedUrl;
    } 
    catch (err) {
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

      const isValid = fileArray.every((file) => {
        if (adTypeName === "image" && !file.type.startsWith("image/")) {
          showToast("Only image files are allowed for image ads", 'error');
          return false
        }
        if (adTypeName === "video" && !file.type.startsWith("video/")) {
          showToast("Only video files are allowed for video ads", 'error');
          return false
        }
        return true
      })

      if (!isValid) return

      setValue('files', fileArray as [File, ...File[]]);
      generateThumbnail(fileArray[0])
        .then(thumbnailUrl => setThumbnail(thumbnailUrl))
        .catch(error => {
          showToast('Failed to generate thumbnail', 'error');
        });
    }
  };



  const onSubmitHandler = async (data: AdFormData) => {
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

      const adData = {
        // ...data,
        name: data.adName,
        adType: adTypeName,
        adTypeId: adTypeId,
        description: data.adDescription,
        redirectUrl: data.adUrl,
        startDate: data.startDate,
        duration: duration,
        media: uploadedUrls.map((url: any, index: any) => ({
          type: data.adType,
          url: url,
          thumbnail: thumbnails[index] || null
        })),
        action: 'create',
        coverURL: mediaUrl,
        userId: userId,
      };

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_ADS}`, adData);

      if (response.code === "00") {
        showToast('Ad created successfully', 'success');
        reset();
        navigate('/admin/advertisement-management');
      }
      else {
        throw new Error('Failed to upload ad');
      }
    } 
    catch (err) {
      showToast('Error creating advertisement!', 'error');
    } 
    finally {
      setIsUploading(false);
    }
  };



  return (
    <div className='p-10 overflow-hidden bg-white'>
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/advertisement-management')} />
      <h3 className="text-center font-semibold text-xl">Add Advert</h3>
      <form onSubmit={(e) => { e.preventDefault(); const data = getValues(); onSubmitHandler(data) }} className="bg-white px-10">
        <div className="my-5 flex flex-col gap-5">
          <Input label="Ad Title" {...register('adName', { required: true })} error={errors.adName} />
          <Input label="Ad Type" {...register('adType', { required: true })} error={errors.adType} />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Ad Description
          </label>
          <RichTextEditor
            value={watch('adDescription')}
            onChange={(value) => setValue('adDescription', value)}
            placeholder='Add description for your advert'
            maxChars={1600}
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
                    containerClass=""
                    uploadLabel="Drag and Drop or Browse"
                    uploadRestrictionText={`Max file size for ${adType === 'image' ? 'images' : 'videos'} advert is ${adType === 'image' ? '2MB' : '15MB'}. If your upload exceeds the limit. Use a compressor to reduce the size`}
                    {...register('files', { required: true })}
                    setFile={(files) => {
                      const fileArray = Array.isArray(files) ? files : files ? [files] : [];
                      onChange(fileArray);
                    }}
                    accept={acceptFileType}
                  />
            )}
          />
          </div>

          <Controller name='startDate' control={control} render={({ field: { onChange, value } }) => (
            <DatePicker label="Start Date" value={value} onChange={(newValue) => onChange(dayjs(newValue))} disabled error={errors.startDate as FieldError | undefined} />
          )} />

          {/* categories, tags, file upload */}
          <Button type="submit" variant='black' className="w-full" disabled={isUploading} label={isUploading ? "Uploading..." : "Submit"} />
        </div>
      </form>
    </div>
  );
};

export default CreateAdvertModal;
