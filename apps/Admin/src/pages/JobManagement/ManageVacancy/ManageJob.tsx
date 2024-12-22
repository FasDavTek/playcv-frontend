import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, CircularProgress, FormControl, InputLabel, MenuItem, SelectChangeEvent, } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Select, Button } from '@video-cv/ui-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { LOCAL_STORAGE_KEYS } from './../../../../../../libs/utils/localStorage';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${import.meta.env.VITE_CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})


interface Job {
    vId: number;
    jobTitle: string;
    startDate: string;
    location: string;
    locationId: number;
    companyName: string;
    companyImage: string;
    jobDetails: string;
    qualifications: string;
    keyResponsibilities: string;
    companyEmail: string;
    status: 'Active' | 'Expired' | 'Pending' | 'Rejected';
    statusId: number;
    linkToApply: string;
    coverURL: string;
    action: string;
}

const ManageJob: React.FC  = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vId } = useParams<{ vId: any }>();

  const [job, setJob] = useState<Job | undefined>(location.state?.job);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      if (!job && vId) {
        setLoading(true);
        try {
          const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
          const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_BY_ID}/${vId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.succeeded) {
            setJob(response.data);
          } else {
            setError('Failed to fetch job details');
          }
        } catch (err) {
          console.error('Error fetching job:', err);
          setError('An error occurred while fetching job details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJob();
  }, [job, vId]);


  if (loading) return <CircularProgress />;

  if (error) return <Typography color="error">{error}</Typography>;

  if (!job) return <Typography>No job found</Typography>;

  return (
    <div className='p-6 bg-gray-50 mb-8'>
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/job-management')} />

      <div className="bg-white flex flex-col p-10 shadow-md rounded-2xl transform transition-all duration-300">
        <div className='flex items-center justify-between w-full mb-3'>
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Company/Employer Name: </span> 
              <span className="text-xl font-semibold text-gray-700 leading-relaxed">{job.companyName}</span>
          </div>
          <img
            src={job?.companyImage}
            alt={job?.companyName}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        

        <div className="transform flex-1 transition-all duration-300">
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Job Title: </span> 
              <span className="text-gray-600">{job.jobTitle}</span>
          </div>
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Job Details: </span> 
              <span className="text-gray-600">{job.jobDetails}</span>
          </div>
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Location: </span> 
              <span className="text-gray-600">{job.location}</span>
          </div>
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Start Date: </span> 
              <span className="text-gray-600">{job.startDate}</span>
          </div>
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Qualifications: </span> 
              <span className="text-gray-600">{job.qualifications}</span>
          </div>
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Key Responsibilities: </span> 
              <span className="text-gray-600">{job.keyResponsibilities}</span>
          </div>
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Company Email: </span> 
              <a href={job.companyEmail} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline transition duration-200 hover:text-blue-800">{job.companyEmail}</a>
          </div>
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Application link: </span> 
              <a href={job.linkToApply} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline transition duration-200 hover:text-blue-800">{job.linkToApply}</a>
          </div>
          <div className="mb-3 flex flex-col">
            <span className="font-semibold text-gray-800">Status: </span> 
            <span className="text-gray-600">{job.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageJob;
