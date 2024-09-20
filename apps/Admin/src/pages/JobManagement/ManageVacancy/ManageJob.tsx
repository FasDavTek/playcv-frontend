import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, CircularProgress, FormControl, InputLabel, MenuItem, SelectChangeEvent, } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Select, Button } from '@video-cv/ui-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


interface Job {
    id: number;
    title: string;
    startDate: string;
    location: string;
    employerName: string;
    companyImage: string;
    jobDetails: string;
    qualifications: string;
    keyResponsibilities: string;
    companyEmail: string;
    status: 'Active' | 'Expired' | 'Pending' | 'Rejected';
    jobUrl: string;
}

const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Rejected', label: 'Rejected' },
];

const ManageJob: React.FC  = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const [job, setJob] = useState<Job | undefined>(location.state?.job);

  const [status, setStatus] = useState<'Active' | 'Expired' | 'Pending' | 'Rejected'>('Active');
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!job) {
      // Optionally handle fetching job if not provided via state
      setError('No job data provided');
    } else {
      setLoading(false);
      setJob(location.state?.job);
      setStatus(job.status);
    }
  }, [job]);

  const handleStatusChange = (value: string) => {
    setStatus(value as 'Active' | 'Expired' | 'Pending' | 'Rejected');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simulate saving job data
      console.log('Job data saved:', { ...job, status });
      navigate('/admin/job-management', { state: { updatedJob: { ...job, status } }, });
    } catch (err) {
      setError('Failed to update job details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  if (error) return <Typography color="error">{error}</Typography>;

  if (!job) return <Typography>No job found</Typography>;

  return (
    <div className='p-6 bg-gray-50 mb-8'>
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/job-management')} />

      <div className="bg-white flex flex-col p-10 shadow-md rounded-2xl transform transition-all duration-300 hover:shadow-2xl">
        <div className='flex items-center justify-between w-full mb-3'>
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Company/Employer Name: </span> 
              <span className="text-xl font-semibold text-gray-700 leading-relaxed">{job. employerName}</span>
          </div>
          <img
            src={job?.companyImage}
            alt={job?.employerName}
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        

        <div className="transform flex-1 transition-all duration-300">
          <div className="mb-3 flex flex-col">
              <span className="font-semibold text-gray-800">Job Title: </span> 
              <span className="text-gray-600">{job.title}</span>
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
              <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline transition duration-200 hover:text-blue-800">Job URL</a>
          </div>

          <FormControl size='medium' margin="normal" variant="outlined">
              <Select
                  value={status}
                  onChange={handleStatusChange}
                  options={statusOptions}
                  label="Status"
                  // className=" bg-white border-gray-300 rounded-md w-56"
              >
                  {/* {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                      {option.label}
                  </MenuItem>
                  ))} */}
              </Select>
          </FormControl>

          <Box mt={4} display="flex" justifyContent="flex-end">
        <Button variant="success" color="primary" label={loading ? <CircularProgress size={24} color="inherit" /> : 'Save'} onClick={handleSave}>
          Save
        </Button>
      </Box>
        </div>
      </div>
    </div>
  );
};

export default ManageJob;
