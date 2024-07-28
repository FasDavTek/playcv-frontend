import { useState } from 'react';

import { useForm } from 'react-hook-form';
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
} from '@video-cv/ui-components';

import { advertSchema } from '../../../schema/formValidations/Advert.schema';

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

const CreateAdvertModal = ({
  onClose,
}: // onSubmit = () => {
//   ('');
// },
{
  onClose: (e: any) => void;
  // onSubmit?: () => void;
}) => {
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
  const onSubmit = () => {
    console.log('i got here');
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit, (err) => console.log('err', err))}
      className="bg-white mt-[50px] md:mt-0 p-10 lg:p-14 centered-modal-md rounded-lg"
    >
      <h3 className="text-center font-bold text-xl">Add Advert</h3>
      <div className="my-5 flex flex-col gap-5">
        <Input label="Ad Name" {...register('adName')} error={errors.adName} />
        <TextArea
          label="Ad Description"
          {...register('adDescription')}
          error={errors.adDescription}
        />
        <Select
          label="Advert Type"
          id="adType"
          placeholder="Select type"
          containerClass="flex-1"
          options={options}
          withLabelDescription={true}
          onChange={(e: any) => console.log('e', e)}
        />
        <div className="">
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Advert Upload
          </label>
          <FileUpload
            uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
            containerClass=""
            uploadLabel="Drag and Drop or Browse"
          />
        </div>

        <DatePicker label="Start Date" />
        <DatePicker label="End Date" />

        {/* categories, tags, file upload */}
        <Button type="submit" className="w-full" label="Submit" />
      </div>
    </form>
  );
};

export default CreateAdvertModal;
