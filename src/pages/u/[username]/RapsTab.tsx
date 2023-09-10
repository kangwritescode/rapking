import { Rap } from '@prisma/client'
import React from 'react'
import RapCard from './RapCard';
import { Box } from '@mui/material';

interface RapsTabProps {
  raps?: Rap[] | null;
}

function RapsTab({ raps }: RapsTabProps) {

  return (
    <Box
      display='grid'
      gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']} gap={4}>
      {raps?.map((rap) => {
        return (
          <RapCard key={rap.id} rap={rap} />
        )
      })}
    </Box>
  )
}

export default RapsTab
