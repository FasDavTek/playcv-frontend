import { useState } from 'react';

import { useForm, Controller } from 'react-hook-form';

import { Button, Input, TextArea, Select, } from '@video-cv/ui-components';

interface IForm {
  name: string;
  email: string;
  role: string;
  phoneNumber: string;
  address: string;
  profilePicture: FileList | null;
}

const options = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
  { value: 'manager', label: 'Manager' },
];

const UserModal = ({
  onClose,
  onSubmit = () => {},
}: {
  onClose: (e: any) => void;
  onSubmit?: (data: IForm) => void;
}) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<IForm>();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-10 lg:p-14 centered-modal rounded-lg"
    >
      <h3 className="text-center font-bold text-xl">Create Sub Admin</h3>
      <div className="my-5 flex flex-col gap-5">
        <Input
          label="Name"
          {...register('name', { required: 'Name is required' })}
          // error={}
        />
        <Input
          label="Email"
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
        <Controller
          name="role"
          control={control}
          rules={{ required: 'Role is required' }}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Role"
              options={options}
              value={value}
              onChange={onChange}
              // onChange={(e: any) => console.log('e', e)}
              // {...{ field }}
            />
          )}
        />
        <Input
          label="Phone Number"
          type="tel"
          {...register('phoneNumber')}
        />
        <TextArea
          label="Address"
          {...register('address')}
        />
        <Button
          onClick={() => {}}
          type="submit"
          variant='black'
          className="w-full"
          label="Create User"
        />
      </div>
    </form>
  );
};

export default UserModal;
