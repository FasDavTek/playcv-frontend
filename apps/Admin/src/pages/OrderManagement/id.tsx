import { useParams, useNavigate } from 'react-router-dom';

import { Button } from '@video-cv/ui-components';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


interface User {
  id: number;
  name: string;
  email: string;
  price: number;
  datePaid: string;
  phone: string;
  paymentType: string;
}

const users: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com', price: 150.00, datePaid: '2024-08-01', phone: '+1234567890', paymentType: 'Credit Card' },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com', price: 200.00, datePaid: '2024-08-02', phone: '+1234567891', paymentType: 'PayPal' },
  { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com', price: 180.00, datePaid: '2024-08-03', phone: '+1234567892', paymentType: 'Bank Transfer' },
  { id: 4, name: 'David Wilson', email: 'david.wilson@example.com', price: 220.00, datePaid: '2024-08-04', phone: '+1234567893', paymentType: 'Cash' },
  { id: 5, name: 'Eve Davis', email: 'eve.davis@example.com', price: 170.00, datePaid: '2024-08-05', phone: '+1234567894', paymentType: 'Credit Card' },
  { id: 6, name: 'Frank Harris', email: 'frank.harris@example.com', price: 210.00, datePaid: '2024-08-06', phone: '+1234567895', paymentType: 'PayPal' },
  { id: 7, name: 'Grace Clark', email: 'grace.clark@example.com', price: 190.00, datePaid: '2024-08-07', phone: '+1234567896', paymentType: 'Bank Transfer' },
  { id: 8, name: 'Henry Lewis', email: 'henry.lewis@example.com', price: 230.00, datePaid: '2024-08-08', phone: '+1234567897', paymentType: 'Cash' },
  { id: 9, name: 'Ivy Walker', email: 'ivy.walker@example.com', price: 160.00, datePaid: '2024-08-09', phone: '+1234567898', paymentType: 'Credit Card' },
  { id: 10, name: 'Jack Young', email: 'jack.young@example.com', price: 250.00, datePaid: '2024-08-10', phone: '+1234567899', paymentType: 'PayPal' },
];

const Id = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = users.find(user => user.id === parseInt(id as string));

  if (!user) {
    return (
      <div className="px-3 md:px-10 pt-4 pb-10">
        <p className="text-red-500">User not found.</p>
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
            <p className="">{user.name}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Email</h5>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Payment Type</h5>
            <p className="text-gray-900">{user.paymentType}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Date Paid</h5>
            <p className="text-gray-900">{user.datePaid}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Amount Paid</h5>
            <p className="text-gray-900">₦{user.price.toFixed(2)}</p>
          </div>
          <div className="flex flex-col">
            <h5 className="font-semibold text-lg text-gray-700">Phone</h5>
            <p className="text-gray-900">{user.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Id;
