import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, RichTextEditor, Select, TextArea, } from '@video-cv/ui-components';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill';

interface IForm {
    // itemName?: string;
    amount?: number;
    description?: string;
    type?: any;
}

interface PriceProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: IForm) => void;
    currentTab: 'videoUploadPrices' | 'adsPrices' | 'buyVideoPrices';
    modalType: 'add' | 'edit';
    item?: Partial<IForm> | null;
}

const Price = ({ open, onClose, onSubmit = () => {}, modalType, item =                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               null, currentTab, }: PriceProps) => {
    const { register, control, watch, handleSubmit, setValue } = useForm<IForm>(
        {
            defaultValues: {
                // itemName: item?.itemName ?? '',
                amount: item?.amount ?? 0,
                description: item?.description ?? '',
                type: item?.type ?? ''
            }
        }
    );

    const [isSaving, setIsSaving] = useState(false);
    const [localModalType, setLocalModalType] = useState(modalType);

    useEffect(() => {
        setLocalModalType(modalType);
        console.log(localModalType)
    }, [modalType]);

    // const [amount, setAmount] = useState<number | undefined>(item?.amount || 0);
    // const [type, setType] = useState<string>(item?.type || '');
    // const [pinnedVideoPrice, setPinnedVideoPrice] = useState<number | undefined>();
    // const [regularVideoPrice, setRegularVideoPrice] = useState<number | undefined>();
    // const [videoAdsPrice, setVideoAdsPrice] = useState<number | undefined>();
    // const [imageAdsPrice, setImageAdsPrice] = useState<number | undefined>();
    // const [buyVideoPrice, setBuyVideoPrice] = useState<number | undefined>();

    const currentType = watch('type');

    useEffect(() => {
        if (item) {
            // setValue('itemName', item.itemName ?? '');
            setValue('amount', item?.amount ?? 0);
            setValue('description', item.description ?? '');
            setValue('type', item.type ?? '');
            // setAmount(item.amount);
            // setType(item.type);
        }
    }, [item, setValue, /* setAmount, setType */ ]);
    
    if (!open) return null;


    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
    };


    // const handleSave = () => {
    //     if (pinnedVideoPrice !== undefined) {
    //         const formattedPinnedPrice = formatCurrency(pinnedVideoPrice);
    //         localStorage.setItem('pinnedVideoPrice', formattedPinnedPrice);
    //     }
    
    //     if (regularVideoPrice !== undefined) {
    //         const formattedRegularPrice = formatCurrency(regularVideoPrice);
    //         localStorage.setItem('regularVideoPrice', formattedRegularPrice);
    //     }
    
    //     if (videoAdsPrice !== undefined) {
    //         const formattedAdsPrice = formatCurrency(videoAdsPrice);
    //         localStorage.setItem('adsPrice', formattedAdsPrice);
    //     }
    
    //     if (imageAdsPrice !== undefined) {
    //       const formattedAdsPrice = formatCurrency(imageAdsPrice);
    //       localStorage.setItem('adsPrice', formattedAdsPrice);
    //   }
    
    //     if (buyVideoPrice !== undefined) {
    //         const formattedBuyPrice = formatCurrency(buyVideoPrice);
    //         localStorage.setItem('buyVideoPrice', formattedBuyPrice);
    //     }
    
    //     console.log({
    //         pinnedVideoPrice: formatCurrency(pinnedVideoPrice || 0),
    //         regularVideoPrice: formatCurrency(regularVideoPrice || 0),
    //         videoAdsPrice: formatCurrency(videoAdsPrice || 0),
    //         imageAdsPrice: formatCurrency(imageAdsPrice || 0),
    //         buyVideoPrice: formatCurrency(buyVideoPrice || 0),
    //     });
    
    //     toast.success('Prices saved successfully!');
    
    //     setPinnedVideoPrice(0);
    //     setRegularVideoPrice(0);
    //     setVideoAdsPrice(0);
    //     setImageAdsPrice(0);
    //     setBuyVideoPrice(0);
    //     onClose();
    // };

    const handleSave = handleSubmit((data: IForm) => {
        setIsSaving(true);
        Promise.resolve()
        .then(() => {
        console.log('Form data:', data);
        console.log({
            // itemName: data.itemName,
            amount: formatCurrency(data.amount || 0),
            type: data.type,
            description: data.description,
        });
        toast.success('Prices saved successfully!');
        onSubmit(data);
        })
        .finally(() => setIsSaving(false));
    });

    // const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = parseFloat(e.target.value);
    //     setAmount(isNaN(value) ? 0 : value);
    // };

    const tabOptions = {
        videoUploadPrices: [{ label: 'Pinned Video', value: 'pinned' }, { label: 'Regular Video', value: 'regular' }],
        adsPrices: [{ label: 'Video Ads', value: 'videoAds' }, { label: 'Image Ads', value: 'imageAds' }],
        buyVideoPrices: [{ label: 'Pinned Video', value: 'pinned' }, { label: 'Regular Video', value: 'regular' }]
    };

    const options = tabOptions[currentTab];
    
  return (
    <form onSubmit={handleSave} className="bg-white p-10 lg:p-14 centered-modal rounded-lg">
        <h3 className="text-center font-bold text-xl">{localModalType === 'edit' ? 'Edit Price' : 'Add Price'}</h3>
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
                            label={`${currentTab === 'videoUploadPrices' ? 'Video Upload' : currentTab === 'adsPrices' ? 'Ad' : 'Buy Video'} Type`}
                            value={value}
                            onChange={onChange}
                            placeholder="Enter type"
                        />
                    ) : (
                        <Select
                            label={`${currentTab === 'videoUploadPrices' ? 'Video Upload' : currentTab === 'adsPrices' ? 'Ad' : 'Buy Video'} Type`}
                            options={options}
                            value={value || ''}
                            onChange={(newValue: string) => onChange(newValue)}
                        />
                    )
                )}
            />
            <Controller
                name="amount"
                control={control}
                rules={{ required: 'Amount is required' }}
                render={({ field }) => (
                    <Input
                    label={`${currentType || 'Price'} Price`}
                        value={field.value}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        type="number"
                        placeholder="Enter price amount"
                    />
                )}
            />
            <label>{`${currentTab === 'videoUploadPrices' ? 'Video Upload' : currentTab === 'adsPrices' ? 'Ad' : 'Buy Video'} Description`}</label>
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
                onClick={() => {}}
                type="submit"
                variant='black'
                className="w-full"
                label={localModalType === 'edit' ? 'Edit Price' : 'Add Price'}
                disabled={isSaving}
                loading={isSaving}
            />
        </div>
    </form>
  )
}

export default Price