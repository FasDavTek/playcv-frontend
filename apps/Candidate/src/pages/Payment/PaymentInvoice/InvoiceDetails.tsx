// src/pages/InvoiceDetails.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

type ReportTableColumns = {
    id: number;
    videoName: string;
    quantity: number;
    price: string;
    type: 'pinned' | 'upload';
    subTotal: string;
    action: 'action';
  };
  
  const data = [
    {
      id: '1', // Unique identifier
      videoName: 'Introduction to TypeScript',
      quantity: 1,
      price: '15.00',
      type: 'upload',
      subTotal: '15.00',
    },
    {
      id: '2',
      videoName: 'Advanced React Patterns',
      quantity: 2,
      price: '25.00',
      type: 'pinned',
      subTotal: '50.00',
    },
    {
      id: '3',
      videoName: 'Node.js Best Practices',
      quantity: 3,
      price: '20.00',
      type: 'upload',
      subTotal: '60.00',
    },
    {
      id: '4',
      videoName: 'CSS Grid Layouts',
      quantity: 1,
      price: '10.00',
      type: 'pinned',
      subTotal: '10.00',
    },
    {
      id: '5',
      videoName: 'Fullstack Development with Next.js',
      quantity: 2,
      price: '30.00',
      type: 'upload',
      subTotal: '60.00',
    },
    {
      id: '6',
      videoName: 'Building REST APIs with Express',
      quantity: 4,
      price: '18.00',
      type: 'pinned',
      subTotal: '72.00',
    },
    {
      id: '7',
      videoName: 'GraphQL for Beginners',
      quantity: 1,
      price: '22.00',
      type: 'upload',
      subTotal: '22.00',
    },
    {
      id: '8',
      videoName: 'JavaScript ES6 Features',
      quantity: 5,
      price: '12.00',
      type: 'pinned',
      subTotal: '60.00',
    },
    {
      id: '9',
      videoName: 'Mastering Vue.js',
      quantity: 2,
      price: '27.00',
      type: 'upload',
      subTotal: '54.00',
    },
    {
      id: '10',
      videoName: 'Understanding Redux',
      quantity: 3,
      price: '19.00',
      type: 'pinned',
      subTotal: '57.00',
    },
  ];
  

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const invoice = data.find(item => item.id === id);

  if (!invoice) {
    return (
        <div className="p-6">
            <p className="text-xl text-red-500">Invoice not found</p>
        </div>
    );
  }

  return (
    <div className="p-6">
        <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/candidate/payment')} />
      <div className="mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-600">Video Name:</h3>
              <p className="text-lg text-gray-900">{invoice.videoName}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Quantity:</h3>
              <p className="text-lg text-gray-900">{invoice.quantity}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Price:</h3>
              <p className="text-lg text-gray-900">₦{invoice.price}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-600">Subtotal:</h3>
              <p className="text-lg text-gray-900">₦{invoice.subTotal}</p>
            </div>
            <div className="col-span-1 sm:col-span-2">
              <h3 className="text-lg font-medium text-gray-600">Type:</h3>
              <p className="text-lg text-gray-900">
                {invoice.type === 'upload' ? 'Upload' : 'Pinned'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
