import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import JobCard from './JobCard';
import { Button } from '@video-cv/ui-components';
import { Link } from 'react-router-dom';
import { Loader } from '.';
import { getData } from './../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../libs/utils/helpers/config';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { LOCAL_STORAGE_KEYS } from './../../../../libs/utils/localStorage';

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

interface FilterOptions {
  searchText: string;
  selectedLocation: string | null;
  selectedDate: Date | null;
  selectedStatus: string;
}

interface FetchJobsProps {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  jobTitle?: string
  location?: string
  keyResponsibilities?: string
  status?: string
  qualifications?: string
  filterOptions: FilterOptions;
}

const fetchJobs: React.FC<FetchJobsProps> = ({ page =1, limit = 30, startDate, endDate, jobTitle, location, keyResponsibilities, status, qualifications, filterOptions }) => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page)
  const [totalPages, setTotalPages] = useState(1)
  const [jobsPerPage, setJobsPerPage] = useState(0);
  const [columns, setColumns] = useState(1);

  const calculateColumns = () => {
    const width = window.innerWidth;
    if (width >= 1536) return 6; // 2xl
    if (width >= 1024) return 5; // lg
    if (width >= 768) return 3; // md
    if (width >= 450) return 2; // sm
    return 1;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        let queryString = `Page=${currentPage}&Limit=${limit}`
        if (startDate) queryString += `&StartDate=${startDate}`
        if (endDate) queryString += `&EndDate=${endDate}`
        if (jobTitle) queryString += `&JobTitle=${jobTitle}`
        if (location) queryString += `&Location=${location}`
        if (keyResponsibilities) queryString += `&KeyResponsibilities=${keyResponsibilities}`
        if (status) queryString += `&Status=${status}`
        if (qualifications) queryString += `&Qualifications=${qualifications}`

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?${queryString}`);

        const jobData = resp.data;
        setJobs(jobData);
        setTotalPages(Math.ceil(jobData.length / limit));

      }
      catch (err) {
        setLoading(false);
      }
      finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [currentPage, limit, startDate, endDate, jobTitle, location, keyResponsibilities, status, qualifications]);


  useEffect(() => {
    const handleResize = () => {
      const cols = calculateColumns();
      setColumns(cols);
      setJobsPerPage(cols * 2);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  };



  if (loading) return <Loader />;
  if (!jobs?.length) return <p>No jobs found</p>;



  return (
    <div className='space-y-4'>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center md:justify-items-start`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {jobs.map((job: Jobs) => (
            <JobCard  key={job?.vId} job={job} />
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-sm text-gray-600 mr-10">
          Page {currentPage} of {totalPages}
        </span>
        <Link to={'/job-board'} className='mr-3 text-blue-600 text-sm'>
            <span>View more</span>
        </Link>
        <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '0.875rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 0}></Button>
        <Button icon={<NavigateNextIcon sx={{ fontSize: '0.875rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
      </div>
    </div>
  );
};

export default fetchJobs;
