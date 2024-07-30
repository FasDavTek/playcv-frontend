import { useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import axios from 'axios';
import { Stack } from '@mui/material';

const VideoUploadConfirmation = () => {
  const navigate = useNavigate();

  const handleUploadNow = () => {
    navigate('/candidate/video-management/upload');
  };

  const handleUploadLater = async () => {
    try {
      // Assume we have the userId and videoId available
      const userId = 'user-id'; // Replace with actual user ID
      const videoId = 'video-id'; // Replace with actual video ID

      await axios.post('/api/video-drafts', { userId, videoId });

      navigate('/candidate/video-management');
    } catch (error) {
      console.error('Failed to create video draft:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center gap-4 text-center justify-center">
      <h2 className='text-lg'>Upload Confirmation</h2>
      <p>Your payment was successful. What would you like to do next?</p>
      <Stack direction='row' gap={4}>
      <Button variant='custom' label="Upload Later" onClick={handleUploadLater} />
        <Button variant='black' label="Upload Now" onClick={handleUploadNow} />
      </Stack>
      
    </div>
  );
};

export default VideoUploadConfirmation;
