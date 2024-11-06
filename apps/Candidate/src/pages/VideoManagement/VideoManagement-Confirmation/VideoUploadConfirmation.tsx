import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import axios from 'axios';
import { Stack } from '@mui/material';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface LocationState {
  videoType: string;
  price: number;
  paymentReference: string;
}

const VideoUploadConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<LocationState | null>(null);

  useEffect(() => {
    if (location.state) {
      const { videoType, price, paymentReference } = location.state as LocationState;
      if (videoType && price && paymentReference) {
        setState({ videoType, price, paymentReference });
      } else {
        toast.error('Invalid upload data. Redirecting....');
        navigate('/candidate/video-management');
      }
    } else {
      toast.error('Error occured. Redirecting....');
      navigate('/candidate/video-management');
    }
  }, [location.state, navigate]);

  const handleUploadNow = () => {
    if (state) {
      navigate('/candidate/video-management/upload', {
        state: {
          videoType: state.videoType,
          videoPrice: state.price,
          paymentReference: state.paymentReference
        }
      });
    } else {
      toast.error('Missing video information. Please try again.');
      navigate('/candidate/video-management');
    }
  };

  const handleUploadLater = async () => {
    if (!state) {
      toast.error('Missing video information. Please try again.');
      navigate('/candidate/video-management');
      return;
    }

    setIsLoading(true)
    try {
      const userId = localStorage.getItem('userId')

      if (!userId) {
        throw new Error('User ID not found')
      }

      const response = await postData(`${CONFIG.BASE_URL}${apiEndpoints.PAYMENT}`, {
        videoType: state.videoType,
        videoPrice: state.price,
        paymentReference: state.paymentReference,
        userId
      });
      // const userId = 'user-id';
      // const videoId = 'video-id';

      // await axios.post('/api/video-drafts', { userId, videoId });

      if (response.status === 200) {
        toast.success('Your payment has been saved. You can upload your video later.')
        navigate('/candidate/video-management');
      } else {
        throw new Error('Failed to save payment information')
      }
    } 
    catch (error) {
      console.error('Failed to create video draft:', error);
      toast.error('Failed to save payment information. Please try again.');
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center gap-4 w-full md:w-[50%] p-2 md:p-0 mx-auto text-center justify-center">
      <h2 className='text-lg font-semibold'>Upload Confirmation</h2>
      <p>Your payment was successful. What would you like to do next?</p>
      <p className='text-red-500 my-4'><span className='font-semibold'>NOTE: </span>By uploading your videoCV on this platfom, you have read the videoCV guideline thoroughly and you agree to this platform's Terms and Conditions</p>
      <Stack direction='row' gap={4}>
      <Button variant='custom' label={isLoading ? 'Saving...' : 'Upload Later'} onClick={handleUploadLater} disabled={isLoading} />
        <Button variant='black' label="Upload Now" onClick={handleUploadNow} />
      </Stack>
      
    </div>
  );
};

export default VideoUploadConfirmation;
