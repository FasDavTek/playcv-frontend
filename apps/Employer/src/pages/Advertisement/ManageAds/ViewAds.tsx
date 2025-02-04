import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Grid } from '@mui/material';
import { formatDate, handleDate } from '@video-cv/utils';
// import { fetchAdById } from './api';
import { Button, DatePicker, FileUpload, Input, RichTextEditor, Select } from '@video-cv/ui-components';
import { ArrowBack, UploadFile } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { toast } from 'react-toastify';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';
import { Controller, useForm } from 'react-hook-form';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dayjs from 'dayjs';
import { LOCAL_STORAGE_KEYS } from './../../../../../../libs/utils/localStorage';

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
    const { id } = useParams<{ id: any }>();
    const [adDetails, setAdDetails] = useState<AdDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [ads, setAds] = useState<Advert | undefined>(location.state?.ads);
    const [adTypes, setAdTypes] = useState<AdType[]>([]);
    const [adTypeId, setAdTypeId] = useState(0);
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newMedia, setNewMedia] = useState<File[]>([]);

    const { register, handleSubmit, reset, watch, setValue, getValues, control, formState: { errors }, } = useForm<AdFormData>({
        resolver: zodResolver(advertSchema),
    });

    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    if (!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/')
    }
    

    const handleFileUpload = useCallback(async (file: File) => {
        
        try {
            const fileName = `${Date.now()}-${file.name}`
            const bucketName = import.meta.env.VITE_CLOUDFLARE_R2_BUCKET

            if (!bucketName) {
            throw new Error('Bucket name is not defined in environment variables.')
            }

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


    const fetchAdDetails = async () => {
        if (!ads && id) {
            setLoading(true);
            try {
                const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_BY_ID}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (response.succeeded) {
                    const data = await response.data;
                    setAds(data)
                    reset({
                        adName: data.adName,
                        adDescription: data.adDescription,
                        adUrl: data.redirectUrl,
                        startDate: new Date(data.startDate),
                        endDate: new Date(data.endDate),
                        adType: data.adType,
                        adTypeId: data.adTypeId,
                        files: data.coverURL,
                        action: 'edit',
                        adId: data.id,
                    });
                }
            } 
            catch (err) {
                setError('Failed to load ad details')
                toast.error('Failed to load ad details')
            }
        }
        else if (ads) {
            // If ads data is already available (from location state), populate form fields
            reset({
                adName: ads.adName,
                adDescription: ads.adDescription,
                adUrl: ads.redirectUrl,
                startDate: new Date(ads.startDate),
                endDate: new Date(ads.endDate),
                adType: ads.adType,
                adTypeId: ads.adTypeId,
                action: 'edit',
                adId: ads.id,
            });
            // setValue('files', '')
        }
    }

    const fetchAdTypes = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_TYPE}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data: AdType[] = await response;
        if (data.length === 0) {
            // Fallback: Create an AdType object based on the current ad's type
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


    useEffect(() => {
        Promise.all([fetchAdDetails(), fetchAdTypes()]).finally(() => setIsLoading(false))
    }, [id, ads, reset, token]);


    const onSubmit = async (data: AdFormData) => {
        try {
            if (!ads || !id) throw new Error('Ad details are not available')

            let updatedMedia = ads.coverURL
    

            if (newMedia.length > 0) {
                const uploadedUrl = await handleFileUpload(newMedia[0]);
                updatedMedia = uploadedUrl;
            }
    
            const userBiodata = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_BIO_DATA_ID);

            const updatedData = {
                name: data.adName,
                description: data.adDescription,
                redirectUrl: data.adUrl,
                adTypeId: adTypeId,
                userId: userBiodata,
                statusId: ads.statusId,
                coverURL: updatedMedia,
                startDate: data.startDate,
                endDate: data.endDate,
                action: 'edit',
                adId: id
            }
    
          const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_ADS}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (response.code === '00') {
            toast.success('Ad updated successfully')
            setIsEditing(false)
            //   setAdDetails(response)
            //   reset(updatedData)
            // setNewMedia([]);
            await fetchAdDetails();
            navigate('/employer/advertisement');
          }
        }
         catch (err) {
          toast.error('Failed to update ad')
        }
    }


    if (loading || !ads) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }
    
    if (error || !ads) {
        return (
            <div className="items-center justify-center min-h-screen">
                <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/employer/advertisement')} />
                <p className="text-center text-red-500">{error || 'Ad not found'}</p>;
            </div>
        ) 
    };

    const isAdStarted = ads.status === 'Approved' && new Date(ads.startDate) <= new Date();

    if (!ads || !ads.coverURL) {
        return <div>No ad data available</div>
    }

  return (
    <div className="p-6 bg-gray-50 mb-8">
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/employer/advertisement')} />
      
      <div className="bg-white p-10 shadow-md rounded-2xl transform transition-all duration-300">
        <div className="flex justify-end items-center mb-4">
            <Button variant={isEditing? 'red' : 'success'} label={isEditing ? 'Cancel' : 'Edit Advert'} onClick={() => setIsEditing(!isEditing)} />
        </div>
        
        {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name='adName'
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Ad Name"
                            className='my-3'
                            {...field}
                        />
                    )}
                />
                <Controller
                    name='adDescription'
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <RichTextEditor
                            value={value}
                            onChange={onChange}
                            placeholder='Add description for your advert'
                        />
                    )}
                />
                <Controller
                    name='adUrl'
                    control={control}
                    render={({ field }) => (
                        <Input
                            label="Redirect URL"
                            className='mb-6'
                            {...field}
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
                    
                    <Controller
                        name='endDate'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <DatePicker
                                label="End Date"
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
                    render={({ field }) => (
                        <Select
                            name="adType"
                            control={control}
                            defaultValue={adTypes.find(type => type.value === adDetails.adType) || null}
                            options={adTypes}
                            handleChange={(newValue) => field.onChange(newValue?.value)}
                            errors={errors}
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
                            uploadRestrictionText="Accepted formats: images, videos (max size: 8MB)"
                            setFile={(files) => {
                                const fileArray = Array.isArray(files) ? files : files ? [files] : [];
                                setNewMedia(fileArray);
                                onChange(fileArray);
                            }}
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
                    <span className="font-semibold text-gray-800">Description:</span> <span className="text-gray-600 text-lg leading-relaxed">{ads.adDescription}</span>
                </div>
                <div className="mb-3">
                    <span className="font-semibold text-gray-800">Ad Type:</span> <span className="text-gray-600">{ads.adType}</span>
                </div>
                <div className="mb-3">
                    <span className="font-semibold text-gray-800">Redirect URL:</span>
                    <a href={ads.redirectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 underline transition duration-200 hover:text-blue-800">
                        {ads.redirectUrl}
                    </a>
                </div>
                <div className="mb-3">
                    <span className="font-semibold text-gray-800">Start Date:</span> <span className="text-gray-600">{handleDate(ads.startDate)}</span>
                </div>
                <div className="mb-3">
                    <span className="font-semibold text-gray-800">End Date:</span> <span className="text-gray-600">{handleDate(ads.endDate)}</span>
                </div>
                <h2 className="text-xl font-semibold mt-10 mb-6 text-gray-800">Media</h2>
                <Grid container spacing={4}>
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