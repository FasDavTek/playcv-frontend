import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, CircularProgress, Box, Divider } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { getData } from '../../../../../../libs/utils/apis/apiMethods';
import CONFIG from '../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from '../../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import { SESSION_STORAGE_KEYS } from './../../../../../../libs/utils/sessionStorage';



interface SubAdmin {
    userDetails: {
        userId: string;
        userTypeId: number;
        status: string;
        businessName: string;
        totalRecords: number;
        email: string;
        fullName: string;
        firstName: string;
        middleName: string;
        lastName: string;
        phoneNo: string;
        dateOfBirth: string;
        gender: string;
        type: string;
        isActive: boolean;
        phoneVerification: any;
        isBusinessUser: boolean;
        isProfessionalUser: boolean;
        isAdmin: boolean;
        profileImage: string;
        isEmailVerified: boolean;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        lastLoginDate: string;
        genderId: any;
    },
    professionalDetails: {
        nyscStateCode: string;
        nyscStartYear: string;
        nyscEndYear: string;
        course: string;
        degree: string;
        institution: string;
        classOfDegree: string;
        coverLetter: string;
        dateCreated: string;
        degreeTypeId: any;
        degreeClassId: any;
        institutionId: any;
        courseId: any;
        businessName: string;
        industry: string;
        address: string;
        businessPhone: string;
        industryId: any;
        businessProfile: any;
    },
    businessDetails: {
        userId: string;
        businessName: string;
        industry: string;
        address: string;
        websiteUrl: string;
        contactPhone: string;
        businessEmail: string;
        contactName: string;
        contactPosition: string;
        fbLink: string;
        twitter: string;
        instagramUrl: string;
        industryId: any;
        isActive: boolean;
        id: any;
    }
};



const userDetails = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<SubAdmin>();

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

    const fetchUserDetails = useCallback(async () => {
        setLoading(true);
        try {
    
          const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.GET_USER}?userEmail=${email}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          if (response.code === '00') {
            const userInfo = response.userProfile;
            setUser(userInfo);
          }
        } 
        catch (error) {
          if (!token) {
            toast.error('Unable to load user profile. Please log in again.');
            navigate('/');
          }
          else {
            console.error('Error fetching user details:', error);
            toast.error('Failed to load user details');
          }
        } 
        finally {
          setLoading(false);
        }
      }, [email]);
    
    
    
      useEffect(() => {
        fetchUserDetails();
      }, [email]);


    if (loading) return <CircularProgress />;

    if (error) return <Typography color="error">{error}</Typography>;

    if (!user) return <Typography>No user found</Typography>;
    
  return (
    <Box className='px-6 py-3 bg-gray-50 mb-8'>
        <ChevronLeftIcon className="cursor-pointer text-7xl mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/user-management')} />

        <div className="bg-white p-10 shadow-lg rounded-2xl transform transition-all duration-300">
            <p className="mb-10 text-xl font-semibold text-gray-700 leading-relaxed">Super Admin Details</p>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Name:</span> <span className="text-gray-600">{`${user?.userDetails?.firstName} ${user?.userDetails?.middleName} ${user?.userDetails?.lastName}`}</span>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Email:</span>
                <a href={`mailto:${user?.userDetails?.email}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 underline transition duration-200 hover:text-blue-800">
                    {user?.userDetails?.email}
                </a>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Phone Number:</span> <span className="text-gray-600">{user?.userDetails?.phoneNo}</span>
            </div>
            {/* <div className="mb-6">
                <span className="font-semibold text-gray-800">Date of birth:</span> <span className="text-gray-600">{user?.userDetails?.dateOfBirth}</span>
            </div>
            <div className="mb-6">
                <span className="font-semibold text-gray-800">Gender:</span> <span className="text-gray-600">{user?.userDetails?.gender}</span>
            </div> */}
            <div className="mb-6">
                <span className="font-semibold text-gray-800">User Type:</span> <span className="text-gray-600">{user?.userDetails?.type}</span>
            </div>
            {/* <div className="mb-6">
                <span className="font-semibold text-gray-800">Status:</span> <span className="text-gray-600">{user?.userDetails?.isActive ? 'Active' : 'Inactive'}</span>
            </div> */}
        </div>
    </Box>
  )
}

export default userDetails