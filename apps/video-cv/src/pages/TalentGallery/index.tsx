import { useEffect, useState, useMemo } from "react"
import { Box, Stack, Typography } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-creative"
import "swiper/css/autoplay"
import { EffectCreative, Autoplay } from "swiper/modules"
import { Images } from "@video-cv/assets"
import { Button, DatePicker, Input, Select } from "@video-cv/ui-components"
import { VideoCard, Loader } from "../../components"
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import { useNavigate } from "react-router-dom"
import { getData } from "./../../../../../libs/utils/apis/apiMethods"
import { apiEndpoints } from "./../../../../../libs/utils/apis/apiEndpoints"
import CONFIG from "./../../../../../libs/utils/helpers/config"
import { Controller, useForm } from "react-hook-form"
import { useAllMisc } from "./../../../../../libs/hooks/useAllMisc"
import model from "./../../../../../libs/utils/helpers/model"
import dayjs from "dayjs"

interface Video {
  id: number
  title: string
  typeId: number
  type: string
  transcript: string
  description: string
  categoryId: number
  category: string | null
  userId: string
  dateCreated: string
  views: number
  videoUrl: string
  thumbnailUrl: string
  status: string
  totalRecords: number
  videoDescription: string;
  rejectionReason?: string;
  reasonForRejaction?: string;
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
    businessDetails: {
      userId: string;
      businessName: string;
      industry: string;
      address: string;
      websiteUrl: string;
      contactPhone: string;
      businessEmail: string;
      businessTypeId: string;
      contactName: string;
      contactPosition: string;
      fbLink: string;
      id: string;
      industryId: string;
      instagramUrl: string;
      isActive: boolean;
      twitter: string;
    }
    professionalDetails: {
      id: string;
      nyscStateCode: string;
      nyscStartYear: number;
      nyscEndYear: number;
      address: string;
      businessName: string;
      businessPhone: string;
      businessProfile: string;
      classOfDegree: string;
      course: string;
      courseId: number;
      coverLetter: string;
      dateCreated: string;
      degree: string;
      degreeClassId: number;
      degreeTypeId: number;
      industry: string;
      industryId: number;
      institution: string;
      institutionId: number;
    }
  }
  hasSubscription: boolean;
}

interface VideosProps {
  page?: number
  limit?: number
  Start_Date?: string
  endDate?: string
  title?: string
  authorName?: string
  status?: string
  category?: string
  categoryId?: number
  download?: boolean
  userType?: string
  userId?: string
  type?: "pinned" | "latest" | "category"
}

const heroImages = [Images.HeroImage10, Images.HeroImage11, Images.HeroImage13, Images.HeroImage14, Images.HeroImage15]

const VideoGallery: React.FC<VideosProps> = ({ page = 1, limit = 10, status = "Approved", download = false, type = "category", }) => {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(page)
  const [itemsPerPage, setItemsPerPage] = useState(limit)
  const [totalPages, setTotalPages] = useState(1);

  const [appliedFilters, setAppliedFilters] = useState({
    author: "",
    title: "",
    selectedCategoryId: null as number | null,
    selectedDate: null as Date | null
  });

  const [currentFilters, setCurrentFilters] = useState({
    author: "",
    title: "",
    selectedCategoryId: null as number | null,
    selectedDate: null as Date | null
  });

  // const [author, setAuthor] = useState("");
  // const [title, setTitle] = useState('');
  // const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const navigate = useNavigate()
  const { control } = useForm()

  const { data: videoCategories, isLoading: isLoadingCategories } = useAllMisc({
    resource: "video-category",
    download: true,
  })


  const fetchVideos = async () => {
    try {
      setLoading(true)

      const queryParams = new URLSearchParams({
        Page: currentPage.toString(),
        Limit: itemsPerPage.toString(),
        ...(appliedFilters.title && { title: appliedFilters.title }),
        ...(status && { Status: status }),
        ...(appliedFilters.author && { AuthorName: appliedFilters.author }),
        ...(appliedFilters.selectedCategoryId && { Category: appliedFilters.selectedCategoryId.toString() }),
        ...(appliedFilters.selectedDate && { Start_Date: dayjs(appliedFilters.selectedDate).format("YYYY-MM-DDTHH:mm:ss.SSSZ") }),
      })

      const response = await getData(`${CONFIG.BASE_URL}${apiEndpoints.ALL_VIDEO_LIST}?${queryParams}`)

      if (response.succeeded === true) {
        const videoData = response.data

        const pinned = videoData.filter((video: Video) => video.type === "Pinned")
        const regular = videoData.filter((video: Video) => video.type !== "Pinned")

        videoData.sort((a: Video, b: Video) => {
          if (a.type === "Pinned" && b.type !== "Pinned") return -1
          if (a.type !== "Pinned" && b.type === "Pinned") return 1
          return 0
        })

        setVideos([...pinned, ...regular])
        setTotalPages(Math.ceil(response.totalRecords / itemsPerPage))
      }
    } catch (error) {
      console.error("Error fetching videos:", error)
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    fetchVideos()
  }, [currentPage, itemsPerPage, appliedFilters])

  // const filteredVideos = useMemo(() => {
  //   return videos.filter((video) => {
  //     const matchesText = video.title.toLowerCase().includes(searchText.toLowerCase())
  //     const matchesAuthor = video.authorProfile.userDetails.fullName.toLowerCase().includes(searchText.toLowerCase())
  //     return matchesText || matchesAuthor
  //   })
  // }, [videos, searchText])

  const filteredVideos = videos;

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setAuthor(e.target.value)
    setCurrentFilters(prev => ({
      ...prev,
      author: e.target.value
    }));
    setIsFilterApplied(true)
    setCurrentPage(1)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setTitle(e.target.value);
    setCurrentFilters(prev => ({
      ...prev,
      title: e.target.value
    }));
    setIsFilterApplied(true);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: any) => {
    // setSelectedCategoryId(value?.id || null)
    setCurrentFilters(prev => ({
      ...prev,
      selectedCategoryId: value?.id || null
    }));
    setIsFilterApplied(true)
    setCurrentPage(1)
  };


  const handleFilter = () => {
    setAppliedFilters(currentFilters);
    setIsFilterApplied(true);
    setCurrentPage(1);
    // fetchVideos();
  };


  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // setSelectedDate(date);
      setCurrentFilters(prev => ({
        ...prev,
        selectedDate: date
      }));
    }
    setCurrentPage(1)
    setIsFilterApplied(true)
  };


  const handleClearFilters = () => {
    // setAuthor("");
    // setTitle("");
    // setSelectedCategoryId(null)
    setCurrentFilters({
      author: "",
      title: "",
      selectedCategoryId: null,
      selectedDate: null
    });
    setAppliedFilters({
      author: "",
      title: "",
      selectedCategoryId: null,
      selectedDate: null
    });
    setIsFilterApplied(false)
    setCurrentPage(1)
  };


  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages = [];
    const maxPagesToShow = 3;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };


  const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);


  // const pageNumbers = useMemo(() => {
  //   const pages = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     pages.push(i);
  //   }
  //   return pages;
  // }, [totalPages]);


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading && videos.length === 0) return <Loader />

  return (
    <Box>
      {/* Hero section */}
      <Box className="min-h-[500px] bg-[#F7FaFF] px-3 md:px-16 flex justify-center w-full items-start py-10 flex-col gap-3">
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 10, base: 30 }}
          width="100%"
        >
          <Box flex={2} width={["100%", "70%"]} className="flex flex-col gap-4">
            <Typography variant="h3" lineHeight="shorter" fontWeight="extrabold" fontSize={{ xs: "32px", md: "42px" }}>
              SHOWCASE YOUR SKILLS & QUALITIES!
            </Typography>
            <Typography variant="body1" fontSize="lg" color="gray.600">
              Let thousands of potential employers notice you via videoCV
            </Typography>
          </Box>
          <Box
            className="!rounded-lg"
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              alignSelf: "center",
              textAlign: "center",
              height: "600px",
            }}
            width="40%"
          >
            <Swiper
              grabCursor={false}
              loop={true}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              speed={3000}
              effect={"creative"}
              creativeEffect={{
                prev: { shadow: true, translate: ["-20%", 0, -1] },
                next: { translate: ["100%", 0, 0] },
              }}
              modules={[EffectCreative, Autoplay]}
              style={{
                width: "550px",
                alignItems: "center",
                justifyContent: "center",
                height: "479px",
                borderRadius: ".75rem",
              }}
            >
              {heroImages.map((image: any, index: any) => (
                <SwiperSlide key={index}>
                  <img
                    className="!rounded-lg"
                    src={image || "/placeholder.svg"}
                    alt={`Hero image ${index + 1}`}
                    style={{ objectFit: "contain", borderRadius: "lg" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Stack>
      </Box>

      {/* Video gallery section */}
      <Box className="bg-white min-h-[400px] flex flex-col lg:flex-row w-[95%] md:w-[90%] mx-auto gap-2 my-6 ">
        <div className="flex-[9] p-4">
          <div className="card-containers w-80 h-fit min-h-[200px] mb-5">
            <div className="border-b flex p-4 justify-between">
              <p className="font-bold" role="button">Filter</p>
              <p className="text-red-500" role="button" onClick={handleClearFilters}>Clear All</p>
            </div>
            <div className="p-3 mx-auto flex flex-col gap-3">
              <Input
                label="Keywords Search"
                placeholder="Search Videos"
                containerClass="flex-1"
                name="title"
                value={currentFilters.title}
                onChange={handleTitleChange}
              />

              <Input
                label="Author"
                placeholder="Search Professionals"
                containerClass="flex-1"
                value={currentFilters.author}
                onChange={handleAuthorChange}
              />

              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <Select
                    name="categories"
                    options={model(videoCategories, "name", "id")}
                    control={control}
                    placeholder="Select Categories"
                    defaultValue={ currentFilters.selectedCategoryId ? { id: currentFilters.selectedCategoryId, name: Array.isArray(videoCategories) && videoCategories.find((cat) => Number(cat.id) === currentFilters.selectedCategoryId)?.name, } : null }
                    handleChange={handleCategoryChange}
                    label='Categories'
                  />
                )}
              />

              <Controller
                name='dateCreated'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Date Posted"
                    value={currentFilters.selectedDate}
                    onChange={handleDateChange}
                  />
                )}
              />

              <Button variant="black" label={'Apply Filters'} onClick={handleFilter}></Button>
            </div>
          </div>
          <div>
            {filteredVideos.length > 0 ? (
              <h4 className="font-medium text-lg text-gray-700">{filteredVideos.length} Video CV Results</h4>
            ) : (
              <h4 className="font-medium text-lg text-gray-700">No results found</h4>
            )}
            <div className="mt-10 mx-auto">
              <Typography
                variant="h5"
                fontWeight="bold"
                mb={2}
                sx={{ color: "black" }}
                className="font-bold text-3xl my-5"
              >
                LATEST VIDEO CVs
              </Typography>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 justify-items-center md:justify-items-start`}
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
              >
                {filteredVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: "1.45rem" }} />} variant={currentPage === 1 ? 'custom' : 'black'} onClick={handlePrevPage} disabled={currentPage === 1}></Button>

                {pageNumbers.map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="text-sm text-gray-600">...</span>
                  ) :
                  (
                    <Button
                      key={`page-${page}-${index}`}
                      variant={currentPage === page ? 'black' : 'custom'}
                      label={page.toString()}
                      onClick={() => handlePageChange(page as number)}
                      className={currentPage === page ? 'active text-sm' : ''}
                    />
                  )
                ))}

                <Button icon={<NavigateNextIcon sx={{ fontSize: "1.45rem" }} />} variant={currentPage === totalPages ? 'custom' : 'black'} onClick={handleNextPage} disabled={currentPage === totalPages}></Button>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  )
}

export default VideoGallery