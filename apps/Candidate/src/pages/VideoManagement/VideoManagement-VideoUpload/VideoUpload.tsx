import React, { useEffect, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { Button, Input, FileUpload, Select, RichTextEditor, useToast } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import { videoUploadSchema } from './../../../../../video-cv/src/schema/videoUploadSchema';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { useAuth } from './../../../../../../libs/context/AuthContext';
import { SESSION_STORAGE_KEYS } from './../../../../../../libs/utils/sessionStorage';
import { Snackbar, IconButton, Alert, SnackbarOrigin } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

interface State extends SnackbarOrigin {
  open: boolean;
}

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
  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors, isValid }, getValues, trigger } = useForm<FormData>({
    resolver: zodResolver(videoUploadSchema),
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const { uploadRequestId, uploadTypeId, uploadTypeName, uploadPrice, paymentReference, paymentId } = location.state || {};

  const userId = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID);

  const { showToast } = useToast();

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
        if (response.code === "00") {
          setCategories(response.data)
        } else {
          throw new Error(response.message || 'Failed to fetch categories')
        }
      } catch (error) {
        showToast('Failed to load video categories', 'error');
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchCategories();
  }, []);


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
    } catch (err) {
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


  const handleFileChange = async (files: File | File[]) => {
    const fileArray = Array.isArray(files) ? files : [files];
    if (fileArray.length > 0) {
      setValue('media', fileArray as [File, ...File[]]);
      generateThumbnail(fileArray[0])
        .then(thumbnailUrl => setThumbnail(thumbnailUrl))
        .catch(error => {
          showToast('Failed to generate thumbnail', 'error');
        });
    }
  };



  const [state, setState] = React.useState<State>({
    open: true,
    vertical: 'top',
    horizontal: 'center',
  });

  const handleSnackbarClick = () => {
    setOpen(true);
  };

  const handleAlertClose = () => {
    setOpen(false);
  };



  // const watchedFields = watch()
  
  // useEffect(() => {
  //   const requiredFields = ["name", "description", "category", "media", "confirmPassword"]

  //   const fieldsValid = requiredFields.every((field) => {
  //     const value = getValues(field as keyof FormData)
  //     const isValid = value !== undefined && value !== "" && !errors[field as keyof FormData]
  //     return isValid
  //   });

  //   const newIsFormValid = fieldsValid;
  //   setIsFormValid(newIsFormValid);
  // }, [getValues, errors])


  
  const onSubmitHandler = async (data: FormData) => {
    const isFormValid = await trigger();
    if (!isFormValid) return;

    try {
      setIsUploading(true);

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
              showToast('Please, select a video', 'error');
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
            showToast('Please, select a video', 'error');
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
        thumbnailUrl: thumbnailUrl,
        action: 'upload',
        paymentReference: paymentReference,
        userId: userId,
      };

      const uploadResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD}`, apiData);
      
      if (uploadResponse.code === "00") {
        showToast('Video uploaded successfully', 'success');
        reset();
        
        showToast('Your VideoCV is hidden & will be assessed very soon. If it meets the requirements, admin will enable it to play', 'info');
        setShowAlert(true);

        setTimeout(() => {
          navigate('/candidate/video-management', { state: { showAlert: true, }});
        }, 3000)
      }
    } 
    catch (err: any) {
      if (err.response?.data?.message) {
        if (err.response?.data?.message.includes('You do not have any pending upload request, kindly make payment to upload a new Video')) {
          showToast(err?.response?.data?.message, 'error');
          navigate('/candidate/video-management');
        }
        else {
          showToast(err?.response?.data?.message, 'error');
        }
      }
      else {
        showToast('An error occurred. Please try again.', 'error');
      }
    } 
    finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); const data = getValues();
        onSubmitHandler(data);
      }} className="bg-white p-10 lg:py-9 lg:px-14">
        <div className="my-2 flex flex-col gap-5">
          {showAlert && (
            <Alert severity="info">Your VideoCV is hidden & will be assessed very soon. If it meets the requirements, admin will enable it to play.</Alert>
          )}
          <Input
            label={<span>Video Title <span className="text-red-500">*</span></span>}
            {...register('name')}
            error={errors.name}
          />

          <Input
            label={<span>Video Type <span className="text-red-500">*</span></span>}
            value={`${uploadTypeName} video upload`}
            {...register('videoType')}
            error={errors.videoType}
            disabled
          />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Description <span className="text-red-500">*</span>
          </label>
          <span className='text-sm text-red-500'>* Please write your course of study, institution attended, email address, phone number and any other information that will be useful to the videoCV you are about to upload *</span>
          <RichTextEditor
            value={watch('description')}
            onChange={(value) => setValue('description', value)}
            placeholder="Add description for your video"
            maxChars={1200}
          />
           {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Transcript
          </label>
          <RichTextEditor
            value={watch('videoTranscript') || ''}
            onChange={(value) => setValue('videoTranscript', value)}
            placeholder="Add transcript for your video"
            maxChars={1200}
          />
          {/* {errors.videoTranscript && (
            <p className="text-red-500">{errors.videoTranscript.message}</p>
          )} */}
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Category <span className="text-red-500">*</span>
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
          {errors.category && (
            <p className="text-red-500">{errors.category.message}</p>
          )}
          <div className="">
            <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Video CV <span className="text-red-500">*</span>
            </label>
            <Controller
                name='media'
                control={control}
                render={({ field: { onChange } }) => (
                  <FileUpload
                    uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                    containerClass=""
                    uploadLabel="Drag and Drop or Browse"
                    uploadRestrictionText='Max file size 6 mb. If your videoCV exceeds the limit. Use a video compressor to reduce the mb size'
                    {...register('media')}
                    setFile={(files) => {
                      const fileArray = Array.isArray(files) ? files : files ? [files] : [];
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

      <Snackbar open={state.open} onClose={() => setState({ ...state, open: false })} anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }} action={<IconButton color='info' onClick={handleSnackbarClick}><InfoIcon /></IconButton>} message="Click the icon for more details" >
        <Alert onClick={handleSnackbarClick} onClose={handleAlertClose} severity="info" sx={{ width: '100%', cursor: 'pointer' }} >
          For Jobseekers. Briefly list your qualifications, email & phone
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VideoUpload;