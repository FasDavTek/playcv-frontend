import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Select, } from '@video-cv/ui-components';
import { toast } from 'react-toastify';

interface IForm {
    amount?: number;
    type?: any;
}

interface PriceProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: IForm) => void;
    currentTab: string;
    modalType: 'add' | 'edit';
    item?: IForm | null;
}

const Price = ({ open, onClose, onSubmit = () => {}, modalType, item = null, currentTab, }: PriceProps) => {
    const { register, control, handleSubmit, setValue } = useForm<IForm>();

    const [amount, setAmount] = useState<number | undefined>(item?.amount || 0);
    const [type, setType] = useState<string>(item?.type || '');
    const [pinnedVideoPrice, setPinnedVideoPrice] = useState<number | undefined>();
    const [regularVideoPrice, setRegularVideoPrice] = useState<number | undefined>();
    const [videoAdsPrice, setVideoAdsPrice] = useState<number | undefined>();
    const [imageAdsPrice, setImageAdsPrice] = useState<number | undefined>();
    const [buyVideoPrice, setBuyVideoPrice] = useState<number | undefined>();

    useEffect(() => {
    if (item) {
        setValue('amount', item?.amount || 0);
        setAmount(item.amount);
        setType(item.type);
    }
    }, [item, setValue, setAmount, setType]);
    
    if (!open) return null;


    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(value);
    };


    const handleSave = () => {
        if (pinnedVideoPrice !== undefined) {
            const formattedPinnedPrice = formatCurrency(pinnedVideoPrice);
            localStorage.setItem('pinnedVideoPrice', formattedPinnedPrice);
        }
    
        if (regularVideoPrice !== undefined) {
            const formattedRegularPrice = formatCurrency(regularVideoPrice);
            localStorage.setItem('regularVideoPrice', formattedRegularPrice);
        }
    
        if (videoAdsPrice !== undefined) {
            const formattedAdsPrice = formatCurrency(videoAdsPrice);
            localStorage.setItem('adsPrice', formattedAdsPrice);
        }
    
        if (imageAdsPrice !== undefined) {
          const formattedAdsPrice = formatCurrency(imageAdsPrice);
          localStorage.setItem('adsPrice', formattedAdsPrice);
      }
    
        if (buyVideoPrice !== undefined) {
            const formattedBuyPrice = formatCurrency(buyVideoPrice);
            localStorage.setItem('buyVideoPrice', formattedBuyPrice);
        }
    
        console.log({
            pinnedVideoPrice: formatCurrency(pinnedVideoPrice || 0),
            regularVideoPrice: formatCurrency(regularVideoPrice || 0),
            videoAdsPrice: formatCurrency(videoAdsPrice || 0),
            imageAdsPrice: formatCurrency(imageAdsPrice || 0),
            buyVideoPrice: formatCurrency(buyVideoPrice || 0),
        });
    
        toast.success('Prices saved successfully!');
    
        setPinnedVideoPrice(0);
        setRegularVideoPrice(0);
        setVideoAdsPrice(0);
        setImageAdsPrice(0);
        setBuyVideoPrice(0);
        onClose();
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setAmount(isNaN(value) ? 0 : value);
    };

    const tabOptions = {
        videoUploadPrices: [{ label: 'Pinned Video', value: 'pinned' }, { label: 'Regular Video', value: 'regular' }],
        adsPrices: [{ label: 'Video Ads', value: 'videoAds' }, { label: 'Image Ads', value: 'imageAds' }],
        buyVideoPrices: [{ label: 'Pinned Video', value: 'pinned' }, { label: 'Regular Video', value: 'regular' }]
    };

    const options = currentTab === 'videoUploadPrices'  ? tabOptions.videoUploadPrices  : currentTab === 'adsPrices'  ? tabOptions.adsPrices  : tabOptions.buyVideoPrices;
    
  return (
    <form onSubmit={handleSave} className="bg-white p-10 lg:p-14 centered-modal-md rounded-lg">
        <h3 className="text-center font-bold text-xl">{modalType === 'edit' ? 'Edit Price' : 'Add Price'}</h3>
        <div className="my-5 flex flex-col gap-5">
            <Input
                label={`${currentTab === 'videoUploadPrices' ? 'Video Upload' : currentTab === 'adsPrices' ? 'Ad' : 'Buy Video'} Amount`}
                value={amount}
                onChange={handleAmountChange}
                // error={}
            />
            <Controller
                name="type"
                control={control}
                rules={{ required: 'Type is required' }}
                render={({ field }) => (
                    <Select
                        label={`${currentTab === 'videoUploadPrices' ? 'Video Upload' : currentTab === 'adsPrices' ? 'Ad' : 'Buy Video'} Type`}
                        id="role"
                        placeholder="Select type"
                        containerClass="flex-1"
                        options={(currentTab === 'videoUploadPrices' ? tabOptions.videoUploadPrices : currentTab === 'adsPrices' ? tabOptions.adsPrices : tabOptions.buyVideoPrices) || []}
                        // onChange={(e: any) => console.log('e', e)}
                        {...{ field }}
                    />
                )}
            />
            <Button
            onClick={() => {}}
            type="submit"
            variant='black'
            className="w-full"
            label={modalType === 'edit' ? 'Edit Price' : 'Add Price'}
            />
        </div>
    </form>
  )
}

export default Price