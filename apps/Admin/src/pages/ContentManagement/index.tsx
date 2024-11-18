import React, { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';
import { Button, Table } from '@video-cv/ui-components';
import { CategoryModal } from './modals';
// import { ContentModal } from './modals';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';

type Content = {
  id: string;
  name?: string;
  action: string;
  status?: string;
  [key: string]: any;
}

type faq = Content & {
  question: string;
  answer: string;
  isActive: boolean;
  createdBy: string;
}

type country = Content & {
  countryId: number;
  countryName: string;
  shortName: string;
  dateCreated: Date;
  dateUpdated: Date;
}

type state = Content & {
  countryId: number;
  shortName: string;
  dateCreated: Date;
  dateUpdated: Date;
}

type course = Content & {
  courseName: string;
  description: string;
}

type industry = Content & {}

type qualification = Content & {
  shortName: string;
  description: string;
  shortDescription: string;
}

type testiomonial = Content & {
  testimonial: string;
  profileImage: string;
}

type degree = Content & {
  shortName: string;
  description: string;
}

type guideline = Content & {
  guideline: string;
  description: string;
}

const columnHelper = createColumnHelper<Content>();

const ContentPage = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'country' | 'state' | 'institutions' | 'courses' | 'industry/Sector' | 'qualifications' | 'siteTestimonials' | 'degreeClass' | 'cvUploadGuideline'>('faq');
  const [openModal, setOpenModal] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedItem, setSelectedItem] = useState<Content | null>(null);

  const { data, isLoading, error } = useAllMisc({
    resource: activeTab,
    page: 1,
    limit: 20,
  });

  const closeModal = () => {
    setOpenModal(null);
    setSelectedItem(null);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setOpenModal('add');
  };

  const handleEdit = (item: Content) => {
    setSelectedItem(item);
    setOpenModal('edit');
  };

  const handleView = (item: Content) => {
    setSelectedItem(item);
    setOpenModal('view');
  };

  
  const getColumns = () => {
    const baseColumns = [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: "Description",
        cell: (info) => info.getValue(),
      }),
    ];


    const actionColumn = columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <Button variant='custom' label='View' onClick={() => handleView(row.original)} />
          <Button variant='custom' label='Edit' onClick={() => handleEdit(row.original)} />
          {row.original.status && (
            <Button variant={row.original.status === 'Active' ? 'red' : 'success'} label={row.original.status === 'Active' ? 'Deactivate' : 'Activate'} />
          )}
        </div>
      )
    });

    switch (activeTab) {
      case 'faq':
        return [
          columnHelper.accessor('question', { header: 'Question' }),
          columnHelper.accessor('answer', { header: 'Answer' }),
          columnHelper.accessor('isActive', {
            header: 'Status',
            cell: (info) => info.getValue() ? 'Active' : 'Inactive'
          }),
          actionColumn,
        ];
      case 'country':
        return [
          columnHelper.accessor('countryName', { header: 'Country Name' }),
          columnHelper.accessor('shortName', { header: 'Short Name' }),
          actionColumn,
        ]
      case 'state':
        return [
          columnHelper.accessor('name', { header: 'State Name' }),
          columnHelper.accessor('shortName', { header: 'Short Name' }),
          columnHelper.accessor('countryId', { header: 'Country ID' }),
          actionColumn,
        ]
      case 'institutions':
        return [
          ...baseColumns,
          columnHelper.accessor('location', { header: 'Location' }),
          actionColumn,
        ]
      case 'courses':
        return [
          columnHelper.accessor('courseName', { header: 'Course Name' }),
          columnHelper.accessor('description', { header: 'Description' }),
          actionColumn,
        ]
      case 'industry/Sector':
        return [
          ...baseColumns,
          actionColumn,
        ]
      case 'qualifications':
        return [
          ...baseColumns,
          columnHelper.accessor('shortName', { header: 'Short Name' }),
          columnHelper.accessor('shortDescription', { header: 'Short Description' }),
          actionColumn,
        ]
      case 'siteTestimonials':
        return [
          columnHelper.accessor('name', { header: 'Name' }),
          columnHelper.accessor('testimonial', { header: 'Testimonial' }),
          columnHelper.accessor('profileImage', { 
            header: 'Profile Image',
            cell: (info) => info.getValue() ? 'Uploaded' : 'Not Uploaded'
          }),
          actionColumn,
        ]
      case 'degreeClass':
        return [
          ...baseColumns,
          columnHelper.accessor('shortName', { header: 'Short Name' }),
          actionColumn,
        ]
      case 'cvUploadGuideline':
        return [
          columnHelper.accessor('guideline', { header: 'Guideline' }),
          columnHelper.accessor('description', { header: 'Description' }),
          actionColumn,
        ]
      default:
        return [...baseColumns, actionColumn];
    }
  }

  const columns = getColumns();
  

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-3">
        <Button
          label={`Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          variant="black"
          onClick={handleAddNew}
        />
      </div>

      <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
        <div className="flex p-1 overflow-auto gap-3">
          {['faq', 'country', 'state', 'institutions', 'courses', 'industry/Sector', 'qualifications', 'siteTestimonials', 'degreeClass', 'cvUploadGuideline'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${activeTab === tab ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
              onClick={() => {
                setActiveTab(tab as typeof activeTab);
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Table
          loading={false}
          data={data || []}
          columns={columns}
          tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        />
      </div>
      
      <Modal open={openModal === 'add' || openModal === 'edit' || openModal === 'view'} onClose={closeModal} sx={{ maxWidth: 'lg' }}>
        <>
          <CategoryModal open={true} selectedItem={selectedItem} onClose={closeModal} action={openModal} currentTab={activeTab}></CategoryModal>
        </>
      </Modal>
    </div>
  );
};

export default ContentPage;