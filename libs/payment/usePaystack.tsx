import React, { useCallback, useState } from 'react';

import { usePaystackPayment } from 'react-paystack';
import { HookConfig } from 'react-paystack/dist/types';
import { toast } from 'react-toastify';
import CONFIG from '../utils/helpers/config';

const usePaystack = (
  amount: number,
  onCompleteCB?: (reference: string) => void,
  onCloseCB?: () => void,
  options: Partial<HookConfig> = {}
) => {
  const [paymentReference, setPaymentReference] = useState<string | null>(null);

  const key = CONFIG.PAYSTACK;

  const userData = localStorage.getItem('USER');
  const email = userData ? JSON.parse(userData).email : 'user@example.com';

  const config: HookConfig = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100,
    publicKey: key,
    currency: 'ngn',
    ...options,
  };

  const initializePayment = usePaystackPayment(config);
  
  const payButtonFn = useCallback(() => {
    initializePayment({
      ...config,
      onSuccess: (reference: string) => {
        setPaymentReference(reference);
        toast.success('Payment Successful');
        if (onCompleteCB) {
          onCompleteCB(reference);
        }
      },
      onClose: () => {
        console.log('Payment dialog closed');
        toast.success('Payment dialog closed');
        if (onCloseCB) {
          onCloseCB();
        }
      },
    })
   
  }, [amount, onCompleteCB, onCloseCB, options]);

  return { payButtonFn, paymentReference };
};

export default usePaystack;
