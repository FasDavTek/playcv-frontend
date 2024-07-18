import React from 'react';
import { Stack, Box } from '@mui/material';

import { Loader, VideoCard } from '.';

// TODO: Rename component
const Videos = ({ videos }: any) => {
  if (!videos?.length) return <Loader />;
  if (videos?.length === 0)
    return (
      <div className="flex justify-center items-center text-2xl h-[400px]">
        No Video Uploaded yet
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {videos.map((item: any, idx: number) => (
        <Box key={idx}>{item.url && <VideoCard video={item} />}</Box>
      ))}
    </div>
  );
};

export default Videos;
