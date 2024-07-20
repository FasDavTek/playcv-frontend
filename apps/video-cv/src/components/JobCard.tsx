import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface JobCardProps {
  job: any;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => (
  <Paper
    elevation={4}
    square={false}
    className="bg-white py-4 px-2 md:py-10 md:px-3"
    key={job.id}
  >
    <div className="flex flex-col">
      <h3 className="font-bold">Job Title</h3>
      <Typography variant='subtitle2'>
        Company Name
      </Typography>
      <div className="flex flex-col gap-2">
        <h5 className="font-semibold text-black">
          <LocationOnIcon sx={{ fontSize: '17px', color: 'gray', mr: '2px' }} />
          Location
        </h5>
        <p className="font-light text-[.75rem] text-gray-500">
          Posted 5 mins ago
        </p>
      </div>
    </div>
    <div className="mt-4 text-pretty">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Minus dolorem maiores consectetur consequuntur ad recusandae
      rerum sapiente quam doloribus accusantium aliquam repellat
      distinctio eum.
    </div>
    <div className="flex justify-end">
      <Link className="text-base hover:underline" to="/job-board/12345">
        Read More...
      </Link>
    </div>
  </Paper>
);

export default JobCard;
