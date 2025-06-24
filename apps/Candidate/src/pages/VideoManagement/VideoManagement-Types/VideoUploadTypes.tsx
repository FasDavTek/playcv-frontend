import { useLocation, useNavigate } from 'react-router-dom';
import { Button, HtmlContent, useToast } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { useAuth } from './../../../../../../libs/context/AuthContext';
import { SESSION_STORAGE_KEYS } from './../../../../../../libs/utils/sessionStorage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

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
  const [uploadPrice, setUploadPrice] = useState<number>(0);
  const { authState } = useAuth();
  const [selectedType, setSelectedType] = useState<UploadType | null>(null);
  const selectedTypeRef = useRef<UploadType | null>(null);
  const [uploadTypes, setUploadTypes] = useState<UploadType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { showToast } = useToast();

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  const fetchUploadTypes = useCallback(async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD_TYPE}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      
      const data = await response.data
      setUploadTypes(data);
    } 
    catch (err: any) {
      if(!token) {
        showToast('Your session has expired. Please log in again', 'error');
        navigate('/');
      }
      else {
        setError(err.message);
        showToast('Failed to load video upload types', 'error');
      }
    } 
    finally {
      setIsLoading(false)
    }
  }, [token]);


  useEffect(() => {
    fetchUploadTypes()
  }, [fetchUploadTypes]);


  const onPaymentSuccess = useCallback(async (response: any) => {

    if (!selectedTypeRef.current) {
      showToast('No selected upload type found. Please try again.', 'error');
      return;
    }

    if (!authState.user) {
      showToast('User authentication error. Please log in and try again.', 'error');
      return;
    }

    try {
      showToast('Processing payment...', 'info');
      
      const paymentConfirmationData = {
        userId: authState.user?.id,
        buyerId: authState.user?.id,
        amount: selectedTypeRef.current.uploadPrice,
        currency: "NGN",
        total: selectedTypeRef.current.uploadPrice,
        countryCode: "NG",
        datetime: new Date().toISOString(),
        reference_Id: response.reference,
        purchaseDetails: [{
          videoId: selectedTypeRef.current.id,
          quantity: 1,
          amount: selectedTypeRef.current.uploadPrice
        }],
        status: response.status === 'success' ? 's' : response.status === 'failed' ? 'f' : 'a',
        // cardType: details.cardType || '',
        // cardDetails: details.cardDetails || '',
        // last_Four: details.last_Four || "Unknown",
        paymentType: "upload",
        uploadType: selectedTypeRef.current.name,
        uploadTypeId: selectedTypeRef.current.id,
        userIdentifier: authState.user?.id,
        // transactionFee: details.added_fees,
        // chargedTaxAmount: 0,
        isUploaded: false,
      };

      const paymentResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, paymentConfirmationData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (paymentResponse.code === '00') {
        showToast('Payment Successful', 'success');

        navigate(`/candidate/video-management/confirmation`, { 
          state: {
            uploadTypeId: selectedTypeRef.current.id,
            uploadTypeName: selectedTypeRef.current.name,
            uploadPrice: selectedTypeRef.current.uploadPrice,
            paymentReference: response,
            paymentId: response.reference
          }
        });
      }
      

    } catch (error) {
      showToast('Failed to process your request. Please try again.', 'error');
    }
  }, [authState.user, navigate, token]);

  const onPaymentFailure = useCallback(() => {
    showToast('Payment failed', 'error');
    setSelectedType(null);
    selectedTypeRef.current = null;
  }, []);


  const { payButtonFn, isProcessing } = usePaystack(onPaymentSuccess, onPaymentFailure);

  
  const handlePayment = useCallback((type: UploadType) => {
    setSelectedType(type);
    selectedTypeRef.current = type;
    const amount = Math.round(Number(type.uploadPrice));
    const email = authState?.user?.username || '';
    const userSignupDataString = sessionStorage.getItem(SESSION_STORAGE_KEYS.USER);
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
      <h2 className="text-2xl font-bold mb-4">Choose Your Video Upload Type</h2>
      {uploadTypes.map((uploadType) => (
        <div key={uploadType.id} className="my-4 p-4 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">{uploadType.name}</h3>
          <HtmlContent html={`Benefit: ${uploadType.description}`} className='mb-2' />
          <p className="mb-4">
            <strong>Price:</strong> {uploadType.uploadPrice.toFixed(2)} NGN. {uploadType.name === 'Pinned' && ('This includes a higher fee for the increased visibility and priority placement.')}
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
        <p className='text-red-500 mt-6'><span className='font-semibold'>NOTE: </span>By uploading your videoCV on this platform, you have read the videoCV guideline thoroughly and you agree to this platform's Terms and Conditions</p>
      </div>
    </div>
  );
};

export default VideoUploadTypes;