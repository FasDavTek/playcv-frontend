import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import clsx from 'clsx';

interface Job {
  vId: string;
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

interface JobProps {
  job: Job;
}

const JobCard: React.FC<JobProps> = ({ job }: any) => {
  const { vId, jobTitle, specialization, dateCreated, jobDetails, companyName, companyEmail, keyResponsibilities, linkToApply, qualifications, views, location } = job;
  return (
    <Paper
      elevation={4}
      square={false}
      className={clsx(
        "bg-white p-4 h-72 max-w-[400px] flex flex-col justify-between",
        "transition-all duration-300 ease-in-out hover:shadow-lg"
      )}
      key={job.vId}
    >
      <div className="flex flex-col space-y-1 gap-2">
        <Typography variant="h5" component="h3" className="font-bold truncate">
          {jobTitle}
        </Typography>
        <Typography variant="h6" component='h4' className="text-gray-600 font-medium truncate">
          {companyName}
        </Typography>
        <div className='flex items-center gap-3'>
          <Typography variant="subtitle1" className="text-gray-500 truncate">
            {companyEmail}
          </Typography>
          <Typography variant="subtitle1" className="text-gray-400">
            Posted on: {new Date(dateCreated).toLocaleDateString()}
          </Typography>
        </div>
        <div className="flex items-center text-gray-500">
          <LocationOnIcon fontSize="small" className="mr-1" />
          <Typography variant="body2" className="truncate">
            {location}
          </Typography>
        </div>
      </div>
      <div className="flex-grow overflow-hidden mt-3">
        <Typography 
          variant="body2" 
          fontSize='1.125rem'
          className="text-gray-700 line-clamp-3"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {jobDetails}
        </Typography>
      </div>
      <div className="flex justify-end mt-2">
        <Link
          to={`/job/${vId}`}
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
        >
          Read More
        </Link>
      </div>
    </Paper>
  )
}

export default JobCard;
