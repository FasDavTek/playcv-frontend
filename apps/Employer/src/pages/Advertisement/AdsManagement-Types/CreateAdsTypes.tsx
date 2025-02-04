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
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  // if (!token) {
  //   toast.error('Your session has expired. Please log in again');
  //   navigate('/')
  // }

  const fetchUploadTypes = useCallback(async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_TYPE}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      setAdTypes(response);
      if (response.length > 0) {
        setSelectedType(response[0])
      }
    } 
    catch (err: any) {
      if(!token) {
        toast.error('Your session has expired. Please log in again');
        navigate('/');
      }
      else {
        setError(err.message)
        toast.error('Failed to load ad types')
      }
    } 
    finally {
      setIsLoading(false)
    }
  }, [token]);



  useEffect(() => {
    fetchUploadTypes()
  }, [fetchUploadTypes])


  const onPaymentSuccess = useCallback(async (response: any) => {

    if (!selectedTypeRef.current) {
      toast.error('No selected ad type found. Please try again.');
      return;
    }
    
    if (!authState.user) {
      toast.error('User authentication error. Please log in and try again.');
      return;
    }

    try {
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
        paymentType: "advert",
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

      if (paymentResponse.code === '00') {
        toast.success('Payment Successful');

        navigate(`/employer/advertisement/confirmation`, { 
          state: {
            adTypeId: selectedTypeRef.current.typeId,
            adTypeName: selectedTypeRef.current.typeName,
            price: selectedTypeRef.current.price,
            paymentReference: response,
            paymentId: response.reference
          }
        });
      }
    }
    catch(err: any) {
      toast.error('Failed to process your request. Please try again.');
    }
  }, [authState.user, navigate, token]);



  const onPaymentFailure = useCallback(() => {
    toast.error('Payment failed');
    setSelectedType(null);
    selectedTypeRef.current = null;
  }, []);

  const { payButtonFn, isProcessing } = usePaystack(onPaymentSuccess, onPaymentFailure);


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

  const handleBackClick = () => {
    navigate(-1);
  };


  return (
    <div className="p-5">
      <ChevronLeftIcon className="cursor-pointer text-base ml-1 top-4 sticky p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.95rem' }} onClick={handleBackClick} />
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
    </div>
  );
};

export default AdUploadTypes;
