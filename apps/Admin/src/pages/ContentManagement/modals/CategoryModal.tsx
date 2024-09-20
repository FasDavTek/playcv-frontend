import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, TextArea, FileUpload, Select, RichTextEditor, } from '@video-cv/ui-components';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface IForm {
  name?: string;
  description?: string;
}

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: IForm) => void;
  selectedItem?: IForm | null;
  currentTab: string;
}

const CategoryModal = ({
  open,
  onClose,
  onSubmit = () => {},
  selectedItem = null,
  currentTab,
}: CategoryModalProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<IForm>();

  useEffect(() => {
    if (selectedItem) {
      setValue('name', selectedItem.name || '');
      setValue('description', selectedItem.description || '');
    }
  }, [selectedItem, setValue]);

  if (!open) return null;

  const getLabel = () => {
    switch (currentTab) {
      case 'faq':
        return { name: 'Question', description: 'Response' };
      case 'state':
        return { name: 'State Name', description: 'Abbreviation' };
      case 'institutions':
        return { name: 'Institution Name', description: 'Location' };
      case 'courses':
        return { name: 'Course Title', description: 'Duration' };
      case 'industries':
        return { name: 'Industry Name', description: 'Description' };
      case 'specialization':
        return { name: 'Specialization Name', description: 'Description' };
      case 'jobFunctions':
        return { name: 'Job Function', description: 'Description' };
      case 'marketplaceCategories':
        return { name: 'Category Name', description: 'Description' };
      case 'qualifications':
        return { name: 'Qualification', description: 'Description' };
      case 'siteTestimonials':
        return { name: 'Name', description: 'Testimonial' };
      case 'degreeClass':
        return { name: 'Degree Class', description: 'Description' };
      case 'cvUploadGuideline':
        return { name: 'Guideline', description: 'Description' };
      default:
        return { name: 'Category', description: 'Role' };
    }
  };

  const labels = getLabel();

  const handleFormSubmit = (data: IForm) => {
    console.log('Current Tab:', currentTab);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="relative bg-white p-10 lg:py-5 lg:px-14 centered-modal rounded-lg">
      <CloseIcon className='absolute cursor-pointer hover:rounded-full hover:bg-gray-400 hover:text-white top-4 right-6' onClick={onClose} />
        
      <h3 className="text-center font-semibold text-xl">{selectedItem ? `Edit ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}` : `Create New ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}`}</h3>
      <div className="my-5 flex flex-col gap-5">
        <Input
          label={labels.name}
          {...register('name')}
          // error={}
        />
        {currentTab !== 'faq' && (
          <TextArea
            label={labels.description}
            {...register('description')}
          />
        )}
        {currentTab === 'faq' && (
          <RichTextEditor
            // value={watch('role')}
            value={selectedItem?.description || ''}
            onChange={(value: string) => setValue('description', value)}
            placeholder='Enter your response'
          />
        )}
        <Button
          onClick={() => {
            ('');
          }}
          variant='black'
          type="submit"
          className="w-full"
          label={selectedItem ? `Update ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}` : `Create ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}`}
        />
      </div>
    </form>
  );
};

export default CategoryModal;
