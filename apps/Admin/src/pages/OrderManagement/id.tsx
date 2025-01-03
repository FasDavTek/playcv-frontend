import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { Button } from '@video-cv/ui-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import React, { useEffect, useState } from 'react';
import { handleDate } from '@video-cv/utils'
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

interface PaymentDetails {
  id: string;
  customerFullName: string;
  customerEmailAddress: string;
  price: number;
  orderId: string;
  quantity: number;
  dateCreated: string;
  customerMobileNumber: string;
  paymentMethod: string;
  paymentDescription: string;
}

const Id: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | undefined>(location.state?.payments);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!id) {
        setError('Invalid Payment ID');
        setIsLoading(false);
        return;
      }

      if (paymentDetails && id) {
        setIsLoading(false);
        id: paymentDetails.id;
        customerFullName: paymentDetails.customerFullName;
        customerEmailAddress: paymentDetails.customerEmailAddress;
        price: paymentDetails.price;
        orderId: paymentDetails.orderId;
        quantity: paymentDetails.quantity;
        dateCreated: paymentDetails.dateCreated;
        customerPhoneNumber: paymentDetails.customerMobileNumber;
        paymentMethod: paymentDetails.paymentMethod;
      }
    };

    fetchPaymentDetails();
  }, [id]);


  if (isLoading) {
    return (
      <div className="px-3 md:px-10 pt-4 pb-10">Loading...</div>
    );
  };


  return (
    <div className="px-3 md:px-10  pt-4 pb-10">
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/order-management')} />
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Name</h5>
            <p className="">{paymentDetails?.customerFullName}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Email</h5>
            <p className="text-gray-900">{paymentDetails?.customerEmailAddress}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Payment Type</h5>
            <p className="text-gray-900">{paymentDetails?.paymentMethod}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Payment Description</h5>
            <p className="text-gray-900">{paymentDetails?.paymentDescription}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Date Paid</h5>
            <p className="text-gray-900">{handleDate(paymentDetails?.dateCreated)}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Amount Paid</h5>
            <p className="text-gray-900">₦{paymentDetails?.price.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Phone</h5>
            <p className="text-gray-900">{paymentDetails?.customerMobileNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Id;
