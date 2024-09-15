import { useState } from 'react';
import { useForm, useController } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { Button, Input, TextArea, FileUpload, Select, } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Chip, Stack } from '@mui/material';
import { VideoUploadWidget } from '@video-cv/ui-components';
import { toast } from 'react-toastify';
import { videoUploadSchema } from './../../../../../video-cv/src/schema/videoUploadSchema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// interface IForm {
//   name: string;
//   description: string;
//   // category: string[];
//   tags: string[];
//   media: string | null;
//   videoTranscript: string;
//   Category: string | string[];
//   videoType?: string;
//   price?: number;
// }

type faqType = z.infer<typeof videoUploadSchema>;

const SelectChip = ({ label, options, value, onChange }: any) => {
  const handleChipClick = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((item: string) => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <Box>
      <label>{label}</label>
      <Stack pt={1} direction="row" spacing={1}>
        {options.map((option: any) => (
          <Chip
            key={option.value}
            label={option.label}
            clickable
            color={value.includes(option.value) ? 'default' : 'default'}
            onClick={() => handleChipClick(option.value)}
            variant={value.includes(option.value) ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>
    </Box>
  );
};

const VideoUpload = ({
  // onClose,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<faqType>({resolver: zodResolver(videoUploadSchema)});
  const navigate = useNavigate();
  const location = useLocation();
  const videoType = (location.state as any)?.videoType ?? '';
  const price = (location.state as any)?.price ?? 0;
  // const { field: categoryField } = useController({ name: 'category', control });

  const handleFileUpload = async (file: File) => {
    const resourceType = file.type.startsWith('image/') ? 'image' : 'video';

    try {
      const mediaUrl = await VideoUploadWidget({
        file,
        resourceType,
        context: {
          videoName: watch('name'),
          videoType: videoType.toUpperCase(),
          description: watch('description'),
          price: price.toString(),
          videoTranscript: watch('videoTranscript'),
          videoCategory: watch('Category'),
        }
      });
      toast.success('Upload Successful');
      return mediaUrl;
    } catch (err) {
      // console.error('Failed to upload media:', err);
      toast.error(`Failed to upload media: ${err}`);
      throw err;
    }
  };

  const onSubmitHandler = async (data: faqType) => {
    try {
      if (data.media) {
        const files = Array.isArray(data.media) ? data.media : [data.media];
      
        setIsUploading(true);

        // Upload each file and gather the URLs
        const uploadedUrls = await Promise.all(
          files.map(async ({ file }) => {
            const resourceType = file.type.startsWith('image/') ? 'image' : 'video';
            const url = await handleFileUpload(file as File);
            return url;
          })
        );

        setIsUploading(false);

        console.log('Uploaded URLs:', uploadedUrls);
      }
      data['videoType'] = videoType.toUpperCase();
      data['price'] = price;
    } catch (error) {
      console.error('Failed to upload video:', error);
    }
  };
  

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="bg-white p-10 lg:py-9 lg:px-14"
      >
        {/* <h3 className="text-center font-bold text-xl">Video CV Upload Page</h3> */}
        <div className="my-2 flex flex-col gap-5">
          <Input
            label="Video Name"
            {...register('name', { required: true })}
          />
          <Input
            label="Video Type"
            value={`${videoType} video upload`}
            disabled
          />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Description
          </label>
          <ReactQuill
            className='custom-quill'
            value={watch('description')}
            onChange={(value) => setValue('description', value)}
            placeholder="Add description for your video"
          />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Transcript
          </label>
          <ReactQuill
            className='custom-quill'
            value={watch('videoTranscript')}
            onChange={(value) => setValue('videoTranscript', value)}
            placeholder="Add transcript for your video"
          />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Category
          </label>
          <ReactQuill
            className='custom-quill'
            value={watch('Category')}
            onChange={(value) => setValue('Category', value)}
            placeholder="Add your video preferred category"
          />
          {/* <SelectChip label="Category"  options={[{ value: 'category1', label: 'Category 1' }, { value: 'category2', label: 'Category 2' }]} value={categoryField.value || []} onChange={categoryField.onChange} /> */}
          <div className="">
            <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Video CV
            </label>
            <FileUpload
              uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
              containerClass=""
              uploadLabel="Drag and Drop or Browse"
              {...register('media', { required: true })}
              setFile={(files: File | File[] | null) => {
                if (files) {
                  if (Array.isArray(files)) {
                    const file = Array.isArray(files) ? files[0] : files; // Ensure we handle one file
                    handleFileUpload(file as File)
                      .then((url) => {
                        setValue('media', url); // Set the URL or file path in the form state
                      })
                      .catch((err) => {
                        console.error('Error uploading file:', err);
                      });
                  }
                }
              }}
            />
          </div>
          <Button type='submit' variant='black' className="w-full md:w-28" disabled={isUploading} label={isUploading ? "Uploading..." : "Submit"} />
        </div>
      </form>
    </div>
    
  );
};

export default VideoUpload;
