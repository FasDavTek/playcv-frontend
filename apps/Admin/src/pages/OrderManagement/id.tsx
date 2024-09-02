import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { Button } from '@video-cv/ui-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useEffect, useState } from 'react';

const Id = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    if (order) {
      setName(order.userName);
      setEmail(order.userEmail);
      setPrice(order.price);
      setDate(order.datePaid);
      setPhone(order.phone);
      setPaymentType(order.paymentType);
      setPaymentDescription(order.paymentDescription);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="px-3 md:px-10 pt-4 pb-10">
        <p className="text-red-500">Order not found.</p>
        <Button onClick={() => navigate('/admin/order-management')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="px-3 md:px-10  pt-4 pb-10">
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/order-management')} />
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Name</h5>
            <p className="">{name}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Email</h5>
            <p className="text-gray-900">{email}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Payment Type</h5>
            <p className="text-gray-900">{paymentType}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Payment Description</h5>
            <p className="text-gray-900">{paymentDescription}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Date Paid</h5>
            <p className="text-gray-900">{date}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Amount Paid</h5>
            <p className="text-gray-900">₦{price.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Phone</h5>
            <p className="text-gray-900">{phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Id;
