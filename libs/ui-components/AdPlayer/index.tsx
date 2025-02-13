import React from "react"
import { useState, useEffect } from "react"
import ReactPlayer from "react-player"
import { Box, Typography } from "@mui/material"
import Image from '@mui/material'
import { Button } from '@video-cv/ui-components';

interface AdPlayerProps {
  adUrl: string
  adDuration?: number
  adType: "video" | "image"
  onAdEnd: () => void
}

const AdPlayer: React.FC<AdPlayerProps> = ({ adUrl, adDuration, adType, onAdEnd }) => {
  const [timeLeft, setTimeLeft] = useState(adType === "video" ? 5 : 0)
  const [canSkip, setCanSkip] = useState(adType === "image")

  useEffect(() => {
    if (adType === "video") {
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer)
              setCanSkip(true)
              return 0
            }
            return prevTime - 1
          })
        }, 1000)
  
    return () => clearInterval(timer)
    }
}, [adType])

  const handleSkip = () => {
    if (canSkip) {
      onAdEnd()
    }
  }

  return (
    <Box position="relative">
      {adType === "video" ? (
        <ReactPlayer url={adUrl} width="100%" height="100%" playing controls={false} onEnded={onAdEnd} />
      ) : (
        <img src={adUrl || "/placeholder.svg"} alt="Advertisement" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      <Box
        position="absolute"
        bottom={16}
        right={16}
        bgcolor="rgba(0, 0, 0, 0.4)"
        color="white"
        paddingY={1}
        paddingX={3}
        borderRadius={5}
        className="cursor-pointer touch-action-manipulation"
        onClick={handleSkip}
      >
        {canSkip ? (
          <Button variant='none' type='button' label='Skip Ad' onClick={handleSkip} className="cursor-pointer touch-action-manipulation" style={{ touchAction: "manipulation" }}></Button>
        ) : (
          <Typography>Ad ends in {timeLeft} seconds</Typography>
        )}
      </Box>
    </Box>
  )
}

export default AdPlayer

