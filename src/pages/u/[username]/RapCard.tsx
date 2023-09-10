import { Icon } from '@iconify/react';
import { Box, CardMedia, IconButton, Paper, SxProps, useTheme } from '@mui/material'
import { Rap } from '@prisma/client'
import { useRouter } from 'next/router';
import React from 'react'
import { CDN_URL } from 'src/shared/constants';

function RapCard({ rap, sx }: { rap: Rap, sx?: SxProps }) {

  const theme = useTheme();
  const router = useRouter();

  const { id, title, dateCreated, coverArtUrl } = rap;

  return (
    <Paper
      sx={{
        position: 'relative',
        '&:hover': {
          cursor: 'pointer',
        },
        ...sx
      }}
      key={id}>
      <CardMedia
        component='img'
        alt='rap-cover-art'
        image={
          coverArtUrl ?
            `${CDN_URL}/${coverArtUrl}` :
            `${CDN_URL}/default/cover-art.jpg`
        }
        sx={{
          height: 100,
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}
      />
      <Box p={4}>
        <Box fontSize='12pt' fontWeight='bold'>{title}</Box>
        <Box fontSize='10pt' color={theme.palette.grey[500]}>{dateCreated.toLocaleDateString()}</Box>
        <IconButton sx={{ position: 'absolute', bottom: 0, right: 0 }} onClick={() => router.push(`/write/${id}`)}>
          <Icon fontSize={16} icon='ph:pencil' />
        </IconButton>
      </Box>
    </Paper>
  )
}

export default RapCard
