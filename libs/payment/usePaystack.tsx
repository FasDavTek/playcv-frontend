// import { useCallback, useState } from 'react';

// // import PaystackPop from '@paystack/inline-js'

// import { usePaystackPayment } from 'react-paystack';
// import { HookConfig, PaystackProps } from 'react-paystack/dist/types';
// import { toast } from 'react-toastify';
// import CONFIG from '../utils/helpers/config';
// import { LOCAL_STORAGE_KEYS } from '../utils/localStorage';
// import { postData } from '../utils/apis/apiMethods';
// import { apiEndpoints } from '../utils/apis/apiEndpoints';
// import React from 'react';

// interface PaystackConfig {
//   email: string;
//   amount: number;
//   currency: string;
//   reference?: string;
// }

// interface VerifyPaymentResponse {
//   status: string;
//   message: string;
//   data: {
//     id: number;
//     domain: string;
//     status: string;
//     reference: string;
//     amount: number;
//     message: string;
//     gateway_response: string;
//     paid_at: string;
//     created_at: string;
//     channel: string;
//     currency: string;
//     ip_address: string;
//     metadata: any;
//     log: any;
//     fees: number;
//     fees_split: any;
//     authorization: {
//       authorization_code: string;
//       bin: string;
//       last4: string;
//       exp_month: string;
//       exp_year: string;
//       channel: string;
//       card_type: string;
//       bank: string;
//       country_code: string;
//       brand: string;
//       reusable: boolean;
//       signature: string;
//       account_name: string;
//     };
//     customer: {
//       id: number;
//       first_name: string;
//       last_name: string;
//       email: string;
//       customer_code: string;
//       phone: string;
//       metadata: any;
//       risk_action: string;
//     };
//     plan: any;
//     split: any;
//     order_id: string;
//     paidAt: string;
//     createdAt: string;
//     requested_amount: number;
//     transaction_date: string;
//     plan_object: any;
//     subaccount: any;
//   };
// }

// export interface PaymentDetails {
//   id: number;
//   email: string;
//   reference: string;
//   access_code?: string;
//   status: string;
//   transaction?: string;
//   amount: number;
//   currency: string;
//   cardType?: string;
//   cardDetails?: string;
//   last_Four?: string;
//   bank?: string;
//   channelType?: string;
//   paidAt?: string;
//   createdAt?: string;
//   added_fees?: number;
//   duration?: string;
// }

// const usePaystack = (onSuccessCB: (reference: string, details: PaymentDetails) => void = () => {}, onCloseCB: () => void = () => {}, options: Partial<HookConfig> = {}) => {
// 	const [isProcessing, setIsProcessing] = useState(false);
//  const [paymentReference, setPaymentReference] = useState<PaymentDetails | null>(null);
  
// 	const key = CONFIG.PAYSTACK;

//   const verifyTransaction = async (reference: string): Promise<VerifyPaymentResponse> => {
//     const url = `https://api.paystack.co/transaction/verify/${reference}`;
//     const verifyPayment = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${CONFIG.PAYSTACK}`,
//         'Content-Type': 'application/json',
//       }
//     });

//     return await verifyPayment.json();
//   }
  
// 	const payButtonFn = useCallback( async(amount: number, email: string, firstName: string, lastName: string, phone?: number, metadata?: {}) => {
//       if (!email || !email.includes('@')) {
//         toast.error('Invalid email address');
//         return;
//       }
  
//       if (amount <= 0) {
//         toast.error('Invalid amount');
//         return;
//       }
  
//       const amountInKobo = amount * 100;
//       console.log(amountInKobo);
  
//       const emailString = email.toString();
//       console.log(emailString);

//       const config: HookConfig = {
//         email: emailString,
//         amount: amountInKobo,
//         publicKey: key,
//         ...options,
//       }

//       const initializePayment = usePaystackPayment(config);
  
//       setIsProcessing(true);

//       initializePayment({
//         ...config,
//         onSuccess: async (response: any) => {
//           console.log(response);

//           console.log(response.reference);
//           setIsProcessing(false);
//           try {
//             const verifyPayment = await verifyTransaction(response.reference);
//             console.log(verifyPayment);

//             if (verifyPayment.data.status === "success") {
//               const details: PaymentDetails = {
//                 id: verifyPayment.data.id,
//                 reference: verifyPayment.data?.reference,
//                 // access_code: verifyPayment.data?.access_code,
//                 amount: verifyPayment.data?.amount,
//                 currency: verifyPayment.data?.currency,
//                 email: verifyPayment.data?.customer?.email,
//                 status: verifyPayment.data?.status,
//                 transaction: response.transaction,
//                 cardType: verifyPayment.data?.authorization?.card_type,
//                 cardDetails: `${verifyPayment.data?.authorization?.brand || ''} || ${verifyPayment.data?.authorization?.card_type || ''}`,
//                 last_Four: verifyPayment.data?.authorization?.last4,
//                 bank: verifyPayment.data?.authorization?.bank,
//                 channelType: verifyPayment.data?.channel,
//                 paidAt: verifyPayment.data?.paid_at,
//                 createdAt: verifyPayment.data?.created_at,
//                 added_fees: verifyPayment.data?.fees,
//                 duration: (verifyPayment.data?.log?.time_spent).toString(),
//               };

//               console.log(details);

//               setPaymentReference(details);
//               toast.success('Payment Successful');
//               onSuccessCB(verifyPayment.data.reference, details);
//             }
//             else {
//               throw new Error('Payment verification failed');
//             }
//           }
//           catch (err) {
//             toast.error('An error occurred while verifying the payment.');
//           }  
//         },
//         onClose: () => {
//           setIsProcessing(false);
//           toast.info('Payment dialog closed');
//           onCloseCB();
//         },
//       });

//     },
//     [ key, verifyTransaction, onSuccessCB, onCloseCB ]
//   );
  
//   console.log(paymentReference)
// 	return { payButtonFn, isProcessing, paymentReference };
// };

// export default usePaystack;














// import { useCallback, useState } from 'react';

// // import PaystackPop from '@paystack/inline-js'

// import { usePaystackPayment } from 'react-paystack';
// import { HookConfig, PaystackProps } from 'react-paystack/dist/types';
// import { toast } from 'react-toastify';
// import CONFIG from '../utils/helpers/config';
// import { useAuth } from './../../libs/context/AuthContext';

// interface PaystackConfig {
//   email: string;
//   amount: number;
//   currency: string;
//   reference?: string;
// }

// interface VerifyPaymentResponse {
//   status: string;
//   message: string;
//   data: {
//     id: number;
//     domain: string;
//     status: string;
//     reference: string;
//     amount: number;
//     message: string;
//     gateway_response: string;
//     paid_at: string;
//     created_at: string;
//     channel: string;
//     currency: string;
//     ip_address: string;
//     metadata: any;
//     log: any;
//     fees: number;
//     fees_split: any;
//     authorization: {
//       authorization_code: string;
//       bin: string;
//       last4: string;
//       exp_month: string;
//       exp_year: string;
//       channel: string;
//       card_type: string;
//       bank: string;
//       country_code: string;
//       brand: string;
//       reusable: boolean;
//       signature: string;
//       account_name: string;
//     };
//     customer: {
//       id: number;
//       first_name: string;
//       last_name: string;
//       email: string;
//       customer_code: string;
//       phone: string;
//       metadata: any;
//       risk_action: string;
//     };
//     plan: any;
//     split: any;
//     order_id: string;
//     paidAt: string;
//     createdAt: string;
//     requested_amount: number;
//     transaction_date: string;
//     plan_object: any;
//     subaccount: any;
//   };
// }

// export interface PaymentDetails {
//   id: number;
//   email: string;
//   reference: string;
//   access_code?: string;
//   status: string;
//   transaction?: string;
//   amount: number;
//   currency: string;
//   cardType?: string;
//   cardDetails?: string;
//   last_Four?: string;
//   bank?: string;
//   channelType?: string;
//   paidAt?: string;
//   createdAt?: string;
//   added_fees?: number;
//   duration?: string;
// }

// const usePaystack = (
//   onSuccessCB: (reference: string, details: PaymentDetails) => void = () => {},
//   onCloseCB: () => void = () => {},
//   options: Partial<PaystackProps> = {}
// ) => {
// 	const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentReference, setPaymentReference] = useState<PaymentDetails | null>(null);
//   const { authState } = useAuth();
  
// 	const key = CONFIG.PAYSTACK;

//   const email = authState?.user?.username || '';
//   const phone = authState?.user?.phone || ""

//   const verifyTransaction = async (reference: string): Promise<VerifyPaymentResponse> => {
//     const url = `https://api.paystack.co/transaction/verify/${reference}`;
//     const verifyPayment = await fetch(url, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${CONFIG.PAYSTACK}`,
//         'Content-Type': 'application/json',
//       }
//     });

//     return await verifyPayment.json();
//   }

//   const initializePayment = usePaystackPayment({
//     ...options,
//     publicKey: key,
//     email: '',
//     amount: 0,
//   });

//   // const initializePaymentPromise = async (config: PaystackProps): Promise<any> => {
//   //   try {
//   //     const response = await new Promise((resolve, reject) => {
//   //       const onClose = () => {
//   //         reject(new Error('Payment window closed'));
//   //         onCloseCB();
//   //       };

//   //       initializePayment({
//   //         ...config,
//   //         onClose,
//   //       });
//   //     });
      
//   //     // Handle successful payment response here (e.g., verify transaction and call onSuccessCB)
//   //     return response;
//   //   } catch (err) {
//   //     console.error('Error initializing payment:', err);
//   //     toast.error('An error occurred while initializing the payment.');
//   //     throw err;
//   //   }
//   // };

  
// 	const payButtonFn = useCallback( async(amount: number, email: string, firstName: string, lastName: string, phone?: number) => {
//       if (!email || !email.includes('@')) {
//         toast.error('Invalid email address');
//         return;
//       }
  
//       if (amount <= 0) {
//         toast.error('Invalid amount');
//         return;
//       }
  
//       const amountInKobo = amount * 100;
//       console.log(amountInKobo);

//       const emailString = email.toString().trim();
//       console.log('Email:', emailString);

//       const config: PaystackProps = {
//         email: emailString,
//         amount: amountInKobo,
//         publicKey: key,
//         firstname: firstName,
//         lastname: lastName,
//         phone,
//       }

//       console.log('Paystack config:', config);

//       try {
//         setIsProcessing(true);
//         initializePayment({
//           ...config,
//           onSuccess: async (response: any) => {
//             console.log(response);

//             console.log(response.reference);
//             // setIsProcessing(false);
            
//             try {
//               const verifyPayment = await verifyTransaction(response.reference);
//               console.log(verifyPayment);

//               if (verifyPayment.data.status === "success") {
//                 const details: PaymentDetails = {
//                   id: verifyPayment.data.id,
//                   reference: verifyPayment.data?.reference,
//                   // access_code: verifyPayment.data?.access_code,
//                   amount: verifyPayment.data?.amount,
//                   currency: verifyPayment.data?.currency,
//                   email: verifyPayment.data?.customer?.email,
//                   status: verifyPayment.data?.status,
//                   transaction: response.transaction,
//                   cardType: verifyPayment.data?.authorization?.card_type,
//                   cardDetails: `${verifyPayment.data?.authorization?.brand || ''} || ${verifyPayment.data?.authorization?.card_type || ''}`,
//                   last_Four: verifyPayment.data?.authorization?.last4,
//                   bank: verifyPayment.data?.authorization?.bank,
//                   channelType: verifyPayment.data?.channel,
//                   paidAt: verifyPayment.data?.paid_at,
//                   createdAt: verifyPayment.data?.created_at,
//                   added_fees: verifyPayment.data?.fees,
//                   duration: (verifyPayment.data?.log?.time_spent).toString(),
//                 };

//                 console.log(details);

//                 setPaymentReference(details);
//                 toast.success('Payment Successful');
//                 onSuccessCB(verifyPayment.data.reference, details);
//               }
//               else {
//                 throw new Error('Payment verification failed');
//               }
//             }
//             catch (err) {
//               console.error('Error initializing payment:', err);
//               toast.error('An error occurred while verifying the payment.');
//             }
//             finally {
//               setIsProcessing(false);
//             }
//           },
//           onClose: () => {
//             setIsProcessing(false);
//             toast.info('Payment dialog closed');
//             onCloseCB();
//           },
//         });
//       }
//       catch (err) {
//         console.error('Error initializing payment:', err);
//         toast.error('An error occurred while verifying the payment.');
//         setIsProcessing(false);
//       }




//       // const onSuccess = async (response: { reference: any }) => {
//       //   console.log('Payment successful:', response);
//       //   try {
//       //     const verifyPayment = await verifyTransaction(response.reference);
//       //     console.log('Payment verification:', verifyPayment);
  
//       //     if (verifyPayment.data.status === "success") {
//       //       const details: PaymentDetails = {
//       //         id: verifyPayment.data.id,
//       //         reference: verifyPayment.data.reference,
//       //         amount: verifyPayment.data.amount / 100, // Convert back to main currency unit
//       //         currency: verifyPayment.data.currency,
//       //         email: verifyPayment.data.customer.email,
//       //         status: verifyPayment.data.status,
//       //         cardType: verifyPayment.data.authorization.card_type,
//       //         cardDetails: `${verifyPayment.data.authorization.card_type}`,
//       //         last_Four: verifyPayment.data.authorization.last4,
//       //         bank: verifyPayment.data.authorization.bank,
//       //         channelType: verifyPayment.data.channel,
//       //         paidAt: verifyPayment.data.paid_at,
//       //         createdAt: verifyPayment.data.created_at,
//       //       };
  
//       //       setPaymentReference(details);
//       //       toast.success('Payment Successful');
//       //       onSuccessCB(verifyPayment.data.reference, details);
//       //     } else {
//       //       throw new Error('Payment verification failed');
//       //     }
//       //   } catch (err) {
//       //     console.error('Error verifying payment:', err);
//       //     toast.error('An error occurred while verifying the payment.');
//       //   } finally {
//       //     setIsProcessing(false);
//       //   }
//       // };
  
//       // const onClose = () => {
//       //   setIsProcessing(false);
//       //   toast.info('Payment dialog closed');
//       //   onCloseCB();
//       // };

//       // try {
//       //   setIsProcessing(true);
//       //   initializePaymentPromise(config);
//       //   // initializePayment();
//       //   console.log(config)
//       //   console.log(initializePayment);
//       // } catch (error) {
//       //   console.error('Error initializing payment:', error);
//       //   toast.error('Failed to initialize payment. Please try again.');
//       //   setIsProcessing(false);
//       // }
//     }, [ key, initializePayment, onSuccessCB, onCloseCB, verifyTransaction ]
//   );
  
//   console.log(paymentReference)
// 	return { payButtonFn, isProcessing, paymentReference };
// };

// export default usePaystack;
























import { useCallback, useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { PaystackProps } from 'react-paystack/dist/types';
import { toast } from 'react-toastify';
import CONFIG from '../utils/helpers/config';
import { useAuth } from './../../libs/context/AuthContext';


const usePaystack = (
  onInitiated: (reference: string, response: any) => void = () => {},
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

  const payButtonFn = useCallback(async (amount: number, email: string, firstName: string, lastName: string, phone?: number, metadata?: any) => {
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

    const config: PaystackProps = {
      email: email,
      amount: amountInKobo,
      publicKey: key,
      metadata: {
        firstName,
        lastName,
        phone,
        ...metadata
      },
      ...options,
    }

    try {
      setIsProcessing(true);
      initializePayment({
        config,
        onSuccess: (response: any) => {
          setIsProcessing(false);
          console.log('Payment initiated:', response);
          onInitiated(response.reference, response);
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
  }, [initializePayment, onInitiated, onClose, options]);

  return { payButtonFn, isProcessing };
};

export default usePaystack;