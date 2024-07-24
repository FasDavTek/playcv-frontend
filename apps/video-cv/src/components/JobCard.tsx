import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    postedTime: string;
    description: string;
    // url: string;
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }: any) => (
  <Paper
    elevation={4}
    square={false}
    className="bg-white py-4 px-2 md:py-10 md:px-3 h-64"
    key={job.id}
  >
    <div className="flex flex-col">
      <h3 className="font-bold">{job.title}</h3>
      <Typography variant='subtitle2'>
        {job.company}
      </Typography>
      <div className="flex flex-col gap-2">
        <h5 className="font-semibold text-black">
          <LocationOnIcon sx={{ fontSize: '17px', color: 'gray', mr: '2px' }} />
            {job.location}
        </h5>
        <p className="font-light text-[.75rem] text-gray-500">
          {job.postedTime}
        </p>
      </div>
    </div>
    <div className="mt-4 text-pretty">
      {job.description}
    </div>
    <div className="flex justify-end">
      <Link className="text-base hover:underline" to="/job-board/12345">
        Read More...
      </Link>
    </div>
  </Paper>
);

export default JobCard;
