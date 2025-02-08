import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import clsx from 'clsx';

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

interface JobProps {
  job: Jobs;
}

const JobCard: React.FC<JobProps> = ({ job }) => {
  const navigate = useNavigate();
  const { vId, jobTitle, specialization, dateCreated, jobDetails, companyName, companyEmail, keyResponsibilities, linkToApply, qualifications, location } = job;
  const [selectedItem, setSelectedItem] = useState<Jobs | null>(null);

  const handleViewDetails = async (item: Jobs) => {
    setSelectedItem(item);
    navigate(`/job/${item.vId}`, { state: { job: item } });
  };


  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }


  return (
    <Paper
      elevation={4}
      square={false}
      onClick={() => handleViewDetails(job)}
      className={clsx(
        "bg-white p-6 h-auto max-h-96 max-w-sm rounded-2xl",
        "transition-all duration-300 ease-in-out hover:shadow-lg"
      )}
    >
      <div className="flex flex-col space-y-4 gap-2">
        <Typography variant="h6" component="h3" className="font-semibold truncate">
          {jobTitle}
        </Typography>
        <Typography variant="h6" component='h4' className="text-gray-600 font-medium truncate">
          {companyName}
        </Typography>
        <div className='flex flex-col items-start justify-center gap-1'>
          <Typography variant="subtitle1" className="text-gray-500 truncate">
            {truncateText(companyEmail, 30)}
          </Typography>
          <Typography variant="subtitle1" className="text-gray-400">
            Posted on: {new Date(dateCreated).toLocaleDateString()}
          </Typography>
        </div>
        <div className="flex items-center text-gray-500">
          <LocationOnIcon fontSize='inherit' className="mr-1 text-sm" />
          <Typography variant="body2" className="truncate">
            {location}
          </Typography>
        </div>
      </div>
      <div className=" line-clamp-3 mt-4">
        <Typography 
          variant="body2" 
          fontSize='0.95rem'
          className="text-neutral-200 line-clamp-3"
        >
          {truncateText(jobDetails, 150)}
        </Typography>
      </div>
      <div className="flex justify-end mt-2">
        <button 
          type='button'
          onClick={() => handleViewDetails(job)}
          className="text-blue-600 text-sm hover:text-blue-800 hover:underline transition-colors duration-200"
        >
          Read More
        </button>
      </div>
    </Paper>
  )
}

export default JobCard;
