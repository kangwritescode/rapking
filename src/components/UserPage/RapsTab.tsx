import { Rap, User } from '@prisma/client'
import React from 'react'
import { Box } from '@mui/material';
import RapCard from '../RapCard';

interface RapsTabProps {
  raps?: (Rap & { user: User })[] | null;
}

function RapsTab({ raps }: RapsTabProps) {

  return (
    <Box py={6} px={2}>
      {raps?.map((rap) =>
        <RapCard key={rap.id} rap={rap} hideAvatar hideUsername showMenu />)}
    </Box>
  )
}

export default RapsTab
