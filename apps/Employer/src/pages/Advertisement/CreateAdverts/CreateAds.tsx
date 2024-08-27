import { useState } from 'react';

import { useForm } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, TextArea, FileUpload, DatePicker, Select, } from '@video-cv/ui-components';
import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';

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

const CreateAds = () => {
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
      <form onSubmit={handleSubmit(onSubmit, (err) => console.log('err', err))} className="bg-white px-10">
        <div className="my-5 flex flex-col gap-5">
          <Input label="Ad Name" {...register('adName')} error={errors.adName} />
          <TextArea
            label="Ad Description"
            {...register('adDescription')}
            error={errors.adDescription}
          />
          <Input label="Ad Redirect Url" {...register('adUrl')} error={errors.adUrl} />
          <Select
            label="Advert Type"
            id="adType"
            placeholder="Select type"
            containerClass="flex-1"
            options={options}
            withLabelDescription={true}
            onChange={(e: any) => console.log('Selected', e)}
          />
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

          <DatePicker label="Start Date" {...register('startDate')} error={errors.startDate} />
          <DatePicker label="End Date" {...register('endDate')} error={errors.endDate} />

          {/* categories, tags, file upload */}
          <Button type="submit" variant='black' className="w-full" label="Submit" />
        </div>
      </form>
    </div>
    
  );
};

export default CreateAds;
