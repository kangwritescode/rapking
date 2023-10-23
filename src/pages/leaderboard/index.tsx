import React from 'react'
import UserLeaderboard from '../../components/LeaderboardPage/UserLeaderboard';
import { Box } from '@mui/material';
import VideoBackground from 'src/components/UI/VideoBackground';

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
        }}
        width={['100%', '630px']}
      >
        <UserLeaderboard />
      </Box>
    </>
  )
}

export default LeaderboardPage;
