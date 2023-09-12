import { Rap } from '@prisma/client'
import React from 'react'
import RapCard from './RapCard';
import { Box } from '@mui/material';
import Link from 'next/link';

interface RapsTabProps {
  raps?: Rap[] | null;
}

function RapsTab({ raps }: RapsTabProps) {

  return (
    <Box
      display='grid'
      gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']}
      gap={4}
    >
      {raps?.map((rap) => {
        return (
          <Link
            href={`/rap/${rap.id}`}
            key={rap.id}
            style={{ textDecoration: 'none' }}
          >
            <RapCard
              key={rap.id}
              rap={rap}
              sx={{
                cursor: 'pointer',
                height: '100%',
              }}
            />
          </Link>
        )
      })}
    </Box>
  )
}

export default RapsTab
