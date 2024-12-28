import React from 'react';
import { Typography, Paper, Skeleton,Alert,Card,CardContent,} from '@mui/material';
import { VideocamOutlined, AccessTimeOutlined, BrushOutlined, RecordVoiceOverOutlined, LightbulbOutlined,} from '@mui/icons-material';
import { useAllMisc } from '../../../../../libs/hooks/useAllMisc';

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
  const { data: guidelines, isLoading, error } = useAllMisc({
    resource: 'cv-guideline',
    page: 1,
    limit: 100,
    download: false,
  });

  const response = guidelines || [];

  if (isLoading) {
    return (
      <div className="min-h-screen px-3 md:px-10 py-10 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          {[...Array(5)]?.map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={200} className="mb-4" />
          ))}
        </div>
      </div>
    );
  }

//   if (error) {
//     return (
//       <div className="min-h-screen px-3 md:px-10 py-10 bg-gray-50">
//         <Alert severity="error" className="max-w-4xl mx-auto">
//           An error occurred while fetching the guidelines. Please try again later.
//         </Alert>
//       </div>
//     );
//   }

  return (
    <div className="min-h-screen px-3 md:px-10 py-10">
      <div className="flex flex-col p-6 md:p-8 max-w-6xl mx-auto bg-white/55 rounded-lg shadow-md gap-6">
        <Typography variant="h5" className="mb-6 text-gray-600 text-center">
          Creating a compelling Video CV can significantly enhance your job application.
        </Typography>
        <Typography variant='h6' className='text-gray-600 text-center mt-10'>
            Follow these guidelines to make a professional and impactful presentation:
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guidelines.length > 0 && (
          guidelines?.map((guideline, index) => {
            const IconComponent = guideline.title && iconMap[guideline.title] ? iconMap[guideline.title] : LightbulbOutlined;
            return (
              <Card key={index} className="transition-all duration-300 hover:shadow-xl">
                <CardContent>
                  <div className="flex items-center mb-4">
                    <IconComponent className="text-indigo-500 mr-2" />
                    <Typography variant="h6" component="h3" className="font-bold text-gray-800">
                      {guideline.title}
                    </Typography>
                  </div>
                  <ul className="list-disc pl-5 space-y-2">
                    {guideline.content ?
                        guideline.content.split('\n')?.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-600">
                            {item.trim()}
                        </li>
                        ))
                    : <li className="text-gray-600">No content available</li>
                    }
                  </ul>
                </CardContent>
              </Card>
            );
          })
        )}
        </div>
        <Typography variant="body1" className="mt-8 text-gray-600 text-center font-semibold">
          Remember, your Video CV is an opportunity to showcase your personality and communication skills. Be authentic, confident, and enthusiastic. Good luck with your application!
        </Typography>
      </div>
    </div>
  );
};

export default index;