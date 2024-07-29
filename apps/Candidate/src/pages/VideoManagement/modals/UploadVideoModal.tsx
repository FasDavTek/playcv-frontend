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

interface IForm {
  name: string;
  description: string;
  category: string[];
  tags: string[];
  video: File;
  videoTranscript: string;
}

const UploadVideoModal = ({
  onClose,
  onSubmit= () => {
    ('');
  },
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

  const { payButtonFn } = usePaystack(
    () => {
      console.log('onSuccess callback');
      navigate('/candidate/video-management');
    },
    () => {
      console.log('onFailure callback');
    }
  );

  const ProceedToPayment = () => {
    // TODO: Redirect to paystack to make payment
    payButtonFn();
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
          />
        </div>

        {/* categories, tags, file upload */}
        <Button type='submit' className="w-full" label="Submit" onClick={ProceedToPayment} />
      </div>
    </form>
  );
};

export default UploadVideoModal;
