import { Box, Paper, useTheme } from '@mui/material'
import { Rap } from '@prisma/client'
import React from 'react'

function RapCard({ rap }: { rap: Rap }) {

  const theme = useTheme();

  return (
    <Paper
      sx={{
        padding: '1rem',
        marginRight: '1rem',
        minWidth: '10rem',
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: theme.palette.grey[800]
        }
      }}
      key={rap.id}>
      <Box fontSize='16pt' fontWeight='bold'>{rap.title}</Box>
      <Box color={theme.palette.grey[500]}>{rap.dateCreated.toLocaleDateString()}</Box>
    </Paper>
  )
}

export default RapCard
