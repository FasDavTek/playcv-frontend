import React from 'react';

import { Link } from 'react-router-dom';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import cx from 'classnames';

import {
  demoThumbnailUrl,
  demoVideoUrl,
  demoVideoTitle,
  VIDEO_STATUS,
} from '@video-cv/constants';
import StatusSpan from './StatusSpan';

const status: VIDEO_STATUS = 1;

const VideoCard = ({ video: { url, width, height } }: any) => (
  <Card
    sx={{
      width: { xs: '100%', sm: '100%', md: '100%' },
      boxShadow: 'none',
      borderRadius: 2,
    }}
  >
    <Link to={demoVideoUrl}>
      <CardMedia
        image={url || demoThumbnailUrl}
        title={'Title'}
        sx={{ width: { xs: '100%', sm: '100%' }, height: 180 }}
      />
    </Link>
    <CardContent className="bg-secondary-700 h-[106px]">
      <Link to={demoVideoUrl}>
        <Typography variant="subtitle1" fontWeight="bold" color="#FFF">
          <StatusSpan containerClassname="float-right" {...{ status }} />
          {demoVideoTitle.slice(0, 30)}{' '}
          <CheckCircleIcon
            sx={{ fontSize: '12px', color: 'gray', ml: '5px' }}
          />
        </Typography>
      </Link>
    </CardContent>
  </Card>
);

export default VideoCard;
