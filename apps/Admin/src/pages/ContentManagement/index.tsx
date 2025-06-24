import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Modal } from '@mui/material';
import { Button, SelectMenu, Table, useToast } from '@video-cv/ui-components';
import { CategoryModal } from './modals';
// import { ContentModal } from './modals';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';
import { useAllCountry } from './../../../../../libs/hooks/useAllCountries';
import { useAllState } from './../../../../../libs/hooks/useAllState';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import { getData } from 'libs/utils/apis/apiMethods';

const truncateText = (text: string, wordLimit: number) => {
  if (!text) return "";

  const strippedText = text.replace(/<[^>]*>?/gm, "")

  const words = strippedText.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return strippedText;
};

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

type category = Content & {
  name: string;
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
  const [activeTab, setActiveTab] = useState<'faq' | 'country' | 'state' | 'institution' | 'course' | 'category' | 'industry' | 'qualification' | 'sitetestimonial' | 'degreeclass' | 'cvguideline'>('faq');
  const [openModal, setOpenModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedItem, setSelectedItem] = useState<Content | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(1);

  const { showToast } = useToast();

  const { data: miscData, isLoading: isMiscLoading, error: miscError, refetch: refetchMiscData, } = useAllMisc({
    resource: React.useMemo(() => {
      switch (activeTab) {
        case "industry":
          return "industries"
        case "cvguideline":
          return "cv-guideline"
        case "degreeclass":
          return "degree-class"
        case "sitetestimonial":
          return "site-testimonials"
        case "category":
          return "video-category"
        default:
          return activeTab
      }
    }, [activeTab]),
    // page: 1,
    // limit: 100,
    download: true,
    enabled: activeTab !== 'country' && activeTab !== 'state',
    structureType: 'data',
  });

  const { data: countryData, isLoading: isCountryLoading, error: countryError, refetch: refetchCountryData, } = useAllCountry();
  const { data: stateData, isLoading: isStateLoading, error: stateError, refetch: refetchStateData } = useAllState();

  const getDataForActiveTab = useCallback(() => {
    let allData: any[] = []
    let totalRecords = 0

    switch (activeTab) {
      case "country":
        allData = countryData?.data || []
        break
      case "state":
        allData = stateData?.data || []
        break
      default:
        allData = miscData || []
    }

    totalRecords = allData.length
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedData = allData.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      totalRecords,
      currentPage,
      pageSize,
      totalPages: Math.ceil(totalRecords / pageSize),
    }
  }, [activeTab, countryData, stateData, miscData, currentPage, pageSize])

  useEffect(() => {
    if (refreshTrigger > 0) {
      if (activeTab === 'country') {
        refetchCountryData()
      } else if (activeTab === 'state') {
        refetchStateData()
      } else {
        refetchMiscData()
      }
    }
  }, [ refreshTrigger, activeTab ]);

  const handleContentUpdate = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
    if (activeTab === "country") {
      refetchCountryData()
    } else if (activeTab === "state") {
      refetchStateData()
    } else {
      refetchMiscData()
    }
  }, [activeTab, refetchCountryData, refetchStateData, refetchMiscData])

  const isLoading = isMiscLoading || isCountryLoading || isStateLoading;
  const error = miscError || countryError || stateError;


  const handleTabChange = (tab: 'faq' | 'country' | 'state' | 'institution' | 'course' | 'category' | 'industry' | 'qualification' | 'sitetestimonial' | 'degreeclass' | 'cvguideline') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const closeModal = () => {
    setOpenModal(null);
    setSelectedItem(null);
  };

  const handleAddNew = () => {
    setSelectedItem(null);
    setOpenModal('create');
  };

  const handleEdit = (item: Content) => {
    setSelectedItem(item);
    setOpenModal('edit');
  };

  const handleView = (item: Content) => {
    setSelectedItem(item);
    setOpenModal('view');
  };



  const handleDownloadCSV = useCallback(async () => {
    const queryParams = new URLSearchParams({
      download: 'true',
    }).toString();

    try {
      const { data } = getDataForActiveTab();

      if (!data || data.length === 0) {
        throw new Error("No data available to download");
      }
  
      // Convert JSON to CSV
      const csvContent = convertJsonToCsv(data);
  
      // Create a Blob from the CSV content
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showToast('Error downloading CSV', 'error');
    }
  }, []);



  const convertJsonToCsv = (data: any[]) => {
    if (data.length === 0) return "";
  
    // Flatten nested objects
    const flattenObject = (obj: any, prefix = "") => {
      return Object.keys(obj).reduce((acc, key) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          Object.assign(acc, flattenObject(obj[key], newKey));
        } else {
          acc[newKey] = obj[key];
        }
        return acc;
      }, {} as any);
    };
  
    const flattenedData = data.map((item) => flattenObject(item));
  
    // Extract headers from the first flattened object
    const headers = Object.keys(flattenedData[0]).join(",");
  
    // Map each object to a CSV row
    const rows = flattenedData.map((item) =>
      Object.values(item)
        .map((value) => {
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(",")
    );
  
    return [headers, ...rows].join("\n");
  };


  
  const getColumns = () => {
    const baseColumns = [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: "Description",
        cell: (info) => truncateText(info.getValue() as string || '', 10),
      }),
    ];


    const actionColumn = columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          {/* <Button variant='custom' label='View' onClick={() => handleView(row.original)} />
          <Button variant='custom' label='Edit' onClick={() => handleEdit(row.original)} />
          {activeTab === 'category' ? (
            <Button 
                variant={row.original.active ? 'red' : 'success'} 
                label={row.original.active ? 'Deactivate' : 'Activate'} 
            />
          ) : (
              row.original.status !== undefined && (
                  <Button 
                      variant={row.original.status ? 'red' : 'success'} 
                      label={row.original.status ? 'Deactivate' : 'Activate'} 
                  />
              )
          )} */}
          <SelectMenu
            options={[
              { label: "View", onClick: () => handleView(row.original), icon: <PreviewOutlinedIcon sx={{ fontSize: 'medium' }} />, },
              { label: "Edit", onClick: () => handleEdit(row.original), icon: <CreateOutlinedIcon sx={{ fontSize: 'medium' }} />, },
            ]}
            buttonVariant="text"
          />
        </div>
      )
    });

    switch (activeTab) {
      case 'faq':
        return [
          columnHelper.accessor('question', { header: 'Question' }),
          columnHelper.accessor('answer', { 
            header: 'Answer',
            cell: (info) => truncateText(info.getValue() as string || '', 10),
          }),
          // columnHelper.accessor('isActive', {
          //   header: 'Status',
          //   cell: (info) => info.getValue() ? 'Active' : 'Inactive'
          // }),
          actionColumn,
        ];
      case 'country':
        return [
          columnHelper.accessor('name', { header: 'Country Name' }),
          columnHelper.accessor('shortName', { header: 'Short Name' }),
          actionColumn,
        ]
      case 'state':
        return [
          columnHelper.accessor('name', { header: 'State Name' }),
          columnHelper.accessor('shortName', { header: 'Short Name' }),
          // columnHelper.accessor('countryId', { header: 'Country ID' }),
          actionColumn,
        ]
      case 'category':
        return [
          columnHelper.accessor('name', { header: 'Category Name' }),
          columnHelper.accessor('description', { 
            header: 'Description',
            cell: (info) => truncateText(info.getValue() as string || '', 10),
          }),
          columnHelper.accessor('active', {
            header: 'Status',
            cell: (info) => info.getValue() ? 'true' : 'false'
          }),
          actionColumn,
        ]
      case 'institution':
        return [
          columnHelper.accessor('institutionName', { header: 'Institution Name' }),
          columnHelper.accessor('location', { header: 'Location' }),
          actionColumn,
        ]
      case 'course':
        return [
          columnHelper.accessor('courseName', { header: 'Course Name' }),
          columnHelper.accessor('description', { 
            header: 'Description',
            cell: (info) => truncateText(info.getValue() as string || '', 10),
          }),
          actionColumn,
        ]
      case 'industry':
        return [
          columnHelper.accessor('name', { header: 'Industry Name' }),
          columnHelper.accessor('description', {
            header: 'Description',
            cell: (info) => truncateText(info.getValue() as string || '', 10),
          }),
          actionColumn,
        ]
      case 'qualification':
        return [
          ...baseColumns,
          columnHelper.accessor('shortName', { header: 'Short Name' }),
          columnHelper.accessor('shortDescription', { 
            header: 'Short Description',
            cell: (info) => truncateText(info.getValue() as string || '', 10),
          }),
          actionColumn,
        ]
      case 'sitetestimonial':
        return [
          columnHelper.accessor('name', { header: 'Name' }),
          columnHelper.accessor('testimonial', { 
            header: 'Testimonial',
            cell: (info) => truncateText(info.getValue() as string || '', 10),
          }),
          columnHelper.accessor('profileImage', { 
            header: 'Profile Image',
            cell: (info) => info.getValue() ? 'Uploaded' : 'Not Uploaded'
          }),
          actionColumn,
        ]
      case 'degreeclass':
        return [
          ...baseColumns,
          columnHelper.accessor('shortName', { header: 'Short Name' }),
          actionColumn,
        ]
      case 'cvguideline':
        return [
          columnHelper.accessor('guideline', { header: 'Guideline' }),
          columnHelper.accessor('description', { 
            header: 'Description',
            cell: (info) => truncateText(info.getValue() as string || '', 10),
          }),
          actionColumn,
        ]
      default:
        return [...baseColumns, actionColumn];
    }
  }

  const columns = getColumns();

  const tableData = useMemo(() => getDataForActiveTab(), [getDataForActiveTab])
  

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
          {['faq', 'country', 'state', 'category', 'institution', 'course', 'industry', 'qualification', 'sitetestimonial', 'degreeclass', 'cvguideline'].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium ${activeTab === tab ? 'text-white border-b-2 border-blue-600 bg-neutral-150 rounded-lg' : 'text-blue-600 hover:text-blue-600'}`}
              onClick={() => {
                handleTabChange(tab as typeof activeTab);
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Table
          loading={isLoading}
          data={tableData.data}
          columns={columns}
          error={error}
          search={setSearch}
          filter={filter}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          tableHeading={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          totalRecords={tableData.totalRecords}
          currentPage={tableData.currentPage}
          pageSize={tableData.pageSize}
          onPageChange={handlePageChange}
          totalPages={tableData.totalPages}
          onDownloadCSV={handleDownloadCSV}
        />
      </div>
      
      <Modal open={openModal === 'create' || openModal === 'edit' || openModal === 'view'} onClose={closeModal} sx={{ maxWidth: 'lg' }}>
        <>
          <CategoryModal open={true} selectedItem={selectedItem} onClose={closeModal} action={openModal} currentTab={activeTab} onContentUpdate={handleContentUpdate}></CategoryModal>
        </>
      </Modal>
    </div>
  );
};

export default ContentPage;