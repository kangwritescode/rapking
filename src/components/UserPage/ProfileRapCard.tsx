import { Icon } from '@iconify/react';
import { Box, CardMedia, IconButton, Paper, SxProps, useTheme } from '@mui/material'
import { Rap } from '@prisma/client'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react'
import { BUCKET_URL } from 'src/shared/constants';

interface ProfileRapCardProps {
  rap: Rap;
  sx?: SxProps;
  onClick?: () => void;
}

function ProfileRapCard({ rap, sx, onClick }: ProfileRapCardProps) {

  const theme = useTheme();
  const { data } = useSession();

  const { id, title, dateCreated, coverArtUrl, userId } = rap;
  const isCurrentUser = data?.user?.id === userId;

  return (
    <Paper
      sx={{
        position: 'relative',
        '&:hover': {
          cursor: 'pointer',
        },
        ...sx
      }}
      onClick={onClick}
    >
      <CardMedia
        component='img'
        alt='rap-cover-art'
        image={
          coverArtUrl ?
            `${BUCKET_URL}/${coverArtUrl}` :
            `${BUCKET_URL}/default/cover-art.jpg`
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
        {isCurrentUser && (
          <Link href={`/write/${id}`}>
            <IconButton
              sx={{ position: 'absolute', bottom: 0, right: 0 }}
              onClick={(e) => {
                e.stopPropagation();
              }}>
              <Icon fontSize={16} icon='ph:pencil' />
            </IconButton>
          </Link>
        )}
      </Box>
    </Paper>
  )
}

export default ProfileRapCard
