import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import { usePaystack, PaymentDetails } from '@video-cv/payment';
import React, { useCallback, useEffect, useState } from 'react';
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

const AdUploadTypes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const [price, setPrice] = useState<number>(0);
  const { authState } = useAuth();
  const [selectedType, setSelectedType] = useState<AdType | null>(null);
  const [adTypes, setAdTypes] = useState<AdType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

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
  }, [navigate, token]);



  useEffect(() => {
    fetchUploadTypes()
  }, [fetchUploadTypes])



  const onPaymentSuccess = useCallback(async (reference: string, details: PaymentDetails) => {
    if (!selectedType || !authState.user) return;

    try {
      const paymentConfirmationData = {
        buyerId: authState.user?.id,
        currency: details.currency,
        total: details.amount / 100,
        countryCode: "NG",
        reference_Id: reference,
        status: details.status === 'success' ? 's' : details.status === 'failed' ? 'f' : 'a',
        cardType: details.cardType || '',
        cardDetails: details.cardDetails || '',
        last_Four: details.last_Four || "Unknown",
        purchaseDetails: [{
          adId: selectedType.typeId,
          quantity: 1,
          amount: selectedType.price
        }],
        paymentType: "upload",
        uploadType: selectedType.typeName,
        uploadTypeId: selectedType.typeId,
        userIdentifier: authState?.user?.username,
        adTypeId: selectedType.typeId,
        transactionFee: details?.added_fees,
        chargedTaxAmount: 0,
        isUploaded: false,
        duration: details?.duration,
      };

      const paymentResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, paymentConfirmationData, {
        headers: { Authorization: `Bearer ${token}` },
      });


      const uploadRequestPayload = {
        buyerId: authState.user?.id,
        adId: null, // This will be filled later when the ad is uploaded
        name: selectedType?.typeName.charAt(0).toUpperCase(),
        adTypeId: selectedType.typeId,
        description: "",
        coverUrl: "",
        redirectUrl: "",
        action: "create",
        statusId: null,
        startDate: null,
        endDate: null,
        paymentId: details.id
      };

      const uploadRequestResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD}`, uploadRequestPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });


      navigate(`/admin/advertisement-management/confirmation`, { 
        state: {
          uploadRequestId: uploadRequestResponse.data.id,
          adTypeId: selectedType.typeId,
          adTypeName: selectedType.typeName,
          price: price,
          paymentReference: reference,
          paymentId: paymentResponse.data.id
        }
      });
    }
    catch(err: any) {
      console.error('Error creating upload request:', err);
      toast.error('Failed to process your request. Please try again.');
    }
  }, []);



  const onPaymentFailure = useCallback(() => {
    toast.error('Payment failed');
    setSelectedType(null);
  }, []);

  const { payButtonFn, isProcessing } = usePaystack(onPaymentSuccess, onPaymentFailure);


  const handlePayment = useCallback((type: AdType) => {
    setSelectedType(type);
    const amount = Math.round(Number(type.price));
    const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    const email = authState?.user?.username || '';
    const firstName = authState?.user?.firstName || '';
    const lastName = authState?.user?.lastName || '';
    const phone = authState?.user?.phone;

    console.log(type.price)
    console.log(amount)

    if (amount > 0) {
      payButtonFn(amount, email, firstName, lastName, phone);
    }
    // if (authState?.user?.username && token) {
      // payButtonFn(amount, email,);
    // }
    // else {
    //   toast.error('User not found. Please log in again.');
    //   navigate('/auth/login', { replace: true });
    // }
  }, [authState.user, payButtonFn, navigate]);


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
          <Button variant='black' onClick={() => handlePayment(adType)} label={isProcessing ? 'Processing...' : `Choose ${adType.typeName}`} disabled={isProcessing} />
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
