import { useState } from 'react';

import { useForm } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';

import {
  Button,
  Input,
  TextArea,
  FileUpload,
  SelectChip,
} from '@video-cv/ui-components';

interface IForm {
  name: string;
  description: string;
  category: string[];
  tags: string[];
  video: File;
  videoTranscript: string;
}

const UploadVideoModal = ({
  onClose,
  onSubmit = () => {
    ('');
  },
}: {
  onClose: (e: any) => void;
  onSubmit?: () => void;
}) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<IForm>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-10 lg:p-14 centered-modal-md rounded-lg"
    >
      <h3 className="text-center font-bold text-xl">Video CV Upload Modal</h3>
      <div className="my-5 flex flex-col gap-5">
        <Input
          label="Video Name"
          {...register('name')}
          // error={}
        />
        <TextArea
          label="Video Description"
          {...register('description')}
          // error={}
        />
        <TextArea
          label="Video Transcript"
          {...register('videoTranscript')}
          // error={}
        />
        <SelectChip label="Category" id="category" />
        <div className="">
          <label className="block font-manrope text-[1rem] capitalize font-normal leading-[1.25rem] text-secondary-500">
            Video CV
          </label>
          <FileUpload
            uploadIcon={<UploadFile sx={{ fontSize: '40px' }} />}
            containerClass=""
            uploadLabel="Drag and Drop or Browse"
          />
        </div>

        {/* categories, tags, file upload */}
        <Button className="w-full" label="Submit" />
      </div>
    </form>
  );
};

export default UploadVideoModal;
