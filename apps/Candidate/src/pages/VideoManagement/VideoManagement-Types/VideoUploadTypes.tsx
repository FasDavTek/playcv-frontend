import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { useAuth } from './../../../../../../libs/context/AuthContext';
import { LOCAL_STORAGE_KEYS } from './../../../../../../libs/utils/localStorage';

interface UploadType {
  id: string;
  name: string;
  price: number;
  description: string;
  uploadPrice: number;
  imageUrl?: string;
  coverUrl?: string;
}

interface UserSignupData {
  firstName: string;
  lastName: string;
  phone?: any;
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


const VideoUploadTypes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const [uploadPrice, setPrice] = useState<number>(0);
  const { authState } = useAuth();
  const [selectedType, setSelectedType] = useState<UploadType | null>(null);
  const [uploadTypes, setUploadTypes] = useState<UploadType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentReference, setPaymentReference] = useState<PaymentDetails | null>(null);

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  
  // if (!token) {
  //   toast.error('Your session has expired. Please log in again');
  //   navigate('/')
  // }

  
  const fetchUploadTypes = useCallback(async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD_TYPE}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      const data = await response.data
      setUploadTypes(data);
      console.log(data)
    } 
    catch (err: any) {
      setError(err.message)
      toast.error('Failed to load video upload types')
    } 
    finally {
      setIsLoading(false)
    }
  }, [token]);

  useEffect(() => {
    fetchUploadTypes()
  }, [fetchUploadTypes]);





  const verifyTransaction = useCallback(async (reference: string): Promise<VerifyPaymentResponse> => {
    try {
      if (!reference) {
        
      }
      else {
        const url = `https://api.paystack.co/transaction/verify/${reference}`;
        const verifyPayment = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${CONFIG.PAYSTACK}`,
            'Content-Type': 'application/json',
          }
        });

        console.log("", verifyPayment);
        return await verifyPayment.json();
      }
    }
    catch (err) {}
  }, [])




  const onPaymentInitiated = useCallback(async (reference: string, response: any) => {
    if (selectedType) {
      try {
        console.log("", reference);
        console.log(response)
        const verifyPayment = await verifyTransaction(reference);
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
            // transaction: transaction,
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

          const paymentConfirmationData = {
            userId: authState.user?.id,
            buyerId: authState.user?.id,
            amount: selectedType.uploadPrice,
            currency: details.currency,
            total: details.amount,
            countryCode: "NG",
            datetime: details.paidAt || new Date().toISOString(),
            reference_Id: reference,
            purchaseDetails: [{
              videoId: selectedType.id,
              quantity: 1,
              amount: selectedType.price
            }],
            status: details.status === 'success' ? 's' : details.status === 'failed' ? 'f' : 'a',
            cardType: details.cardType || '',
            cardDetails: details.cardDetails || '',
            last_Four: details.last_Four || "Unknown",
            paymentType: "upload",
            uploadType: selectedType.name,
            uploadTypeId: selectedType.id,
            userIdentifier: authState.user?.id,
            transactionFee: details.added_fees,
            chargedTaxAmount: 0,
            isUploaded: false, // This indicates that the video has been uploaded
          };


          const paymentResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, paymentConfirmationData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          toast.success('Payment Successful');

           // Create an upload request
          const uploadRequestPayload = {
            buyerId: authState.user?.id,
            videoId: null,
            title: "",
            id: selectedType.id,
            description: "",
            transcript: "",
            categoryId: null,
            videoUrl: "",
            action: "create",
            statusId: null,
            startDate: null,
            endDate: null,
            paymentId: details.id
          };

          const uploadRequestResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD}`, uploadRequestPayload, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Navigate to the confirmation page
          navigate(`/candidate/video-management/confirmation`, { 
            state: {
              uploadRequestId: uploadRequestResponse.data.id,
              uploadTypeId: selectedType.id,
              uploadTypeName: selectedType.name,
              uploadPrice: selectedType.uploadPrice,
              paymentReference: paymentReference,
              paymentId: paymentResponse.data.id
            }
          });
        }
        else {
          throw new Error('Payment verification failed');
        }
      } catch (error) {
        console.error('Error creating upload request:', error);
        toast.error('Failed to process your request. Please try again.');
      }
    }
  }, [authState.user, navigate, selectedType, token, uploadPrice]);



  const onPaymentFailure = useCallback(() => {
    toast.error('Payment failed');
    setSelectedType(null);
  }, []);


  const { payButtonFn, isProcessing } = usePaystack(onPaymentInitiated, onPaymentFailure);

  const handlePayment = useCallback((type: UploadType) => {
      setSelectedType(type);
      const amount = Math.round(Number(type.uploadPrice));
      const email = authState?.user?.username || '';
      const userSignupDataString = localStorage.getItem(LOCAL_STORAGE_KEYS.SIGNUP_DATA);
      let firstName = '';
      let lastName = '';
      let phone = '';
      if (userSignupDataString) {
        const userSignupData = JSON.parse(userSignupDataString);
        firstName = userSignupData?.surname;
        lastName = userSignupData?.firstName;
        phone = userSignupData?.phoneNumber;
      } 
  
      if (amount > 0) {
        payButtonFn(amount, email, firstName, lastName, phone);
      }
    }, [authState.user, payButtonFn]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress className="w-8 h-8 animate-spin" />
      </div>
    )
  }


  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Choose Your Video Upload Type</h2>
      {uploadTypes.map((uploadType) => (
        <div key={uploadType.id} className="my-4 p-4 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">{uploadType.name}</h3>
          <p className="mb-2">
            <strong>Benefit:</strong> {uploadType.description}
          </p>
          <p className="mb-4">
            <strong>Price:</strong> {uploadType.uploadPrice.toFixed(2)} NGN. This includes a higher fee for the increased visibility and priority placement.
          </p>
          {uploadType.imageUrl && (
            <img
              src={uploadType.imageUrl}
              alt={`${uploadType.name} Example`}
              className="w-full h-auto mb-4"
            />
          )}
          <Button variant='black' onClick={() => handlePayment(uploadType)} label={isProcessing ? 'Processing...' : `Choose ${uploadType.name}`} disabled={isProcessing || isLoading} />
        </div>
      ))}
     
      <div className="my-4 p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold mb-2">Additional Notes</h3>
        <ul className="list-disc ml-5">
          <li className="mb-2">Pinned videos will be displayed at the top of relevant search results, potentially increasing engagement.</li>
          <li className="mb-2">Both options include a feature to add a title, description, and tags to your video.</li>
          <li className="mb-2">Ensure that your video complies with our content guidelines to avoid any issues during the upload process.</li>
        </ul>
        <p className="mt-4">If you have any questions or need assistance, please contact our support team.</p>
        <p className='text-red-500 mt-6'><span className='font-semibold'>NOTE: </span>By uploading your videoCV on this platfom, you have read the videoCV guideline thoroughly and you agree to this platform's Terms and Conditions</p>
      </div>
    </div>
  );
};

export default VideoUploadTypes;