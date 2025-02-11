import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@video-cv/ui-components';
import axios from 'axios';
import { Stack, duration } from '@mui/material';
import { getData, postData } from '../../../../../../libs/utils/apis/apiMethods';
import CONFIG from '../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from '../../../../../../libs/utils/apis/apiEndpoints';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from './../../../../../../libs/utils/localStorage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface LocationState {
  AdType: string;
  price: number;
  paymentReference: string;
}

const CreateAdsConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<LocationState | null>(null);

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);


  const { adRequestId, adTypeId, adTypeName, price, paymentReference, paymentId, duration } = location.state || {};

  const handleCreateNow = async () => {
    setIsLoading(true);

    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_STATUS}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.status === 'success' && response.hasValidAdRequest === true) {
        navigate('/employer/advertisement/create', {
          state: {
            adRequestId: response.adRequest.id,
            adTypeId: response.adRequest.adTypeId,
            adTypeName: response.adRequest.adType,
            price: price,
            paymentReference: paymentReference,
            paymentId: paymentId,
            duration: duration,
            paymentDate: response.adRequest.paymentDate,
          }
        });
      }
      else {
        toast.error(response?.message || 'Unable to proceed with upload')
      }
    }
    catch (err: any) {
      toast.error(err?.response?.message || 'An error occurred while checking upload status');
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleCreateLater = () => {
    navigate('/employer/advertisement');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen flex flex-col items-center gap-4 w-full md:w-[50%] p-2 md:p-0 mx-auto text-center justify-center">
      <ChevronLeftIcon className="cursor-pointer text-base ml-1 top-4 fixed p-1 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.95rem' }} onClick={handleBackClick} />
      <h2 className='text-lg font-semibold'>Creation Confirmation</h2>
      <p>Your payment was successful. What would you like to do next?</p>
      <p className='text-red-500 my-4'><span className='font-semibold'>NOTE: </span>By uploading your AdCV on this platfom, you have read the AdCV guideline thoroughly and you agree to this platform's Terms and Conditions</p>
      <Stack direction='row' gap={4}>
        <Button variant='custom' label='Upload Later' onClick={handleCreateLater} />
        <Button variant='black' label="Upload Now" onClick={handleCreateNow} disabled={isLoading} />
      </Stack>
      
    </div>
  );
};

export default CreateAdsConfirmation;
