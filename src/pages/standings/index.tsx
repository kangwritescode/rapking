import React from 'react'
import DataGridDemo from './DataGrid';
import { Box } from '@mui/material';

function StandingsPage() {
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

export default StandingsPage;
