import { useState } from 'react';

import { useForm, Controller } from 'react-hook-form';
import UploadFile from '@mui/icons-material/UploadFileOutlined';

import {
  Button,
  Input,
  TextArea,
  FileUpload,
  Select,
} from '@video-cv/ui-components';

interface IForm {
  adName: string;
  fileUrl: string;
}

const options = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
];

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
      <h3 className="text-center font-bold text-xl">Create Ad</h3>
      <div className="my-5 flex flex-col gap-5">
        <Input
          label="Ad Name"
          {...register('adName')}
          // error={}
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
        <Button
          onClick={() => {
            ('');
          }}
          className="w-full"
          label="Create User"
        />
      </div>
    </form>
  );
};

export default UploadVideoModal;
