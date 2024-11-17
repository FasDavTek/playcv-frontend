import React, { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';
import { Button, Table } from '@video-cv/ui-components';
import { CategoryModal } from './modals';
// import { ContentModal } from './modals';

type Content = {
  id: string;
  name: string;
  action: string;
  [key: string]: any;
}

type faq = Content & {
  question: string;
  answer: string;
  isActive: boolean;
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

type ContentColumns = {
  id: number;
  name: string;
  description: string;
  category?: string;
  role?: string;
  actions: 'actions';
};

const columnHelper = createColumnHelper<ContentColumns>();

const generateSampleData = (type: string) => {
  switch (type) {
    case 'faq':
      return [
        { id: 1, name: 'What is your refund policy?', description: 'We offer a 30-day money back guarantee.' },
        { id: 2, name: 'How can I contact support?', description: 'You can reach us via email at support@example.com.' },
        { id: 3, name: 'Where can I find the user guide?', description: 'The user guide is available on our website under the support section.' },
        { id: 4, name: 'What payment methods do you accept?', description: 'We accept all major credit cards and PayPal.' },
        { id: 5, name: 'Do you offer a free trial?', description: 'Yes, we offer a 14-day free trial for new users.' }
      ];
    case 'state':
      return [
        { id: 1, name: 'California', description: 'CA' },
        { id: 2, name: 'New York', description: 'NY' },
        { id: 3, name: 'Texas', description: 'TX' },
        { id: 4, name: 'Florida', description: 'FL' },
        { id: 5, name: 'Illinois', description: 'IL' }
      ];
    case 'institutions':
      return [
        { id: 1, name: 'Harvard University', description: 'Cambridge, MA' },
        { id: 2, name: 'Stanford University', description: 'Stanford, CA' },
        { id: 3, name: 'Massachusetts Institute of Technology', description: 'Cambridge, MA' },
        { id: 4, name: 'University of California, Berkeley', description: 'Berkeley, CA' },
        { id: 5, name: 'University of Chicago', description: 'Chicago, IL' }
      ];
    case 'courses':
      return [
        { id: 1, name: 'Introduction to Computer Science', description: '10 weeks' },
        { id: 2, name: 'Advanced Algorithms', description: '12 weeks' },
        { id: 3, name: 'Database Systems', description: '8 weeks' },
        { id: 4, name: 'Machine Learning', description: '14 weeks' },
        { id: 5, name: 'Web Development', description: '6 weeks' }
      ];
    case 'industry/Sector':
      return [
        { id: 1, name: 'Technology', description: 'Industry focused on technology and innovations.' },
        { id: 2, name: 'Healthcare', description: 'Industry focused on health services and products.' },
        { id: 3, name: 'Finance', description: 'Industry focused on financial services and investments.' },
        { id: 4, name: 'Education', description: 'Industry focused on educational institutions and services.' },
        { id: 5, name: 'Retail', description: 'Industry focused on consumer goods and services.' }
      ];
    case 'marketplaceCategories':
      return [
        { id: 1, name: 'Electronics', description: 'Category for electronic devices and gadgets.' },
        { id: 2, name: 'Clothing', description: 'Category for clothing and fashion items.' },
        { id: 3, name: 'Home & Garden', description: 'Category for home improvement and gardening products.' },
        { id: 4, name: 'Sports & Outdoors', description: 'Category for sports equipment and outdoor gear.' },
        { id: 5, name: 'Health & Beauty', description: 'Category for health and beauty products.' }
      ];
    case 'qualifications':
      return [
        { id: 1, name: 'Bachelor of Science', description: 'Undergraduate degree in science.' },
        { id: 2, name: 'Master of Business Administration', description: 'Graduate degree in business administration.' },
        { id: 3, name: 'PhD in Computer Science', description: 'Doctoral degree in computer science.' },
        { id: 4, name: 'Certified Public Accountant', description: 'Professional certification in accounting.' },
        { id: 5, name: 'Project Management Professional', description: 'Certification for project management professionals.' }
      ];
    case 'siteTestimonials':
      return [
        { id: 1, name: 'John Doe', description: 'This platform has significantly improved my productivity.' },
        { id: 2, name: 'Jane Smith', description: 'The support team is very responsive and helpful.' },
        { id: 3, name: 'Acme Corp', description: 'A reliable platform with excellent features.' },
        { id: 4, name: 'Sarah Johnson', description: 'I love the user-friendly interface and functionalities.' },
        { id: 5, name: 'Michael Brown', description: 'Highly recommend it for professionals looking to streamline their work.' }
      ];
    case 'degreeClass':
      return [
        { id: 1, name: 'First Class', description: 'Top-tier degree classification.' },
        { id: 2, name: 'Second Class Upper', description: 'High standard degree classification.' },
        { id: 3, name: 'Second Class Lower', description: 'Moderate degree classification.' },
        { id: 4, name: 'Third Class', description: 'Basic degree classification.' },
        { id: 5, name: 'Pass', description: 'Minimum passing degree classification.' }
      ];
    case 'cvUploadGuideline':
      return [
        { id: 1, name: 'File Format', description: 'Accepted formats: PDF, DOCX' },
        { id: 2, name: 'File Size', description: 'Maximum size: 5MB' },
        { id: 3, name: 'Content', description: 'Include your personal details, work experience, and education.' },
        { id: 4, name: 'Layout', description: 'Use a clean and professional layout.' },
        { id: 5, name: 'File Naming', description: 'Use your full name as the file name.' }
      ];
    default:
      return [];
  }
};

const ContentPage = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'state' | 'institutions' | 'courses' | 'industry/Sector' | 'marketplaceCategories' | 'qualifications' | 'siteTestimonials' | 'degreeClass' | 'cvUploadGuideline'>('faq');
  const [openModal, setOpenModal] = useState<'add' | 'edit' | null>(null);
  const [selectedItem, setSelectedItem] = useState<ContentColumns | null>(null);
  const [data, setData] = useState(() => generateSampleData(activeTab));

  useEffect(() => {
    setData(generateSampleData(activeTab));
  }, [activeTab]);

  const closeModal = () => {
    setOpenModal(null);
    setSelectedItem(null);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setOpenModal('add');
  };

  const handleEdit = (item: ContentColumns) => {
    setSelectedItem(item);
    setOpenModal('edit');
  };

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('actions', {
      cell: ({ row: { original } }) => {
        const handleEditClick = () => handleEdit(original);

        return (
          <div className="flex gap-2">
            <Button variant="custom" label="Edit" onClick={handleEditClick} />
          </div>
        );
      },
      header: 'Actions',
    }),
  ];
  

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex justify-end mb-3">
        <Button
          label={`Add New ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          variant="black"
          onClick={handleAddNew}
        />
      </div>

      <div className="bg-gray-300 border-b border-gray-200 rounded-lg">
        <div className="flex p-1 overflow-auto gap-3">
          {['faq', 'state', 'institutions', 'courses', 'industry/Sector', 'marketplaceCategories', 'qualifications', 'siteTestimonials', 'degreeClass', 'cvUploadGuideline'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${activeTab === tab ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
              onClick={() => {
                setActiveTab(tab as typeof activeTab);
                setData(generateSampleData(tab));
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
          data={data}
          columns={columns}
          tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        />
      </div>
      
      <CategoryModal open={openModal === 'add' || openModal === 'edit'} selectedItem={selectedItem} onClose={closeModal} onSubmit={(data) => { console.log('Submitted Data:', data); closeModal(); }} currentTab={activeTab}></CategoryModal>
    </div>
  );
};

export default ContentPage;