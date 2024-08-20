import { useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import axios from 'axios';
import { Stack } from '@mui/material';

const VideoUploadConfirmation = () => {
  const navigate = useNavigate();

  const handleUploadNow = () => {
    const videoType = localStorage.getItem('videoType');
    const videoPrice = localStorage.getItem('videoPrice');

    navigate('/candidate/video-management/upload', { state: { videoType, videoPrice } });
  };

  const handleUploadLater = async () => {
    try {
      const userId = 'user-id';
      const videoId = 'video-id';

      await axios.post('/api/video-drafts', { userId, videoId });

      navigate('/candidate/video-management');
    } catch (error) {
      console.error('Failed to create video draft:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center gap-4 w-full md:w-[50%] p-2 md:p-0 mx-auto text-center justify-center">
      <h2 className='text-lg font-semibold'>Upload Confirmation</h2>
      <p>Your payment was successful. What would you like to do next?</p>
      <p className='text-red-500 my-4'><span className='font-semibold'>NOTE: </span>By uploading your videoCV on this playfom, you have read the videoCV guideline thoroughly and you agree to this platform's Terms and Conditions</p>
      <Stack direction='row' gap={4}>
      <Button variant='custom' label="Upload Later" onClick={handleUploadLater} />
        <Button variant='black' label="Upload Now" onClick={handleUploadNow} />
      </Stack>
      
    </div>
  );
};

export default VideoUploadConfirmation;
