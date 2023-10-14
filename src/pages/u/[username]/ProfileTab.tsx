import { Box, useTheme } from '@mui/material';
import { User } from '@prisma/client'
import React from 'react'
import BioCard from './BioCard/BioCard';

interface ProfileTabProps {
  userData?: User | null;
}

function ProfileTab({ userData }: ProfileTabProps) {
  const theme = useTheme();

  return (
    <Box
      display='grid'
      gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']}
      gap={4}
      position="relative"
    >
      <BioCard
        userData={userData}
        sx={{
          p: theme.spacing(5),
          gridColumn: [
            '1 / 1',
            '1 / 2',
            '1 / 2',
          ],
        }} />
    </Box >
  )
}

export default ProfileTab
