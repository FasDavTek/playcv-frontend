import React, { ChangeEvent, useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import { Paper, Pagination, Box, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { Select, Radio, Input } from '@video-cv/ui-components';
import { useFilters } from '@video-cv/hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/autoplay';
import { EffectCreative, Autoplay } from 'swiper/modules';
import { Images } from '@video-cv/assets';
import { Button } from '@video-cv/ui-components';
import { mockJobs } from '../../utils/jobs';
import { JobCard } from '../../components';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';


const heroImages = [Images.HeroImage10, Images.HeroImage11, Images.HeroImage12, Images.HeroImage13, Images.HeroImage14];

const JobBoard = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isFilterApplied, setIsFilterApplied] = useState(false);

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
        return mockJobs.filter((job) => {
            const matchesText = job.title.toLowerCase().includes(searchText.toLowerCase());
            // const matchesCategory = setSelectedCategories.length === 0 || selectedCategories.includes(video.category);
            const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(job.location);
            const matchesDate = selectedDates.length === 0 || selectedDates.includes(job.postedTime);
            // const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
            // return matchesText && matchesCategory;
            return matchesText && matchesLocation && matchesDate /* && matchesStatus */ ;
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
    
    const handleCategoryChange = (e: React.ChangeEvent<{ value: string[] }>) => {
        setSelectedCategories(e.target.value);
        setIsFilterApplied(true);
    };

    const handleLocationChange = (e: ChangeEvent<{ value: string[] }>) => {
      setSelectedLocations(e.target.value);
      setIsFilterApplied(true);
    };
  
    const handleDateChange = (e: ChangeEvent<{ value: string[] }>) => {
      setSelectedDates(e.target.value);
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
            }}
            width='40%'
            height='100%'
          >
            <Swiper grabCursor={false} loop={true} autoplay={{ delay: 3000, disableOnInteraction: false }} speed={3000} effect={'creative'} creativeEffect={{ prev: { shadow: true, translate: ['-20%', 0, -1], }, next: { translate: ['100%', 0, 0] } }} modules={[EffectCreative, Autoplay]} style={{ width: '100%', maxWidth: '100%', height: '100%', borderRadius: '.75rem' }}>
                {heroImages.map((image: any, index: any) => (
                  <SwiperSlide key={index}>
                    <img className='!rounded-lg h-full' src={image} alt={`Hero image ${index + 1}`} style={{ width: '100%', objectFit: 'cover', maxWidth: '100%', borderRadius: 'lg' }} />
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
      <div className="bg-white min-h-[400px] flex flex-col md:flex-row w-[95%] md:w-[90%] mx-auto gap-2 my-6 ">
        {/* filter */}
        <div className="card-containers flex-[2] h-fit min-h-[200px]">
          <div className="border-b flex p-4 justify-between">
            <p className="font-bold" role="button" onClick={() => {}}>Filter</p>
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

            <Select
              options={categoryOptions.map(option => ({ label: option, value: option }))} // Replace with actual options
              label="Categories"
              placeholder="Select Category(s)"
              containerClass="flex-1"
              name="category"
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
            />

            <Select
              options={[]} // Replace with actual options
              label="Location"
              placeholder="Select Location"
              containerClass="flex-1"
              name="location"
              multiple
              value={selectedLocations}
              onChange={handleLocationChange}
            />

            <Select
              options={[]} // Replace with actual options
              label="Date Posted"
              placeholder="Select Date"
              containerClass="flex-1"
              name="datePosted"
              multiple
              value={selectedDates}
              onChange={handleDateChange}
            />

            <Radio
              label="Job Status"
              options={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'closed', label: 'Closed' },
              ]}
              // onChange={handleFilter}
              defaultValue={'all'}
              name="jobStatus"
              onChange={handleStatusChange}
              value={selectedStatus}
            />

            <div className=""></div>
          </div>
        </div>
        {/* job board */}
        <div className=" flex-[9] p-4">
          {/* Search box comes here */}

          {filteredJobs.length > 0 ? (
            <h4 className="font-black text-xl text-gray-700">{filteredJobs.length} Job Results</h4>
          ) : null}
          <div className="mt-10 mx-auto">
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              sx={{ color: 'black' }}
              className="font-bold text-3xl my-5">LATEST JOBS</Typography>
            <div className={`items-center grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {paginatedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 0}></Button>
                <Button icon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default JobBoard;
