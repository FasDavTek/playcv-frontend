import React, { useState, forwardRef, Ref } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import { PaymentTimingDeadlineInDays } from '@video-cv/constants';
import { usePaystack } from '@video-cv/payment';

interface CreateAdsConfirmationModalProps {
  onClose: (e?: any) => void;
}

const CreateAdsConfirmationModal = forwardRef<HTMLDivElement, CreateAdsConfirmationModalProps>(
  ({ onClose }, ref: Ref<HTMLDivElement>) => {
    const navigate = useNavigate();
    const [price, setPrice] = useState<number>(0);

    // const { payButtonFn } = usePaystack(
    //   price,
    //   () => {
    //     console.log('onSuccess callback');
    //     navigate('/advertisement-management?uploadModal=true');
    //   },
    //   () => {
    //     console.log('onFailure callback');
    //   }
    // );

    // const ProceedToPayment = () => {
    //   payButtonFn();
    //   onClose();
    // };

    const ProceedToTypes = () => {
      navigate('/admin/advertisement-management/types');
    };

    return (
      <div ref={ref} className="bg-white p-5 lg:py-10 px-7 centered-modal-md rounded-lg" tabIndex={0}>
        <p className="text-gray-500 text-lg my-4">
          You are about to upload a new ad. Please note that the upload must be completed within {PaymentTimingDeadlineInDays} days from the time of your upload request.
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
            label="Accept"
            onClick={ProceedToTypes}
          />
        </div>
      </div>
    );
  }
);

CreateAdsConfirmationModal.displayName = "CreateAdsConfirmationModal";

export default CreateAdsConfirmationModal;