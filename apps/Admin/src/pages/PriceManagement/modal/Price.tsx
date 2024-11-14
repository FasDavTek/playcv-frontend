import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, RichTextEditor, Select, TextArea, } from '@video-cv/ui-components';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';

interface PriceItem {
    // itemName?: string;
    id?: string;
    price?: string;
    description?: string;
    type?: any;
    status?: string;
}

const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Rejected', label: 'Rejected' },
];

interface PriceProps {
    open: boolean;
    onClose: () => void;
    currentTab: 'videoUploadTypes' | 'adsTypes' | 'buyVideoTypes';
    modalType: 'add' | 'edit';
    item?: Partial<PriceItem> | null;
}

const Price: React.FC<PriceProps> = ({ open, onClose, modalType, item = null, currentTab, }) => {
    const { register, control, watch, handleSubmit, setValue, formState: { errors } } = useForm<PriceItem>({
        defaultValues: {
            // itemName: item?.itemName ?? '',
            id: item?.id ?? undefined,
            price: item?.price ?? '',
            description: item?.description ?? '',
            type: item?.type ?? '',
            status: item?.status ?? '',
        }
    });

    useEffect(() => {
        if (item) {
          Object.entries(item).forEach(([key, value]) => {
            setValue(key as keyof PriceItem, value)
          })
        }
    }, [item, setValue]);

    if (!open) return null;

    const currentType = watch('type');

    const tabOptions = {
        videoUploadTypes: [{ label: 'Pinned Video', value: 'pinned' }, { label: 'Regular Video', value: 'regular' }],
        adsTypes: [{ label: 'Video Ads', value: 'videoAds' }, { label: 'Image Ads', value: 'imageAds' }],
        buyVideoTypes: [{ label: 'Pinned Video', value: 'pinned' }, { label: 'Regular Video', value: 'regular' }]
    };

    const options = tabOptions[currentTab];



    const onSubmit = async (data: PriceItem) => {
        try {
          const endpoint = currentTab === 'videoUploadTypes' ? apiEndpoints.CREATE_VIDEO_TYPE : apiEndpoints.CREATE_AD_TYPE
          const response = await postData(`${CONFIG.BASE_URL}${endpoint}`, data)
          if (response.ok) {
            toast.success(`${modalType === 'add' ? 'Added' : 'Updated'} successfully`)
            onClose()
          } else {
            throw new Error('Failed to save')
          }
        } catch (error) {
          console.error('Error saving:', error)
          toast.error('Failed to save. Please try again.')
        }
    }


    
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
                name="type"
                control={control}
                rules={{ required: 'Type is required' }}
                render={({ field: { onChange, value } }) => (
                    modalType === 'add' ? (
                        <Input
                            label={`${currentTab === 'videoUploadTypes' ? 'Video Upload' : currentTab === 'adsTypes' ? 'Ad' : 'Buy Video'} Type`}
                            value={value}
                            onChange={onChange}
                            placeholder="Enter type"
                        />
                    ) : (
                        <Select
                            label={`${currentTab === 'videoUploadTypes' ? 'Video Upload' : currentTab === 'adsTypes' ? 'Ad' : 'Buy Video'} Type`}
                            options={options}
                            value={value || ''}
                            onChange={(newValue: string) => onChange(newValue)}
                        />
                    )
                )}
            />
            <Controller
                name="price"
                control={control}
                rules={{ required: 'Amount is required' }}
                render={({ field }) => (
                    <Input
                        label={`${currentTab} Price`}
                        value={field.value === '' ? '' : field.value}
                        onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : parseFloat(value));
                        }}
                        type="number"
                        placeholder={`Enter ${currentTab} price`}
                    />
                )}
            />
            {modalType === "edit" && (
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
            <label>{`${currentTab === 'videoUploadTypes' ? 'Video Upload' : currentTab === 'adsTypes' ? 'Ad' : 'Buy Video'} Description`}</label>
            <Controller
                name="description"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <RichTextEditor
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder={`Enter description for ${currentType}`}
                    />
                )}
            />
            <Button
                type="submit"
                variant='black'
                className="w-full"
                label={modalType === 'edit' ? 'Update' : 'Add'}
            />
        </div>
    </form>
  )
}

export default Price