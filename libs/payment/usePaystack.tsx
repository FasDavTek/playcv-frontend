import React, { useCallback, useState } from 'react';

import { usePaystackPayment } from 'react-paystack';
import { HookConfig } from 'react-paystack/dist/types';
import { toast } from 'react-toastify';
import CONFIG from '../utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from '../utils/localStorage';
import { postData } from '../utils/apis/apiMethods';
import { apiEndpoints } from '../utils/apis/apiEndpoints';

const usePaystack = (
  amount: number,
  onCompleteCB?: (reference: string) => void,
  onCloseCB?: () => void,
  options: Partial<HookConfig> = {}
) => {
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const key = CONFIG.PAYSTACK;

  const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
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

  // const processPayment = async (paymentDetails: PaymentDetails) => {
  //   setIsProcessing(true);
  //   try {
  //     const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, paymentDetails);
  //     if (response.isSuccess) {
  //       toast.success('Payment processed successfully');
  //       return true;
  //     } else {
  //       toast.error('Failed to process payment');
  //       return false;
  //     }
  //   }
  //   catch (error) {
  //     console.error('Error processing payment:', error);
  //     toast.error('An error occurred while processing payment');
  //     return false;
  //   } 
  //   finally {
  //     setIsProcessing(false);
  //   }
  // };
  
  const payButtonFn = useCallback(() => {
    initializePayment({
      ...config,
      onSuccess: async (reference: string) => {
        setPaymentReference(reference);
          toast.success('Payment Successful');
          if (onCompleteCB) {
            onCompleteCB(reference);
          }
      },
      onClose: () => {
        setIsProcessing(false);
        console.log('Payment dialog closed');
        toast.success('Payment dialog closed');
        if (onCloseCB) {
          onCloseCB();
        }
      },
    })
   
  }, [amount, onCompleteCB, onCloseCB, options, config]);

  return { payButtonFn, paymentReference, isProcessing };
};

export default usePaystack;
