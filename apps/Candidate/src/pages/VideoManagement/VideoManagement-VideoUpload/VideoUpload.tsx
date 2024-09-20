import { useEffect, useState } from 'react';
import { useForm, useController } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import { Button, Input, TextArea, FileUpload, Select, RichTextEditor } from '@video-cv/ui-components';
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
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<faqType>({resolver: zodResolver(videoUploadSchema),});
  // const navigate = useNavigate();
  const location = useLocation();
  const videoType = (location.state as any)?.videoType ?? '';
  const price = (location.state as any)?.price ?? 0;
  // const { field: categoryField } = useController({ name: 'category', control });

  console.log();
  console.log(errors);

  const options = [
    { value: 'education', label: 'Education' },
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
  ];

  useEffect(() => {
    setValue('videoType', videoType);
    setValue('price', price);
  }, [setValue, videoType, price]);

  // const handleFileUpload = async (file: File) => {
  //   console.log('Form Received!');
  //   const resourceType = file.type.startsWith('image/') ? 'image' : 'video';

  //   try {
  //     const mediaUrl = await VideoUploadWidget({
  //       file,
  //       resourceType,
  //       context: {
  //         videoName: watch('name'),
  //         videoType: videoType.toUpperCase(),
  //         description: watch('description'),
  //         price: price.toString(),
  //         videoTranscript: watch('videoTranscript'),
  //         videoCategory: watch('Category'),
  //       }
  //     });
  //     toast.success('Upload Successful');
  //     return mediaUrl;
  //   } catch (err) {
  //     // console.error('Failed to upload media:', err);
  //     toast.error(`Failed to upload media: ${err}`);
  //     throw err;
  //   }
  // };

  const handleFileUpload = async (file: File) => {
    try {
      // Check if the file exists and ensure it is being processed correctly
      if (!file) throw new Error('File is not defined.');
      
      const mediaUrl = await VideoUploadWidget({
        file,
        resourceType: 'video',
        context: {
          videoName: watch('name'),
          videoType: watch('videoType')?.toUpperCase(),
          description: watch('description'),
          price: watch('price')?.toString(),
          videoTranscript: watch('videoTranscript'),
          videoCategory: watch('Category'),
        }
      });
      toast.success('Upload successful');
      console.log('Upload successful:', mediaUrl);
      return mediaUrl;
    } catch (err) {
      toast.error(`Upload Failed: ${err}`);
      console.error('Upload failed:', err);
      throw err;
    }
  };
  

  // const onSubmitHandler = async (data: faqType) => {
  //   console.log('Form Submitted!');
  //   try {
  //     setIsUploading(true);

  //     if (data.media) {
  //       const files = Array.isArray(data.media) ? data.media : [data.media];

  //       // Upload each file and gather the URLs
  //       const uploadedUrls = await Promise.all(
  //         files.map(async ({ file }) => {
  //           const resourceType = file.type.startsWith('image/') ? 'image' : 'video';
  //           const url = await handleFileUpload(file as File);
                // setValue('media', url);
  //           return url;
  //         })
  //       );

  //       setIsUploading(false);

  //       data.media = uploadedUrls[0];

  //       console.log('Uploaded URLs:', uploadedUrls);
  //     }
  //     data['videoType'] = videoType.toUpperCase();
  //     data['price'] = price;

  //     console.log("Final form data:", data); 

  //   } catch (error) {
  //     console.error('Failed to upload video:', error);
  //   }
  // };



  const onSubmitHandler = async (data: faqType) => {
    try {
      toast.info('Uploading files...');
      setIsUploading(true);
  
      // File upload logic
      if (data.media instanceof File || typeof data.media === 'object') {
        const file = Array.isArray(data.media) ? data.media[0] : data.media;
        if (file) {
          const uploadedUrl = await handleFileUpload(file);
          console.log('Uploaded URL:', uploadedUrl);
        } else {
          toast.warning('No file selected')
          console.warn('No file selected');
        }
      }

      setIsUploading(false);
  
      // After file upload, check if data was submitted correctly
      console.log('Final form data:', data);
    } catch (err) {
      toast.warning(`Error during submission: ${err}`)
      console.error('Error during submission:', err);
    }
    finally {
      setIsUploading(false);
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
            {...register('videoType')}
            disabled
          />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Description
          </label>
          <RichTextEditor
            value={watch('description')}
            onChange={(value) => setValue('description', value)}
            placeholder="Add description for your video"
          />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Transcript
          </label>
          <RichTextEditor
            value={watch('videoTranscript')}
            onChange={(value) => setValue('videoTranscript', value)}
            placeholder="Add transcript for your video"
          />
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video Category
          </label>
          {/* <RichTextEditor
            value={watch('Category')}
            onChange={(value) => setValue('Category', value)}
            placeholder="Add your video preferred category"
          /> */}
          <Select
            label="Select your video category"
            options={options}
            value={watch('Category')}
            onChange={(value) => setValue('Category', value)}
            // placeholder="Select your video category"
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
                    const file = files[0]; // Ensure we handle one file
                    setValue('media', file);
                  }
                  else {
                    setValue('media', files);
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
