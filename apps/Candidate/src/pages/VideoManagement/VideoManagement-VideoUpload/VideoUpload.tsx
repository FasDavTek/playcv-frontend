import React, { useEffect, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { Button, Input, FileUpload, Select, RichTextEditor } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import { videoUploadSchema } from './../../../../../video-cv/src/schema/videoUploadSchema';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { useAuth } from './../../../../../../libs/context/AuthContext';
import { LOCAL_STORAGE_KEYS } from './../../../../../../libs/utils/localStorage';

console.log('VideoUpload module loaded');

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

type FormData = z.infer<typeof videoUploadSchema>;

interface Category {
  id: string
  name: string
}

const VideoUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors }, getValues } = useForm<FormData>({
    resolver: zodResolver(videoUploadSchema),
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { uploadRequestId, uploadTypeId, uploadTypeName, uploadPrice, paymentReference, paymentId } = location.state || {};

  const userId = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);

  const options = [
    { value: 'education', label: 'Education' },
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
  ];

  // useEffect(() => {
  //   setValue('videoType', videoType);
  //   setValue('price', price);
  // }, [setValue, videoType, price]);

  console.log('HERE');

  useEffect(() => {
    console.log('VideoUpload component mounted');
    return () => {
      console.log('VideoUpload component unmounted');
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_CATEGORY}?Page=1&Limit=1000`)
        if (response.code === "00") {
          setCategories(response.data)
        } else {
          throw new Error(response.message || 'Failed to fetch categories')
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        toast.error('Failed to load video categories')
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchCategories();
  }, []);


  console.log('GETTING FILE FOR UPLOAD');
  const handleFileUpload = useCallback(async (file: File) => {
    // if (!file) throw new Error('File is not defined.');

    console.log('REACHING');
    
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
    } catch (err) {
      console.error('Upload failed:', err);
      throw err;
    }
  }, []);


  console.log('GETTING VIDEO FOR GENERATING THUMBAIL')
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
      } else {
        reject(new Error('Unsupported file type for thumbnail generation'));
      }
    });
  };


  const handleFileChange = async (files: File | File[]) => {
    const fileArray = Array.isArray(files) ? files : [files];
    if (fileArray.length > 0) {
      setValue('media', fileArray as [File, ...File[]]);
      generateThumbnail(fileArray[0])
        .then(thumbnailUrl => setThumbnail(thumbnailUrl))
        .catch(error => {
          console.error('Error generating thumbnail:', error);
          toast.error('Failed to generate thumbnail');
        });
    }
  };


  console.log("GETTING VIDEO DETAILS FOR UPLOAD");
  const onSubmitHandler = async (data: FormData) => {
    console.log('Form submitted with data:', data);

    try {
      setIsUploading(true);
      toast.info('Uploading files...');

      const media = data.media;
      let uploadedUrl = '';
      let thumbnailUrl = thumbnail;

      const uploadedUrls: string[] = [];
      const thumbnails: string[] = [];

      if (data.media && data.media.length > 0) {
        if (Array.isArray(media)) {
          for (const file of media) {
            const uploadedUrl = await handleFileUpload(file);
            uploadedUrls.push(uploadedUrl);
  
            if (file.type.startsWith('video/')) {
              const thumbnailUrl = await generateThumbnail(file);
              thumbnails.push(thumbnailUrl);
            } 
            else if (file.type.startsWith('image/')) {
              toast.error('Please, select a video');
              return;
            }
          }
        } else if (media) {
          const uploadedUrl = await handleFileUpload(media);
          uploadedUrls.push(uploadedUrl);
  
          if (media.type.startsWith('video/')) {
            const thumbnailUrl = await generateThumbnail(media);
            thumbnails.push(thumbnailUrl);
          } 
          else if (media.type.startsWith('image/')) {
            toast.error('Please, select a video');
            return;
          }
        }
  
        thumbnailUrl = thumbnails.length > 0 ? thumbnails[0] : null;
        uploadedUrl = uploadedUrls[0];
      }

      const apiData = {
        videoId: uploadRequestId,
        title: data.name,
        typeId: uploadTypeId,
        description: data.description,
        transcript: data.videoTranscript,
        categoryId: data.category,
        videoUrl: uploadedUrl,
        media: uploadedUrls.map((url: any, index: any) => ({
          videoType: data.videoType,
          url: url,
          thumbnail: thumbnails[index],
        })),
        action: 'upload',
        paymentReference: paymentReference,
        userId: userId,
      };

      console.log('Sending API data:', apiData);

      const uploadResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD}`, apiData);
      
      if (uploadResponse.code === "00") {
        toast.success('Video uploaded successfully');
        reset();
        navigate('/candidate/video-management');
      }
    } 
    catch (err: any) {
      if (err.response?.data?.message) {
        if (err.response?.data?.message.includes('You do not have any pending upload request, kindly make payment to upload a new Video')) {
          toast.error(err?.response?.data?.message);
          navigate('/candidate/video-management');
        }
        else {
          toast.error(err?.response?.data?.message);
        }
      }
      else {
        toast.error('An error occurred. Please try again.');
      }
    } 
    finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); const data = getValues();
        console.log('Form submitted with data:', JSON.stringify(data, null, 2));
        onSubmitHandler(data);
      }} className="bg-white p-10 lg:py-9 lg:px-14">
        <div className="my-2 flex flex-col gap-5">
          <Input
            label="Video Title"
            {...register('name')}
          />
          <Input
            label="Video Type"
            value={`${uploadTypeName} video upload`}
            {...register('videoType')}
            disabled
          />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Description
          </label>
          <RichTextEditor
            value={watch('description')}
            onChange={(value) => setValue('description', value)}
            placeholder="Add description for your video"
          />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Transcript
          </label>
          <RichTextEditor
            value={watch('videoTranscript')}
            onChange={(value) => setValue('videoTranscript', value)}
            placeholder="Add transcript for your video"
          />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Category
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
                <Select
                  name="category"
                  control={control}
                  placeholder="Select your video category"
                  options={categories.map(category => ({ value: category.id, label: category.name }))}
                  handleChange={(newValue) => field.onChange(newValue?.value)}
                />
            )}
          />
          <div className="">
            <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Video CV
            </label>
            <Controller
                name='media'
                control={control}
                render={({ field: { onChange } }) => (
                  <FileUpload
                    uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                    containerClass=""
                    uploadLabel="Drag and Drop or Browse"
                    {...register('media')}
                    setFile={(files) => {
                      console.log('Files received by FileUpload:', files);
                      const fileArray = Array.isArray(files) ? files : files ? [files] : [];
                      console.log('Selected files:', fileArray);
                      onChange(fileArray);
                    }}
                  />
                )}
              />
            {errors.media && <p className="text-red-500">{errors.media.message}</p>}
          </div>
          <Button 
            type="submit"
            variant='black' 
            className="w-full md:w-28" 
            disabled={isUploading} 
            label={isUploading ? "Uploading..." : "Upload"} 
          />
        </div>
      </form>
    </div>
  );
};

export default VideoUpload;