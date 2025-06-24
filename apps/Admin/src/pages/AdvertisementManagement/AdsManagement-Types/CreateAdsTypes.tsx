import { useLocation, useNavigate } from 'react-router-dom';
import { Button, DurationModal } from '@video-cv/ui-components';
import { usePaystack } from '@video-cv/payment';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CircularProgress, duration, Typography } from '@mui/material';
import { getData, postData } from '../../../../../../libs/utils/apis/apiMethods';
import CONFIG from '../../../../../../libs/utils/helpers/config';
import { apiEndpoints } from '../../../../../../libs/utils/apis/apiEndpoints';
import { useAuth } from './../../../../../../libs/context/AuthContext';
import { SESSION_STORAGE_KEYS } from './../../../../../../libs/utils/sessionStorage';

interface AdType {
  typeId: string;
  typeName: string;
  typeDescription: string;
  price: number;
  dateCreated?: string;
  dateUpdated?: string | null;
  createdBy?: string;
  coverUrl?: string;
  redirectUrl? : string;
}

const AdUploadTypes = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [selectedType, setSelectedType] = useState<AdType | null>(null);
  const [adTypes, setAdTypes] = useState<AdType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(1);

  const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

  const fetchUploadTypes = useCallback(async () => {
    try {

      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ADS_TYPE}?Download=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAdTypes(response);
      if (response.length > 0) {
        setSelectedType(response[0])
      }
    }
    catch (err: any) {
      setError(err.message)
      toast.error('Failed to load video upload types');
    }
    finally {
      setIsLoading(false);
    }
  }, [navigate, token]);



  useEffect(() => {
    fetchUploadTypes();
  }, [fetchUploadTypes]);


  const handleContinue = (durationWeeks: number) => {
    if (!selectedType) return;

    const durationDays = durationWeeks * 7;
    
    navigate('/admin/advertisement-management/create', { 
      state: {
        adTypeId: selectedType.typeId,
        adTypeName: selectedType.typeName,
        duration: durationDays,
      }
    });
  };

  const handleAdTypeSelection = (adType: AdType) => {
    setSelectedType(adType);
    setShowDurationModal(true);
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Choose Your Ad Creation Type</h2>
      {adTypes.map((adType) => (
        <div key={adType.typeId} className="my-4 p-4 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">{adType.typeName}</h3>
          <p className="mb-2">
            <strong>Benefit:</strong> {adType.typeDescription}
          </p>
          <p className="mb-4">
            <strong>Price:</strong> {adType.price.toFixed(2)} NGN. This includes a higher fee for the increased visibility and priority placement.
          </p>
          {adType.coverUrl && (
            <img
              src={adType.coverUrl}
              alt={`${adType.typeName} Example`}
              className="w-full h-auto mb-4"
            />
          )}
          <Button variant='black' onClick={() => handleAdTypeSelection(adType)} label={`Choose ${adType.typeName}`} />
        </div>
      ))}
      {selectedType && (
        <DurationModal open={showDurationModal} onClose={() => setShowDurationModal(false)} onContinue={handleContinue} adPrice={selectedType.price} isAdmin={true} />
      )}
    </div>
  )
}

export default AdUploadTypes