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
    id?: string;
    typeName: string;
    typeDescription: string;
    thumbnailUrl?: string;
    dateCreated?: string;
    dateUpdated?: string;
    createdBy?: string;
    status?: string;
    action: 'create' | 'edit';
  }
  
  interface VideoUploadTypeItem {
    typeId?: string;
    name: string;
    shortName: string;
    description: string;
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
}

const Price: React.FC<PriceProps> = ({ open, onClose, modalType, item = null, currentTab, currentUser, }) => {
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [action, setAction] = useState<'create' | 'edit'>('create');

    const { register, control, watch, handleSubmit, setValue, formState: { errors } } = useForm<PriceItem>({
        defaultValues: {
            // itemName: item?.itemName ?? '',
            action: modalType === 'add' ? "create" : "edit",
            status: 'Active',
        }
    });

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

    if (!open) return null;

    // const currentType = watch('type');

    const tabOptions = {
        videoUploadTypes: [{ label: 'Pinned Video', value: 'pinned' }, { label: 'Regular Video', value: 'regular' }],
        adsTypes: [{ label: 'Video Ads', value: 'videoAds' }, { label: 'Image Ads', value: 'imageAds' }],
        buyVideoTypes: [{ label: 'Pinned Video', value: 'pinned' }, { label: 'Regular Video', value: 'regular' }]
    };

    const options = tabOptions[currentTab];

    const handleImageUpload = async (file: File) => {
        if (!file) throw new Error('File is not defined.');
    
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
                dateCreated: modalType === 'add' ? now : data.dateCreated,
                dateUpdated: modalType === 'edit' ? now : undefined,
                createdBy: modalType === 'add' ? currentUser : data.createdBy,
                active: data.status === 'Active',
            }
          const endpoint = currentTab === 'videoUploadTypes' ? apiEndpoints.CREATE_VIDEO_TYPE : apiEndpoints.CREATE_AD_TYPE
          const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, priceData)
          if (response.code === "00") {
            toast.success(`${modalType === 'add' ? 'Added' : 'Updated'} successfully`)
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
            <Controller
                name={currentTab === 'videoUploadTypes' ? 'name' : 'typeName' }
                control={control}
                rules={{ required: 'Type (name) is required' }}
                render={({ field }) => (
                    <Input
                        label={`${currentTab === 'videoUploadTypes' ? 'Video Upload' : 'Ad'} Type`}
                        {...register(`${currentTab === 'videoUploadTypes' ? 'name' : 'typeName'}`)}
                        placeholder="Enter type name"
                    />
                )}
            />
            {currentTab === 'videoUploadTypes' && (
                <>
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
            <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Select
                        label={`${currentTab === 'videoUploadTypes' ? 'Video Upload' : currentTab === 'adsTypes' ? 'Ad' : 'Buy Video'} Status`}
                        options={statusOptions}
                        value={value || ''}
                        onChange={(newValue: string) => onChange(newValue)}
                    />
                )}
            />
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
            <FileUpload
                uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                containerClass=""
                uploadLabel="Drag and Drop or Browse"
                setFile={(files: File | File[] | null) => {
                if (files) {
                    if (Array.isArray(files)) {
                    handleImageUpload(files[0]);
                    } else {
                    handleImageUpload(files);
                    }
                }
                }}
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