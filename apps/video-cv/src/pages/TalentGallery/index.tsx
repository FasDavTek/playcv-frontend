import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material'
import { Images } from '@video-cv/assets';
import { Button, Radio, Select } from '@video-cv/ui-components';
import { VideoCard, Videos } from '../../components';
import { videoCVs } from '../../utils/videoCVs';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const index = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
    
    const totalPages = Math.ceil(videoCVs.length / itemsPerPage);

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

    const paginatedItems = videoCVs.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
    );


  return (
    <Box>
        <Box className="min-h-[500px] bg-[#F7FaFF] px-3 md:px-10 flex justify-center items-start py-10 flex-col gap-3">
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems='center' spacing={4}>
                <Box flex={1}>
                    <Typography variant="h3" fontSize="2xl" lineHeight="shorter" fontWeight="extrabold">
                        Discover Top Talent
                    </Typography>
                    <Typography variant="body1" fontSize="lg" color="gray.600">
                        Browse through a catalog of video resumes from talented professionals and find the perfect fit for your organization.
                    </Typography>
                </Box>
                <Box flexShrink={0} className='!rounded-lg'
                    sx={{
                    flex: 1,
                    display: { xs: 'none', md: 'block' },
                    alignSelf: 'center',
                    textAlign: 'center',
                    }}
                >
                    <img className='!rounded-lg'
                    src={Images.HeroImage}
                    alt="Job search illustration"
                    style={{ maxWidth: '80%', height: 'auto', borderRadius: 'lg' }}
                    />
                </Box>
            </Stack>
        </Box>

        <Box className="bg-white min-h-[400px] flex flex-col md:flex-row w-[95%] md:w-[90%] mx-auto gap-2 my-6 ">
            <div className="card-containers flex-[2] h-fit min-h-[200px]">
                <div className="border-b flex p-4 justify-between">
                    <p className="font-bold" role="button" onClick={() => {console.log('');}}>Filter</p>
                    <p className="text-red-500" role="button" onClick={() => {console.log('');}}>Clear All</p>
                </div>
                <div className="p-3 mx-auto flex flex-col gap-3">
                    <Select
                        options={[]}
                        label="Job"
                        placeholder="Select Role"
                        containerClass="flex-1"
                    />
                    <Select
                        options={[]}
                        label="Keywords"
                        placeholder="Select Keyword"
                        containerClass="flex-1"
                    />

                    <Select
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
                    />

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

                <h4 className="font-black text-xl text-gray-700">250 Job Results</h4>
                <div className="mt-10 mx-auto">
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={2}
                        sx={{ color: 'black' }}
                        className="font-bold text-3xl my-5">LATEST VIDEO CVs
                    </Typography>
                    <div className={`items-center grid gap-4`} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                        {videoCVs.map((video) => (
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