// src/pages/InvoiceDetails.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { LOCAL_STORAGE_KEYS } from './../../../../../../libs/utils/localStorage';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { getData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

type InvoiceDetails = {
  id: number;
  customerFullName: string;
  customerEmailAddress: string;
  orderId: string;
  quantity: number;
  price: string;
  type: 'pinned' | 'upload';
  subTotal: string;
};
  

  

const InvoiceDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [invoice, setInvoice] = useState<InvoiceDetails | undefined>(location.state?.payments);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, watch, setValue, getValues, control, formState: { errors }, } = useForm({});

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

  console.log(id);
  console.log(invoice);

  const fetchInvoiceDetails = async () => {
    if (invoice && id) {
      setIsLoading(false);
      reset({
        id: invoice.id,
        customerFullName: invoice.customerFullName,
        customerEmailAddress: invoice.customerEmailAddress,
        orderId: invoice.orderId,
        quantity: invoice.quantity,
        price: invoice.price,
      })

      console.log(invoice);
    }
  };

  useEffect(() => {
    fetchInvoiceDetails();
  }, [id, invoice, token]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
        <p className="text-xl text-red-500">Invoice not found</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6">
          <p className="text-xl text-red-500">Invoice not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 mb-8">
        <ChevronLeftIcon className="cursor-pointer text-base mr-1 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/candidate/payment')} />
      <div className="mx-auto bg-white shadow-lg rounded-lg">
        <div className="p-4 lg:p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Customer Name:</h3>
              <p className="text-sm md:text-md text-gray-900">{invoice.customerFullName}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Customer Email:</h3>
              <p className="text-sm md:text-md text-gray-900">{invoice.customerEmailAddress}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Order ID:</h3>
              <p className="text-sm md:text-md text-gray-900">{invoice.orderId}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Quantity:</h3>
              <p className="text-sm md:text-md text-gray-900">{invoice.quantity}</p>
            </div>
            <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Price:</h3>
              <p className="text-sm md:text-md text-gray-900">₦{invoice.price}</p>
            </div>
            {/* <div>
              <h3 className="text-md md:text-lg font-medium text-gray-600">Subtotal:</h3>
              <p className="text-sm md:text-md text-gray-900">₦{invoice.subTotal}</p>
            </div> */}
            <div className="col-span-1 sm:col-span-2">
              <h3 className="text-md md:text-lg font-medium text-gray-600">Type:</h3>
              <p className="text-sm md:text-md text-gray-900">
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
