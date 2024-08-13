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
  const [price, setPrice] = useState<number>(0);

  const { payButtonFn } = usePaystack(
    price,
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

  const ProceedToTypes = () => {
    navigate('/candidate/video-management/types')
  }

  return (
    <div className="bg-white p-5 lg:py-10 px-7 centered-modal-md rounded-lg">
      <p className=" text-gray-500 text-lg my-4">
        You are about to upload a new video. Please note that the upload must be completed within {PaymentTimingDeadlineInDays} days from the time of your upload request. 
        <br /> 
        If you agree to these terms, please proceed to payment.
      </p>
      <div className="flex gap-8 justify-center mt-5">
        <Button
          className="text-white bg-red-500"
          label="Cancel"
          onClick={onClose}
        />
        <Button
          variant='black'
          // className="bg-green-500 text-white "
          label="Accept"
          onClick={ProceedToTypes}
        />
      </div>
    </div>
  );
};

export default CreateVideConfirmationModal;