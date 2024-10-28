import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const VideoUploadTypes: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const [price, setPrice] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<'Pinned' | 'Regular' | null>(null);

  const storedPinnedPrice = parseFloat(localStorage.getItem('pinnedVideoPrice') || '5000');
  const storedRegularPrice = parseFloat(localStorage.getItem('regularVideoPrice') || '2000');

  const calculatePrice = useCallback(() => {
    if (type === 'pinned') {
      setPrice(storedPinnedPrice);
    } else {
      setPrice(storedRegularPrice);
    }
  }, [type, storedPinnedPrice, storedRegularPrice]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const onPaymentSuccess = (reference: string) => {
    // console.log('Payment successful:', reference);
    // console.log('Amount paid:', price);
    localStorage.setItem('videoType', selectedType || '');
    localStorage.setItem('videoPrice', price.toString());
    navigate(`/candidate/video-management/confirmation`, { 
      state: { 
        videoType: selectedType?.charAt(0).toUpperCase(), 
        price: price 
      } 
    });
  };

  const onPaymentFailure = () => {
    toast.error('Payment failed');
    setSelectedType(null);
  };

  const { payButtonFn } = usePaystack(
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

  const handlePayment = (type: 'Pinned' | 'Regular') => {
    const selectedPrice = type === 'Pinned' ? storedPinnedPrice : storedRegularPrice;
    setPrice(selectedPrice);
    setSelectedType(type);
    // console.log('Initiating payment for amount:', selectedPrice);
    payButtonFn();

    // localStorage.setItem('videoType', type);
    // localStorage.setItem('videoPrice', selectedPrice.toString());

    // navigate(`/candidate/video-management/confirmation`, { state: { videoType: type.charAt(0).toUpperCase(), price: selectedPrice } });
  };


  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Choose Your Video Upload Type</h2>
      <div className="my-4 p-4 border rounded-lg shadow-md">
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
      </div>
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
