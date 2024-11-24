import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CircularProgress, Typography } from '@mui/material';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { useAuth } from './../../../../../../libs/context/AuthContext';

interface UploadType {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
}

interface PaymentDetails {
  reference: string;
  status: string;
  transaction: string;
  amount: number;
  currency: string;
  cardType?: string;
  cardBrand?: string;
  last4?: string;
  bank?: string;
  channelType?: string;
  paidAt?: string;
  createdAt?: string;
  fees?: number;
}

const VideoUploadTypes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const [price, setPrice] = useState<number>(0);
  const { authState } = useAuth();
  const [selectedType, setSelectedType] = useState<UploadType | null>(null);
  const [uploadTypes, setUploadTypes] = useState<UploadType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const calculatePrice = useCallback((selectedType: UploadType | undefined) => {
    if (selectedType) {
      setPrice(selectedType.price)
    }
  }, [])


  useEffect(() => {
    const fetchUploadTypes = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD_TYPE}?Page=1&Limit=10`)
        if (!response.ok) {
          throw new Error('Failed to fetch upload types')
        }
        const data: UploadType[] = await response.json()
        setUploadTypes(data);
        if (data.length > 0) {
          setSelectedType(data[0])
          calculatePrice(data[0])
        }
      } 
      catch (err: any) {
        setError(err.message)
        toast.error('Failed to load video upload types')
      } 
      finally {
        setIsLoading(false)
      }
    }

    fetchUploadTypes()
  }, [calculatePrice])



  const onPaymentSuccess = async (reference: string, paymentDetails: PaymentDetails) => {
    if (selectedType) {
      try {
        const paymentConfirmationData = {
          userId: authState.user?.id,
          currency: paymentDetails.currency,
          total: paymentDetails.amount,
          countryCode: "NG",
          datetime: paymentDetails.paidAt || new Date().toISOString(),
          reference_Id: paymentDetails.reference,
          // purchaseDetails: [{
          //   videoId: uploadResponse.data.videoId,
          //   quantity: 1,
          //   amount: paymentDetails.amount
          // }],
          status: paymentDetails.status,
          cardType: paymentDetails.cardType || "Unknown",
          cardDetails: `${paymentDetails.cardBrand || "Unknown"} ${paymentDetails.cardType || ""}`,
          last_Four: paymentDetails.last4 || "Unknown",
          paymentType: "upload",
          uploadType: selectedType.name,
          uploadTypeId: selectedType.id,
          userIdentifier: authState.user?.email,
          // adTypeId: selectedType.adTypeId,
          transactionFee: paymentDetails.fees || 0,
          chargedTaxAmount: 0,
          isUploaded: false, // This indicates that the video has been uploaded
        };


        const paymentResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, paymentConfirmationData);


        if (!paymentResponse.ok) {
          toast.error('Unable to save payment details');
          throw new Error('Unable to save payment details');
        }


        // Create an upload request
        const uploadRequestPayload = {
          videoId: null, // This will be filled later when the video is uploaded
          title: "",
          typeId: selectedType.id,
          description: "",
          transcript: "",
          categoryId: null,
          videoUrl: "",
          action: "create",
          paymentId: paymentResponse.data.id
        };

        const uploadRequestResponse = await postData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD}`, uploadRequestPayload);

        if (!uploadRequestResponse.code === "201") {
          throw new Error('Failed to create upload request');
        }

        // Navigate to the confirmation page
        navigate(`/candidate/video-management/confirmation`, { 
          state: {
            uploadRequestId: uploadRequestResponse.data.id,
            uploadTypeId: selectedType.id,
            uploadTypeName: selectedType.name,
            price: price,
            paymentReference: reference,
            paymentId: paymentResponse.data.id
          }
        });
      } catch (error) {
        console.error('Error creating upload request:', error);
        toast.error('Failed to process your request. Please try again.');
      }
    }
  };



  const onPaymentFailure = () => {
    toast.error('Payment failed');
    setSelectedType(null);
  };


  const { payButtonFn, isProcessing } = usePaystack(
    price,
    onPaymentSuccess,
    onPaymentFailure
  );

  // useEffect(() => {
  //   if (triggerPayment) {
  //     payButtonFn();
  //     setTriggerPayment(false);
  //   }
  // }, [price, triggerPayment, payButtonFn]);

  // const handlePayment = (type: 'Pinned' | 'Regular') => {
  //   const selectedPrice = type === 'Pinned' ? storedPinnedPrice : storedRegularPrice;
  //   setPrice(selectedPrice);
  //   setSelectedType(type);
  //   payButtonFn();
  // };

  const handlePayment = (type: UploadType) => {
    setPrice(type.price)
    setSelectedType(type)
    payButtonFn()
  }


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
      {/* <div className="my-4 p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Pinned Video</h3>
        <p className="mb-2">
          <strong>Benefit:</strong> Pinned videos are showcased prominently at the top of search results, ensuring greater visibility and a higher chance of being seen by potential clients or employers.
        </p>
        <p className="mb-4">
          <strong>Price:</strong> {storedPinnedPrice.toFixed(2)} NGN. This includes a higher fee for the increased visibility and priority placement.
        </p>
        <img
          src="/images/pinned-video-example.jpg" // Replace with actual image path
          alt="Pinned Video Example"
          className="w-full h-auto mb-4"
        />
        <Button variant='black' label="Choose Pinned Video" onClick={() => handlePayment('Pinned')} />
      </div>
      <div className="my-4 p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Regular Video</h3>
        <p className="mb-2">
          <strong>Benefit:</strong> Regular videos are listed in the standard search results. This option is suitable for general visibility and standard placement.
        </p>
        <p className="mb-4">
          <strong>Price:</strong> {storedRegularPrice.toFixed(2)} NGN. This option has a lower fee compared to pinned videos but provides good visibility.
        </p>
        <img
          src="/images/regular-video-example.jpg" // Replace with actual image path
          alt="Regular Video Example"
          className="w-full h-auto mb-4"
        />
        <Button variant='black' label="Choose Regular Video" onClick={() => handlePayment('Regular')} />
      </div> */}
      
        {uploadTypes.map((uploadType) => (
          <Card key={uploadType.id} className="mb-6">
            <CardHeader>
              <Typography>{uploadType.name}</Typography>
              <Typography>{uploadType.description}</Typography>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                <strong>Price:</strong> {uploadType.price.toFixed(2)} NGN
              </p>
              <img
                src={uploadType.imageUrl}
                alt={`${uploadType.name} Example`}
                className="w-full h-auto mb-4 rounded-lg"
              />
              <Button 
                variant="black" 
                onClick={() => handlePayment(uploadType)}
                label={isProcessing ? 'Processing...' : `Choose ${uploadType.name}`}
                disabled={isProcessing}
              >
              </Button>
            </CardContent>
          </Card>
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
