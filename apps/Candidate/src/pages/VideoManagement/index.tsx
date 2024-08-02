import React, { useState, useEffect } from 'react';

import { Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@video-cv/ui-components';
import { VideoLinks } from '@video-cv/constants';
import { VideoCard, Videos } from '../../components';
import { CreateVideoConfirmationModal, UploadVideoModal } from './modals';
import { routes } from '../../routes/routes';

export type ModalTypes = null | 'confirmationModal' | 'uploadModal';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);
  const [videos, setVideos] = useState([]);
  const [approvedVideos, setApprovedVideos] = useState([]);
  const [pendingVideos, setPendingVideos] = useState([]);

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  useEffect(() => {
    const uploadModalParam = queryParams.get('uploadModal');
    if (uploadModalParam === 'true') {
      openSetModalFn('uploadModal');
    }

    // const fetchedVideos: any = [];
    // setVideos(fetchedVideos);

    // const approved = fetchedVideos.filter((video: { status: string; }) => video.status === 'approved');
    // const pending = fetchedVideos.filter((video: { status: string; }) => video.status === 'pending');
    // setApprovedVideos(approved);
    // setPendingVideos(pending);

  }, [queryParams]);
  

  return (
    <section className="ce-px ce-py gap-5 border min-h-screen ">
      <div className=" h-full">
        <div className="flex justify-end mb-5">
          <Button
            variant='custom'
            label="Upload your Video"
            onClick={() => openSetModalFn('confirmationModal')}
          />
        </div>
        {/* VIDEO CARDS SECTION */}
        <div>
          <h3 className="mb-4">Videos Awaiting Approval</h3>
          <div className={`grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {/* {pendingVideos.map(video => <VideoCard key={video.id} video={video} />)} */}
          </div>
          <h3 className="mt-8 mb-4">Approved Videos</h3>
          <div className={`grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {/* {approvedVideos.map(video => <VideoCard key={video.id} video={video} />)} */}
          </div>
        </div>
      </div>
      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <CreateVideoConfirmationModal onClose={closeModal} />
      </Modal>
      {/* TODO: Add tags field and video upload field */}
      <Modal open={openModal === 'uploadModal'} onClose={closeModal}>
        <UploadVideoModal onClose={closeModal} />
      </Modal>
    </section>
  );
};

export default Dashboard;