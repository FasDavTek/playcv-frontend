import { useState } from 'react';

import { Controller, FieldError, useForm } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Input,
  TextArea,
  FileUpload,
  DatePicker,
  Select,
  RichTextEditor,
} from '@video-cv/ui-components';

import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';
import dayjs from 'dayjs';

// interface IForm {
//   name: string;
//   description: string;
//   category: string[];
//   tags: string[];
//   video: File;
//   videoTranscript: string;
// }

const options = [
  { value: 'video', label: 'Video', price: '$200' },
  { value: 'image', label: 'Image', price: '$200' },
];

type faqType = z.infer<typeof advertSchema>;

const CreateAdvertModal = () => {
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
  console.log('errors', errors);
  const onSubmit = (data: faqType) => {
    console.log('Form Data:', data);
  };
  return (
    <div className='p-10 overflow-hidden bg-white'>
      <h3 className="text-center font-semibold text-xl">Add Advert</h3>
      <form onSubmit={handleSubmit(onSubmit, (err) => console.log('err', err))} className="bg-white mt-[50px] md:mt-0 p-10 lg:p-14 centered-modal-md rounded-lg">
        <h3 className="text-center font-bold text-xl">Add Advert</h3>
        <div className="my-5 flex flex-col gap-5">
        <Input label="Ad Name" {...register('adName', { required: true })} error={errors.adName} />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Ad Description
          </label>
          <RichTextEditor
            value={watch('adDescription')}
            onChange={(value) => setValue('adDescription', value)}
            placeholder='Add description for your advert'
          />
          <Input label="Ad Redirect Url" {...register('adUrl', { required: true })} error={errors.adUrl} />
          {/* <Select
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
          /> */}
          <div className="">
            <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Advert Upload (Multiple Files)
            </label>
            <FileUpload
              uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
              containerClass=""
              uploadLabel="Drag and Drop or Browse"
              {...register('files')}
            />
          </div>

          <Controller name='startDate' control={control} render={({ field: { onChange, value } }) => (
            <DatePicker label="Start Date" value={value} onChange={(newValue) => onChange(dayjs(newValue))} error={errors.startDate as FieldError | undefined} />
          )} />
          <Controller name='endDate' control={control} render={({ field: { onChange, value } }) => (
            <DatePicker label="End Date" value={value} onChange={(newValue) => onChange(dayjs(newValue))} error={errors.endDate as FieldError | undefined} />
          )} />

          {/* categories, tags, file upload */}
          <Button type="submit" variant='black' className="w-full" label="Submit" />
        </div>
      </form>
    </div>
  );
};

export default CreateAdvertModal;
