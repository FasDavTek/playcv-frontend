import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Grid } from '@mui/material';
import { formatDate } from '@video-cv/utils';
// import { fetchAdById } from './api';
import { Button } from '@video-cv/ui-components';
import { ArrowBack } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

type AdDetails = {
    id: string;
    adName: string;
    description: string;
    adType: string;
    redirectUrl: string;
    startDate: string;
    endDate: string;
    media: { type: 'image' | 'video'; url: string }[];
};

const mockAdData: AdDetails[] = [
    {
      id: '1',
      adName: 'Summer Sale',
      description: 'Get the best deals this summer with our exclusive offers!',
      adType: 'Image',
      redirectUrl: 'https://example.com/summer-sale',
      startDate: '2024-06-01T10:00:00Z',
      endDate: '2024-06-30T23:59:59Z',
      media: [{ type: 'image', url: 'https://example.com/summer-sale.png' }],
    },
    {
      id: '2',
      adName: 'Winter Collection',
      description: 'Check out our latest winter collection for the season.',
      adType: 'Video',
      redirectUrl: 'https://example.com/winter-collection',
      startDate: '2024-11-15T12:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      media: [{ type: 'video', url: 'https://example.com/winter-collection.mp4' }],
    },
    {
      id: '3',
      adName: 'Spring Promo',
      description: 'Enjoy our special spring promo with discounts on all items.',
      adType: 'Image',
      redirectUrl: 'https://example.com/spring-promo',
      startDate: '2024-03-21T09:30:00Z',
      endDate: '2024-04-30T23:59:59Z',
      media: [{ type: 'image', url: 'https://example.com/spring-promo.png' }],
    },
];

const ViewAds = () => {
    const { id } = useParams<{ id: string }>();
    const [adDetails, setAdDetails] = useState<AdDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getAdDetails = async () => {
            try {
                const data = mockAdData.find(ad => ad.id === id);
                if (data) {
                    setAdDetails(data);
                } else {
                    console.error('Ad not found');
                }
            } catch (error) {
                console.error('Failed to fetch ad details:', error);
            } finally {
                setLoading(false);
            }
        };
        getAdDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }
    
    if (!adDetails) {
        return <p className="text-center text-red-500">Ad not found</p>;
    }

  return (
    <div className="p-6 bg-gray-50 mb-8">
      <ChevronLeftIcon className="cursor-pointer text-base mr-1 top-2 sticky p-1 mb-4 hover:text-white hover:bg-black rounded-full" sx={{ fontSize: '1.75rem' }} onClick={() => navigate('/admin/advertisement-management')} />
      
      <div className="bg-white p-10 shadow-lg rounded-2xl transform transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-4xl font-semibold text-gray-700 mb-6">{adDetails.adName}</h1>
        <p className="mb-8 text-lg text-gray-700 leading-relaxed">{adDetails.description}</p>
        
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Ad Type:</span> <span className="text-gray-600">{adDetails.adType}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Redirect URL:</span>
            <a href={adDetails.redirectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 ml-2 underline transition duration-200 hover:text-blue-800">
                {adDetails.redirectUrl}
            </a>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">Start Date:</span> <span className="text-gray-600">{formatDate(adDetails.startDate)}</span>
        </div>
        <div className="mb-6">
            <span className="font-semibold text-gray-800">End Date:</span> <span className="text-gray-600">{formatDate(adDetails.endDate)}</span>
        </div>

        <h2 className="text-2xl font-semibold mt-10 mb-6 text-gray-800">Media</h2>
        <Grid container spacing={4}>
            {adDetails.media.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                    {item.type === 'image' ? (
                        <img
                            src={item.url}
                            alt={`Ad media ${index + 1}`}
                            className="w-full h-auto rounded-xl p-1 transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <video
                            controls
                            src={item.url}
                            className="w-full h-auto rounded-xl p-1 transition-transform duration-300 hover:scale-105"
                        />
                    )}
                </Grid>
            ))}
        </Grid>
      </div>

    </div>
  )
}

export default ViewAds