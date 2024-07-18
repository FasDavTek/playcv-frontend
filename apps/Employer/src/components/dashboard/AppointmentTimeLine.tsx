import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import * as Assets from '@video-cv/assets';

const AppointmentTimeLine = () => {
  return (
    <div className="border-t border-borderLine border-solid">
      <h3 className="mt-4 pl-2 text-blackText">Upcoming Appointment</h3>

      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div>
              <p className="text-greyText">Today, 08:30 am - 10:30 am</p>

              <p className="mt-3 text-blackText">Nurse Visit 20</p>

              <div className="flex items-center justify-between">
                <p className="mt-1 text-greyText">
                  Dr. Carol D. Pollack-rundle
                </p>

                <button className="btn-icon">
                  <img src={Assets.Icons.ArrowRight} alt="" />
                </button>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <div>
              <p className="text-greyText">Today, 08:30 am - 10:30 am</p>

              <p className="mt-3 text-blackText">Nurse Visit 20</p>

              <div className="flex items-center justify-between">
                <p className="mt-1 text-greyText">
                  Dr. Carol D. Pollack-rundle
                </p>

                <button className="btn-icon">
                  <img src={Assets.Icons.ArrowRight} alt="" />
                </button>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent>
            <div>
              <p className="text-greyText">Today, 08:30 am - 10:30 am</p>

              <p className="mt-3 text-blackText">Nurse Visit 20</p>

              <div className="flex items-center justify-between">
                <p className="mt-1 text-greyText">
                  Dr. Carol D. Pollack-rundle
                </p>

                <button className="btn-icon">
                  <img src={Assets.Icons.ArrowRight} alt="" />
                </button>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  );
};

export default AppointmentTimeLine;
