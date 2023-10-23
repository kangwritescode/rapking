import { Box, CardMedia } from '@mui/material'
import React from 'react'

interface VideoBackgroundProps {
  videoSrc: string;
  imageSrc: string;
}

function VideoBackground({ videoSrc, imageSrc }: VideoBackgroundProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    >
      <Box sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(36, 24, 3, 0.664)',
        zIndex: -1,
      }} />
      <Box
        component='video'
        src={videoSrc}
        autoPlay={true}
        loop={true}
        playsInline={true}
        muted
        sx={{
          objectFit: 'cover',
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: -2,
        }}
      />
      <CardMedia
        src={imageSrc}
        component='img'
        sx={{
          objectFit: 'cover',
          position: 'absolute',
          height: '100%',
          width: '100%',
          zIndex: -3,
        }}
      />
    </Box >
  )
}

export default VideoBackground
