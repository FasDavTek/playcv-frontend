import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CircularProgress, Typography } from '@mui/material';
import { getData, postData } from '../../../../../../libs/utils/apis/apiMethods';
import CONFIG from '../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from '../../../../../../libs/utils/apis/apiEndpoints';

interface AdType {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string;
  videoUrl? : string;
}

const AdUploadTypes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const [price, setPrice] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<AdType | null>(null);
  const [adTypes, setAdTypes] = useState<AdType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const storedPinnedPrice = parseFloat(localStorage.getItem('pinnedVideoPrice') || '5000');
  const storedRegularPrice = parseFloat(localStorage.getItem('regularVideoPrice') || '2000');

  // const calculatePrice = useCallback(() => {
  //   if (type === 'pinned') {
  //     setPrice(storedPinnedPrice);
  //   } else {
  //     setPrice(storedRegularPrice);
  //   }
  // }, [type, storedPinnedPrice, storedRegularPrice]);

  const calculatePrice = useCallback((selectedType: AdType | undefined) => {
    if (selectedType) {
      setPrice(selectedType.price)
    }
  }, [])

  // useEffect(() => {
  //   calculatePrice();
  // }, [calculatePrice]);

  useEffect(() => {
    const fetchUploadTypes = async () => {
      try {
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_UPLOAD_TYPE}?Page=1&Limit=10`)
        if (!response.ok) {
          throw new Error('Failed to fetch upload types')
        }
        const data: AdType[] = await response.json()
        setAdTypes(data);
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



  const onPaymentSuccess = async (reference: string) => {
    // console.log('Payment successful:', reference);
    // console.log('Amount paid:', price);
    if (selectedType) {
          navigate(`/admin/advertisement-management/confirmation`, { 
            state: {
              adTypeId: selectedType.id,
              adTypeName: selectedType?.name.charAt(0).toUpperCase(), 
              price: price,
              paymentReference: reference,
            }
        });
      // localStorage.setItem('videoType', selectedType.name);
      // localStorage.setItem('videoPrice', price.toString());
      
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

  const handlePayment = (type: AdType) => {
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
      <h2 className="text-2xl font-bold mb-4">Choose Your Ad Creation Type</h2>
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
      
        {adTypes.map((adType) => (
          <Card key={adType.id} className="mb-6">
            <CardHeader>
              <Typography>{adType.name}</Typography>
              <Typography>{adType.description}</Typography>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                <strong>Price:</strong> {adType.price.toFixed(2)} NGN
              </p>
              <img
                src={adType.imageUrl}
                alt={`${adType.name} Example`}
                className="w-full h-auto mb-4 rounded-lg"
              />
              <Button 
                variant="black" 
                onClick={() => handlePayment(adType)}
                label={`Choose ${adType.name}`}
              >
              </Button>
            </CardContent>
          </Card>
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
