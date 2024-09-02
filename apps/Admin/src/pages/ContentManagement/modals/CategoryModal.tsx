import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, TextArea, FileUpload, Select, } from '@video-cv/ui-components';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface IForm {
  category?: string;
  role?: string;
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
      setValue('category', selectedItem.category || '');
      setValue('role', selectedItem.role || '');
    }
  }, [selectedItem, setValue]);

  if (!open) return null;

  const getLabel = () => {
    switch (currentTab) {
      case 'faq':
        return { category: 'Question', role: 'Answer' };
      case 'state':
        return { category: 'State Name', role: 'Abbreviation' };
      case 'institutions':
        return { category: 'Institution Name', role: 'Location' };
      case 'courses':
        return { category: 'Course Title', role: 'Duration' };
      case 'industries':
        return { category: 'Industry Name', role: 'Description' };
      case 'specialization':
        return { category: 'Specialization Name', role: 'Description' };
      case 'jobFunctions':
        return { category: 'Job Function', role: 'Description' };
      case 'marketplaceCategories':
        return { category: 'Category Name', role: 'Description' };
      case 'qualifications':
        return { category: 'Qualification', role: 'Description' };
      case 'siteTestimonials':
        return { category: 'Name', role: 'Testimonial' };
      case 'degreeClass':
        return { category: 'Degree Class', role: 'Description' };
      case 'cvUploadGuideline':
        return { category: 'Guideline', role: 'Description' };
      default:
        return { category: 'Category', role: 'Role' };
    }
  };

  const labels = getLabel();

  const handleFormSubmit = (data: IForm) => {
    console.log('Current Tab:', currentTab);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="relative bg-white p-10 lg:p-14 centered-modal-md rounded-lg">
      <CloseIcon className='absolute cursor-pointer hover:rounded-full hover:bg-gray-400 hover:text-white top-4 right-6' onClick={onClose} />
        
      <h3 className="text-center font-semibold text-xl">{selectedItem ? `Edit ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}` : `Create New ${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}`}</h3>
      <div className="my-5 flex flex-col gap-5">
        <Input
          label={labels.category}
          {...register('category')}
          // error={}
        />
        <TextArea
          label={labels.role}
          {...register('role')}
        />
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
