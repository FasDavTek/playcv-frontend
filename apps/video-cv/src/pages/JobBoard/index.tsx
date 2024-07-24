import React, { ChangeEvent, useState } from 'react';

import { Link } from 'react-router-dom';
import { Paper, Pagination, Box, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { Select, Radio, Input } from '@video-cv/ui-components';
import { useFilters } from '@video-cv/hooks';
import { Images } from '@video-cv/assets';
import { Button } from '@video-cv/ui-components';
import { mockJobs } from '../../utils/jobs';
import { JobCard } from '../../components';

interface Filters {
  title: string;
  category: string;
  location: string;
  datePosted: string;
  jobStatus: string;
}

const JobBoard = () => {
  const [filters, setFilters] = useState<Filters>({
    title: '',
    category: '',
    location: '',
    datePosted: '',
    jobStatus: 'all',
  });

  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  const handleFilter = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filteredJobs = mockJobs.filter((job: any) => {
    return (
      (filters.title ? job.title.includes(filters.title) : true) &&
      (filters.category ? job.category.includes(filters.category) : true) &&
      (filters.location ? job.location.includes(filters.location) : true) &&
      (filters.datePosted ? job.datePosted.includes(filters.datePosted) : true) &&
      (filters.jobStatus !== 'all' ? job.status === filters.jobStatus : true)
    );
  });

  return (
    <Box>
      <Box className="min-h-[500px] bg-[#F7FaFF] px-3 md:px-10 flex justify-center items-start py-10 flex-col gap-3">
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
            <Typography variant="h3" className="font-bold text-[42px] leading-[66px] md:leading-[72px] text-[#2c3e50]" sx={{ marginBottom: '1.25rem' }}>
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
      <div className="bg-white min-h-[400px] flex flex-col md:flex-row w-[95%] md:w-[90%] mx-auto gap-2 my-6 ">
        {/* filter */}
        <div className="card-containers flex-[2] h-fit min-h-[200px]">
          <div className="border-b flex p-4 justify-between">
            <p
              className="font-bold"
              role="button"
              onClick={() => {
                console.log('');
              }}
            >
              Filter
            </p>
            <p
              className="text-red-500"
              role="button"
              onClick={() => {
                console.log('');
                () => setFilters({
                  title: '',
                  category: '',
                  location: '',
                  datePosted: '',
                  jobStatus: 'all',
                })
              }}
            >
              Clear All
            </p>
          </div>
          <div className="p-3 mx-auto flex flex-col gap-3">
            <Input
              label="Role"
              placeholder="Search..."
              containerClass="flex-1"
              name="role"
              onChange={handleFilter}
              value={filters.title}
            />

            <Select
              options={categoryOptions.map(option => ({ label: option, value: option }))} // Replace with actual options
              label="Categories"
              placeholder="Select Category(s)"
              containerClass="flex-1"
              name="category"
              onChange={handleFilter}
              value={filters.category}
            />

            <Select
              options={[]} // Replace with actual options
              label="Location"
              placeholder="Select Location"
              containerClass="flex-1"
              name="location"
              onChange={handleFilter}
              value={filters.location}
            />

            <Select
              options={[]} // Replace with actual options
              label="Date Posted"
              placeholder="Select Date"
              containerClass="flex-1"
              name="datePosted"
              onChange={handleFilter}
              value={filters.datePosted}
            />

            <Radio
              label="Job Status"
              options={[
                { value: 'all', label: 'All' },
                { value: 'active', label: 'Active' },
              ]}
              onChange={handleFilter}
              defaultValue={'all'}
              name="jobStatus"
              value={filters.jobStatus}
            />

            <div className=""></div>
          </div>
        </div>
        {/* job board */}
        <div className=" flex-[9] p-4">
          {/* Search box comes here */}

          <h4 className="font-black text-xl text-gray-700">{filteredJobs.length} Job Results</h4>
          <div className="mt-10 mx-auto">
            <Typography
              variant="h5"
              fontWeight="bold"
              mb={2}
              sx={{ color: 'black' }}
              className="font-bold text-3xl my-5">LATEST JOBS</Typography>
            <div className={`items-center grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default JobBoard;
