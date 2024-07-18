import React, { useState, useEffect } from 'react';

import { Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@video-cv/ui-components';
import { VideoLinks } from '@video-cv/constants';
import { Videos } from '../../components';
import { CreateVideoConfirmationModal, UploadVideoModal } from './modals';
import { routes } from '../../routes/routes';

export type ModalTypes = null | 'confirmationModal' | 'uploadModal';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const [openModal, setOpenModal] = useState<ModalTypes>(null);

  const closeModal = () => setOpenModal(null);
  const openSetModalFn = (modalType: ModalTypes) => setOpenModal(modalType);

  useEffect(
    function openUploadModal() {
      if (queryParams.has('uploadModal')) {
        navigate(routes.videoManagement, { replace: true });
        openSetModalFn('uploadModal');
      }
    },
    [location.search]
  );

  return (
    <section className="ce-px ce-py gap-5 border min-h-screen ">
      <div className=" h-full">
        <div className="flex justify-end mb-5">
          <Button
            label="GET STARTED UPLOAD VIDEOCV"
            onClick={() => openSetModalFn('confirmationModal')}
          />
        </div>
        {/* VIDEO CARDS SECTION */}
        <Videos videos={VideoLinks.slice(0, 10)} />
      </div>
      <Modal open={openModal === 'confirmationModal'} onClose={closeModal}>
        <CreateVideoConfirmationModal
          onClose={closeModal}
          // onAccept={() => openSetModalFn('uploadModal')}
        />
      </Modal>
      {/* TODO: Add tags field and video upload field */}
      <Modal open={openModal === 'uploadModal'} onClose={closeModal}>
        <UploadVideoModal onClose={closeModal} />
      </Modal>
    </section>
  );
};

export default Dashboard;
