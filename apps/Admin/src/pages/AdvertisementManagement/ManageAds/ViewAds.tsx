import { Fragment, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { formatDate } from '@video-cv/utils';
// import { fetchAdById } from './api';
import dayjs from 'dayjs';
import { Button, DatePicker, FileUpload, HtmlContent, Input, RichTextEditor, Select, TextArea, VideoUploadWidget } from '@video-cv/ui-components';
import { ArrowBack, UploadFile } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useController, useForm } from 'react-hook-form';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';
import { toast } from 'react-toastify';
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
    coverURL: string;
    thumbnailUrl: string
    rejectionReason?: string
}

type AdFormData = z.infer<typeof advertSchema>;

interface AdType {
    typeId: number;
    typeName: string;
}

interface AdDetails extends Omit<AdFormData, 'files'> {
    id: string
    media: { type: string; url: string }[];
    status: 'pending' | 'approved' | 'rejected';
}

const ViewAds = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [ads, setAds] = useState<Advert>();
    const [adDetails, setAdDetails] = useState<Advert>()
    const [adTypes, setAdTypes] = useState<AdType[]>([])
    const [adTypeId, setAdTypeId] = useState(0);
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [newMedia, setNewMedia] = useState<File[]>([])
    const { register, handleSubmit, reset, watch, setValue, getValues, control, formState: { errors }, } = useForm<AdFormData>({
        resolver: zodResolver(advertSchema),
    });


    const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);
    if (!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/')
    }


    useEffect(() => {
        fetchAdDetails();
        fetchAdTypes();
    }, []);


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
            toast.success('Upload successful')
            return uploadedUrl
        } catch (err) {
            toast.error(`Upload Failed: ${err}`)
            throw err
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



    const fetchAdDetails = async () => {
        try {
            setLoading(true);

            const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_BY_ID}?adId=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (response.code === '00') {
                const data = await response.data;
                setAds(data);
                Object.keys(data).forEach((key) => {
                    setValue(key as keyof AdFormData, data[key]);
                })
            }
        } 
        catch (err) {
            setError('Failed to load ad details')
            toast.error('Failed to load ad details')
        }
        finally {
            setLoading(false)
        }
    };


    const fetchAdTypes = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_TYPE}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data: AdType[] = await response;
        if (data.length === 0) {
            if (ads) {
                setAdTypes([{
                    typeId: ads.adTypeId,
                    typeName: ads.adType,
                }]);
                const matchingAdType = data.find(adType => adType.typeName === ads?.adType);
                if (matchingAdType) {
                    setAdTypeId(matchingAdType.typeId);
                }
            }
        } else {
            setAdTypes(data);
            const matchingAdType = data.find(adType => adType.typeName === ads?.adType);
            if (matchingAdType) {
                setAdTypeId(matchingAdType.typeId);
            }
        }
      } 
      catch (err) {
        toast.error('Failed to load ad types')
      }
    }



    
    const SubmitForm = async (data: AdFormData) => {
        try {

            const selectedType = adTypes.find((type) => type.typeName === data.adType);

            if (!selectedType) {
               toast.error('Invalid type');
               return;
            }

            const typeId = selectedType.typeId;

            const media = data.files;
            let uploadedUrl = ads?.coverURL
            let thumbnailUrl = ads?.thumbnailUrl || null;

            if (media) {
                const mediaArray = Array.isArray(media) ? media : [media];

                const isNewFile = mediaArray.some((file) => file instanceof File);

                if (isNewFile) {
                    const uploadedUrls: string[] = [];
                    const thumbnails: string[] = [];

                    for (const file of mediaArray) {
                        if (!(file instanceof File)) {
                          toast.error('Invalid file selected');
                          return;
                        }

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

                    thumbnailUrl = thumbnails.length > 0 ? thumbnails[0] : null;
                    uploadedUrl = uploadedUrls[0];
                }
            }

            const updatedData = {
                name: data.adName,
                description: data.adDescription,
                redirectUrl: data.adUrl,
                adTypeId: adTypeId,
                statusId: ads?.statusId,
                coverURL: uploadedUrl,
                thumbnailUrl: thumbnailUrl,
                startDate: data.startDate,
                userId: ads?.userId,
                action: 'edit',
                adId: id
            }
    
          const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_ADS}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (response.code === '00') {
            toast.success('Ad updated successfully')
            setIsEditing(false)
            await fetchAdDetails();
            // navigate('/employer/advertisement');
          }
        }
         catch (err) {
          toast.error('Failed to update ad')
        }
    };


    if (isLoading || !ads) {
        return (
          <div className="flex justify-center items-center h-screen">
            <CircularProgress />
          </div>
        );
    }

    if (error) {
        return (
          <div className="items-center justify-center min-h-screen">
            <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/advertisement-management')} />
            <p className="text-lg font-semibold text-red-500">{error}</p>
          </div>
        )
    };

    const isAdStarted = ads.status === 'approved' && new Date(ads.startDate) <= new Date();

    const shouldRenderEditButton = ads?.status === 'Inactive' || ads?.statusId === 2;

  return (
    <div className="p-3 bg-gray-50 mb-8">
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/advertisement-management')} />
      
      <div className="bg-white p-10 shadow-md rounded-2xl transform transition-all duration-300">
        {shouldRenderEditButton && (
            <div className="flex justify-end items-center mb-4">
                <Button variant={isEditing? 'red' : 'success'} label={isEditing ? 'Cancel' : 'Edit Advert'} onClick={() => setIsEditing(!isEditing)} />
            </div>
        )}
        
        {isEditing ? (
            <form onSubmit={(e) => {e.preventDefault(); const data = getValues(); SubmitForm(data) }}>
                <Controller
                    name='adName'
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Ad Name"
                            className='my-3'
                            {...register('adName')}
                        />
                    )}
                />
                <Controller
                    name='adType'
                    control={control}
                    render={({field}) => (
                        <Input
                            label="Ad Type"
                            className='my-3'
                            {...register('adType')}
                            disabled
                        />
                    )}
                />
                 <Controller
                    name='adDescription'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <RichTextEditor
                            value={watch('adDescription')}
                            onChange={(value) => setValue('adDescription', value)}
                            placeholder='Add description for your advert'
                            maxChars={1600}
                        />
                    )}
                />
                <Controller
                    name='redirectUrl'
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Redirect URL"
                            className='mb-6'
                            {...register('redirectUrl')}
                        />
                    )}
                />
                <div className='mb-6 flex flex-col gap-3'>
                    <Controller
                        name='startDate'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker
                                label="Start Date"
                                className='mb-10'
                                value={dayjs(value)}
                                onChange={(value) => onChange(value?.toDate())}
                                disabled={isAdStarted}
                            />
                        )}
                    />
                </div>
                {/* <Controller
                    name='adType'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Select
                            label="Advert Type"
                            options={adTypes.map((type) => ({ value: type.value, label: type.label }))}
                            value={watch('adType') || ''}
                            onChange={(value: string) => {
                                if (value === "video" || value === "image") {
                                  setValue('adType', value);
                                } else {
                                  console.error(`Invalid ad type: ${value}`);
                                }
                              }}
                        />
                    )}
                /> */}
                <Controller
                    name='files'
                    control={control}
                    render={({ field: { onChange } }) => (
                        <FileUpload
                            uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                            containerClass="mt-3"
                            uploadLabel="Drag and Drop or Browse"
                            uploadRestrictionText='Max file size for video advert is 15MB, while that of images is 2MB. If your upload exceeds the limit. Use a compressor to reduce the size'
                            setFile={(files) => {
                                const fileArray = Array.isArray(files) ? files : files ? [files] : [];
                                setNewMedia(fileArray);
                                onChange(fileArray);
                            }}
                            videoUrl={ads?.coverURL}
                            imageUrl={ads?.coverURL}
                        />
                    )}
                />

                <Button
                    variant="success"
                    color="primary"
                    type='submit'
                    label='Save Changes'
                    className='mt-3'
                ></Button>
            </form>
            ) : (
                <>
                    <h1 className="text-3xl font-semibold text-gray-700 mb-4">{ads.adName}</h1>
                    <div className="mb-3">
                        <span className="font-semibold text-gray-800">Description:</span> <HtmlContent html={ads.adDescription} className="text-gray-600 text-lg leading-relaxed" />
                    </div>
                    <div className="mb-3">
                        <span className="font-semibold text-gray-800">Ad Type:</span> <span className="text-gray-600">{ads.adType}</span>
                    </div>
                    <div className="mb-3">
                        <span className="font-semibold text-gray-800">Redirect URL:</span>
                        <a href={ads.redirectUrl.startsWith('http') ? ads.redirectUrl : `https://${ads.redirectUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 underline transition duration-200 hover:text-blue-800">
                            {ads.redirectUrl}
                        </a>
                    </div>
                    <div className="mb-3">
                        <span className="font-semibold text-gray-800">Start Date:</span> <span className="text-gray-600">{formatDate(ads.startDate)}</span>
                    </div>
                    <div className="mb-3">
                        <span className="font-semibold text-gray-800">End Date:</span> <span className="text-gray-600">{formatDate(ads.endDate)}</span>
                    </div>
                    <h2 className="text-xl font-semibold mt-10 mb-6 text-gray-800">Media</h2>
                    <Grid container spacing={6}>
                        {ads.coverURL &&  (
                            <Grid item xs={12} md={6}>
                                {ads.coverURL.toLowerCase().endsWith('.mp4') ? (
                                    <video
                                        src={ads.coverURL}
                                        controls
                                        className="rounded-lg shadow-md w-full"
                                    />
                                ) : (
                                    <img
                                        src={ads.coverURL}
                                        alt="Ad Media"
                                        className="rounded-lg shadow-md w-full"
                                    />
                                )}
                            </Grid>
                        )}
                    </Grid>
                </>
            )}
      </div>

    </div>
  )
}

export default ViewAds