import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CircularProgress, Typography } from '@mui/material';
import { getData, postData } from '../../../../../../libs/utils/apis/apiMethods';
import CONFIG from '../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from '../../../../../../libs/utils/apis/apiEndpoints';
import { useAuth } from './../../../../../../libs/context/AuthContext';
import { LOCAL_STORAGE_KEYS } from './../../../../../../libs/utils/localStorage';

interface AdType {
  typeId: string;
  typeName: string;
  typeDescription: string;
  price: number
  dateCreated?: string;
  dateUpdated?: string | null;
  createdBy?: string;
  coverUrl?: string;
  redirectUrl? : string;
}


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


const AdUploadTypes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const [price, setPrice] = useState<number>(0);
  const { authState } = useAuth();
  const [selectedType, setSelectedType] = useState<AdType | null>(null);
  const selectedTypeRef = useRef<AdType | null>(null);
  const [adTypes, setAdTypes] = useState<AdType[]>([]);
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
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_TYPE}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      setAdTypes(response);
      if (response.length > 0) {
        setSelectedType(response[0])
      }
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
  }, [fetchUploadTypes])


  const onPaymentInitiated = useCallback(async (response: any) => {
    if (!selectedTypeRef.current) {
      console.error('No selected upload type found');
      toast.error('An error occurred. Please try again.');
      return;
    }
    
    if (!authState.user) {
      console.error('No user found in auth state');
      toast.error('User authentication error. Please log in and try again.');
      return;
    }

    try {
      console.log(response)

      const paymentConfirmationData = {
        userId: authState.user?.id,
        buyerId: authState.user?.id,
        currency: "NGN",
        total: selectedTypeRef.current.price,
        amount: selectedTypeRef.current.price,
        countryCode: "NG",
        reference_Id: response.reference,
        purchaseDetails: [{
          adId: selectedTypeRef.current.typeId,
          quantity: 1,
          amount: selectedTypeRef.current.price
        }],
        status: response.status === 'success' ? 's' : response.status === 'failed' ? 'f' : 'a',
        // cardType: selectedTypeRef.current.cardType || '',
        // cardDetails: selectedTypeRef.current.cardDetails || '',
        // last_Four: selectedTypeRef.current.last_Four || "Unknown",
        paymentType: "upload",
        uploadType: selectedTypeRef.current.typeName,
        uploadTypeId: selectedTypeRef.current.typeId,
        userIdentifier: authState?.user?.id,
        adTypeId: selectedTypeRef.current.typeId,
        // transactionFee: selectedTypeRef.current?.added_fees,
        // chargedTaxAmount: 0,
        isUploaded: false,
        // duration: selectedTypeRef.current?.duration,
      };

      const paymentResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, paymentConfirmationData, {
        headers: { Authorization: `Bearer ${token}` },
      });


      const uploadRequestPayload = {
        buyerId: authState.user?.id,
        adId: null, // This will be filled later when the ad is uploaded
        name: '',
        adTypeId: selectedTypeRef.current.typeId,
        description: "",
        coverUrl: "",
        redirectUrl: "",
        action: "create",
        statusId: null,
        startDate: null,
        endDate: null,
        paymentId: paymentResponse.data.id
      };

      const uploadRequestResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.ADD_ADS}`, uploadRequestPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });


      navigate(`/admin/advertisement-management/confirmation`, { 
        state: {
          uploadRequestId: uploadRequestResponse.data.id,
          adTypeId: selectedTypeRef.current.typeId,
          adTypeName: selectedTypeRef.current.typeName,
          price: selectedTypeRef.current.price,
          paymentReference: response,
          paymentId: paymentResponse.data.id
        }
      });
    }
    catch(err: any) {
      console.error('Error creating upload request:', err);
      toast.error('Failed to process your request. Please try again.');
    }
  }, [authState.user, navigate]);



  const onPaymentFailure = useCallback(() => {
    toast.error('Payment failed');
    setSelectedType(null);
  }, []);

  const { payButtonFn, isProcessing } = usePaystack(onPaymentInitiated, onPaymentFailure);


  const handlePayment = useCallback((type: AdType) => {
    setSelectedType(type);
    selectedTypeRef.current = type;
    const amount = Math.round(Number(type.price));
    const email = authState?.user?.username || '';
    const userSignupDataString = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
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
      <h2 className="text-2xl font-bold mb-4">Choose Your Ad Creation Type</h2>
      {adTypes.map((adType) => (
        <div key={adType.typeId} className="my-4 p-4 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">{adType.typeName}</h3>
          <p className="mb-2">
            <strong>Benefit:</strong> {adType.typeDescription}
          </p>
          <p className="mb-4">
            <strong>Price:</strong> {adType.price.toFixed(2)} NGN. This includes a higher fee for the increased visibility and priority placement.
          </p>
          {adType.coverUrl && (
            <img
              src={adType.coverUrl}
              alt={`${adType.typeName} Example`}
              className="w-full h-auto mb-4"
            />
          )}
          <Button variant='black' onClick={() => handlePayment(adType)} label={isProcessing ? 'Processing...' : `Choose ${adType.typeName}`} disabled={isProcessing || isLoading} />
        </div>
      ))}
     
      {/* <div className="my-4 p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold mb-2">Additional Notes</h3>
        <ul className="list-disc ml-5">
          <li className="mb-2">Pinned videos will be displayed at the top of relevant search results, potentially increasing engagement.</li>
          <li className="mb-2">Both options include a feature to add a title, description, and tags to your video.</li>
          <li className="mb-2">Ensure that your video complies with our content guidelines to avoid any issues during the upload process.</li>
        </ul>
        <p className="mt-4">If you have any questions or need assistance, please contact our support team.</p>
        <p className='text-red-500 mt-6'><span className='font-semibold'>NOTE: </span>By uploading your videoCV on this platfom, you have read the videoCV guideline thoroughly and you agree to this platform's Terms and Conditions</p>
      </div> */}
    </div>
  );
};

export default AdUploadTypes;
