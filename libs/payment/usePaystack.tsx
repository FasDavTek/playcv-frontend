import { useCallback, useState } from 'react';

// import PaystackPop from '@paystack/inline-js'

import { PaystackButton } from 'react-paystack';
import { HookConfig, PaystackProps } from 'react-paystack/dist/types';
import { toast } from 'react-toastify';
import CONFIG from '../utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from '../utils/localStorage';
import { postData } from '../utils/apis/apiMethods';
import { apiEndpoints } from '../utils/apis/apiEndpoints';
import React from 'react';

interface PaystackConfig {
  email: string;
  amount: number;
  currency: string;
  reference?: string;
}

interface VerifyPaymentResponse {
  status: string;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: any;
    log: any;
    fees: number;
    fees_split: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: any;
      risk_action: string;
    };
    plan: any;
    split: any;
    order_id: string;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    transaction_date: string;
    plan_object: any;
    subaccount: any;
  };
}

export interface PaymentDetails {
  id: number;
  email: string;
  reference: string;
  access_code?: string;
  status: string;
  transaction?: string;
  amount: number;
  currency: string;
  cardType?: string;
  cardDetails?: string;
  last_Four?: string;
  bank?: string;
  channelType?: string;
  paidAt?: string;
  createdAt?: string;
  added_fees?: number;
  duration?: string;
}

const usePaystack = (onSuccessCB: (reference: string, details: PaymentDetails) => void = () => {}, onCloseCB: () => void = () => {}) => {
	const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReference, setPaymentReference] = useState<PaymentDetails | null>(null);

  // const popup = new PaystackPop()
  
	const key = CONFIG.PAYSTACK;

  const verifyTransaction = async (reference: string): Promise<VerifyPaymentResponse> => {
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    const verifyPayment = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CONFIG.PAYSTACK}`,
        'Content-Type': 'application/json',
      }
    });

    return await verifyPayment.json();
  }
  
	const payButtonFn = useCallback( async(amount: number, email: string, firstName: string, lastName: string, phone?: number, metadata?: {}) => {
      if (!email || !email.includes('@')) {
        toast.error('Invalid email address');
        return;
      }
  
      if (amount <= 0) {
        toast.error('Invalid amount');
        return;
      }
  
      const amountInKobo = amount * 100;
      console.log(amountInKobo);
  
      const emailString = email.toString();
      console.log(emailString);
  
      const componentProps = ({
        email: emailString,
        amount: amountInKobo,
        publicKey: key,
        text: `Pay ${amountInKobo / 100} NGN}`,
        onSuccess: async (response: any) => {
          console.log(response);

          console.log(response.reference);

          try {
            setIsProcessing(false);
            const verifyPayment = await verifyTransaction(response.reference);
            console.log(verifyPayment);

            if (verifyPayment.data.status === "success") {
              const details: PaymentDetails = {
                id: verifyPayment.data.id,
                reference: verifyPayment.data?.reference,
                // access_code: verifyPayment.data?.access_code,
                amount: verifyPayment.data?.amount,
                currency: verifyPayment.data?.currency,
                email: verifyPayment.data?.customer?.email,
                status: verifyPayment.data?.status,
                transaction: response.transaction,
                cardType: verifyPayment.data?.authorization?.card_type,
                cardDetails: `${verifyPayment.data?.authorization?.brand || ''} || ${verifyPayment.data?.authorization?.card_type || ''}`,
                last_Four: verifyPayment.data?.authorization?.last4,
                bank: verifyPayment.data?.authorization?.bank,
                channelType: verifyPayment.data?.channel,
                paidAt: verifyPayment.data?.paid_at,
                createdAt: verifyPayment.data?.created_at,
                added_fees: verifyPayment.data?.fees,
                duration: (verifyPayment.data?.log?.time_spent).toString(),
              };

              console.log(details);

              setPaymentReference(details);
              toast.success('Payment Successful');
              onSuccessCB(verifyPayment.data.reference, details);
            }
            else {
              throw new Error('Payment verification failed');
            }
          }
          catch (err) {
            toast.error('An error occurred while verifying the payment.');
          }  
        },
        onClose: () => {
          setIsProcessing(false);
          toast.info('Payment dialog closed');
          onCloseCB();
        },
      });

      setIsProcessing(true); // Set processing state before rendering the button
      return <PaystackButton {...componentProps} />;
    },
    [ onSuccessCB,  ]
  );
  
  console.log(paymentReference)
	return { payButtonFn, isProcessing, paymentReference };
};

export default usePaystack;