import { Rap, User } from '@prisma/client'
import React from 'react'
import { Box } from '@mui/material';
import Link from 'next/link';
import RapCard from '../RapCard';

interface RapsTabProps {
  raps?: (Rap & { user: User })[] | null;
}

function RapsTab({ raps }: RapsTabProps) {

  return (
    <Box py={6} px={2}>
      {raps?.map((rap) => {
        return (
          <Link
            href={`/rap/${rap.id}`}
            key={rap.id}
            style={{ textDecoration: 'none' }}
          >
            <RapCard rap={rap} hideAvatar hideUsername />
          </Link>
        )
      })}
    </Box>
  )
}

export default RapsTab
