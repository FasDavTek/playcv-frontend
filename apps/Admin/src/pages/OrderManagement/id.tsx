import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { Button } from '@video-cv/ui-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import React, { useEffect, useState } from 'react';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';

interface PaymentDetails {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  datePaid: Date;
  phone: string;
  paymentType: string;
  paymentDescription: string;
}

const Id: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!id) {
        setError('Payment ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT_DETAILS}/${id}`);
        if (response.Success) {
          const data = await response.json();
          setPaymentDetails(data);
        } else {
          throw new Error('Failed to fetch payment details');
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setError('Failed to load payment details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [id]);


  if (isLoading) {
    return <div className="px-3 md:px-10 pt-4 pb-10">Loading...</div>;
  };


  return (
    <div className="px-3 md:px-10  pt-4 pb-10">
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/order-management')} />
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Name</h5>
            <p className="">{paymentDetails?.userName}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Email</h5>
            <p className="text-gray-900">{paymentDetails?.userEmail}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Payment Type</h5>
            <p className="text-gray-900">{paymentDetails?.paymentType}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Payment Description</h5>
            <p className="text-gray-900">{paymentDetails?.paymentDescription}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Date Paid</h5>
            <p className="text-gray-900">{(paymentDetails?.datePaid)?.toDateString()}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Amount Paid</h5>
            <p className="text-gray-900">₦{paymentDetails?.amount.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Phone</h5>
            <p className="text-gray-900">{paymentDetails?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Id;
