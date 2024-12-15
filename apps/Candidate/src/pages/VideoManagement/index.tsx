import React, { useState, useEffect } from 'react';

import { CircularProgress, Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@video-cv/ui-components';
import { VideoLinks } from '@video-cv/constants';
import { VideoCard, Videos } from '../../components';
import { CreateVideoConfirmationModal, UploadVideoModal } from './modals';
import { routes } from '../../routes/routes';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

export type ModalTypes = null | 'confirmationModal' | 'uploadModal';

type Video = {
  id: string;
  title: string;
  status: string;
  startDate: Date;
  endDate: Date;
  authorName: string;
  search: string;
  category: string;
  userType: string;
  userId: string;
  rejectionReason?: string
}

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [approvedVideos, setApprovedVideos] = useState<Video[]>([]);
  const [pendingVideos, setPendingVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState(Date.now());

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  if (!token) {
    toast.error('Your session has expired. Please log in again.');
    navigate('/auth/login', { replace: true });
    return;
  }

  const checkPaymentStatus = async () => {
    try {
      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VIDEO_STATUS}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.data;
      console.log(data);
      
      if (!data || !data.checkoutId) {
        openSetModalFn('confirmationModal');
      } else {
        toast.info('You have an existing payment for video upload that you have not yet completed.');
        navigate(`/candidate/video-management/upload`, { 
          state: { 
            checkoutId: data.checkoutId,
          } 
        });
      }
    } 
    catch (error) {
      console.error('Error checking payment status:', error);
      toast.warning('There was an error checking your payment status. Please try again later.');
    }
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.AUTH_VIDEO_LIST}?Page=1&Limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resp.succeded === true) {
        const data = await resp.data;
        const currentTime = Date.now();
        console.log(data);
        setVideos(data.videos);

        const newVideos = data.videos.filter((video: Video) => new Date(video.startDate).getTime() > lastFetchTime);
        const approved = data.videos.filter((video: Video) => video.status === 'approved');
        const pending = data.videos.filter((video: Video) => ['pending', 'rejected'].includes(video.status));
        setVideos(data.videos);
        setApprovedVideos(approved);
        setPendingVideos(pending);

        newVideos.forEach((video: Video) => {
          if (video.status === 'approved') {
            toast.success(`Your video "${video.title}" has been approved!`)
          } 
          else if (video.status === 'rejected') {
            toast.error(`Your video "${video.title}" has been rejected. Reason: ${video.rejectionReason}`)
          }
        })

        setLastFetchTime(currentTime)
      }
    }
    catch (err) {
      console.error('Error fetching videos: ', err);
      setError('Failed to load videos. Please try again later.');
      toast.warning('Failed to load videos. Please try again later.');
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchVideos()
    const interval = setInterval(fetchVideos, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [])


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // if (error) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen">
  //       <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
  //       <p className="text-lg font-semibold text-red-500">{error}</p>
  //     </div>
  //   )
  // }
  

  return (
    <section className="ce-px ce-py gap-5 border min-h-screen ">
      <div className=" h-full">
        <div className="flex justify-end mb-5">
          <Button
            variant='custom'
            label="Upload your Video"
            onClick={checkPaymentStatus}
            // onClick={() => openSetModalFn('confirmationModal')}
          />
        </div>
        {/* VIDEO CARDS SECTION */}
        <div>
          <h3 className="mb-4">Videos Awaiting Approval</h3>
          <div className={`grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {pendingVideos.map(video => <VideoCard key={video.id} video={video} />)}
          </div>
          <h3 className="mt-8 mb-4">Approved Videos</h3>
          <div className={`grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {approvedVideos.map(video => <VideoCard key={video.id} video={video} />)}
          </div>
        </div>
      </div>
      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <CreateVideoConfirmationModal onClose={closeModal} />
      </Modal>
      {/* TODO: Add tags field and video upload field */}
    </section>
  );
};

export default Dashboard;