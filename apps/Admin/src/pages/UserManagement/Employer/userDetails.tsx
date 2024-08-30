import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Divider, CircularProgress } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface Employer {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  companyUrl: string;
  location: string;
  status: string;
};

const userDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<Employer | undefined>(location.state?.user);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      if (!user) {
        // Optionally handle fetching user if not provided via state
        setError('No user data provided');
      } else {
        setLoading(false);
        setUser(location.state?.user);
      }
  }, [user]);


  if (loading) return <CircularProgress />;

  if (error) return <Typography color="error">{error}</Typography>;

  if (!user) return <Typography>No user found</Typography>;

  return (
    <div className='p-6 bg-gray-50 mb-8'>
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/user-management')} />

      <div className="bg-white p-10 shadow-lg rounded-2xl transform transition-all duration-300 hover:shadow-2xl">
            <p className="mb-10 text-xl font-semibold text-gray-700 leading-relaxed">Employer Details</p>

            {/* <div className="mb-6">
              <span className="font-semibold text-gray-800">Id:</span> <span className="text-gray-600">{user.id}</span>
            </div> */}
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Name:</span> <span className="text-gray-600">{user.name}</span>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Email:</span>
                <a href={user.email} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 underline transition duration-200 hover:text-blue-800">
                    {user.email}
                </a>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">(Company) Website:</span>
                <a href={user.companyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 underline transition duration-200 hover:text-blue-800">
                    {user.companyUrl}
                </a>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Phone Number:</span> <span className="text-gray-600">{user.phoneNumber}</span>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Location:</span> <span className="text-gray-600">{user.location}</span>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Status:</span> <span className="text-gray-600">{user.status}</span>
            </div>
            <div className="mb-6">
                
            </div>
      </div>
    </div>
  )
}

export default userDetails