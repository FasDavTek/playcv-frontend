import React, { useEffect, useState } from 'react';
import { getData } from '../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from '../../../../libs/utils/apis/apiEndpoints';
import CONFIG from '../../../../libs/utils/helpers/config';
import { SESSION_STORAGE_KEYS } from '../../../../libs/utils/sessionStorage';
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
  page?: number
  limit?: number
  currentJobId?: number;
  jobTitle?: string;
  // location?: string;
}

const SimilarJobs: React.FC<SimilarJobsProps> = ({ page =1, limit = 3, currentJobId, jobTitle= "", /* location= "", */ }) => {
  const [similarJobs, setSimilarJobs] = useState<Jobs[]>([]);
  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      try {
        const token = sessionStorage.getItem(SESSION_STORAGE_KEYS.TOKEN);

        let queryString = `Page=${currentPage}&Limit=${limit}`
        if (jobTitle) queryString += `&JobTitle=${jobTitle}`
        // if (location) queryString += `&Location=${location}`
        
        const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?${queryString}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.succeeded === true) {
          const filteredJobs = response.data
            .filter((job: Jobs) => job.vId !== currentJobId)
            .sort((a: Jobs, b: Jobs) => {
              let scoreA = 0;
              let scoreB = 0;

              // if (a.location === location) scoreA += 2;
              // if (b.location === location) scoreB += 2;

              if (a.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())) scoreA += 1;
              if (b.jobTitle.toLowerCase().includes(jobTitle.toLowerCase())) scoreB += 1;

              return scoreB - scoreA;
            })
          setSimilarJobs(filteredJobs.slice(0, 3));
          setTotalPages(Math.ceil(filteredJobs.length / limit))
        }
      } catch (error) {
        console.error('Error fetching similar jobs:', error);
      }
    };
    fetchSimilarJobs();
  }, [currentJobId, jobTitle, /* location, */ currentPage, limit]);

  if (loading) {
    return <div>Loading similar jobs...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (similarJobs.length === 0) {
    return <div>No similar jobs found.</div>
  }

  return (
    <div className="space-y-4">
      {similarJobs.map((job) => (
        <JobCard key={job.vId} job={job} />
      ))}
    </div>
  );
};

export default SimilarJobs;