import { Box, SxProps } from '@mui/material'
import React from 'react'

interface UserLeaderboardGridStylesProps {
  sx?: SxProps
  children: React.ReactNode
}

function UserLeaderboardGridStyles({ sx, children }: UserLeaderboardGridStylesProps) {
  return (
    <Box sx={{
      '& .MuiDataGrid-columnHeaders': {
        background: 'rgba(0, 0, 0, 0.7)',
      },
      '& .user-leaderboard-header .MuiDataGrid-columnHeaderTitle': {
        fontFamily: 'Impact',
        fontSize: '1.2rem',
      },
      '& .user-leaderboard-points-header .MuiDataGrid-columnHeaderTitle': {
        fontFamily: 'PressStart2P',
        fontSize: '1rem',
      },
      '& .user-leaderboard-points-cell .MuiDataGrid-cellContent': {
        fontFamily: 'PressStart2P',
        fontSize: '1rem',
      },
      '& .MuiDataGrid-row:nth-child(odd)': {
        background: 'rgba(0, 0, 0, 0.5)',
      },
      '& .MuiDataGrid-row:nth-child(even)': {
        background: 'rgba(20, 12, 0, 0.623)',
      },
      '& .MuiDataGrid-footerContainer': {
        background: 'rgba(0, 0, 0, 0.7)',
        borderBottomLeftRadius: '0.5rem',
        borderBottomRightRadius: '0.5rem',
      },
      ...sx
    }}>
      {children}
    </Box>
  )
}

export default UserLeaderboardGridStyles
