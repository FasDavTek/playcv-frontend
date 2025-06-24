import React from 'react';
// import * as Assets from '@video-cv/assets';

interface DashboardCardProps {
  text: string;
  figure: number;
  icon?: string;
  metric?: number;
}

const DashboardCard = ({
  text,
  figure,
  icon,
  metric = 0,
}: DashboardCardProps) => {
  return (
    <div className="rounded-[20px] p-3 bg-white [box-shadow:0px_4px_12px_0px_#0000000A] w-full">
      <div className="flex gap-4 items-center">
        <img className="w-10" src={icon} alt="" />
        <p>{text}</p>
      </div>

      <div className="flex gap-4 items-center mt-4">
        <p className="font-medium text-3xl md:text-4xl">{figure}</p>
        <div className="flex items-center gap-1">
          {/* <img src={Assets.Icons.Dashboard.TrendUp} alt="" /> */}
          <span
            className={`${metric < 0 ? 'text-red' : 'text-ce-green'} text-sm`}
          >
            {metric}%
          </span>
          <span className="text-greyText text-xs">from last week</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
