import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { Button, FileUpload, Input, RichTextEditor, Select, TextArea, } from '@video-cv/ui-components';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { UploadFile } from '@mui/icons-material';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
      secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
});

interface AdTypeItem {
    id?: number;
    name: string;
    typeDescription: string;
    price: number;
    coverUrl: string;
    thumbnailUrl?: string;
    dateCreated?: string;
    dateUpdated?: string;
    createdBy?: string;
    status?: string;
    action: 'create' | 'edit';
}
  
interface VideoUploadTypeItem {
    id?: number;
    typeId?: number;
    name: string;
    shortName: string;
    description: string;
    coverUrl: string;
    thumbnailUrl?: string;
    uploadPrice: number;
    transactionFee: number;
    buyPrice: number;
    dateCreated?: string;
    dateUpdated?: string;
    createdBy?: string;
    active: boolean;
    status?: string;
    action: 'create' | 'edit';
}

type PriceItem = AdTypeItem | VideoUploadTypeItem;

const statusOptions = [
    { value: 'true', label: 'Activate' },
    { value: 'false', label: 'Suspend' },
];

interface PriceProps {
    open: boolean;
    onClose: () => void;
    currentTab: 'videoUploadTypes' | 'adsTypes' | 'buyVideoTypes';
    modalType: 'add' | 'edit';
    item?: Partial<PriceItem> | null;
    currentUser: string;
    onSubmitSuccess: () => void
}

const Price: React.FC<PriceProps> = ({ open, onClose, modalType, item = null, currentTab, currentUser, onSubmitSuccess, }) => {
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [action, setAction] = useState<'create' | 'edit'>('create');

    const { register, control, watch, handleSubmit, setValue, reset, formState: { errors } } = useForm<PriceItem>({});

    useEffect(() => {
        if (item) {
          Object.entries(item).forEach(([key, value]) => {
            if (value !== undefined) {
              if (typeof value === 'string') {
                setValue(key as keyof PriceItem, value);
              } else if (typeof value === 'number') {
                setValue(key as keyof VideoUploadTypeItem, value);
              } else if (typeof value === 'boolean') {
                setValue('active' as keyof VideoUploadTypeItem, value);
              }
            }
          });
        }
    }, [item, setValue]);

    useEffect(() => {
        if (item) {
            reset(item);
        } else {
            reset({});
        }
    }, [item, reset]);

    if (!open) return null;

    // const currentType = watch('type');

    const tabOptions = {
        videoUploadTypes: [{ label: 'Pinned Video', value: 'pinned' }, { label: 'Regular Video', value: 'regular' }],
        adsTypes: [{ label: 'Video Ads', value: 'videoAds' }, { label: 'Image Ads', value: 'imageAds' }],
        buyVideoTypes: [{ label: 'Pinned Video', value: 'pinned' }, { label: 'Regular Video', value: 'regular' }]
    };

    const options = tabOptions[currentTab];

    const handleImageUpload = async (file: File) => {
    
        try {
          const fileName = `${Date.now()}-${file.name}`;
          const bucketName = import.meta.env.VITE_CLOUDFLARE_R2_BUCKET;
    
          const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: file,
            ContentType: file.type,
          });
    
          await s3Client.send(command);
          const uploadedUrl = `https://${import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_DOMAIN}/${fileName}`;
          return uploadedUrl;
        } 
        catch (err) {
          toast.error(`Image upload failed: ${err}`);
          console.error('Upload failed:', err);
          throw err;
        }
    };


    
    const onSubmit = async (data: PriceItem) => {
        setIsLoading(true)
        try {
          let thumbnailUrl = data.thumbnailUrl;
          if (thumbnailFile) {
              thumbnailUrl = await handleImageUpload(thumbnailFile);
          }

          const now = new Date().toISOString();

          const priceData = {
              ...data,
              thumbnailUrl: thumbnailUrl,
              action: modalType === 'add' ? 'create' : 'edit',
              createdBy: modalType === 'add' ? currentUser : data.createdBy,
              ...(currentTab === 'videoUploadTypes' ? { typeId: data?.id } : { id: data?.id, typeName: data.name }),
          }
          const endpoint = currentTab === 'videoUploadTypes' ? apiEndpoints.CREATE_VIDEO_TYPE : apiEndpoints.CREATE_AD_TYPE
          const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, priceData)
          if (response.code === "00") {
              toast.success(`${modalType === 'add' ? 'Added' : 'Updated'} successfully`)
              onSubmitSuccess();
              onClose()
          } else {
              throw new Error('Failed to save')
          }
        } 
        catch (error) {
          console.error('Error saving:', error)
          toast.error('Failed to save. Please try again.')
        }
        finally {
          setIsLoading(false)
        }
    };


    
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 lg:p-14 centered-modal rounded-lg">
        <h3 className="text-center font-bold text-xl">
            {modalType === 'edit' ? `Edit ${currentTab === 'videoUploadTypes' ? 'Video Upload' : 'Ad'} Type` : `Add ${currentTab === 'videoUploadTypes' ? 'Video Upload' : 'Ad'} Type`}
        </h3>
        <div className="my-5 flex flex-col gap-5">
            {/* <Controller
                name="itemName"
                control={control}
                rules={{ required: 'Item name is required' }}
                render={({ field: { onChange, value } }) => (
                    <Input
                        label="Item Name"
                        value={value}
                        onChange={onChange}
                        placeholder="Enter item name"
                    />
                )}
            /> */}
            
            {/* <Controller
                name={currentTab === 'videoUploadTypes' ? 'name' : 'typeName' }
                control={control}
                rules={{ required: 'Type (name) is required' }}
                render={({ field }) => (
                    
                )}
            /> */}
            {currentTab === 'videoUploadTypes' && (
                <>
                    <Input
                        label={`Video Upload Type`}
                        {...register(`name`)}
                        placeholder="Enter vdieo type name"
                    />
                    <Controller
                        name='shortName'
                        control={control}
                        rules={{ required: 'Short name is required' }}
                        render={({ field }) => (
                            <Input
                                label='Short Name'
                                {...register('shortName')}
                                placeholder="Enter short name"
                            />
                        )}
                    />
                    <Controller
                        name="uploadPrice"
                        control={control}
                        rules={{ required: 'Amount is required' }}
                        render={({ field }) => (
                            <Input
                                label={`Video Upload Price`}
                                {...register('uploadPrice')}
                                type="number"
                                placeholder={`Enter video upload price`}
                            />
                        )}
                    />
                    <Controller
                        name="buyPrice"
                        control={control}
                        rules={{ required: 'Amount is required' }}
                        render={({ field }) => (
                            <Input
                                label={`Buy Video Price`}
                                {...register('buyPrice')}
                                type="number"
                                placeholder={`Enter buy price`}
                            />
                        )}
                    />
                    <Controller
                        name="transactionFee"
                        control={control}
                        rules={{ required: 'Amount is required' }}
                        render={({ field }) => (
                            <Input
                                label={`Transaction Fee`}
                                {...register('transactionFee')}
                                type="number"
                                placeholder={`Enter Transaction fee`}
                            />
                        )}
                    />
                </>
            )}
            {currentTab === 'adsTypes' && (
                <>
                    <Input
                        label={`Ad Upload Type`}
                        {...register(`name`)}
                        placeholder="Enter ad type name"
                    />
                    <Controller
                        name="price"
                        control={control}
                        rules={{ required: 'Amount is required' }}
                        render={({ field }) => (
                            <Input
                                label={`Ad Upload Price`}
                                {...register('price')}
                                type="number"
                                placeholder={`Enter ad upload price`}
                            />
                        )}
                    />
                </>
            )}
            {/* <Controller
                name="status"
                control={control}
                render={({ field }) => (
                    <Select
                        name='status'
                        options={statusOptions}
                        control={control}
                        placeholder="Select Status"
                        defaultValue={field.value}
                        handleChange={(newValue) => field.onChange(newValue)}
                        label={`${currentTab === 'videoUploadTypes' ? 'Video Upload' : currentTab === 'adsTypes' ? 'Ad' : 'Buy Video'} Status`}
                    />
                )}
            /> */}
            <label>{currentTab === 'videoUploadTypes' ? 'Video Upload Description' : 'Ad Description'}</label>
            <Controller
                name={currentTab === 'videoUploadTypes' ? 'description' : 'typeDescription'}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder={`Enter description for ${currentTab === 'videoUploadTypes' ? 'Video Upload Type' : 'Ad Type'}`}
                    />
                )}
            />
            <Controller
                name='coverUrl'
                control={control}
                render={({ field: { onChange } }) => (
                    <FileUpload
                        uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                        containerClass=""
                        uploadLabel="Drag and Drop or Browse"
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
                type="submit"
                variant='black'
                className="w-full"
                label={isLoading ? 'Processing...' : (modalType === 'edit' ? 'Update' : 'Add')}
                disabled={isLoading}
            />
        </div>
    </form>
  )
}

export default Price