import React from 'react';

import { usePaystackPayment } from 'react-paystack';
import { HookConfig } from 'react-paystack/dist/types';
import { toast } from 'react-toastify';

const usePaystack = (
  amount: number,
  onCompleteCB?: () => void,
  onCloseCB?: () => void,
  options: Partial<HookConfig> = {}
) => {
  const config: HookConfig = {
    reference: new Date().getTime().toString(),
    email: 'user@example.com',
    amount: amount * 100,
    publicKey: 'pk_test_1507a32eacc6e969e3c63d30052f77e12f29f78f',
    currency: 'ngn',
    ...options,
  };

  const onSuccess = (reference: string) => {
    // console.log('Payment successful:', reference);
    toast.success('Payment Successful');
    onCompleteCB?.();
  };

  const onClose = () => {
    console.log('Payment dialog closed');
    toast.success('Payment dialog closed');
    onCloseCB?.();
  };
  const initializePayment = usePaystackPayment(config);
  const payButtonFn = () => initializePayment({ onSuccess, onClose });
  return { payButtonFn };
};

export default usePaystack;
