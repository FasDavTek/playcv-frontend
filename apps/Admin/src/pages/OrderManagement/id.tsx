import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@video-cv/ui-components';

const Id = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen px-3 md:px-10  pt-4 pb-10">
      <div className="mb-10">
        <Button
          variant="neutral"
          label="< Back"
          onClick={() => navigate('/order-management')}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <h5 className="font-bold text-xl">Customer Name</h5>
          <p className="">John Doe</p>
        </div>
        <div className="flex flex-col">
          <h5 className="font-bold text-xl">Payment Type</h5>
          <p className="">Pinned / Video Upload</p>
        </div>
        <div className="flex flex-col">
          <h5 className="font-bold text-xl">Date Paid</h5>
          <p className="">23/05/2024</p>
        </div>
        <div className="flex flex-col">
          <h5 className="font-bold text-xl">Amount paid</h5>
          <p className="">N 50000</p>
        </div>
      </div>
    </div>
  );
};

export default Id;
