import { Box, Card, Stack, Typography, useTheme } from '@mui/material';
import { User } from '@prisma/client'
import React from 'react'

interface ProfileTabProps {
  userData?: User | null;
}

function ProfileTab({ userData }: ProfileTabProps) {
  const theme = useTheme();

  return (
    <Box
      display='grid'
      gridTemplateColumns={['1fr 1fr 1fr 1fr 1fr 1fr']}
      gap={4}
    >
      <Card
        sx={{
          p: theme.spacing(5),
          gridColumn: '1 / 3',
        }}>
        <Typography
          variant='body1'
          sx={{
            mb: theme.spacing(1),
            color: 'text.disabled',
          }}
        >
          Bio
        </Typography>
        <Typography
          variant='body1'
          color='text.secondary'
        >
          {userData?.bio || "Add a bio."}
        </Typography>
      </Card>
      <Card
        sx={{
          p: theme.spacing(5),
          gridRow: '2',
        }}>
        <Stack direction='row'>
          <Box pr={theme.spacing(4)}>
            <Typography variant='caption'>
              Followers
            </Typography>
            <Typography variant='h5'>
              {25}
            </Typography>
          </Box>
          <Box>
            <Typography variant='caption'>
              Following
            </Typography>
            <Typography variant='h5'>
              {523}
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Box >
  )
}

export default ProfileTab
