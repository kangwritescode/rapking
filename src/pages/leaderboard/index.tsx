import React from 'react'
import UserLeaderboard from './DataGrid';
import { Box } from '@mui/material';
import { api } from 'src/utils/api';

function LeaderboardPage() {
  const { data } = api.leaderboard.getTopUsersByPoints.useQuery({ page: 0 }, { enabled: true })

  const rows = data?.map(({ userData, points }) => ({
    id: userData?.id || '',
    username: userData?.username || '',
    location: userData?.city || '',
    region: userData?.region || 'EAST',
    sex: userData?.sex || '',
    points: points || 0,
  }));

  return (
    <Box
      sx={{
        margin: 'auto',
        width: '50%',
      }}
    >
      {rows ?
        <UserLeaderboard rows={rows} /> :
        <div>Loading...</div>}
    </Box>
  )
}

export default LeaderboardPage;
