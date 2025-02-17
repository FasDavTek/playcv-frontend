import React, { useEffect, useState } from 'react';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useLocation, useNavigate } from 'react-router-dom';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';
import { LOCAL_STORAGE_KEYS } from './../../../../../libs/utils/localStorage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { Button, Loader } from '@video-cv/ui-components';
import { useParams } from 'react-router-dom';
import SimilarJobs from './../../components/SimilarJobs';

interface Jobs {
  vId: number;
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
  const { vId } = useParams<{ vId: any }>();
  const location = useLocation();
  const [job, setJob] = useState<Jobs | undefined>(location.state?.job);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!job && vId) {
        setLoading(false);
        try {
          const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
          const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_BY_ID}/${vId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (resp && resp.data) {
            setJob(resp.data);
            setLoading(false);
          } else {
            setError('No job data found');
          }
        } catch (err) {
          console.error('Error fetching job detail:', err);
          setError('Error fetching job detail');
          toast.error('Error fetching job detail');
        } finally {
          setLoading(false);
        }
      }
      else if (!vId) {
        setError('No job ID provided');
        setLoading(false);
        return;
      }
    };

    fetchJobDetails();
  }, [job, vId]);


  const handleBackClick = () => {
    navigate(-1);
  };

  
  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!job) return <div className='items-center flex text-center'>No job found</div>;

  return (
    <div className="job-detail overflow-hidden flex flex-col md:flex-row py-10 px-3 md:px-10 gap-5 md:gap-10">
      <section className="flex-[6] overflow-x-scroll">
        <ChevronLeftIcon className="cursor-pointer text-7xl mr-1 sticky p-1 -mt-0 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={handleBackClick} />
        <div className="flex flex-row items-center justify-between mb-3">
            <h5 className="font-semibold text-2xl my-5">{job.jobTitle}</h5>
            <Button variant='black' label="Apply Now" onClick={() => window.open(job.linkToApply, '_blank')} />
        </div>
        <div className="flex gap-3">
          <div className="h-16 w-16 border rounded-lg">
            {/* <img src={job.} alt="" /> */}
          </div>
          <div className="flex items-center justify-start gap-4">
            <h5 className="font-semibold text-lg">{job.companyName}</h5>
            <div className="flex items-center">
              <LocationOnIcon sx={{ fontSize: '17px', color: 'gray', mr: '0.5rem' }} />
              <span>{job.location}</span>
            </div>
          </div>
        </div>
        <div className="mt-6">
          {job.jobDetails && (
            <section>
              <h5 className="mt-3 mb-2 font-semibold text-xl">About this role</h5>
              <p className="whitespace-pre-wrap">{job.jobDetails}</p>
            </section>
          )}
          {job.qualifications && (
            <section className="mt-6">
              <h5 className="mt-3 mb-2 font-semibold text-xl">Qualifications</h5>
              <p className="whitespace-pre-wrap">{job.qualifications}</p>
            </section>
          )}
          {job.keyResponsibilities && (
            <section className="mt-6">
              <h5 className="mt-3 mb-2 font-semibold text-xl">Responsibilities</h5>
              <ul className="list-disc list-inside">
                {/* {job.keyResponsibilities.split('\n').map((responsibility, index) => (
                  <li key={index} className="mb-2">{responsibility.trim()}</li>
                ))} */}
              </ul>
              <p className="whitespace-pre-wrap">{job.keyResponsibilities}</p>
            </section>
          )}
          <div className="flex flex-col gap-2 mt-6">
            <h5 className="my-0 py-0 font-semibold text-xl">How to apply</h5>
            <span className="my-0 py-0">
              Send email to: {job.companyEmail}
            </span>
          </div>
          <a href={job.linkToApply} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 inline-block">
            Click here to apply online
          </a>
        </div>
      </section>
      <section className="border flex-[2] rounded-lg min-h-[400px] overflow-y-scroll mt-5 md:mt-0">
        <h5 className="mt-3 mb-2 font-semibold text-xl p-5">Similar roles</h5>
        <SimilarJobs  currentJobId={job.vId} jobTitle={job.jobTitle} specialization={job.specialization} location={job.location} />
      </section>
    </div>
  );
};

export default JobDetail;
