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

  const { uploadRequestId, uploadTypeId, uploadTypeName, price, paymentReference, paymentId } = location.state || {};

  const handleUploadNow = () => {
    navigate('/candidate/video-management/upload', {
      state: {
        uploadRequestId,
        uploadTypeId,
        uploadTypeName,
        price,
        paymentReference,
        paymentId
      }
    });
  };

  const handleUploadLater = () => {
    navigate('/candidate/video-management');
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
