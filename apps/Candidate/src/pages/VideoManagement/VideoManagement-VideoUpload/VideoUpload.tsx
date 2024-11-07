import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { Button, Input, FileUpload, Select, RichTextEditor } from '@video-cv/ui-components';
import { videoUploadSchema } from './../../../../../video-cv/src/schema/videoUploadSchema';
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

type FormData = z.infer<typeof videoUploadSchema>;

interface Category {
  id: string
  name: string
}

interface LocationState {
  videoType: string;
  price: number;
  paymentReference: string;
}

const VideoUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([]);
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(videoUploadSchema),
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState<LocationState | null>(null);


  useEffect(() => {
    if (location.state) {
      const { videoType, price, paymentReference } = location.state as LocationState;
      if (videoType && price && paymentReference) {
        setState({ videoType, price, paymentReference });
      } else {
        toast.error('Invalid upload data. Redirecting....');
        navigate('/candidate/video-management');
      }
    } else {
      toast.error('Error occured. Redirecting....');
      navigate('/candidate/video-management');
    }
  }, [location.state, navigate]);

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
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_CATEGORY}?Page=1&Limit=10`)
        if (response.isSuccess) {
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


  const onSubmitHandler = async (data: FormData) => {
    if (!state) {
      toast.error('Missing video information. Please try again.');
      navigate('/candidate/video-management');
      return;
    }

    try {
      toast.info('Uploading files...');
      setIsUploading(true);

      if (data.media instanceof File) {
        const uploadedUrl = await handleFileUpload(data.media);
        data.media = uploadedUrl;
      }

      const apiData = {
        title: data.name,
        uploadTypeId: data.videoType,
        description: data.description,
        transcript: data.videoTranscript,
        categoryId: data.Category,
        videoUrl: data.media,
        action: 'upload',
        paymentReference: data.paymentReference,
      };

      const uploadResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD}`, apiData);

      if (uploadResponse.isSuccess) {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          throw new Error('User ID not found');
        }

        const paymentConfirmationData = {
          videoType: state.videoType,
          videoPrice: state.price,
          paymentReference: state.paymentReference,
          userId,
          isUploaded: true, // This indicates that the video has been uploaded
        };

        const paymentResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, paymentConfirmationData);

        if (paymentResponse.isSuccess) {
          toast.success('Video uploaded and payment confirmed successfully');
          reset();
          navigate('/candidate/video-management');
        } 
        else {
          throw new Error(paymentResponse.message || 'Failed to confirm payment');
        }
      } else {
        throw new Error(uploadResponse.message || 'Failed to upload video');
      }
    } catch (err) {
      toast.error(`Error during submission: ${err}`);
      console.error('Error during submission:', err);
    } finally {
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
            value={`${state?.videoType} video upload`}
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
          <Select
            label="Select your video category"
            options={categories.map(category => ({ value: category.id, label: category.name }))}
            value={watch('Category')}
            onChange={(value) => setValue('Category', value)}
          />
          <div className="">
            <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Video CV
            </label>
            <FileUpload
              uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
              containerClass=""
              uploadLabel="Drag and Drop or Browse"
              {...register('media')}
              setFile={(files: File | File[] | null) => {
                if (files) {
                  if (Array.isArray(files)) {
                    setValue('media', files[0]);
                  } else {
                    setValue('media', files);
                  }
                }
              }}
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