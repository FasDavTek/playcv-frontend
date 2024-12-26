import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { Paper, Pagination } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { Select, Radio } from '@video-cv/ui-components';
import { useFilters } from '@video-cv/hooks';
import { Images } from '@video-cv/assets';

const JobBoard = () => {
  const [jobs, setJobs] = useState(Array.from({ length: 10 }, (v, i) => i));

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobs(e.target.value === 'all' ? [1, 2, 3, 4] : [3, 4]);
  };

  return (
    <div>
      <div
        className="min-h-[230px] px-3 md:px-10 border flex py-10 flex-col gap-1"
        style={{
          backgroundImage: `url(${Images.HeaderBackground})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <h3 className="font-bold text-[72px] text-TColor-100 mt-6">
          Search for Job Listings{' '}
        </h3>
        <p className="text-lg text-TColor-100">
          Looking for Jobs? Browse our latest job openings to view and apply to
          best jobs today!
        </p>
      </div>
      <div className=" min-h-[400px] flex flex-col md:flex-row w-[95%] md:w-[90%] mx-auto gap-2 my-6 ">
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
              }}
            >
              Clear All
            </p>
          </div>
          <div className="p-3 mx-auto flex flex-col gap-3">
            {/* <Select
              options={[]}
              label="Date Posted"
              value={''}
              onChange={(value) => console.log(value)}
            /> */}

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
                  // variant="outlined"
                  square={false}
                  className="bg-white p-4 md:p-10"
                  key={val}
                >
                  <div className="flex justify-between">
                    <h4 className="font-bold">Job Title</h4>
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
                  <div className="flex justify-between mt-4">
                    <p className="font-bold">Deadline: Tomorrow</p>
                    <Link
                      className="text-base hover:underline"
                      to={'https://video-cv-upload.vercel.app/job-board/12345'}
                    >
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
