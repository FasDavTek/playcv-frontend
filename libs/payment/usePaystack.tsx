import { useCallback, useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { PaystackProps } from 'react-paystack/dist/types';
import { toast } from 'react-toastify';
import CONFIG from '../utils/helpers/config';
import { useAuth } from './../../libs/context/AuthContext';

const usePaystack = (
  onSuccess: (response: any) => Promise<void>,
  onClose: () => void = () => {},
  options: Partial<PaystackProps> = {}
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { authState } = useAuth();
  
  const key = CONFIG.PAYSTACK;

  const email = authState?.user?.username || '';

  const initializePayment = usePaystackPayment({
    ...options,
    publicKey: key,
  });

  const payButtonFn = useCallback(async (amount: number, email: string, firstName: string, lastName: string, phone?: any, metadata?: any) => {
    if (!email || !email.includes('@')) {
      toast.error('Invalid email address');
      return;
    }

    if (amount <= 0) {
      toast.error('Invalid amount');
      return;
    }

    const amountInKobo = amount * 100;

    const emailString = email.toString().trim();

    const config: PaystackProps = {
      email: email,
      amount: amountInKobo,
      publicKey: key,
      metadata: {
        firstName,
        lastName,
        phone,
        ...metadata,
      },
      ...options,
    }

    try {
      setIsProcessing(true);
      initializePayment({
        config,
        onSuccess: (response: any) => {
          onSuccess(response);
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
          toast.info('Payment dialog closed');
          onClose();
        },
      });
    }
    catch (err) {
      toast.error('An error occurred while initializing the payment.');
      setIsProcessing(false);
    }
  }, [initializePayment, onSuccess, onClose, options, key]);

  return { payButtonFn, isProcessing };
};

export default usePaystack;