import React from 'react'
import UserLeaderboard from './UserLeaderboard';
import { Box } from '@mui/material';

function LeaderboardPage() {

  return (
    <Box
      sx={{
        margin: 'auto',
        width: '50%',
      }}
    >
        <UserLeaderboard />
    </Box>
  )
}

export default LeaderboardPage;
