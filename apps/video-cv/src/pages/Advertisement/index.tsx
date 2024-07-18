import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Modal } from '@mui/material';
import { z } from 'zod';

import { Button } from '@video-cv/ui-components';
import CreateAdvertModal from './modals/CreateAdvert';

const Advertisement = () => {
  const [openModal, setOpenModal] = useState<'createAdvert' | null>(null);

  const closeModal = () => {
    setOpenModal(null);
  };

  const openModalFn = () => {
    setOpenModal('createAdvert');
  };

  return (
    <section className="ce-px ce-py">
      <div className="">
        <Button onClick={openModalFn} label="Add Advert" />
      </div>
      {/* TODO: add filters */}
      <div className="p-4 grid md:grid-cols-4 gap-4">
        <AdvertCard />
        <AdvertCard />
        <AdvertCard />
        <AdvertCard />
      </div>
      <Modal
        className="overflow-scroll pt-[50px] block"
        open={openModal === 'createAdvert'}
        onClose={closeModal}
      >
        <CreateAdvertModal onClose={closeModal} />
      </Modal>
    </section>
  );
};

export default Advertisement;

const AdvertCard = () => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        width: { xs: '100%', sm: '100%', md: '100%' },
        boxShadow: 'none',
        borderRadius: 2,
      }}
    >
      <Link to={`/advertisement/manage/1`}>
        <CardMedia
          image={'https://i.ytimg.com/vi/3cbnNwxtUUA/hqdefault_live.jpg'}
          title={'Title'}
          sx={{ width: { xs: '100%' }, height: 180 }}
        />
      </Link>
      <CardContent sx={{ backgroundColor: '#1E1E1E', height: '106px' }}>
        <Link to={'#'}>
          <Typography variant="subtitle1" fontWeight="bold" color="#FFF">
            {`demoVideoTitle.slice(0, 30)`}{' '}
          </Typography>
        </Link>
        <div className="flex justify-end mt-2 gap-2">
          <Button
            onClick={() => navigate('/advertisement/manage/1')}
            variant="success"
            label="manage"
            className="!px-1 !py-1.5 text-white"
          />
          <Button
            variant="tertiary"
            label="suspend"
            className="!px-1 !py-1.5"
          />
          <Button variant="red" label="Delete" className="!px-1 !py-1.5" />
        </div>
      </CardContent>
    </Card>
  );
};
