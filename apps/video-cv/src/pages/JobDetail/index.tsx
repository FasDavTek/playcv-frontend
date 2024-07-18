import React from 'react';

import LocationOnIcon from '@mui/icons-material/LocationOn';

import { Button } from '@video-cv/ui-components';

const JobDetail = () => {
  return (
    <div className="job-detail flex flex-col md:flex-row py-10 px-3 md:px-10 gap-5 md:gap-10">
      <section className="flex-[9]">
        <div className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between mb-3">
          <h5 className="font-bold text-5xl my-5">UI/UX Designer</h5>
          {/* <Button label="Apply Now" /> */}
        </div>
        <div className="flex gap-3">
          <div className="h-16 w-16 border rounded-lg"></div>
          <div className="flex items-start justify-start gap-4">
            <p className="">Pixel Studio</p>
            <LocationOnIcon sx={{ fontSize: '17px', color: 'gray', mr: '' }} />
            Location
          </div>
        </div>
        <div className="">
          <section className="">
            <h5 className="mt-3 mb-2 font-bold text-2xl">About this role</h5>
            <p className="">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus
              delectus odit labore, ea velit nihil corrupti dolor autem quas
              excepturi culpa? Omnis cumque dolores non nemo dolore illo placeat
              facere quo distinctio ad suscipit, optio odit deserunt quos fugiat
              itaque? Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Ducimus delectus odit labore, ea velit nihil corrupti dolor autem
              quas excepturi culpa? Omnis cumque dolores non nemo dolore illo
              placeat facere quo distinctio ad suscipit, optio odit deserunt
              quos fugiat itaque?
            </p>
            <h5 className="mt-3 mb-2 font-bold text-2xl">Qualification</h5>
            <p className="">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus
              delectus odit labore, ea velit nihil corrupti dolor autem quas
              excepturi culpa? Omnis cumque dolores non nemo dolore illo placeat
              facere quo distinctio ad suscipit, optio odit deserunt quos fugiat
              itaque? Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Ducimus delectus odit labore, ea velit nihil corrupti dolor autem
              quas excepturi culpa? Omnis cumque dolores non nemo dolore illo
              placeat facere quo distinctio ad suscipit, optio odit deserunt
              quos fugiat itaque?
            </p>
            <h5 className="mt-3 mb-2 font-bold text-2xl">Responsibilities</h5>
            <ul className="list-disc list-inside">
              <li className="">At least 3 years of relevant experience</li>
              <li className="">Knowledge of design validation</li>
              <li className="">Have good knowledge using figma and figjam</li>
            </ul>
          </section>
          <div className="flex flex-col gap-2 mt-4">
            <h5 className="my-0 py-0 font-bold text-2xl">How to apply</h5>
            <span className="my-0 py-0">
              Send email to: careers@videocv.com
            </span>
          </div>
          <a href="#" className="text-blue-500 underline">
            Click here to apply online
          </a>
        </div>
      </section>
      <section className="border flex-[3] rounded-lg min-h-[400px]">
        <h5 className="mt-3 mb-2 font-bold text-2xl p-5">Similar roles</h5>
      </section>
    </div>
  );
};

export default JobDetail;
