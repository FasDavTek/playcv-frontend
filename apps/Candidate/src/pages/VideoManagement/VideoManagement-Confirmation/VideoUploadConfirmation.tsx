import { useLocation, useNavigate } from 'react-router-dom';
import { Button, useToast } from '@video-cv/ui-components';
import axios from 'axios';
import { Stack } from '@mui/material';
import { getData, postData } from './../../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../../libs/utils/apis/apiEndpoints';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { SESSION_STORAGE_KEYS } from './../../../../../../libs/utils/sessionStorage';

interface LocationState {
  videoType: string;
  price: number;
  paymentReference: string;
}

interface UploadRequest {
  id: number;
  userId: string;
  paymentDate: string;
  checkoutId: number;
  uploadTypeId: number;
  uploadType: string;
  dateCreated: string;
  duration: string;
  dateUpdated: string;
  isProcessed: boolean;
  isExpired: boolean;
  paymentStatus: number;
  videoId: number | null;
}

interface ApiResponse {
  hasValidUpploadRequest: boolean;
  requestAge: number;
  uploadRequest: UploadRequest;
  code: string;
  status: string;
  totalRecords: number | null;
  statusCode: string | null;
  message: string;
  data: any;
}

const VideoUploadConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<LocationState | null>(null);

  const { showToast } = useToast();

  const { uploadTypeId, uploadTypeName, uploadPrice, paymentReference, paymentId } = location.state || {};

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  const handleUploadNow = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 'success' && response.hasValidUpploadRequest === true) {
        navigate('/candidate/video-management/upload', {
          state: {
            uploadTypeId: response.uploadRequest.uploadTypeId,
            uploadTypeName: response.uploadRequest.uploadType,
            uploadPrice: uploadPrice,
            paymentReference: paymentReference,
            paymentId: paymentId,
            uploadRequestId: response.uploadRequest.id,
            paymentDate: response.uploadRequest.paymentDate,
            duration: response.uploadRequest.duration
          }
        });
      }
      else {
        showToast(response?.message || 'Unable to proceed with upload', 'error');
      }
    }
    catch (err: any) {
      showToast(err?.response?.message || 'An error occurred while checking upload status', 'error');
    }
    finally {
      setIsLoading(false);
    }
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
        <Button variant='custom' label='Upload Later' onClick={handleUploadLater} />
        <Button variant='black' label="Upload Now" onClick={handleUploadNow} disabled={isLoading} />
      </Stack>
      
    </div>
  );
};

export default VideoUploadConfirmation;
