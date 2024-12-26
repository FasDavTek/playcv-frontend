import React, { ChangeEvent, useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { Paper, Pagination, Box, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { Select, Radio, DatePicker, Input, Button } from '@video-cv/ui-components';
import { useFilters } from '@video-cv/hooks';
import { Images } from '@video-cv/assets';
import { Controller, useForm } from 'react-hook-form';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import dayjs from 'dayjs';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import JobCard  from '../../../../video-cv/src/components/JobCard';

interface Jobs {
  id: string;
  jobTitle: string;
  datePosted: Date;
  startDate: Date;
  endDate: Date;
  description?: string;
  companyName?: string;
  specialization: string;
  location: string;
}


type Option = {
  label: string;
  value: string;
};


const JobBoard = () => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [locationOptions, setLocationOptions] = useState<Option[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?Page=1&Limit=100`);
        if (resp.status === 200) {
          setJobs(resp.data);

          // const categories: Option[] = [...new Set(resp.data.map((job: Jobs) => job.specialization))].map(cat => ({
          //   label: cat,
          //   value: cat,
          // }));
  
          // const locations: Option[] = [...new Set(resp.data.map((job: Jobs) => job.location))].map(loc => ({
          //   label: loc,
          //   value: loc,
          // }));
  
          // setCategoryOptions(categories);
          // setLocationOptions(locations);
        }
        else {
          console.error('Unable to fetch jobs:', resp.message);
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
  }, []);

  const { control } = useForm();

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 768) {
        setItemsPerPage(30);
      } else {
        setItemsPerPage(10);
      }
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
        const matchesText = job.specialization.toLowerCase().includes(searchText.toLowerCase());

        const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(job.location);
        
        const jobDate = dayjs(job.datePosted).startOf('day');
        const matchesDate = selectedDates.length === 0 || selectedDates.some(date => 
          dayjs(date).startOf('day').isSame(jobDate)
        );
        // const matchesCategory = setSelectedCategories.length === 0 || selectedCategories.includes(job.category);
        // return matchesText && matchesCategory;
        return matchesText && matchesLocation && matchesDate;
    });
  };

  const filteredJobs = filterJobs();
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const handlePrevPage = () => {
      if (currentPage > 0) {
          setCurrentPage((prevPage) => prevPage - 1);
      }
  };

  const handleNextPage = () => {
      if (currentPage < totalPages - 1) {
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
  };

  const handleCategoryChange = (newValue: any) => {
      setSelectedCategories(newValue ? [newValue.value] : []);
      setIsFilterApplied(true);
  };

  const handleLocationChange = (newValue: any) => {
    setSelectedLocations(newValue ? [newValue.value] : []);
    setIsFilterApplied(true);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(e.target.value);
    setIsFilterApplied(true);
  };

  const handleClearFilters = () => {
      setSearchText('');
      setSelectedCategories([]);
      setSelectedLocations([]);
      setSelectedDates([]);
      setSelectedStatus('all');
      setIsFilterApplied(false);
  };


  // const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setJobs(e.target.value === 'all' ? [] : '');
  // };

  return (
    <Box>
      <Box className="min-h-[500px] px-10 flex justify-center items-start py-10 flex-col gap-3 bg-[#F7FaFF]">
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems='center' spacing={4}>
          <Box className='!rounded-lg'
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'block' },
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            <img className='!rounded-lg'
              src={Images.HeroImage}
              alt="Job search illustration"
              style={{ maxWidth: '80%', height: 'auto', borderRadius: 'lg' }}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="h2" className="font-bold text-[42px] leading-[66px] md:leading-[72px] text-[#2c3e50]" sx={{ marginBottom: '1.25rem' }}>
              Find Your Dream Job
            </Typography>
            <Typography variant="h6" className="text-lg text-secondary mt-3">
              Explore thousands of job listings and find the one that's perfect for you.
            </Typography>
            <Typography variant="body1" className="text-[#34495e]" sx={{ fontSize: '1.2rem', marginBottom: '1.875rem' }}>
              Connect with top companies and get started on your career journey today!
            </Typography>
            <div className="flex items-center gap-6 mt-6">
              <Typography variant="body2" className="text-lg" sx={{ fontSize: '1rem', color: '#7f8c8d' }}>
                Reach <span className="text-TColor-150 font-bold">50K+</span> Job Opportunities
              </Typography>
            </div>
          </Box>
        </Stack>
      </Box>
      <div className="bg-white min-h-[400px] flex w-[90%] mx-auto gap-2 my-6 ">
        {/* filter */}
        <div className="card-containers flex-[2] h-fit min-h-[500px]">
          <div className="border-b flex p-4 justify-between">
            <p className="font-bold" role="button" onClick={() => {console.log('');}}>Filter</p>
            <p className="text-red-500" role="button" onClick={handleClearFilters}>Clear All</p>
          </div>
          <div className="p-3 mx-auto flex flex-col gap-3">
            <Input
                label="Role"
                placeholder="Search..."
                containerClass="flex-1"
                name="role"
                value={searchText}
                onChange={handleSearchChange}
              />

          {/* <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <Select
                  name="Categories"
                  options={categoryOptions}
                  control={control}
                  placeholder="Select Categories"
                  defaultValue={selectedCategories[0]}
                  handleChange={handleCategoryChange}
                />
              )}
            />

            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select
                  name="Location"
                  options={locationOptions}
                  control={control}
                  placeholder="Select Location"
                  defaultValue={selectedLocations[0]}
                  handleChange={handleLocationChange}
                />
              )}
            /> */}

            <Controller
                name='datePosted'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Date Posted"
                    value={value}
                    onChange={(newValue) => onChange(dayjs(newValue))}
                  />
                )}
              />

            <Radio
              label="Job Status"
              options={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
              ]}
              name="jobStatus"
              onChange={handleStatusChange}
              value={selectedStatus}
            />

            <div className=""></div>
          </div>
        </div>
        {/* job board */}
        <div className=" flex-[9]  p-4">
          {/* Search box comes here */}

          {filteredJobs.length > 0 ? (
            <h4 className="font-black text-xl text-gray-700">{filteredJobs.length} Job Results</h4>
          ) : null}
          <div className="mt-20 mx-auto">
            <h5 className="font-bold text-5xl my-5">LATEST JOBS</h5>
            <div className={` items-center grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {/* {paginatedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))} */}
              <div className="flex justify-end gap-2 mt-4">
                <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 0}></Button>
                <Button icon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default JobBoard;
