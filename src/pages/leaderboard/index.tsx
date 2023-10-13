import React from 'react'
import UserLeaderboard from './UserLeaderboard';
import { Box } from '@mui/material';
import VideoBackground from 'src/components/VideoBackground';

function LeaderboardPage() {

  return (
    <>
      <VideoBackground
        videoSrc='/videos/joey.webm'
        imageSrc='/images/joey.png'
      />
      <Box
        sx={{
          mx: 'auto',
          mt: '4rem',
          width: '630px',
        }}
      >
        <UserLeaderboard />
      </Box>
    </>
  )
}

export default LeaderboardPage;
