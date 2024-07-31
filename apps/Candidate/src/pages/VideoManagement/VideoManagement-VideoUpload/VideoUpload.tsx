import { useState } from 'react';
import { useForm, useController } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';
import {
  Button,
  Input,
  TextArea,
  FileUpload,
  Select,
} from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Chip, Stack } from '@mui/material';

interface IForm {
  name: string;
  description: string;
  category: string[];
  tags: string[];
  video: File | null;
  videoTranscript: string;
}

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
  onSubmit = () => '',
}: {
  // onClose: (e?: any) => void;
  onSubmit?: (data: IForm) => void;
}) => {
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<IForm>();
  const { field: categoryField } = useController({ name: 'category', control });

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
          <SelectChip label="Category"  options={[{ value: 'category1', label: 'Category 1' }, { value: 'category2', label: 'Category 2' }]} value={categoryField.value || []} onChange={categoryField.onChange} />
          <div className="">
            <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
              Video CV
            </label>
            <FileUpload
              uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
              containerClass=""
              uploadLabel="Drag and Drop or Browse"
              {...register('video', { required: true })}
              setFile={(file: File | null) => setValue('video', file)}
            />
          </div>
          <Button type='submit' variant='black' className="w-full md:w-28" label="Submit" />
        </div>
      </form>
    </div>
    
  );
};

export default VideoUpload;
