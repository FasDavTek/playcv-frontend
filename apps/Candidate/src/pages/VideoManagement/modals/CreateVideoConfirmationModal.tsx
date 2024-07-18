import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button } from '@video-cv/ui-components';
import { PaymentTimingDeadlineInDays } from '@video-cv/constants';
import { ModalTypes } from '../';
import { usePaystack } from '@video-cv/payment';

const CreateVideConfirmationModal = ({
  onClose,
}: // onAccept,
{
  onClose: (e?: any) => void;
  // onAccept: (e: ModalTypes) => void;
}) => {
  const navigate = useNavigate();
  const { payButtonFn } = usePaystack(
    () => {
      console.log('onSuccess callback');
      navigate('/video-management?uploadModal=true');
    },
    () => {
      console.log('onFailure callback');
    }
  );
  const ProceedToPayment = () => {
    // TODO: Redirect to paystack to make payment
    payButtonFn();
    onClose();
  };

  return (
    <div className="bg-white p-10 lg:p-14 centered-modal-md rounded-lg">
      <p className="text-center text-gray-500 text-lg my-4">
        You are about to upload a new video, note that uploading video is done
        within an assigned window of {PaymentTimingDeadlineInDays} days, This
        means that if you create an upload request, you have until{' '}
        {PaymentTimingDeadlineInDays} days from now to upload your video.
        <br /> If you accept this, kindly proceed to payment
      </p>
      <div className="flex gap-4 justify-center mt-3">
        <Button
          className="text-white bg-red-500"
          label="Cancel"
          onClick={onClose}
        />
        <Button
          className="bg-green-500 text-white "
          label="Accept"
          onClick={ProceedToPayment}
        />
      </div>
    </div>
  );
};

export default CreateVideConfirmationModal;
