import React from 'react';

import ReactPlayer from 'react-player';
import { Box, Stack, Modal } from '@mui/material';

import { useCart } from '../../context/CartProvider';
import { Button } from '@video-cv/ui-components';

const VideoDetails = () => {
  const id = 'GDa8kZLNhJ4';
  const { cartState, dispatch } = useCart();

  const handleAddToCart = () => {
    const value = {
      name: 'name',
      id: id,
      imageSrc: 'imageSrc',
      price: 'price',
    };
    dispatch({
      type: 'ADD_TO_CART',
      payload: value,
    });
  };
  return (
    <Box minHeight="95vh" className="py-9">
      <Stack direction={{ xs: 'column', md: 'row' }}>
        <Box flex={4}>
          <Box className="mr-auto mx-auto md:ml-5 w-full sticky top-[86px]">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              className="react-player"
              controls
            />

            {/*  category, reason for rejection if rejected */}
          </Box>
        </Box>
        <Box flex={1} className="flex items-end px-8">
          <Button
            className="w-full"
            label="Add to Cart"
            onClick={handleAddToCart}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetails;
