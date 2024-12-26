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

interface CheckoutDetails {
  videoType: string;
  uploadTypeId: string;
  price: number;
  paymentReference: string;
  videos: {
    id: string;
    title: string;
    description: string;
  }[];
  adTypeId?: string;
  duration?: string;
}

const VideoUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(videoUploadSchema),
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [checkoutDetails, setCheckoutDetails] = useState<CheckoutDetails | null>(null);
  const { uploadRequestId, uploadTypeId, uploadTypeName, price, paymentReference, paymentId } = location.state || {};


  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      if (paymentId) {
        toast.error('Invalid upload data. Redirecting....');
        // navigate('/candidate/video-management');
        return;
      }

      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.CHECKOUT_DETAILS}/${paymentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch checkout details');
        }
        const data: CheckoutDetails = await response.json();
        setCheckoutDetails(data);
        
        if (data.videos && data.videos.length > 0) {
          const video = data.videos[0];
          setValue('name', video.title);
          setValue('description', video.description);
        }
        
        setValue('videoType', data.videoType);
        setValue('price', data.price);
        setValue('paymentReference', data.paymentReference);
      } catch (error) {
        console.error('Error fetching checkout details:', error);
        toast.error('Failed to load video details. Please try again.');
        // navigate('/candidate/video-management');
      }
    };

    fetchCheckoutDetails();
  }, [paymentId, navigate, setValue]);


  const options = [
    { value: 'education', label: 'Education' },
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
  ];

  // useEffect(() => {
  //   setValue('videoType', videoType);
  //   setValue('price', price);
  // }, [setValue, videoType, price]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_CATEGORY}?Page=1&Limit=1000`)
        if (response.code === "201") {
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


  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) throw new Error('File is not defined.');
    
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const bucketName = import.meta.env.VITE_CLOUDFLARE_R2_BUCKET;

      if (!bucketName) {
        throw new Error('Bucket name is not defined in environment variables.');
      }

      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      });

      await s3Client.send(command);

      const uploadedUrl = `https://${import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_DOMAIN}/${fileName}`;
      toast.success('Upload successful');
      console.log('Upload successful:', uploadedUrl);
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


  const handleFileChange = async (files: File | File[] | null) => {
    if (files) {
      const file = Array.isArray(files) ? files[0] : files;
      setValue('media', file);
      try {
        const thumbnailUrl = await generateThumbnail(file);
        setThumbnail(thumbnailUrl);
      } catch (error) {
        console.error('Error generating thumbnail:', error);
        toast.error('Failed to generate thumbnail');
      }
    }
  };



  const onSubmitHandler = async (data: FormData) => {
    if (!checkoutDetails) {
      toast.error('Missing video information. Please try again.');
      return;
    }

    try {
      toast.info('Uploading files...');
      setIsUploading(true);

      let uploadedUrl = '';
      if (data.media instanceof File) {
        uploadedUrl = await handleFileUpload(data.media);
      }

      const apiData = {
        videoId: uploadRequestId,
        title: data.name,
        typeId: uploadTypeId,
        description: data.description,
        transcript: data.videoTranscript,
        categoryId: data.Category,
        videoUrl: data.media,
        action: 'edit',
        paymentReference: checkoutDetails.paymentReference,
      };

      const uploadResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD}`, apiData);
      
      if (uploadResponse.code === "201") {
        toast.success('Video uploaded and payment confirmed successfully');
        reset();
        navigate('/candidate/video-management');
      } else {
        throw new Error(uploadResponse.message || 'Unable to upload video');
      }
    } 
    catch (err) {
      toast.error(`Error during submission: ${err}`);
      console.error('Error during submission:', err);
    } 
    finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="bg-white p-10 lg:py-9 lg:px-14">
        <div className="my-2 flex flex-col gap-5">
          <Input
            label="Video Title"
            {...register('name')}
          />
          <Input
            label="Video Type"
            value={`${checkoutDetails?.videoType} video upload`}
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
            name="Category"
            control={control}
            render={({ field }) => (
                <Select
                  name="Category"
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
            type='submit' 
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