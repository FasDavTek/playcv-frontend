import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, FormControl, InputLabel, MenuItem, CircularProgress } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Button, Select } from '@video-cv/ui-components';
import { watch } from 'fs';
import model from './../../../../../../libs/utils/helpers/model';
import { Controller } from 'react-hook-form';

interface JobStatusModalProps {
  open: boolean;
  onClose: () => void;
  job: {
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
  };
  onUpdate: (id: number, updates: { status: string }) => void;
}

const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Expired', label: 'Expired' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Rejected', label: 'Rejected' },
];

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const JobStatusModal: React.FC<JobStatusModalProps> = ({ open, onClose, job, onUpdate }) => {
  if (!job) {
    return null; // or some fallback UI
  }

  const [status, setStatus] = useState<'Active' | 'Expired' | 'Pending' | 'Rejected'>(job.status);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (value: string) => {
    setStatus(value as 'Active' | 'Expired' | 'Pending' | 'Rejected');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onUpdate(job.id, { status });
      onClose(); // Close modal after successful update
    } catch (error) {
      console.error('Error updating status:', error);
      // Handle error (e.g., show a toast notification)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} className="p-6 bg-white rounded-lg shadow-lg">
        <span className="text-lg font-semibold text-gray-700 leading-relaxed mb-4">Manage Job Status</span>
        <Box display="flex" flexDirection="row" gap={4} mb={4}>
          <img
            src={job.companyImage}
            alt={job.employerName}
            className="w-20 h-20 rounded-full object-cover"
          />
          <Box flex={1} className="transform transition-all duration-300">
            <div className="mb-6 flex flex-col">
                <span className="font-semibold text-gray-800">Job Title: </span> 
                <span className="text-xl font-semibold text-gray-700 leading-relaxed">{job.title}</span>
            </div>
            <div className="mb-6 flex flex-col">
                <span className="font-semibold text-gray-800">Company/Employer Name: </span> 
                <span className="text-gray-600">{job.employerName}</span>
            </div>
            <div className="mb-6 flex flex-col">
                <span className="font-semibold text-gray-800">Job Details: </span> 
                <span className="text-gray-600">{job.jobDetails}</span>
            </div>
            <div className="mb-6 flex flex-col">
                <span className="font-semibold text-gray-800">Location: </span> 
                <span className="text-gray-600">{job.location}</span>
            </div>
            <div className="mb-6 flex flex-col">
                <span className="font-semibold text-gray-800">Start Date: </span> 
                <span className="text-gray-600">{job.startDate}</span>
            </div>
            <div className="mb-6 flex flex-col">
                <span className="font-semibold text-gray-800">Qualifications: </span> 
                <span className="text-gray-600">{job.qualifications}</span>
            </div>
            <div className="mb-6 flex flex-col">
                <span className="font-semibold text-gray-800">Key Responsibilities: </span> 
                <span className="text-gray-600">{job.keyResponsibilities}</span>
            </div>
            <div className="mb-6 flex flex-col">
                <span className="font-semibold text-gray-800">Company Email: </span> 
                <a href={job.companyEmail} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline transition duration-200 hover:text-blue-800">{job.companyEmail}</a>
            </div>
            <div className="mb-6 flex flex-col">
                <span className="font-semibold text-gray-800">Application link: </span> 
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline transition duration-200 hover:text-blue-800">Job URL</a>
            </div>

            <FormControl size='medium' margin="normal" variant="outlined">
                {/* <Select
                    value={status}
                    onChange={handleStatusChange}
                    options={statusOptions}
                    label="Status"
                >
                </Select>
                <Controller
                  {...register('userProfile.businessDetails.industryId')}
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={statusOptions}
                      placeholder="Select Status"
                    />
                  )}
              />
                 */}
            </FormControl>
          </Box>
        </Box>
        
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={onClose} variant="red" color="secondary" label="Cancel" className="bg-red-600 text-white hover:bg-red-700"></Button>
          <Button onClick={handleSubmit} variant="success" color="primary" label={loading ? <CircularProgress size={24} color="inherit" /> : 'Save'} className="bg-green-600 text-white hover:bg-green-700"></Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default JobStatusModal;
