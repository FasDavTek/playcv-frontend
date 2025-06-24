import React, { useState } from 'react';
import { Typography, Paper, Skeleton,Alert,Card,CardContent, Box, CircularProgress,} from '@mui/material';
import { VideocamOutlined, AccessTimeOutlined, BrushOutlined, RecordVoiceOverOutlined, LightbulbOutlined,} from '@mui/icons-material';
import { useAllMisc } from '../../../../../libs/hooks/useAllMisc';
import { HtmlContent } from '@video-cv/ui-components';

interface IconMap {
    [key: string]: React.ComponentType;
}

const iconMap: IconMap = {
  'Preparation': LightbulbOutlined,
  'Equipment Setup': VideocamOutlined,
  'Appearance': BrushOutlined,
  'Content': RecordVoiceOverOutlined,
  'Timing': AccessTimeOutlined,
};

const index = () => {
  const { data: guidelines, isLoading: isLoadingGuidelines } = useAllMisc({
    resource: 'cv-guideline',
    // page: 1,
    // limit: 100,
    download: true,
    structureType: "data",
  });

  const [expanded, setExpanded] = useState<string | null>(null);
  
  const togglePanel = (panelId: string) => {
    setExpanded((prev) => (prev === panelId ? null : panelId));
  };

  return (
    <div className="min-h-screen mt-6 px-3 md:px-10 py-10">
      <div className="flex flex-col lg:p-6 md:p-8 w-[95%] lg:w-[90%] mx-auto gap-6">
        <Typography variant="h5" className="mb-6 text-gray-600 text-center">
          Creating a compelling Video CV can significantly enhance your job application.
        </Typography>
        <Typography variant='h6' className='text-gray-600 text-center mt-10'>
            Follow these guidelines to make a professional and impactful presentation:
        </Typography>
        <Typography variant="h6" className="mt-8 text-gray-600 text-center font-semibold">
          Remember, your Video CV is an opportunity to showcase your personality and communication skills. Be authentic, confident, and enthusiastic. Good luck with your application!
        </Typography>
        <div className="p-6 mt-12 flex flex-col gap-10">
          {isLoadingGuidelines ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {guidelines?.map((guideline: any) => (
                <div key={guideline.id} className={`${expanded && expanded === guideline.id ? ' rounded-lg shadow-md bg-white' : ''}`}>
                  <button
                    className="w-full p-4 text-left flex justify-between items-center bg-black/90 text-white hover:bg-black rounded-t-lg"
                    onClick={() => togglePanel(guideline.id)}
                  >
                    <span className="font-medium text-primary-700">{guideline.guideline}</span>
                    <svg
                      className={`w-5 h-5 transition-transform transform ${
                        expanded === guideline.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expanded && expanded === guideline.id && (
                    <div className={`${expanded && expanded === guideline.id ? 'p-4 text-gray-700 bg-[rgba(0, 0, 0, 0.03)] rounded-lg' : 'bg-none hidden opacity-0'}`}>
                      <HtmlContent html={guideline.description}></HtmlContent>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default index;