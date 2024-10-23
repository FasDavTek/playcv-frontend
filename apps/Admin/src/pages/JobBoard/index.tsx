import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { Paper, Pagination } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { Select, Radio, DatePicker } from '@video-cv/ui-components';
import { useFilters } from '@video-cv/hooks';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';

const JobBoard = () => {
  const [jobs, setJobs] = useState([1, 2, 3, 4]);

  const { control } = useForm();

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobs(e.target.value === 'all' ? [1, 2, 3, 4] : [3, 4]);
  };

  return (
    <div>
      <div className="h-[220px] px-10 border flex py-10 flex-col gap-3 bg-gray-100">
        <h3 className="font-bold text-3xl">Search for Job Listings </h3>
        <p className="text-md text-gray-500">
          Looking for Jobs? Browse our latest job openings to view and apply to
          best jobs today!
        </p>
      </div>
      <div className="bg-white min-h-[400px] flex w-[90%] mx-auto gap-2 my-6 ">
        {/* filter */}
        <div className="card-containers flex-[2] h-fit min-h-[500px]">
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
              }}
            >
              Clear All
            </p>
          </div>
          <div className="p-3 mx-auto flex flex-col gap-3">
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
              onChange={handleFilter}
              defaultValue={'all'}
            />

            <div className=""></div>
          </div>
        </div>
        {/* job board */}
        <div className=" flex-[9]  p-4">
          {/* Search box comes here */}

          <h4 className="font-black text-xl text-gray-700">250 Job Results</h4>
          <div className="mt-20 mx-auto">
            <h2 className="font-bold text-5xl my-5">LATEST JOBS</h2>
            <div className="flex flex-col gap-4">
              {jobs.map((val) => (
                <Paper
                  elevation={4}
                  variant="outlined"
                  square={false}
                  className="bg-white p-10"
                  key={val}
                >
                  <div className="flex justify-between">
                    <h4 className="font-bold text-3xl">Job Title</h4>
                    <div className="flex flex-col gap-2">
                      <h5 className="font-bold text-black">
                        <LocationOnIcon
                          sx={{ fontSize: '17px', color: 'gray', mr: '2px' }}
                        />
                        Location
                      </h5>
                      <p className="font-light text-gray-500">
                        Posted 5 mins ago
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Minus dolorem maiores consectetur consequuntur ad recusandae
                    rerum sapiente quam doloribus accusantium aliquam repellat
                    distinctio eum.
                  </div>
                  <div className="flex justify-end">
                    <Link className="text-base hover:underline" to="/">
                      Read More...
                    </Link>
                  </div>
                </Paper>
              ))}
              <div className="flex justify-end">
                <Pagination className="mt-5" size="large" count={10} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
