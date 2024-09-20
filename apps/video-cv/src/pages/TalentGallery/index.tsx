import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/autoplay';
import { EffectCreative, Autoplay } from 'swiper/modules';
import { Images } from '@video-cv/assets';
import { Button, Input, Radio, Select } from '@video-cv/ui-components';
import { VideoCard, Videos } from '../../components';
import { videoCVs } from '../../utils/videoCVs';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

const heroImages = [Images.HeroImage6, Images.HeroImage7, Images.HeroImage8, Images.HeroImage9, Images.HeroImage9];

const index = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
          const screenWidth = window.innerWidth;
          if (screenWidth >= 768) {
            setItemsPerPage(30);
          } else {
            setItemsPerPage(10);
          }
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
        return videoCVs.filter((video) => {
            const matchesText = video.role.toLowerCase().includes(searchText.toLowerCase());
            // const matchesCategory = setSelectedCategories.length === 0 || selectedCategories.includes(video.category);
            // return matchesText && matchesCategory;
            return matchesText;
        });
    };
    
    const filteredVideoCVs = filterVideoCVs();
    const totalPages = Math.ceil(filteredVideoCVs.length / itemsPerPage);

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
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
    };
    
    const handleCategoryChange = (value: string) => {
        setSelectedCategories([...selectedCategories, value]);
        setIsFilterApplied(true);
    };
    
    const handleClearFilters = () => {
        setSearchText('');
        setSelectedCategories([]);
        setIsFilterApplied(false);
    };

    const handleVideoClick = (videoId: any, searchParams: any) => {
        navigate(`/video-details/${videoId}`, { state: { fromTalentGallery: true, searchParams } });
    };


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
                    }}
                    width='40%'
                    height='100%'
                >
                    
                    <Swiper grabCursor={false} loop={true} autoplay={{ delay: 3000, disableOnInteraction: false }} speed={3000} effect={'creative'} creativeEffect={{ prev: { shadow: true, translate: ['-20%', 0, -1], }, next: { translate: ['100%', 0, 0] } }} modules={[EffectCreative, Autoplay]} style={{ width: '100%', height: '100%', maxWidth: '100%', borderRadius: '.75rem' }}>
                        {heroImages.map((image: any, index: any) => (
                            <SwiperSlide key={index}>
                                <img className='!rounded-lg h-full' src={image} alt={`Hero image ${index + 1}`} style={{ width: '100%', objectFit: 'cover', maxWidth: '100%', borderRadius: 'lg' }} />
                            </SwiperSlide>
                            
                        ))}
                    </Swiper>
                </Box>
            </Stack>
        </Box>

        <Box className="bg-white min-h-[400px] flex flex-col lg:flex-row w-[95%] md:w-[90%] mx-auto gap-2 my-6 ">
            <div className="card-containers flex-[2] h-fit min-h-[200px]">
                <div className="border-b flex p-4 justify-between">
                    <p className="font-bold" role="button" onClick={() => {console.log('');}}>Filter</p>
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
                    <Select
                        options={categoryOptions.map(option => ({ label: option, value: option }))}
                        label="Categories"
                        value={selectedCategories.join(', ')}
                        onChange={handleCategoryChange}
                    />

                    {/* <Select
                        options={[]}
                        label="Location"
                        placeholder="Select Location"
                        containerClass="flex-1"
                    />
                    <Select
                        options={[]}
                        label="Date Posted"
                        placeholder="Select Date"
                        containerClass="flex-1"
                    /> */}

                    <Radio
                        label="Job Status"
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'closed', label: 'Closed' },
                        ]}
                        // onChange={handleFilter}
                        defaultValue={'all'}
                    />

                    <div className=""></div>
                </div>
            </div>

            <div className=" flex-[9] p-4">
                {/* Search box comes here */}

                {filteredVideoCVs.length > 0 ? (
                    <h4 className="font-black text-xl text-gray-700">{filteredVideoCVs.length} CV Results</h4>
                ) : null}
                <div className="mt-10 mx-auto">
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={2}
                        sx={{ color: 'black' }}
                        className="font-bold text-3xl my-5">LATEST VIDEO CVs
                    </Typography>
                    <div className={`items-center md:items-start justify-start grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        {paginatedItems.map((video) => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
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