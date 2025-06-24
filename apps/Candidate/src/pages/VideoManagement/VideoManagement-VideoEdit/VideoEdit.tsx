import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { Button, Input, FileUpload, Select, RichTextEditor, useToast } from '@video-cv/ui-components';
import { videoUploadSchema } from './../../../../../video-cv/src/schema/videoUploadSchema';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { SESSION_STORAGE_KEYS } from './../../../../../../libs/utils/sessionStorage';
import { ErrorMessages } from '@video-cv/constants';
import DOMPurify from "dompurify"
import { Snackbar, IconButton, Alert, SnackbarOrigin } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// Define max file size and accepted file types
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

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

interface Category {
  id: string;
  name: string;
}

interface UploadType {
    id: string;
    name: string;
    price: number;
    description: string;
    uploadPrice: number;
    imageUrl?: string;
    coverUrl?: string;
}

const videoSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Job title is required"),
  type: z.string().min(1, 'Video Type is required'),
  typeId: z.string().optional(),
  description: z.string().min(1, 'Video Description is required'),
  videoDescription: z.string().min(1, 'Video Description is required'),
  transcript: z.string().min(1, 'Video Transcript is required'),
  category: z.string().min(1, 'Category is required'),
  media: z.union([z.instanceof(File).refine((file) => {
    return !file || file.size <= MAX_FILE_SIZE; },
        `Max video file size is ${MAX_FILE_SIZE}MB.`)
        .refine((file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
        "Only .mp4, .webm, and .ogg video files are accepted."),
        z.array(z.instanceof(File)).nonempty('Please add a video file')
        .min(1, ErrorMessages.required("Please add a video file"))
        .refine((files) => files.every((file) => ACCEPTED_VIDEO_TYPES.includes(file.type)),
        'Only .mp4, .webm, and .ogg video files are accepted.'),])
        .refine((value) => value !== undefined && value !== null,
        { message: ErrorMessages.required('Media'),}
    ),
});

interface Video {
  id: number
  title: string
  typeId: number
  type: string
  transcript: string
  description: string
  categoryId: number
  category: string | null
  userId: string
  dateCreated: string
  views: number
  videoUrl: string
  thumbnailUrl: string
  status: string
  totalRecords: number
  videoDescription: string;
  rejectionReason?: string
  reasonForRejaction?: string;
  authorProfile: {
    userDetails: {
      fullName: string
      email: string
      profileImage: string | null
      userId: string;
      firstName: string;
      middleName: string;
      lastName: string;
      phoneNo: string;
      dateOfBirth: string;
      gender: string;
      type: string;
      isActive: boolean;
      phoneVerification: boolean;
      isBusinessUser: boolean;
      isProfessionalUser: boolean;
      isAdmin: boolean;
      isEmailVerified: boolean;
      isDeleted: boolean;
      createdAt: string;
      updatedAt: string;
      lastLoginDate: string;
      genderId: number;
    }
    businessDetails: {
      userId: string;
      businessName: string;
      industry: string;
      address: string;
      websiteUrl: string;
      contactPhone: string;
      businessEmail: string;
      businessTypeId: string;
      contactName: string;
      contactPosition: string;
      fbLink: string;
      id: string;
      industryId: string;
      instagramUrl: string;
      isActive: boolean;
      twitter: string;
    }
    professionalDetails: {
      id: string;
      nyscStateCode: string;
      nyscStartYear: number;
      nyscEndYear: number;
      address: string;
      businessName: string;
      businessPhone: string;
      businessProfile: string;
      classOfDegree: string;
      course: string;
      courseId: number;
      coverLetter: string;
      dateCreated: string;
      degree: string;
      degreeClassId: number;
      degreeTypeId: number;
      industry: string;
      industryId: number;
      institution: string;
      institutionId: number;
    }
  }
  hasSubscription: {
      userId: number,
      subscriptionId: number,
      videoId: number,
      totalAmountPaid: number,
      canAccessProduct: string,
      datePaid: string,
      checkOutId: number
  },
}

type FormData = z.infer<typeof videoSchema>;

const VideoEdit: React.FC = () => {
  const { id: idParam } = useParams();
  const id = idParam && Number.parseInt(idParam, 10);
  const location = useLocation();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video>();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadTypes, setUploadTypes] = useState<UploadType[]>([]);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(true);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors, isValid }, getValues, trigger } = useForm<FormData>({
    resolver: zodResolver(videoSchema),
  });

  const { showToast } = useToast();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
  const userId = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER_BIO_DATA_ID);

  useEffect(() => {
    fetchVideoDetails()
  }, []);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_CATEGORY}?Download=true`);
        if (response.code === "00") {
          await setCategories(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch categories');
        }
      } catch (error) {
        showToast('Failed to load video categories', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);



  const fetchUploadTypes = useCallback(async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD_TYPE}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      const data = await response.data
      setUploadTypes(data);
    } 
    catch (err: any) {
      if(!token) {
        showToast('Your session has expired. Please log in again', 'error');
        navigate('/');
      }
      else {
        showToast('Failed to load video upload types', 'error');
      }
    } 
    finally {
      setIsLoading(false)
    }
  }, [token]);


  useEffect(() => {
    fetchUploadTypes()
  }, [fetchUploadTypes]);


  const fetchVideoDetails = async () => {
    setLoading(true);
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_BY_ID}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.code === '200') {
        let data = await resp.videoDetails;
        setVideo(data);
        Object.keys(data).forEach((key) => {
            setValue(key as keyof FormData, data[key]);
        })
        // if (location.state?.fromVideosList) {
        //   incrementViewCount()
        // }
      }
    }
    catch (err) {
      console.error('Error fetching video detail:', err);
      showToast('Error fetching video detail', 'error');
    }
    finally {
      setLoading(false);
    }
  };



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
      if (!(file instanceof File)) {
          throw new Error('Invalid file object');
      }
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
          const file = fileArray[0];

          // Validate the file object
          if (!(file instanceof File)) {
          showToast('Invalid file selected', 'error');
          return;
          }
          setValue('media', fileArray as [File, ...File[]]);
          try {
              const thumbnailUrl = await generateThumbnail(file);
              setThumbnail(thumbnailUrl);
          }
          catch (err) {
              showToast('Failed to generate thumbnail', 'error');
          }
          // generateThumbnail(fileArray[0])
          //     .then(thumbnailUrl => setThumbnail(thumbnailUrl))
          //     .catch(error => {
              
          //     });
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



  // useEffect(() => {
  //   const requiredFields = ["title", "type", "videoDescription", "category", "media"];
  
  //   const fieldsValid = requiredFields.every((field) => {
  //     const value = getValues(field as keyof FormData);
  //     const isValid = value !== undefined && value !== "" && !errors[field as keyof FormData];
  //     return isValid;
  //   });
  
  //   setIsFormValid(fieldsValid);
  // }, [getValues, errors]);



  const onSubmitHandler = async (data: FormData) => {
    const isFormValid = await trigger();
    if (!isFormValid) return;

    try {
      setIsUploading(true);

      const selectedType = uploadTypes.find((type) => type.name === data.type);
      const selectedCategory = categories.find((category) => category.name === data.category);
  
      if (!selectedType || !selectedCategory) {
        showToast('Invalid type or category selected', 'error');
        return;
      }
  
      const typeId = selectedType.id;
      const categoryId = selectedCategory.id;
  
      const media = data.media;
      let uploadedUrl = video?.videoUrl; // Use existing video URL by default
      let thumbnailUrl = video?.thumbnailUrl || null; // Use existing thumbnail URL by default
  
      if (media) {
        const mediaArray = Array.isArray(media) ? media : [media];
  
        // Check if the media is a new file (not the existing one)
        const isNewFile = mediaArray.some((file) => file instanceof File);
  
        if (isNewFile) {
          const uploadedUrls: string[] = [];
          const thumbnails: string[] = [];
  
          for (const file of mediaArray) {
            if (!(file instanceof File)) {
              showToast('Invalid file selected', 'error');
              return;
            }
  
            // Upload the new file
            const uploadedUrl = await handleFileUpload(file);
            uploadedUrls.push(uploadedUrl);
  
            if (file.type.startsWith('video/')) {
              // Generate thumbnail for video
              const thumbnailUrl = await generateThumbnail(file);
              thumbnails.push(thumbnailUrl);
            } else if (file.type.startsWith('image/')) {
              // Use the image as the thumbnail
              thumbnails.push(uploadedUrl);
            }
          }
  
          // Update URLs only if new files were uploaded
          thumbnailUrl = thumbnails.length > 0 ? thumbnails[0] : null;
          uploadedUrl = uploadedUrls[0];
        }
      }


      const apiData = {
        videoId: id,
        title: data.title,
        typeId: typeId,
        description: data.description,
        transcript: data.transcript,
        categoryId: categoryId,
        videoUrl: uploadedUrl, // Use existing or new video URL
        thumbnailUrl: thumbnailUrl, // Use existing or new thumbnail URL
        action: 'edit',
      };
  
      const updateResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD}`, apiData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (updateResponse.code === "00") {
        showToast('Video updated successfully', 'success');
        reset();
        navigate('/candidate/video-management');
      }
      else if (updateResponse.statusCode === '99') {
        showToast(updateResponse.message, 'error');
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'An error occurred. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };



  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); const data = getValues();
        onSubmitHandler(data);
      }} className="bg-white p-10 lg:py-9 lg:px-14">
        <div className="my-2 flex flex-col gap-5">
          <Input
            label={<span>Video Title <span className="text-red-500">*</span></span>}
            {...register('title')}
            error={errors.title}
          />
          <Input
            label={<span>Video Type <span className="text-red-500">*</span></span>}
            {...register('type')}
            error={errors.type}
            disabled
          />
          {/* {errors.type && <p className="text-red-500">{errors.type.message}</p>} */}

          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Description <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={watch('videoDescription')}
            onChange={(value) => setValue('videoDescription', value)}
            placeholder="Add description for your video"
            maxChars={1200}
          />
          {errors.videoDescription && <p className="text-red-500">{errors.videoDescription.message}</p>}

          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Transcript
          </label>
          <RichTextEditor
            value={watch('transcript')}
            onChange={(value) => setValue('transcript', value)}
            placeholder="Add transcript for your video"
            maxChars={1200}
          />
          {/* {errors.transcript && <p className="text-red-500">{errors.transcript.message}</p>} */}

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
          {errors.category && <p className="text-red-500">{errors.category.message}</p>}

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
                    {...register('media')}
                    setFile={(files) => {
                      const fileArray = Array.isArray(files) ? files : files ? [files] : [];
                      onChange(fileArray);
                    }}
                    videoUrl={video?.videoUrl}
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
            label={isUploading ? "Updating..." : "Update"}
          />
        </div>
      </form>

      <Snackbar open={state.open} onClose={() => setState({ ...state, open: false })} anchorOrigin={{ vertical: state.vertical, horizontal: state.horizontal }} action={<IconButton color='info' onClick={handleSnackbarClick}><InfoIcon /></IconButton>} message="Click the icon for more details" >
        <Alert onClick={handleSnackbarClick} onClose={handleAlertClose} variant="filled" severity="info" sx={{ width: '100%', cursor: 'pointer' }} >
          For Jobseekers. Briefly list your qualifications, email & phone
        </Alert>
      </Snackbar>
    </div>
  );
};

export default VideoEdit;