import React, { useState } from 'react';

import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { Box, Stack, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';

import { Loader, StatusSpan } from '../../components';
import { VIDEO_STATUS } from '@video-cv/constants';
import { Button, VacancyCard } from '@video-cv/ui-components';
import { ModalTypes } from '../VideoManagement';
import { UploadVideoModal } from '../VideoManagement/modals';
import { DeleteVideoConfirmationModal } from './modals';

const VideoDetail = () => {
  const { id } = useParams();
  const status: any = VIDEO_STATUS.REJECTED;

  const [openModal, setOpenModal] = useState<
    ModalTypes | 'deleteConfirmationModal'
  >(null);

  // if(!videoDetail?.snippet) return <Loader />;

  const closeModal = () => setOpenModal(null);

  const onDelete = () => {
    setOpenModal('deleteConfirmationModal');
  };
  const onEdit = () => {
    setOpenModal('uploadModal');
  };

  return (
    <Box minHeight="95vh" className="py-6">
      <Stack direction={{ xs: 'column', md: 'column' }}>
        <Box flex={1}>
          <Box className="mr-auto mx-auto md:ml-5 w-[90%] sticky top-[86px]">
            <div className="flex justify-end mb-3 gap-3">
              <Button
                className="text-white bg-red-500"
                label="Delete"
                onClick={() => onDelete()}
                iconAfter={<DeleteIcon />}
              />
              {/* <Button label="Edit Video" onClick={() => onEdit()} /> */}
            </div>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              className="react-player"
              controls
            />

            {/*  category, reason for rejection if rejected */}
          </Box>
        </Box>
        <Box flex={1} className="p-6">
          <div className="flex flex-col">
            <div className="border flex justify-end gap-2 items-center">
              <h5 className="font-bold text-2xl">Share to:</h5>
              <EmailShareButton
                className="bg-pink"
                url=""
                subject=""
                body=""
                separator=""
              >
                <EmailIcon
                  bgStyle={{ fill: 'transparent' }}
                  iconFillColor="black"
                />
              </EmailShareButton>
              <FacebookShareButton url={''} className="">
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <WhatsappShareButton
                url={''}
                title={'Vide Sv'}
                separator=":: "
                className=""
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
            <div className="mt-3 flex items-center gap-2 font-semibold">
              Status: <StatusSpan status={status} />
            </div>
            <p className="text-black font-bold text-2xl py-3">
              {'Title of the Video'}
            </p>
            <p className="text-grey-500 text-base">
              {'Description of the Video'}
            </p>
            {status === VIDEO_STATUS.REJECTED && (
              <p className="text-grey-500 text-base mt-3">
                <span className="font-bold text-2xl">
                  Reason for Rejection:
                </span>{' '}
                Video is not clear.
              </p>
            )}
          </div>
        </Box>
        <Box className="mt-10 w-full md:w-11/12 mx-auto">
          <h2 className="font-bold text-5xl my-5">Vacancies</h2>
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((_, idx) => (
              <VacancyCard key={idx} />
            ))}
          </div>
        </Box>
      </Stack>
      {/* <Modal open={openModal === 'uploadModal'} onClose={closeModal}>
        <UploadVideoModal onClose={closeModal} />
      </Modal> */}
      <Modal
        open={openModal === 'deleteConfirmationModal'}
        onClose={closeModal}
      >
        <DeleteVideoConfirmationModal onClose={closeModal} />
      </Modal>
    </Box>
  );
};

export default VideoDetail;
