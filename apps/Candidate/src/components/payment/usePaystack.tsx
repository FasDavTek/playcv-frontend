import React from 'react';

import { usePaystackPayment } from 'react-paystack';

const usePaystack = (onCompleteCB?: () => void, onCloseCB?: () => void) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: 'user@example.com',
    amount: 20000, //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: 'pk_test_1507a32eacc6e969e3c63d30052f77e12f29f78f',
    currency: 'ngn',
  };

  // you can call this function anything
  const onSuccess = (reference: string) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
    onCompleteCB?.();
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log('closed');
    onCloseCB?.();
  };
  const initializePayment = usePaystackPayment(config);
  const payButtonFn = () => initializePayment({ onSuccess, onClose });
  return { payButtonFn };
};

export default usePaystack;
