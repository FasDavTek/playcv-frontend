import { useState } from 'react';

import { Controller, useForm } from 'react-hook-form';
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
        {/* <Controller
            name='adType'
            control={control}
            render={({ field }) => (
                <Select
                    name="adType"
                    control={control}
                    defaultValue={adTypes.find(type => type.value === adDetails.adType) || null}
                    options={adTypes}
                    handleChange={(newValue) => field.onChange(newValue?.value)}
                    errors={errors}
                />
            )}
        /> */}
        <div className="">
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Advert Upload
          </label>
          <Controller
              name='files'
              control={control}
              render={({ field: { onChange } }) => (
                  <FileUpload
                      uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
                      containerClass="mt-3"
                      uploadLabel="Drag and Drop or Browse"
                      uploadRestrictionText="Accepted formats: images, videos (max size: 8MB)"
                      setFile={(files) => {
                          console.log('Files received by FileUpload:', files);
                          const fileArray = Array.isArray(files) ? files : files ? [files] : [];
                          console.log('Selected files:', fileArray);
                          onChange(fileArray);
                      }}
                      // onFilesChange={(files) => {
                      //     console.log('Files changed:', files);
                      //     const fileArray = Array.isArray(files) ? files : [files];
                      //     setNewMedia(fileArray);
                      // }}
                  />
              )}
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
