import { useCallback, useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { PaystackProps } from 'react-paystack/dist/types';
import { toast } from 'react-toastify';
import CONFIG from '../utils/helpers/config';
import { useAuth } from './../../libs/context/AuthContext';


const usePaystack = (
  onInitiated: (reference: string, response: any) => Promise<void>,
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
    console.log('Email:', emailString);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);

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
          console.log('Payment initiated:', response);
          onInitiated(response?.reference, response);
          console.log(response?.reference)
          console.log(response);
          setIsProcessing(false);
        },
        onClose: () => {
          setIsProcessing(false);
          toast.info('Payment dialog closed');
          onClose();
        },
      });

      console.log(config);
      console.log(initializePayment)
    }
    catch (err) {
      console.error('Error initializing payment:', err);
      toast.error('An error occurred while initializing the payment.');
      setIsProcessing(false);
    }
  }, [initializePayment, onInitiated, onClose, options, key]);

  return { payButtonFn, isProcessing };
};

export default usePaystack;