import React from 'react'
import DataGridDemo from './DataGrid';
import { Box } from '@mui/material';
import { api } from 'src/utils/api';

function LeaderboardPage() {
  const { data } = api.leaderboard.getTopUsersByPoints.useQuery({ page: 0 }, { enabled: true })

  console.log(data);

  return (
    <Box
      sx={{
        width: '70%',
        margin: 'auto',
      }}
    >
      <DataGridDemo />
    </Box>
  )
}

export default LeaderboardPage;
