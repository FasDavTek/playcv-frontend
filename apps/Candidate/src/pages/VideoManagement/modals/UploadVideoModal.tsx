import { useState } from 'react';

import { useForm } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';

import {
  Button,
  Input,
  TextArea,
  FileUpload,
  SelectChip,
  Select,
} from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface IForm {
  name: string;
  description: string;
  category: string[];
  tags: string[];
  video: File | null;
  videoTranscript: string;
  videoType: 'pinVideo' | 'regularVideo';
}

const UploadVideoModal = ({
  onClose,
  onSubmit = (data: IForm) => '',
}: {
  onClose: (e?: any) => void;
  onSubmit?: (data: IForm) => void;
}) => {
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<IForm>();
  const navigate = useNavigate();
  // const onSubmit = (data: IForm) => {
  //   console.log('Form Data:', data);
  //   // TODO: Redirect to paystack to make payment
  //   payButtonFn();
  //   onClose();
  // };

  const videoType = watch('videoType');
  const amount = videoType === 'pinVideo' ? 10000 * 100 : 5000 * 100;

  const { payButtonFn } = usePaystack(
    amount,
    () => {
      console.log('Payment successful');
      navigate('/candidate/video-management');
    },
    () => {
      console.log('Payment failed');
    }
  );

  const ProceedToPayment = () => {
    // TODO: Redirect to paystack to make payment
    payButtonFn();
    onClose();
  };



  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/video/upload', formData); // Replace with your Cloudinary URL
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  const onSubmitHandler = async (data: IForm) => {
    try {
      if (data.video) {
        const videoUrl = await handleFileUpload(data.video);
        data.video = videoUrl as any;
      }
      onSubmit(data);
      ProceedToPayment();
    } catch (error) {
      console.error('Failed to upload video:', error);
    }
  };



  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="bg-white p-10 lg:py-9 lg:px-14 centered-modal md:centered-modal-md xl:centered-modal-large rounded-lg"
    >
      <h3 className="text-center font-bold text-xl">Video CV Upload Modal</h3>
      <div className="my-2 flex flex-col gap-2">
        <Input
          label="Video Name"
          {...register('name', { required: true })}
          // error={errors.name ? 'This field is required' : undefined}
          // error={}
        />
        <TextArea
          label="Video Description"
          placeholder='Add description forr your video'
          {...register('description', { required: true })}
          // error={errors.description ? 'This field is required' : undefined}
          // error={}
        />
        <TextArea
          label="Video Transcript"
          {...register('videoTranscript', { required: true })}
          // error={}
        />
        <SelectChip label="Category" id="category" {...register('category', { required: true })} />
        <Select
          label="Do you want to pin your video, to increase chances of visibility? However, pinned videos attract more payment"
          id="pinned"
          options={[
            { value: 'pinVideo', label: 'Pin Video' },
            { value: 'regularVideo', label: 'Regular Video' },
          ]}  
          {...register('tags', { required: true })}
          error={errors.tags ? 'This field is required' : undefined}
        />
        <div className="">
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video CV
          </label>
          <FileUpload
            uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
            containerClass=""
            uploadLabel="Drag and Drop or Browse"
            {...register('video', { required: true })}
            setFile={(file: File[] | null) => setValue('video', file)}
          />
        </div>

        {/* categories, tags, file upload */}
        <Button type='submit' className="w-full" label="Submit" />
      </div>
    </form>
  );
};

export default UploadVideoModal;
