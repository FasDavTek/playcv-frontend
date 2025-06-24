import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { formatDate } from '@video-cv/utils';
// import { fetchAdById } from './api';
import dayjs from 'dayjs';
import { Button, DatePicker, FileUpload, Input, RichTextEditor, Select, TextArea, VideoUploadWidget } from '@video-cv/ui-components';
import { ArrowBack, UploadFile } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { advertSchema } from './../../../../video-cv/src/schema/formValidations/Advert.schema';
import { toast } from 'react-toastify';

type AdDetails = {
    id: string;
    adName: string;
    description: string;
    adType: string;
    adUrl: string;
    startDate: string;
    endDate: string;
    media: { type: string; url: string }[];
};

type State = {
    adDetails: AdDetails | null;
    loading: boolean;
    isEditing: boolean;
    error: string | null;
    isUploading: boolean;
    uploadUrls: string[];
    newMedia: { type: string; url: string }[];
};

type FileUploadProps = {
  setFile?: (files: File[] | File | null) => void;
  // other props
};

type faqType = z.infer<typeof advertSchema>;

const options = [
  { value: 'video', label: 'Video' },
  { value: 'image', label: 'Image' },
];

const ManageAdvertisement = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [state, setState] = useState<State>({
        adDetails: location.state?.ad || {
            id: '',
            adName: '',
            description: '',
            adType: '',
            adUrl: '',
            startDate: '',
            endDate: '',
            media: []
          },
        loading: true,
        isEditing: false,
        error: null,
        isUploading: false,
        uploadUrls: [],
        newMedia: [],
    });
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm<faqType>({
        resolver: zodResolver(advertSchema),
    });
    console.log(state);
    console.log('errors', errors);

    useEffect(() => {
        if (state.adDetails) {
            setState(prev => ({ ...prev, loading: false }));
            // Set the initial values of the fields
            setValue('adName', state.adDetails.adName);
            setValue('adDescription', state.adDetails.description);
            setValue('adUrl', state.adDetails.adUrl);
            setValue('startDate', state.adDetails.startDate);
            setValue('adType', state.adDetails.adType && state.adDetails.adType.toLowerCase() === 'image' ? 'image' : 'video');
        }
    }, [state.adDetails, setValue, id]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         if (editedAdDetails) {
//             setEditedAdDetails({
//                 ...editedAdDetails,
//                 [e.target.name]: e.target.value,
//             });
//         }
//     };

//     const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (editedAdDetails) {
//             setEditedAdDetails({
//                 ...editedAdDetails,
//                 adType: e.target.checked ? 'Video' : 'Image',
//             });
//         }
//     };

//     const handleSaveChanges = () => {
//       if (editedAdDetails) {
//           setAdDetails({
//               ...editedAdDetails,
//               media: [...(adDetails?.media || []), ...newMedia]
//           });
//           setIsEditing(false);
//           // Here you would normally send the updated details to the server
//       }
//   };


    if (state.loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (!state.adDetails) {
        return <p className="text-center text-red-500">Ad not found</p>;
    }

    if (state.error) return <Typography color="error">{state.error}</Typography>;

  const handleFileUpload = async (data: faqType) => {
    try {
        toast.info('Uploading files...');
        setState(prev => ({ ...prev, isUploading: true }));
        
        if (data.files) {
          const newFiles = Array.isArray(data.files) ? data.files : [data.files];
          const uploadedUrls = await Promise.all(
            newFiles.map(async (file) => {
              const resourceType = file.type.startsWith('image') ? 'image' : 'video';
              const url = await VideoUploadWidget({ 
                file,
                resourceType,
                context: {
                  adName: state.adDetails?.adName,
                  advertType: state.adDetails?.adType,
                  adRedirectURL: state.adDetails?.adUrl,
                  startDate: state.adDetails?.startDate,
                  endDate: state.adDetails?.endDate,
                  description: state.adDetails?.description,
                },
              });
              console.log(url);
              return url;
            })
          );
          setState(prev => ({
            ...prev,
            uploadUrls: [...prev.uploadUrls, ...uploadedUrls],
            isUploading: false,
            isEditing: false,
          }));
          toast.success('Files uploaded successfully!');
        }
      } catch (err) {
        setState(prev => ({ ...prev, isUploading: false }));
        toast.error(`Error: ${err}`);
        console.log('Error during file upload:', err);
      }
  };

  return (
    <div className="p-6 bg-gray-50 mb-8">
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/employer/advertisement')} />
      
      <div className="bg-white p-10 shadow-lg rounded-2xl transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-end items-center mb-4">
            <Button variant={state.isEditing? 'red' : 'success'} label={state.isEditing ? 'Cancel' : 'Edit Advert'} onClick={() => setState(prev => ({ ...prev, isEditing: !prev.isEditing }))} />
        </div>
        
        {state.isEditing ? (
            <form onSubmit={handleSubmit(handleFileUpload)}>
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
                                    onChange={(value) => onChange(value)}
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
                                options={options}
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
                                uploadRestrictionText="Accepted formats: images, videos (max size: 8MB)"
                                setFile={(files) => {
                                    console.log('Files received by FileUpload:', files);
                                    const fileArray = Array.isArray(files) ? files : files ? [files] : [];
                                    console.log('Selected files:', fileArray);
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
                    <h1 className="text-3xl font-semibold text-gray-700 mb-4">{state.adDetails.adName}</h1> 
                    <div className="mb-3">
                      <span className="font-semibold text-gray-800">Description:</span> <span className="text-gray-600 text-lg leading-relaxed">{state.adDetails.description}</span>
                    </div>
                    <div className="mb-3">
                        <span className="font-semibold text-gray-800">Ad Type:</span> <span className="text-gray-600">{state.adDetails.adType}</span>
                    </div>
                    <div className="mb-3">
                        <span className="font-semibold text-gray-800">Redirect URL:</span>
                        <a href={state.adDetails.adUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 underline transition duration-200 hover:text-blue-800">
                            {state.adDetails.adUrl}
                        </a>
                    </div>
                    <div className="mb-3">
                        <span className="font-semibold text-gray-800">Start Date:</span> <span className="text-gray-600">{formatDate(state.adDetails.startDate)}</span>
                    </div>
                    <div className="mb-3">
                        <span className="font-semibold text-gray-800">End Date:</span> <span className="text-gray-600">{formatDate(state.adDetails.endDate)}</span>
                    </div>
                    <h2 className="text-2xl font-semibold mt-10 mb-6 text-gray-800">Media</h2>
                    <Grid container spacing={4}>
                        {[...(state.adDetails.media ? state.adDetails.media : []), ...state.newMedia].map((item, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                {item.type === 'image' ? (
                                    <img
                                        src={item.url}
                                        alt={`Ad Media ${index + 1}`}
                                        className="rounded-lg shadow-md"
                                    />
                                ) : (
                                    <video
                                        src={item.url}
                                        controls
                                        className="rounded-lg shadow-md"
                                    />
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
      </div>

    </div>
  )
}

export default ManageAdvertisement
