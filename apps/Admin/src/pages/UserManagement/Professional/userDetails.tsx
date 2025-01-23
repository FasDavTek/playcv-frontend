import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Divider, CircularProgress } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface Professional {
  userBioDetails: {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phoneNo: string;
    dateOfBirth: string;
    gender: string;
    type: string;
    status: string;
    avatarUrl: string;
    [key: string]: any;
  }
};

const userDetails = () => {
  const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<Professional | undefined>(location.state?.user);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
          // Optionally handle fetching user if not provided via state
          setError('No user data provided');
        } else {
          setLoading(false);
        }
    }, [user]);


    if (loading) return <CircularProgress />;

    if (error) return <Typography color="error">{error}</Typography>;

    if (!user) return <Typography>No user found</Typography>;
  
  return (
    <div className='p-6 bg-gray-50 mb-8'>
      <ChevronLeftIcon className="cursor-pointer text-7xl mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/user-management')} />

      <div className="bg-white p-10 shadow-lg rounded-2xl transform transition-all duration-300">
        <p className="mb-10 text-xl font-semibold text-gray-700 leading-relaxed">Professional Details</p>

        {/* <div className="mb-6">
          <span className="font-semibold text-gray-800">Id:</span> <span className="text-gray-600">{user.id}</span>
        </div> */}
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Name:</span> <span className="text-gray-600">{`${user?.userBioDetails?.firstName} ${user?.userBioDetails?.middleName} ${user?.userBioDetails?.lastName}`}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Email:</span>
            <a href={`mailto:${user?.userBioDetails?.email}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 underline transition duration-200 hover:text-blue-800">
              {user?.userBioDetails?.email}
            </a>
        </div>
        {/* <div className="mb-6">
            <span className="font-semibold text-gray-800">Phone Number:</span> <span className="text-gray-600">{user??.phoneNumber}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Date of birth:</span> <span className="text-gray-600">{user??.dateOfBirth}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Gender:</span> <span className="text-gray-600">{user??.gender}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Institution:</span> <span className="text-gray-600">{user??.institution}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">CV Url:</span> 
            <a href={user??.cvUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 underline transition duration-200 hover:text-blue-800">
                {user??.cvUrl}
            </a>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Status:</span> <span className="text-gray-600">{user??.status}</span>
        </div> */}
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Phone Number:</span> <span className="text-gray-600">{user?.userBioDetails?.phoneNo}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Date of birth:</span> <span className="text-gray-600">{user?.userBioDetails?.dateOfBirth}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Gender:</span> <span className="text-gray-600">{user?.userBioDetails?.gender}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">User Type:</span> <span className="text-gray-600">{user?.userBioDetails?.type}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Status:</span> <span className="text-gray-600">{user?.userBioDetails?.status}</span>
        </div>
      </div>
    </div>
  )
}

export default userDetails