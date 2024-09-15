import { useState } from 'react';

import { useForm } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Input, TextArea, FileUpload, DatePicker, Select, VideoUploadWidget } from '@video-cv/ui-components';
import { advertSchema } from './../../../../../video-cv/src/schema/formValidations/Advert.schema';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useNavigate } from 'react-router-dom';

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
      const files = data.files;
      setIsUploading(true);

      
      const uploadedUrls = await Promise.all(
        files.map(async ({ file }) => {
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
          return url;
        })
      );

      setIsUploading(false);
      setUploadUrls(uploadedUrls);
      console.log('Uploaded URLs:', uploadedUrls);
    }
    catch (err) {
      setIsUploading(false);
      console.log('Error during file upload:', err);
    }
  };

  return (
    <div className='p-10 overflow-hidden bg-white'>
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/employer/advertisement')} />
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
              Media Upload (Multiple Files)
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
          <Button type="submit" variant='black' className="w-full" disabled={isUploading} label={isUploading ? "Uploading..." : "Submit"} />
        </div>
      </form>
    </div>
    
  );
};

export default CreateAds;
