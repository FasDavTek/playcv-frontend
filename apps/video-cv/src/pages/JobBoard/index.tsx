import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';

import { Select, Radio, Input, DatePicker } from '@video-cv/ui-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/autoplay';
import { EffectCreative, Autoplay } from 'swiper/modules';
import { Images } from '@video-cv/assets';
import { JobCard } from '../../components';
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

const heroImages = [Images.HeroImage16, Images.HeroImage17, Images.HeroImage18, Images.HeroImage2, Images.HeroImage3];

const JobBoard = () => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);

  const { control } = useForm();

  const [searchText, setSearchText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        const queryParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: itemsPerPage.toString(),
          ...(searchText && { Search: searchText }),
      })

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?${queryParams}`);

        if (resp.succeeded === true) {
          setJobs(resp.data);
        }
      }
      catch (err) {
        console.error('Error fetching jobs:', err);
      }
      finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [currentPage, itemsPerPage, searchText]);


  // const { data: countryData, isLoading: isCountryLoading } = useAllCountry();
  // const { data: stateData, isLoading: isStateLoading } = useAllState();


  useEffect(() => {
        const handleResize = () => {
          const screenWidth = window.innerWidth;
          setItemsPerPage(screenWidth >= 768 ? 30 : 10)
        };
    
        // Set the initial items per page based on screen width
        handleResize();
    
        // Add event listener to update items per page on resize
        window.addEventListener('resize', handleResize);
    
        // Clean up event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
  }, []);


  const filterJobs = () => {
      return jobs.filter((job) => {
          const matchesText = job.jobTitle.toLowerCase().includes(searchText.toLowerCase());
          const matcheseResponsibilities = job?.keyResponsibilities?.toLowerCase().includes(searchText.toLowerCase());
          const matchesQualifications = job?.qualifications?.toLowerCase().includes(searchText.toLowerCase());
          const matchesLocation = job.location?.toLowerCase().includes(searchText.toLowerCase())

          const matchesDate = !selectedDate || dayjs(job.dateCreated).isSame(selectedDate, "day");
          return (matchesText || matchesLocation || matcheseResponsibilities || matchesQualifications)  && matchesDate;

          // return (matchesText || matchesLocation || matcheseResponsibilities || matchesQualifications);
      });
  };
  
  const filteredJobs = filterJobs();
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

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

  const paginatedJobs = filteredJobs.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setIsFilterApplied(true);
    setCurrentPage(1);
  };

  const handleLocationChange = (value: any) => {
    if (value && value.name) {
      setSelectedLocation(value.name)
    } else {
      setSelectedLocation(null)
    }
    setIsFilterApplied(true)
    setCurrentPage(0)
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date)
    setCurrentPage(1)
  };

  // const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setFilterOptions(prev => ({ ...prev, selectedStatus: e.target.value }));
  //   setIsFilterApplied(true);
  // };
  
  const handleClearFilters = () => {
    setSearchText('');
    setSelectedDate(null)
    setIsFilterApplied(false);
    setCurrentPage(1)
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
            <p className="font-bold" role="button" onClick={() => {}}>Filter</p>
            <p className="text-red-500" role="button" onClick={handleClearFilters}>Clear All</p>
          </div>
          <div className="p-3 mx-auto flex flex-col gap-3">
            <Input
              label="Job Title"
              placeholder="Search..."
              containerClass="flex-1"
              name="role"
              value={searchText}
              onChange={handleSearchChange}
            />

            <Controller
              name='datePosted'
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  label="Date Posted"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
              )}
            />
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
            {/* <div className="flex justify-end gap-2 mt-4">
                <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 0}></Button>
                <Button icon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
            </div> */}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default JobBoard;
