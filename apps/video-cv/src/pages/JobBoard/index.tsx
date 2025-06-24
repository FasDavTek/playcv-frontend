import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import { Select, Radio, Input, DatePicker, Button } from '@video-cv/ui-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/autoplay';
import { EffectCreative, Autoplay } from 'swiper/modules';
import { Images } from '@video-cv/assets';
import { JobCard } from '../../components';
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined"
import FilterListIcon from '@mui/icons-material/FilterList';
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';
import { useAllCountry } from './../../../../../libs/hooks/useAllCountries';
import { useAllState } from './../../../../../libs/hooks/useAllState';
import model from './../../../../../libs/utils/helpers/model';

interface Jobs {
  vId: number;
  jobTitle: string;
  dateCreated: Date;
  startDate: Date;
  endDate: Date;
  jobDetails?: string;
  companyName?: string;
  companyEmail?: string;
  specialization: string;
  qualifications?: string;
  keyResponsibilities?: string;
  location: string;
  linkToApply?: string;
  status?: string;
    // url: string;
}

interface FilterOptions {
  searchText: string;
  selectedLocation: string | null;
  selectedDate: Date | null;
  selectedStatus: string;
}

interface VacancyProps {
  page?: number
  limit?: number
  Start_Date?: string
  endDate?: string
  jobTitle?: string
  status?: string;
}

// interface AppliedFilters {
//   jobTitle: string;
//   selectedLocation: string | null;
//   selectedDate: Date | null;
// }

const heroImages = [Images.HeroImage16, Images.HeroImage17, Images.HeroImage18, Images.HeroImage2, Images.HeroImage3];

const JobBoard = ({ page = 1, limit = 10, status = 'Active' }) => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [itemsPerPage, setItemsPerPage] = useState(limit);
  const [totalPages, setTotalPages] = useState(1)

  const { control, formState: { errors }, watch } = useForm();

  const [appliedFilters, setAppliedFilters] = useState({
    jobTitle: '',
    selectedLocation: null as string | null,
    selectedDate: null as Date | null,
  });

  const [currentFilters, setCurrentFilters] = useState({
    jobTitle: '',
    selectedLocation: null as string | null,
    selectedDate: null as Date | null,
  });

  // const [searchText, setSearchText] = useState('');
  // const [jobTitle, setJobTitle] = useState('');
  // const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  // const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  
  const { data: stateData, isLoading: isStateLoading, error: stateError, refetch: refetchStateData } = useAllState();

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        Page: currentPage.toString(),
        Limit: itemsPerPage.toString(),
        // ...(searchText && { Search: searchText }),
        ...(status && { Status: status }),
        ...(appliedFilters.jobTitle && { jobTitle: appliedFilters.jobTitle }),
        ...(appliedFilters.selectedLocation && { Location: appliedFilters.selectedLocation }),
        ...(appliedFilters.selectedDate && { Start_Date: dayjs(appliedFilters.selectedDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ") }),
    })

      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?${queryParams}`);

      if (resp.succeeded === true) {
        setJobs(resp.data);
        setTotalPages(Math.ceil(resp.totalRecords / itemsPerPage))
      }
    }
    catch (err) {
      console.error('Error fetching jobs:', err);
    }
    finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchJobs();
  }, [currentPage, itemsPerPage, status, appliedFilters]);


  // const filterJobs = () => {
  //     return jobs.filter((job) => {
  //         const matchesText = job.jobTitle.toLowerCase().includes(searchText.toLowerCase());
  //         const matcheseResponsibilities = job?.keyResponsibilities?.toLowerCase().includes(searchText.toLowerCase());
  //         const matchesQualifications = job?.qualifications?.toLowerCase().includes(searchText.toLowerCase());
  //         const matchesLocation = job.location?.toLowerCase().includes(searchText.toLowerCase())

  //         const matchesDate = !selectedDate || dayjs(job.dateCreated).isSame(selectedDate, "day");
  //         return (matchesText || matchesLocation || matcheseResponsibilities || matchesQualifications)  && matchesDate;

  //         // return (matchesText || matchesLocation || matcheseResponsibilities || matchesQualifications);
  //     });
  // };
  
  const filteredJobs = jobs;
  // const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);



  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);



  // const pageNumbers = useMemo(() => {
  //   const pages = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     pages.push(i);
  //   }
  //   return pages;
  // }, [totalPages]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage((prevPage) => prevPage + 1);
    }
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  // const paginatedJobs = filteredJobs.slice(
  //     currentPage * itemsPerPage,
  //     (currentPage + 1) * itemsPerPage
  // );

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchText(e.target.value);
  //   setIsFilterApplied(true);
  //   setCurrentPage(1);
  // };

  const handleJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setJobTitle(e.target.value);
    setCurrentFilters(prev => ({
      ...prev,
      jobTitle: e.target.value
    }));
    setIsFilterApplied(true);
    setCurrentPage(1);
  };

  const handleLocationChange = (value: any) => {
    // if (value && value.name) {
    //   setSelectedLocation(value.name)
    // } else {
    //   setSelectedLocation(null)
    // }
    setCurrentFilters(prev => ({
      ...prev,
      selectedLocation: value?.name || null
    }));
    setIsFilterApplied(true)
    setCurrentPage(0)
  };

  const handleDateChange = (date: Date | undefined) => {
    // if (date) {
    //   setSelectedDate(date)
    // }
    if (date) {
      setCurrentFilters(prev => ({
        ...prev,
        selectedDate: date || null
      }));
    }
    setCurrentPage(1)
    setIsFilterApplied(true)
  };

  // const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setFilterOptions(prev => ({ ...prev, selectedStatus: e.target.value }));
  //   setIsFilterApplied(true);
  // };

  const handleFilter = () => {
    // setAppliedFilters({
    //   jobTitle,
    //   selectedLocation,
    //   selectedDate,
    // });
    setAppliedFilters(currentFilters);
    setIsFilterApplied(true);
    setCurrentPage(1);
  };

  
  const handleClearFilters = () => {
    // setJobTitle('');
    // setSelectedDate(null);
    // setSelectedLocation(null);
    // setAppliedFilters({
    //   jobTitle: '',
    //   selectedLocation: null,
    //   selectedDate: null,
    // });
    setCurrentFilters({
      jobTitle: '',
      selectedLocation: null,
      selectedDate: null,
    });
    setAppliedFilters({
      jobTitle: '',
      selectedLocation: null,
      selectedDate: null,
    });
    setIsFilterApplied(false);
    setCurrentPage(1);
  };

  return (
    <Box>
      <Box className="min-h-[500px] bg-[#F7FaFF] px-3 md:px-16 flex justify-center w-full items-start py-10 flex-col gap-3">
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems='center' justifyContent='space-between' spacing={30} width='100%'>
          <Box className='!rounded-lg'
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'flex' },
              alignSelf: 'center',
              textAlign: 'center',
              height: '600px'
            }}
            width='40%'
          >
            <Swiper grabCursor={false} loop={true} autoplay={{ delay: 3000, disableOnInteraction: false }} speed={3000} effect={'creative'} creativeEffect={{ prev: { shadow: true, translate: ['-20%', 0, -1], }, next: { translate: ['100%', 0, 0] } }} modules={[EffectCreative, Autoplay]} style={{ width: '550px', alignItems: 'center', justifyContent: 'center', height: '600px', borderRadius: '.75rem' }}>
                {heroImages.map((image: any, index: any) => (
                  <SwiperSlide key={index}>
                    <img className='!rounded-lg h-full' src={image} alt={`Hero image ${index + 1}`} style={{ objectFit: 'contain', borderRadius: 'lg' }} />
                  </SwiperSlide>
                    
                ))}
            </Swiper>
          </Box>
          <Box flex={2} width={['100%', '70%']}>
            <Typography variant="h3" className="font-bold text-[42px] leading-[66px] md:leading-[72px] text-[#2c3e50]" fontSize={{ xs: '32px', md: '42px' }} sx={{ marginBottom: '1.25rem' }}>
              ACCELERATE YOUR CAREER
            </Typography>
            <Typography variant="h6" className="text-lg text-secondary mt-3">
              Discover the best job listings for young graduates tailored to your aspirations.
            </Typography>
            <Typography variant="body1" className="text-[#34495e]" sx={{ fontSize: '1.2rem', marginBottom: '1.875rem' }}>
              Announce your amazing business, inventions, products, and services as a young entrepreneur via your video profile
            </Typography>
            <div className="flex items-center gap-6 mt-6">
              <Typography variant="body2" className="text-lg" sx={{ fontSize: '1rem', color: '#7f8c8d' }}>
                Reach <span className="text-TColor-150 font-bold">50K+</span> Job Opportunities
              </Typography>
            </div>
          </Box>
        </Stack>
      </Box>
      <div className="bg-white min-h-[400px] flex flex-col lg:flex-row w-[95%] md:w-[90%] mx-auto gap-2 my-6 ">
        {/* filter */}
        <div className="card-containers  md:flex-[3.5] 2xl:flex-[2] h-fit min-h-[200px]">
          <div className="border-b flex p-4 justify-between">
            <p className="font-bold" role="button">Filter</p>
            <p className="text-red-500" role="button" onClick={handleClearFilters}>Clear All</p>
          </div>
          <div className="p-3 mx-auto flex flex-col gap-3">
            {/* <Input
              label="Search"
              placeholder="Search..."
              containerClass="flex-1"
              name="role"
              value={searchText}
              onChange={handleSearchChange}
            /> */}

            <Input
              label="Job Title"
              placeholder="Search Jobs"
              containerClass="flex-1"
              name="title"
              value={currentFilters.jobTitle}
              onChange={handleJobChange}
            />

            <Controller
              name='location'
              control={control}
              render={({ field }) => (
                <Select
                  name="Location"
                  control={control}
                  defaultValue={Array.isArray(stateData) ? stateData?.find(i => i.id === watch('stateId')) : null}
                  options={model(stateData, 'name', 'id')}
                  // handleChange={(newValue) => {
                  //   field.onChange(newValue?.value);
                  //   setSelectedLocation(newValue?.name);
                  // }}
                  handleChange={handleLocationChange}
                  isDisabled={isStateLoading}
                  errors={errors}
                  label={'Select Location'}
                />
              )}
            />

            <Controller
              name='dateCreated'
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Date Posted"
                  value={currentFilters.selectedDate}
                  onChange={handleDateChange}
                />
              )}
            />

            <Button variant="black" label={'Apply Filters'} onClick={handleFilter}></Button>
          </div>
        </div>

        <div className=" flex-[9] p-4">
          {/* Search box comes here */}

          {filteredJobs.length > 0 ? (
            <h4 className="font-medium text-lg text-gray-700">{filteredJobs.length} Job Results</h4>
          ) : (
            <h4 className="font-medium text-lg text-gray-700">No jobs match your search criteria.</h4>
          )}
          <div className="mt-10 mx-auto">
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              sx={{ color: 'black' }}
              className="font-bold text-3xl my-5">LATEST JOBS</Typography>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center md:justify-items-start`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {filteredJobs.map((job: Jobs) => (
                  <JobCard key={job.vId} job={job} />
              ))}
              {/* <JobCardBoard filterOptions={filterOptions} /> */}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1.45rem' }} />} variant={currentPage === 1 ? 'custom' : 'black'} onClick={handlePrevPage} disabled={currentPage === 0}></Button>

              {pageNumbers.map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="text-sm text-gray-600">...</span>
                ) :
                (
                  <Button
                    key={`page-${page}-${index}`}
                    variant={currentPage === page ? 'black' : 'custom'}
                    label={page.toString()}
                    onClick={() => handlePageChange(page as number)}
                    className={currentPage === page ? 'active text-sm' : ''}
                  />
                )
              ))}

              <Button icon={<NavigateNextIcon sx={{ fontSize: '1.45rem' }} />} variant={currentPage === totalPages ? 'custom' : 'black'} onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default JobBoard;
