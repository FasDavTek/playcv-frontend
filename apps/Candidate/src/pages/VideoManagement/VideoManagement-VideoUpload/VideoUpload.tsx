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
import { VideoUploadWidget } from '@video-cv/ui-components';
import { toast } from 'react-toastify';

interface IForm {
  name: string;
  description: string;
  category: string[];
  tags: string[];
  media: string | null;
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
    const resourceType = file.type.startsWith('image/') ? 'image' : 'video';
    const cloudName = 'dht1fkhxb';
    const uploadPreset = 'ml_default';

    try {
      const mediaUrl = await VideoUploadWidget({
        cloudName,
        uploadPreset,
        file,
        resourceType,
      });
      toast.success('Upload Successful');
      return mediaUrl;
    } catch (err) {
      // console.error('Failed to upload media:', err);
      toast.error(`Failed to upload media: ${err}`);
      throw err;
    }
  };

  const onSubmitHandler = async (data: IForm) => {
    try {
      if (data.media) {
        const mediaUrl = await handleFileUpload(data.media as unknown as File);
        data.media = mediaUrl as any;
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
              {...register('media', { required: true })}
              setFile={(file: File | null) => 
                { 
                  if (file) {
                    handleFileUpload(file).then(url => {
                      { setValue('media', url)}
                    }).catch(err => {
                      console.error('Error uploading file:', err);
                    })
                  }
                }
              }
            />
          </div>
          <Button type='submit' variant='black' className="w-full md:w-28" label="Submit" />
        </div>
      </form>
    </div>
    
  );
};

export default VideoUpload;
