import React, { useState } from 'react';
import { Card, CardContent, Paper, Typography } from '@mui/material';
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

const JobCard: React.FC<JobProps> = ({ job }: any) => {
  const { vId, jobTitle, specialization, dateCreated, startDate, endDate, jobDetails, companyName, companyEmail, keyResponsibilities, linkToApply, qualifications, location } = job;
  const [selectedItem, setSelectedItem] = useState<Jobs | null>(null);
  const navigate = useNavigate();

  const handleViewDetails = async (item: Jobs) => {
    setSelectedItem(item);
    navigate(`/job/${item.vId}`);
  };


  // const truncateText = (text: string | undefined, maxLength: number) => {
  //   if (!text) return ""
  //   return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  // }

  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return "";
  
    const strippedText = text.replace(/<[^>]*>?/gm, "")
  
    const words = strippedText.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return strippedText;
  };


  return (
    <Card
      elevation={4}
      square={false}
      onClick={() => handleViewDetails(job)}
      // className={clsx(
      //   "bg-white py-6 px-4 h-72 w-[320px] rounded-2xl",
      //   "transition-all duration-300 ease-in-out hover:shadow-lg"
      // )}
      sx={{
        width: { xs: '300px', sm: '100%', md: '100%' },
        maxWidth: '300px',
        // boxShadow: { xs: '1', sm: '1', lg:'0'},
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        mx: 'auto',
        height: '100%',
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        '&:hover': {
          cursor: 'pointer',
          // boxShadow: '5',
          transform: "translateY(-5px)",
          boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        },
        touchAction: "manipulation"
      }}
    >
      <CardContent>
        <div className="flex flex-col gap-2">
          <Typography variant="h6" component="h5" className="font-semibold truncate">
            {jobTitle}
          </Typography>
          <Typography variant="subtitle1" component='h6' className="text-gray-600 font-medium truncate">
            {companyName}
          </Typography>
          <div className='flex flex-col items-start justify-center gap-1'>
            <Typography variant="subtitle2" className="text-gray-500 truncate">
              {truncateText(companyEmail, 30)}
            </Typography>
            <Typography variant="caption" className="text-gray-400">
              Posted on: {new Date(dateCreated).toLocaleDateString()}
            </Typography>
          </div>
          <div className='flex flex-row items-start justify-between gap-1'>
            <Typography variant="subtitle2" className="text-gray-500 truncate">
              Vacancy opens: {new Date(startDate).toLocaleDateString()}
            </Typography>
            <Typography variant="subtitle2" className="text-gray-400 truncate">
              Closes on: {new Date(endDate).toLocaleDateString()}
            </Typography>
          </div>
          <div className="flex items-center text-gray-500">
            <LocationOnIcon sx={{ fontSize: 'small' }} fontSize='small' className="mr-1 text-sm" />
            <Typography variant="body2" className="truncate">
              {location}
            </Typography>
          </div>
        </div>
        <div className=" line-clamp-3 mt-4">
          <Typography 
            variant="body2" 
            fontSize='0.85rem'
            className="text-neutral-200 line-clamp-3"
          >
            {truncateText(jobDetails, 100)}
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
      </CardContent>
    </Card>
  )
}

export default JobCard;
