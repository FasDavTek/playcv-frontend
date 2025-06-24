import React from "react"
import { useState, useEffect, useRef } from "react"
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

const AdPlayer: React.FC<AdPlayerProps> = ({ adUrl, adDuration = 5, adType, onAdEnd }) => {
  const [timeLeft, setTimeLeft] = useState(adType === "video" ? adDuration : 4)
  const [canSkip, setCanSkip] = useState(adType === "image")
  const [isPlaying, setIsPlaying] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePlay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    setTimeLeft(adType === "video" ? adDuration : 4)
    setCanSkip(adType === "image")
    setIsPlaying(true)

    // // Clear any existing timers
    // if (imageTimerRef.current) {
    //   clearInterval(imageTimerRef.current)
    // }

    // Start timer for image ads
    if (adType === "image") {
      imageTimerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(imageTimerRef.current as NodeJS.Timeout)
            setCanSkip(true)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }

    if (adType === "video") {
      const videoElement = document.createElement("video");
      videoElement.preload = "auto";
      videoElement.src = adUrl;
      videoElement.load();
    } else {
      const img = new window.Image();
      img.src = adUrl;
    }

    // Cleanup function
    return () => {
      if (imageTimerRef.current) {
        clearInterval(imageTimerRef.current)
      }

      setTimeLeft(adType === "video" ? adDuration : 4)
      setCanSkip(adType === "image")
      setIsPlaying(true)
    }
}, [adUrl, adType, adDuration]);



useEffect(() => {
  if (adType === "video") {
    // Method 1: Start muted, then try to play
    const attemptPlay = async () => {
      try {
        if (playerRef.current) {
          // Set a small timeout to ensure the player is ready
          setTimeout(() => {
            setIsPlaying(true)
          }, 100)
        }
      } catch (error) {
        console.error("Autoplay failed:", error)
      }
    }

    attemptPlay()
  }
}, [adType])



const handleProgress = (state: { playedSeconds: number }) => {
  if (adType === "video") {
    const secondsPlayed = Math.floor(state.playedSeconds)
    const secondsRemaining = Math.max(0, adDuration - secondsPlayed)
    setTimeLeft(secondsRemaining)

    if (secondsPlayed >= adDuration - 1 && !canSkip) {
      setCanSkip(true)
    }
  }
}



const handleSkip = () => {
  if (canSkip) {
    if (imageTimerRef.current) {
      clearInterval(imageTimerRef.current)
    }
    onAdEnd()
  }
}

// Handle video errors
const handleError = (error: any) => {
  console.error("Ad player error:", error)
  // If there's an error, allow skipping and show error message
  setCanSkip(true)
  setTimeLeft(0)
}


  return (
    <Box position="relative" ref={containerRef}>
      {adType === "video" ? (
        <ReactPlayer key={adUrl} ref={playerRef} url={adUrl} width="100%" height="100%" playing={isPlaying} controls={false} onEnded={onAdEnd} onProgress={handleProgress} onError={handleError} onPause={() => setIsPlaying(false)} onPlay={() => setIsPlaying(true)} config={{ file: { attributes: { controlsList: "nodownload", disablePictureInPicture: true, preload: "auto", }, forceVideo: true, }, }} className="react-player" />
      ) : (
        <img key={adUrl} src={adUrl} alt="Advertisement" style={{ width: "100%", height: "100%", objectFit: "contain" }} onEnded={onAdEnd} className="react-player" />
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

