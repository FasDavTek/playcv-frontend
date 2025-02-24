import { useEffect, useState, useMemo } from "react"
import { Box, Stack, Typography } from "@mui/material"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-creative"
import "swiper/css/autoplay"
import { EffectCreative, Autoplay } from "swiper/modules"
import { Images } from "@video-cv/assets"
import { Button, Input, Select } from "@video-cv/ui-components"
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
      userId: string
      firstName: string
      middleName: string
      lastName: string
      phoneNo: string
      dateOfBirth: string
      gender: string
      type: string
      isActive: boolean
      phoneVerification: boolean
      isBusinessUser: boolean
      isProfessionalUser: boolean
      isAdmin: boolean
      isEmailVerified: boolean
      isDeleted: boolean
      createdAt: string
      updatedAt: string
      lastLoginDate: string
      genderId: number
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

interface VideosProps {
  page?: number
  limit?: number
  startDate?: string
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
  const [totalPages, setTotalPages] = useState(1)
  const [searchText, setSearchText] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  const navigate = useNavigate()
  const { control } = useForm()

  const { data: videoCategories, isLoading: isLoadingCategories } = useAllMisc({
    resource: "video-category",
    download: true,
  })

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)

        const queryParams = new URLSearchParams({
          Page: currentPage.toString(),
          Limit: itemsPerPage.toString(),
          ...(status && { Status: status }),
          ...(selectedCategoryId && { Category: selectedCategoryId.toString() }),
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
    }

    fetchVideos()
  }, [currentPage, itemsPerPage, selectedCategoryId, status])

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesText = video.title.toLowerCase().includes(searchText.toLowerCase())
      const matchesAuthor = video.authorProfile.userDetails.fullName.toLowerCase().includes(searchText.toLowerCase())
      return matchesText || matchesAuthor
    })
  }, [videos, searchText])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    setIsFilterApplied(true)
    setCurrentPage(1)
  }

  const handleCategoryChange = (value: any) => {
    setSelectedCategoryId(value?.id || null)
    setIsFilterApplied(true)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchText("")
    setSelectedCategoryId(null)
    setIsFilterApplied(false)
    setCurrentPage(1)
  }

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
              <p className="font-bold" role="button">
                Filter
              </p>
              <p className="text-red-500" role="button" onClick={handleClearFilters}>
                Clear All
              </p>
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
                    options={model(videoCategories, "name", "id")}
                    control={control}
                    placeholder="Select Categories"
                    defaultValue={ selectedCategoryId ? { id: selectedCategoryId, name: Array.isArray(videoCategories) && videoCategories.find((cat) => Number(cat.id) === selectedCategoryId)?.name, } : null }
                    handleChange={handleCategoryChange}
                  />
                )}
              />
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
                <span className="text-sm text-gray-600 mr-10">
                  Page {currentPage} of {totalPages}
                </span>
                <Button icon={<ChevronLeftOutlinedIcon sx={{ fontSize: "1rem" }} />} variant="neutral" onClick={handlePrevPage} disabled={currentPage === 1}></Button>
                <Button icon={<NavigateNextIcon sx={{ fontSize: "1rem" }} />} variant="neutral" onClick={handleNextPage} disabled={currentPage === totalPages}></Button>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  )
}

export default VideoGallery