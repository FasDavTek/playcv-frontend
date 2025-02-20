import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/autoplay';
import { EffectCreative, Autoplay } from 'swiper/modules';
import { Images } from '@video-cv/assets';
import { Button, Input, Radio, Select } from '@video-cv/ui-components';
import { VideoCard, Loader, Videos } from '../../components';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';
import { getData } from './../../../../../libs/utils/apis/apiMethods';
import { apiEndpoints } from './../../../../../libs/utils/apis/apiEndpoints';
import CONFIG from './../../../../../libs/utils/helpers/config';
import { Controller, useForm } from 'react-hook-form';
import { useAllMisc } from './../../../../../libs/hooks/useAllMisc';
import model from './../../../../../libs/utils/helpers/model';

interface Video {
    id: number
    title: string
    typeId: number
    type: string
    transcript: string
    categoryId: number
    category: string | null
    userId: string
    dateCreated: string
    views: number
    videoUrl: string
    thumbnailUrl: string
    status: string
    price: number
    totalRecords: number
    rejectionReason?: string
    authorProfile: {
      userDetails: {
        fullName: string
        email: string
        profileImage: string | null
        userId: string;
        firstName: string;
        middleName: string;
        lastName: string;
        phoneNo: string;
        dateOfBirth: string;
        gender: string;
        type: string;
        isActive: boolean;
        phoneVerification: boolean;
        isBusinessUser: boolean;
        isProfessionalUser: boolean;
        isAdmin: boolean;
        isEmailVerified: boolean;
        isDeleted: boolean;
        createdAt: string;
        updatedAt: string;
        lastLoginDate: string;
        genderId: number;
      }
    }
    paymentDetails: {
      amountPaid: number
      totalAmount: number
      paymentStatus: string
      currency: string
      paymentDate: string
    }
}

const heroImages = [Images.HeroImage10, Images.HeroImage11, Images.HeroImage13, Images.HeroImage14, Images.HeroImage15];

const index = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(30);
    
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const navigate = useNavigate();
    const { control } = useForm();



    const { data: videoCategory, isLoading: isLoadingIndustries } = useAllMisc({
        resource: 'video-category',
        download: true,
    });



    useEffect(() => {
        const fetchVideos = async () => {
          try {
            setLoading(true);

            const queryParams = new URLSearchParams({
                Page: currentPage.toString(),
                Limit: itemsPerPage.toString(),
                ...(searchText && { Search: searchText }),
                ...(selectedCategory && { Category: selectedCategory }),
            })

            const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?${queryParams}`);
            
            if (response.succeeded === true) {
              const data = await response.data;
              const approvedVideos = data.filter((video: Video) => video.status === "Approved")

              approvedVideos.sort((a: Video, b: Video) => {
                if (a.type === "Pinned" && b.type !== "Pinned") return -1
                if (a.type !== "Pinned" && b.type === "Pinned") return 1
                return 0
              })

              setVideos(approvedVideos);
            //   setTotalRecords(videos.length || 0);
            }
          } 
          catch (error) {
            console.error('Error fetching videos:', error);
          }
          finally {
            setLoading(false);
          }
        };
    
        fetchVideos();
    }, [currentPage, itemsPerPage, searchText, selectedCategory]);



    useEffect(() => {
        const handleResize = () => {
          const screenWidth = window.innerWidth;
          setItemsPerPage(screenWidth >= 768 ? 30 : 10)
        };
    
        // Set the initial items per page based on screen width
        handleResize();
    
        // Add event listener to update items per page on resize
        window.addEventListener('resize', handleResize);
    
        // Clean up event listener on component unmount
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);


    const filterVideoCVs = () => {
        return videos.filter((video) => {
            const matchesText = video.title.toLowerCase().includes(searchText.toLowerCase());
            const matchesAuthor = video.authorProfile.userDetails.fullName.toLowerCase().includes(searchText.toLowerCase());
            const matchesStatus = video.status.toLowerCase().includes(searchText.toLowerCase());
            const matchesCategory = !selectedCategory || video.category === selectedCategory
            return (matchesText || matchesAuthor || matchesStatus) && matchesCategory;
            // return matchesText;
        });
    };
    
    const filteredVideoCVs = filterVideoCVs();
    const totalPages = Math.ceil(filteredVideoCVs.length / itemsPerPage)

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const paginatedItems = filteredVideoCVs.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        setIsFilterApplied(true);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value: any) => {
        setSelectedCategory(value?.name || null);
        setIsFilterApplied(true);
        setCurrentPage(1) // Reset to first page when changing category
    }
    
    const handleClearFilters = () => {
        setSearchText('');
        setSelectedCategory(null);
        setIsFilterApplied(false);
        setCurrentPage(1)
    };


    if (loading) return <Loader />

  return (
    <Box>
        <Box className="min-h-[500px] bg-[#F7FaFF] px-3 md:px-16 flex justify-center w-full items-start py-10 flex-col gap-3">
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems='center' justifyContent='space-between' spacing={{ xs: 10, base: 30 }} width='100%'>
                <Box flex={2} width={['100%', '70%']} className='flex flex-col gap-4'>
                    <Typography variant="h3" lineHeight="shorter" fontWeight="extrabold" fontSize={{ xs: '32px', md: '42px' }}>
                        SHOWCASE YOUR SKILLS & QUALITIES!
                    </Typography>
                    <Typography variant="body1" fontSize="lg" color="gray.600">
                        Let thousands of potential employers notice you via videoCV
                    </Typography>
                </Box>
                <Box className='!rounded-lg'
                    sx={{
                        flex: 1,
                        display: { xs: 'none', md: 'flex' },
                        alignSelf: 'center',
                        textAlign: 'center',
                        height: '600px'
                    }}
                    width='40%'
                >
                    
                    <Swiper grabCursor={false} loop={true} autoplay={{ delay: 3000, disableOnInteraction: false }} speed={3000} effect={'creative'} creativeEffect={{ prev: { shadow: true, translate: ['-20%', 0, -1], }, next: { translate: ['100%', 0, 0] } }} modules={[EffectCreative, Autoplay]} style={{ width: '550px', alignItems: 'center', justifyContent: 'center', height: '479px', borderRadius: '.75rem' }}>
                        {heroImages.map((image: any, index: any) => (
                            <SwiperSlide key={index}>
                                <img className='!rounded-lg' src={image} alt={`Hero image ${index + 1}`} style={{ objectFit: 'contain', borderRadius: 'lg' }} />
                            </SwiperSlide>
                            
                        ))}
                    </Swiper>
                </Box>
            </Stack>
        </Box>

        <Box className="bg-white min-h-[400px] flex flex-col lg:flex-row w-[95%] md:w-[90%] mx-auto gap-2 my-6 ">
            <div className="card-containers md:flex-[3.5] 2xl:flex-[2] h-fit min-h-[200px]">
                <div className="border-b flex p-4 justify-between">
                    <p className="font-bold" role="button" onClick={() => {}}>Filter</p>
                    <p className="text-red-500" role="button" onClick={handleClearFilters}>Clear All</p>
                </div>
                <div className="p-3 mx-auto flex flex-col gap-3">
                    <Input
                        label="Find CV"
                        placeholder="Search..."
                        containerClass="flex-1"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <Controller
                        name="categories"
                        control={control}
                        render={({ field }) => (
                            <Select
                                name="categories"
                                options={model(videoCategory, 'name', 'label')}
                                control={control}
                                placeholder="Select Categories"
                                // defaultValue={selectedCategories.map(cat => ({ value: cat, label: cat }))}
                                defaultValue={selectedCategory ? { name: selectedCategory, label: selectedCategory } : null}
                                handleChange={handleCategoryChange}
                                // isMulti={true}
                            />
                        )}
                    />

                    {/* <div className=""></div> */}
                </div>
            </div>

            <div className=" flex-[9] p-4">
                {/* Search box comes here */}

                {filteredVideoCVs.length > 0 ? (
                    <h4 className="font-medium text-lg text-gray-700">{filteredVideoCVs.length} Video CV Results</h4>
                ) : 
                    <h4 className="font-medium text-lg text-gray-700">No results found</h4>
                }
                <div className="mt-10 mx-auto">
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={2}
                        sx={{ color: 'black' }}
                        className="font-bold text-3xl my-5">LATEST VIDEO CVs
                    </Typography>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center md:justify-items-start`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                        {filteredVideoCVs.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <span className="text-sm text-gray-600 mr-10">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 0}></Button>
                        <Button icon={<NavigateNextIcon sx={{ fontSize: '1rem' }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages - 1}></Button>
                    </div>
                </div>
            </div>
        </Box>
    </Box>
  )
}

export default index