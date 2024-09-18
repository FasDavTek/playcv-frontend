import { useState } from 'react';

import { useForm, Controller, FieldError } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, TextArea, FileUpload, DatePicker, Select, VideoUploadWidget, RichTextEditor } from '@video-cv/ui-components';
import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

// interface IForm {
//   name: string;
//   description: string;
//   category: string[];
//   tags: string[];
//   video: File;
//   videoTranscript: string;
// }

type faqType = z.infer<typeof advertSchema>;

const options = [
  { value: 'video', label: 'Video', price: '$200' },
  { value: 'image', label: 'Image', price: '$200' },
];

const CreateAds = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadUrls, setUploadUrls] = useState<string[]>([]);
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

  const adType = watch('adType');

  const navigate = useNavigate();

  const onSubmit = async (data: faqType) => {
    try {
      toast.info('Uploading files...');
      const files = data.files;
      setIsUploading(true);

      if (Array.isArray(files)) {
        const uploadedUrls = await Promise.all(
          files.map(async (file) => {
            const resourceType = file.type.startsWith('image') ? 'image' : 'video';
            const url = await VideoUploadWidget({ 
              file,
              resourceType,
              context: {
                adName: data.adName,
                advertType: data.adType,
                adRedirectURL: data.adUrl,
                startDate: data.startDate,
                endDate: data.endDate,
                description: data.adDescription,
              },
            });
            console.log(url)
            return url;
          })
        );
  
        setUploadUrls(uploadedUrls);
        console.log('Uploaded URLs:', uploadedUrls);
      } else {
        const uploadedUrl = await VideoUploadWidget({ 
          file: files,
          resourceType: files.type.startsWith('image') ? 'image' : 'video',
          context: {
            adName: data.adName,
            advertType: data.adType,
            adRedirectURL: data.adUrl,
            startDate: data.startDate,
            endDate: data.endDate,
            description: data.adDescription,
          },
        });
        setUploadUrls([uploadedUrl]);

        console.log('Uploaded URLs:', uploadedUrl);
      }

      setIsUploading(false);
      toast.success('Files uploaded successfully!');
    }
    catch (err) {
      setIsUploading(false);
      toast.error('Error during file upload!');
      console.log('Error during file upload:', err);
    }
  };

  return (
    <div className='p-10 overflow-hidden bg-white'>
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/employer/advertisement')} />
      <form onSubmit={handleSubmit(onSubmit, (err) => console.log('err', err))} className="bg-white px-10">
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
          <Select
            label="Advert Type"
            options={options}
            value={watch('adType')}
            onChange={(value: string) => {
              if (value === "video" || value === "image") {
                setValue('adType', value);
              } else {
                console.error(`Invalid ad type: ${value}`);
              }
            }}
          />
          <div className="">
            <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Media Upload (Multiple Files)
            </label>
            <FileUpload
              uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
              containerClass=""
              uploadLabel="Drag and Drop or Browse"
              {...register('files', { required: true })}
              setFile={(files: File | File[] | null) => {
                if (files) {
                  if (Array.isArray(files)) {
                    setValue('files', [files[0], ...files.slice(1)]);
                  } else {
                    setValue('files', [files]);
                  }
                }
              }}
            />
          </div>

          <Controller name='startDate' control={control} render={({ field: { onChange, value } }) => (
            <DatePicker label="Start Date" value={value} onChange={(newValue) => onChange(dayjs(newValue))} error={errors.startDate as FieldError | undefined} />
          )} />
          <Controller name='endDate' control={control} render={({ field: { onChange, value } }) => (
            <DatePicker label="End Date" value={value} onChange={(newValue) => onChange(dayjs(newValue))} error={errors.endDate as FieldError | undefined} />
          )} />

          {/* categories, tags, file upload */}
          <Button type="submit" variant='black' className="w-full" disabled={isUploading} label={isUploading ? "Uploading..." : "Submit"} />
        </div>
      </form>
    </div>
    
  );
};

export default CreateAds;
