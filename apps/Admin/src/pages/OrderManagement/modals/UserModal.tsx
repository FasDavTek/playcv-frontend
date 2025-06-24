import { useState } from 'react';

import { useForm, Controller } from 'react-hook-form';

import {
  Button,
  Input,
  TextArea,
  Select,
} from '@video-cv/ui-components';

interface IForm {
  email: string;
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
      <h3 className="text-center font-bold text-xl">Create Sub Admin</h3>
      <div className="my-5 flex flex-col gap-5">
        <Input
          label="Email"
          {...register('email')}
          // error={}
        />
        <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                name="Role"
                control={control}
                options={options}
                handleChange={(newValue) => field.onChange(newValue?.value)}
              />
            )}
        />
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
