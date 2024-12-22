import React, { useEffect, useState } from 'react';
import { getData } from '../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from '../../../../libs/utils/apis/apiEndpoints';
import CONFIG from '../../../../libs/utils/helpers/config';
import { LOCAL_STORAGE_KEYS } from '../../../../libs/utils/localStorage';
import JobCard from './JobCard';

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

interface SimilarJobsProps {
  currentJobId: number;
  jobTitle: string;
  specialization: string;
  location: string;
}

const SimilarJobs: React.FC<SimilarJobsProps> = ({ currentJobId, jobTitle, specialization, location }) => {
  const [similarJobs, setSimilarJobs] = useState<Jobs[]>([]);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      try {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);

        const queryParams = new URLSearchParams({
          specialization,
          location,
          jobTitle,
          limit: '12',
        }).toString();
        
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?${queryParams}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response && response.data) {
          const filteredJobs = response.data
            .filter((job: Jobs) => job.vId !== currentJobId)
            .sort((a: Jobs, b: Jobs) => {
              let scoreA = 0;
              let scoreB = 0;

              if (a.specialization === specialization) scoreA += 3;
              if (b.specialization === specialization) scoreB += 3;

              if (a.location === location) scoreA += 2;
              if (b.location === location) scoreB += 2;

              if (a.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())) scoreA += 1;
              if (b.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())) scoreB += 1;

              return scoreB - scoreA;
            })
          setSimilarJobs(filteredJobs.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching similar jobs:', error);
      }
    };

    fetchSimilarJobs();
  }, [currentJobId, jobTitle, specialization, location]);

  return (
    <div className="space-y-4">
      {similarJobs.map((job) => (
        <JobCard key={job.vId} job={job} />
      ))}
    </div>
  );
};

export default SimilarJobs;