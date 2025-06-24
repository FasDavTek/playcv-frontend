import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { Button } from '@video-cv/ui-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import React, { useEffect, useState } from 'react';
import { handleDate } from '@video-cv/utils'
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { SESSION_STORAGE_KEYS } from './../../../../../libs/utils/sessionStorage';

interface PaymentDetails {
  id: number;
  customerFullname: string;
  customerEmailAddress: string;
  referenceId: string;
  quantity: number;
  productName: string;
  total: string;
  type: string;
  customerMobileNumber: string;
  subTotal: string;
  paymentDate: string;
}

const Id: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);


  const fetchPaymentDetails = async () => {
    setIsLoading(false);

    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT_DETAILS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.code === '00') {
        const paymentRecord = resp.data;
        setPaymentDetails(paymentRecord);
      }

    }
    catch (err) {

    }
  };


  useEffect(() => {
    fetchPaymentDetails();
  }, []);


  if (!paymentDetails && isLoading) {
    return (
      <div className="px-3 md:px-10 pt-4 pb-10">Loading...</div>
    );
  };


  return (
    <div className="px-3 md:px-10  pt-4 pb-10">
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/order-management')} />
      
      <div className="mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-4 lg:p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Customer Name:</h3>
              <p className="text-sm md:text-md text-gray-900">{paymentDetails?.customerFullname}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Customer Email:</h3>
              <p className="text-sm md:text-md text-gray-900">{paymentDetails?.customerEmailAddress}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Customer Phone:</h3>
              <p className="text-sm md:text-md text-gray-900">{paymentDetails?.customerMobileNumber}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Product Name:</h3>
              <p className="text-sm md:text-md text-gray-900">{paymentDetails?.productName}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Order ID:</h3>
              <p className="text-sm md:text-md text-gray-900">{paymentDetails?.referenceId}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Payment Date:</h3>
              <p className="text-sm md:text-md text-gray-900">{handleDate(paymentDetails?.paymentDate)}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Quantity:</h3>
              <p className="text-sm md:text-md text-gray-900">{paymentDetails?.quantity}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Amount Paid:</h3>
              <p className="text-sm md:text-md text-gray-900">₦{paymentDetails?.total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Id;
