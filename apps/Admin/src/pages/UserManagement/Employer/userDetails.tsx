import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Divider } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const userDetails = () => {
  const { id } = useParams();

  const employer = { id, name: 'Acme Corp', email: 'contact@acmecorp.com', role: 'Employer', status: 'Active' };
  const navigate = useNavigate();

  return (
    <div className='p-6 bg-gray-50 mb-8'>
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/user-management')} />

      <div className="bg-white p-10 shadow-lg rounded-2xl transform transition-all duration-300 hover:shadow-2xl">
            <p className="mb-10 text-xl font-semibold text-gray-700 leading-relaxed">Employer Details</p>

            <div className="mb-6">
              <span className="font-semibold text-gray-800">Id:</span> <span className="text-gray-600">{employer.id}</span>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Name:</span> <span className="text-gray-600">{employer.name}</span>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Email:</span>
                <a href={employer.email} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 underline transition duration-200 hover:text-blue-800">
                    {employer.email}
                </a>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Role:</span> <span className="text-gray-600">{employer.role}</span>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Status:</span> <span className="text-gray-600">{employer.status}</span>
            </div>
            <div className="mb-6">
                
            </div>
      </div>
    </div>
  )
}

export default userDetails