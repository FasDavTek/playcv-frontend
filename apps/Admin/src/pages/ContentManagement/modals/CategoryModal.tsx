import { useState } from 'react';

import { useForm, Controller } from 'react-hook-form';

import {
  Button,
  Input,
  TextArea,
  FileUpload,
  Select,
} from '@video-cv/ui-components';

interface IForm {
  category: string;
  role: string;
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
      <h3 className="text-center font-bold text-xl">Create New Category</h3>
      <div className="my-5 flex flex-col gap-5">
        <Input
          label="Category"
          {...register('category')}
          // error={}
        />
        <Button
          onClick={() => {
            ('');
          }}
          className="w-full"
          label="Create Category"
        />
      </div>
    </form>
  );
};

export default UploadVideoModal;
