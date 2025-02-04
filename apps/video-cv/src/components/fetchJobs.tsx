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
  selectedCategories: string[];
  selectedLocations: string[];
  selectedDates: string[];
  selectedStatus: string;
}

interface FetchJobsProps {
  filterOptions: FilterOptions;
}

const fetchJobs: React.FC<FetchJobsProps> = ({ filterOptions }) => {
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

        const resp = await getData(`${CONFIG.BASE_URL}${apiEndpoints.VACANCY_LIST}?Download=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = resp.vacancies;
        // if (resp.status === 200) {
        //   setJobs(resp.data);
        // }
        setJobs(data);
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



  const filterJobs = (jobs: Jobs[]) => {
    return jobs.filter((job) => {
      const matchesText = job.jobTitle.toLowerCase().includes(filterOptions.searchText.toLowerCase());
      const matchesCategory = filterOptions.selectedCategories.length === 0 || filterOptions.selectedCategories.includes(job.specialization);
      const matchesLocation = filterOptions.selectedLocations.length === 0 || filterOptions.selectedLocations.includes(job.location);

      const jobDate = dayjs(job.dateCreated).startOf('day');
      const matchesDate = filterOptions.selectedDates.length === 0 || filterOptions.selectedDates.some(date => 
        dayjs(date).startOf('day').isSame(jobDate)
      );

      // Assuming job status is part of the job object. If not, you'll need to adjust this.
      const matchesStatus = filterOptions.selectedStatus === 'all' || job?.status === filterOptions.selectedStatus;

      return matchesText && matchesCategory && matchesLocation && matchesDate && matchesStatus;
    });
  };


  
  if (loading) return <Loader />;
  if (!jobs?.length) return <p>No jobs found</p>;

  const filteredJobs = filterJobs(jobs);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * jobsPerPage;
  const currentJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

  return (
    <div>
      <div className={`items-center grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {currentJobs.map((job: Jobs) => (
          <Box key={job?.vId}>
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
