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
import { LOCAL_STORAGE_KEYS } from './../../../../libs/utils/localStorage';

interface Jobs {
  id: string;
  jobTitle: string;
  datePosted: Date;
  startDate: Date;
  endDate: Date;
  description?: string;
  companyName?: string;
  specialization: string;
  location: string;
}

const fetchJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
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
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
        if (!token) {
          toast.error('Unable to load user profile');
          return;
        }

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?Page=1&Limit=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = resp.data;
        // if (resp.status === 200) {
        //   setJobs(resp.data);
        // }
        setJobs(resp.data);
      }
      catch (err) {
        console.error('Error fetching jobs:', err);
      }
      finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

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
  
  if (loading) return <Loader />;
  if (!jobs?.length) return <p>No jobs found</p>;

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * jobsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div>
      <div className={`items-center grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {currentJobs.map((job: Jobs) => (
          <Box key={job.id}>
            <JobCard job={job} />
          </Box>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 mt-4">
        <Link to={'/job-board'} className='mr-3 text-blue-600'>
            <span>View more</span>
        </Link>
        <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 0}></Button>
        <Button icon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
      </div>
    </div>
  );
};

export default fetchJobs;
