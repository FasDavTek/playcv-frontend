import React from 'react';

import cx from 'classnames';

import { VIDEO_STATUS } from '@video-cv/constants';

const statusObject: any = {
  0: {
    className: 'bg-green-100 text-green-600',
    value: VIDEO_STATUS.APPROVED,
    label: 'Approved',
  },
  1: {
    className: 'bg-yellow-100 text-yellow-600',
    value: VIDEO_STATUS.IN_REVIEW,
    label: 'In Review',
  },
  2: {
    className: 'bg-red-100 text-red-600',
    value: VIDEO_STATUS.REJECTED,
    label: 'Rejected',
  },
};

const StatusSpan = ({
  status,
  containerClassname = '',
}: {
  status: VIDEO_STATUS;
  containerClassname?: string;
}) => {
  return (
    <span
      className={cx(
        'my-1 text-xs rounded-full py-1 px-2 ',
        containerClassname,
        statusObject[status].className
      )}
    >
      {statusObject[status].label}
    </span>
  );
};

export default StatusSpan;
