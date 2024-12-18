import React, { useEffect, useState } from 'react';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useLocation } from 'react-router-dom';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';

import { Button, Loader } from '@video-cv/ui-components';
import { useParams } from 'react-router-dom';

interface Job {
  vId: string;
  jobTitle: string;
  dateCreated: Date;
  startDate: Date;
  endDate: Date;
  jobDetails?: string;
  companyName?: string;
  companyEmail?: string;
  specialization: string;
  qualifications?: string;
  keyResponsibilities?: string;
  location: string;
  linkToApply?: string;
  status?: string;
    // url: string;
}

const JobDetail = () => {
  const location = useLocation();
 
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const vId = location.pathname.split('/').pop();
  console.log(vId)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

        console.log(vId);

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_BY_ID}?${vId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(resp);
        if (resp && resp.data) {
          setJob(resp.data);
        }
      }
      catch (err) {
        console.error('Error fetching jobs:', err);
      }
      finally {
        setLoading(false);
      }
    }

    fetchJobDetails();
  }, [vId]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!job) return <div>No job found</div>;

  return (
    <div className="job-detail h-[88dvh] overflow-hidden flex flex-col md:flex-row py-10 px-3 md:px-10 gap-5 md:gap-10">
      <section className="flex-[9] overflow-x-scroll">
      <div className="flex flex-col items-start justify-start md:flex-row md:items-center md:justify-between mb-3">
          <h5 className="font-bold text-3xl my-5">{job.jobTitle}</h5>
          <Button label="Apply Now" onClick={() => window.open(job.linkToApply, '_blank')} />
        </div>
        <div className="flex gap-3">
          <div className="h-16 w-16 border rounded-lg"></div>
          <div className="flex items-center justify-start gap-4">
            <h5 className="font-semibold text-lg">{job.companyName}</h5>
            <div className="flex items-center">
              <LocationOnIcon sx={{ fontSize: '17px', color: 'gray', mr: '0.5rem' }} />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <section>
            <h5 className="mt-3 mb-2 font-bold text-2xl">About this role</h5>
            <p className="whitespace-pre-wrap">{job.jobDetails}</p>
          </section>
          <section className="mt-6">
            <h5 className="mt-3 mb-2 font-bold text-2xl">Qualifications</h5>
            <p className="whitespace-pre-wrap">{job.qualifications}</p>
          </section>
          <section className="mt-6">
            <h5 className="mt-3 mb-2 font-bold text-2xl">Responsibilities</h5>
            <ul className="list-disc list-inside">
              {/* {job.keyResponsibilities.split('\n').map((responsibility, index) => (
                <li key={index} className="mb-2">{responsibility.trim()}</li>
              ))} */}
            </ul>
            <p className="whitespace-pre-wrap">{job.keyResponsibilities}</p>
          </section>
          <div className="flex flex-col gap-2 mt-6">
            <h5 className="my-0 py-0 font-bold text-2xl">How to apply</h5>
            <span className="my-0 py-0">
              Send email to: {job.companyEmail}
            </span>
          </div>
          <a href={job.linkToApply} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 inline-block">
            Click here to apply online
          </a>
        </div>
      </section>
      <section className="border flex-[3] rounded-lg min-h-[400px] overflow-y-scroll">
        <h5 className="mt-3 mb-2 font-bold text-2xl p-5">Similar roles</h5>
      </section>
    </div>
  );
};

export default JobDetail;
