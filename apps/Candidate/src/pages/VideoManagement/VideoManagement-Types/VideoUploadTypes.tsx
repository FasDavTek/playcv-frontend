import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import { useEffect, useState } from 'react';

const VideoUploadTypes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');
  const [price, setPrice] = useState<number>(0);
  
  const { payButtonFn } = usePaystack(
    () => {
      console.log('Payment successful');
    //   navigate('/candidate/video-management/confirmation');
    },
    () => {
      console.log('Payment failed');
    }
  );


  const handlePayment = (type: 'pinned' | 'regular') => {
    payButtonFn();
    navigate(`/candidate/video-management/confirmation`, { state: { videoType: type } });
  };

  const calculatePrice = () => {
    if (type === 'pinned') {
      setPrice(5000);
    } else {
      setPrice(2000);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [type]);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Choose Your Video Upload Type</h2>
      <div className="my-4 p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Pinned Video</h3>
        <p className="mb-2">
          <strong>Benefit:</strong> Pinned videos are showcased prominently at the top of search results, ensuring greater visibility and a higher chance of being seen by potential clients or employers.
        </p>
        <p className="mb-4">
          <strong>Price:</strong> 5,000 NGN. This includes a higher fee for the increased visibility and priority placement.
        </p>
        <img
          src="/images/pinned-video-example.jpg" // Replace with actual image path
          alt="Pinned Video Example"
          className="w-full h-auto mb-4"
        />
        <Button variant='black' label="Choose Pinned Video" onClick={() => handlePayment('pinned')} />
      </div>
      <div className="my-4 p-4 border rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Regular Video</h3>
        <p className="mb-2">
          <strong>Benefit:</strong> Regular videos are listed in the standard search results. This option is suitable for general visibility and standard placement.
        </p>
        <p className="mb-4">
          <strong>Price:</strong> 2,000 NGN. This option has a lower fee compared to pinned videos but provides good visibility.
        </p>
        <img
          src="/images/regular-video-example.jpg" // Replace with actual image path
          alt="Regular Video Example"
          className="w-full h-auto mb-4"
        />
        <Button variant='black' label="Choose Regular Video" onClick={() => handlePayment('regular')} />
      </div>
      <div className="my-4 p-4 border rounded-lg shadow-md bg-gray-100">
        <h3 className="text-xl font-semibold mb-2">Additional Notes</h3>
        <ul className="list-disc ml-5">
          <li className="mb-2">Pinned videos will be displayed at the top of relevant search results, potentially increasing engagement.</li>
          <li className="mb-2">Both options include a feature to add a title, description, and tags to your video.</li>
          <li className="mb-2">Ensure that your video complies with our content guidelines to avoid any issues during the upload process.</li>
        </ul>
        <p className="mt-4">If you have any questions or need assistance, please contact our support team.</p>
      </div>
    </div>
  );
};

export default VideoUploadTypes;