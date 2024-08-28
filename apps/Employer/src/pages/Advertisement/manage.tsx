// import React from 'react';

// const ManageAdvertisement = () => {
//   return (
//     <section className="ce-px ce-py md:w-[98%] my-3 mx-auto bg-white rounded-md overflow-auto">
//       <div className="text-3xl font-semibold">Advert 1</div>
//       <div className="">
//         <h1 className="my-2 text-xl">Description lists</h1>
//         <p className="">
//           Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore vero,
//           aliquam quo in atque deserunt vel aperiam magnam ullam necessitatibus
//           neque quos iste consequuntur molestiae velit perspiciatis? Accusantium
//           perspiciatis saepe nobis quam ullam fuga tempore delectus odio minima
//           quasi optio temporibus deleniti officiis laboriosam reprehenderit
//           architecto placeat dicta repudiandae, doloribus possimus, aperiam
//           atque voluptatum quidem. Laudantium voluptatem minima corrupti beatae
//           totam nam distinctio odio sequi voluptates harum optio recusandae,
//           omnis, tempora nihil rem amet placeat architecto non impedit
//           repudiandae suscipit! Quo consequatur numquam tenetur? Officia amet
//           deleniti, architecto modi ea quam expedita delectus voluptate tempore
//           eligendi nostrum, porro debitis animi fuga! Iste odio saepe, fugiat
//           consequuntur placeat perferendis, fugit delectus reiciendis eligendi
//           obcaecati laudantium explicabo ullam inventore necessitatibus, atque
//           distinctio fuga dolorum animi in soluta sed. <br /> <br /> Quia ex,
//           reprehenderit, ipsam recusandae veniam fugit et harum beatae quisquam
//           saepe sint doloremque amet labore. Consequatur iure id possimus ad
//           hic, ut voluptatum corporis, dicta tempore consequuntur odit earum
//           quaerat maxime vel quod itaque sunt similique saepe eos? Nisi
//           dignissimos accusantium ullam aliquam soluta sapiente impedit odio
//           velit repudiandae sed blanditiis vitae voluptatibus tempore dolorem
//           ex, illum aperiam adipisci modi dolore nobis ratione et! Aspernatur ab
//           minus officia adipisci odit ea obcaecati eaque.{' '}
//         </p>
//       </div>
//       <div className="">
//         <h1 className="my-2 text-xl">Advert Details</h1>
//         <div className="flex flex-col gap-2">
//           <div className="flex justify-between border rounded-lg px-5 py-2">
//             <p className="">DURATION</p>
//             <p className="">10 days</p>
//           </div>
//           <div className="flex justify-between border rounded-lg px-5 py-2">
//             <p className="">START DATE</p>
//             <p className="">10 days</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ManageAdvertisement;






import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Grid } from '@mui/material';
import { formatDate } from '@video-cv/utils';
// import { fetchAdById } from './api';
import dayjs from 'dayjs';
import { Button, DatePicker, Input, Select, TextArea } from '@video-cv/ui-components';
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

const ManageAdvertisement = () => {
    const { id } = useParams<{ id: string }>();
    const [adDetails, setAdDetails] = useState<AdDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAdDetails, setEditedAdDetails] = useState<AdDetails | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getAdDetails = async () => {
            try {
                const data = mockAdData.find(ad => ad.id === id);
                if (data) {
                    setAdDetails(data);
                    setEditedAdDetails(data);
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (editedAdDetails) {
            setEditedAdDetails({
                ...editedAdDetails,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editedAdDetails) {
            setEditedAdDetails({
                ...editedAdDetails,
                adType: e.target.checked ? 'Video' : 'Image',
            });
        }
    };

    const handleSaveChanges = () => {
        if (editedAdDetails) {
            setAdDetails(editedAdDetails);
            setIsEditing(false);
            // Here you would normally send the updated details to the server
        }
    };

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
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-semibold text-gray-700">{adDetails.adName}</h1>
            <Button variant={isEditing? 'red' : 'success'} label={isEditing ? 'Cancel' : 'Edit'} onClick={() => setIsEditing(!isEditing)} />
        </div>
        
        {isEditing ? (
            <>
                <Input
                    label="Ad Name"
                    name="adName"
                    className='mt-3'
                    value={editedAdDetails?.adName || ''}
                    onChange={handleInputChange}
                />
                <TextArea
                    label="Description"
                    name="description"
                    className='mt-3'
                    rows={4}
                    value={editedAdDetails?.description || ''}
                    onChange={handleInputChange}
                />
                <Input
                    label="Redirect URL"
                    name="redirectUrl"
                    className='mt-3'
                    value={editedAdDetails?.redirectUrl || ''}
                    onChange={handleInputChange}
                />
                <DatePicker
                    label="Start Date"
                    name="startDate"
                    className='mt-3'
                    value={dayjs(editedAdDetails?.startDate)}
                    onChange={handleInputChange}
                />
                <DatePicker
                    label="End Date"
                    name="endDate"
                    className='mt-3'
                    value={dayjs(editedAdDetails?.endDate)}
                    onChange={handleInputChange}
                />
                <Select
                    checked={editedAdDetails?.adType === 'Video'}
                    onChange={handleSwitchChange}
                    name="adType"
                    color="primary"
                    label="Ad Type (Video)"
                    className='mt-3'
                />

                <Button
                    variant="success"
                    color="primary"
                    onClick={handleSaveChanges}
                    label='Save Changes'
                    className='mt-3'
                ></Button>
            </>
            ) : (
                <>
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
                                        alt={`Ad Media ${index + 1}`}
                                        className="rounded-lg shadow-md"
                                    />
                                ) : (
                                    <video
                                        src={item.url}
                                        controls
                                        className="rounded-lg shadow-md"
                                    />
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
      </div>

    </div>
  )
}

export default ManageAdvertisement
