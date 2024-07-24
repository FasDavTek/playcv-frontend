import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { mockJobs } from '../utils/jobs'
import { ChannelCard, JobCard, Loader, VideoCard } from '.';
import { Button } from '@video-cv/ui-components';

const Jobs = ({ jobs }: any) => {
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
    const handleResize = () => {
      const cols = calculateColumns();
      setColumns(cols);
      setJobsPerPage(cols * 2);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  if (!mockJobs?.length) return <Loader />;

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
            {currentJobs.map((job: any) => (
                <Box key={job.id}>
                    <JobCard job={job} />
                </Box>
            ))}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 0}></Button>
          <Button icon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
        </div>
    </div>
  )
}

export default Jobs