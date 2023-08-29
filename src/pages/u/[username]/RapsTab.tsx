import { Flex } from '@mantine/core';
import { Box } from '@mui/material';
import { Rap } from '@prisma/client'
import React from 'react'
import RapCard from './RapCard';

interface RapsTabProps {
  raps?: Rap[] | null;
}

function RapsTab({ raps }: RapsTabProps) {

  if (!raps) {
    return <></>
  }

  return (
    <Box width='100%'>
      <Flex wrap='wrap' direction='row'>
        {raps.map((rap) => {
          return (
            <RapCard key={rap.id} rap={rap} />
          )
        })}
      </Flex>
    </Box>
  )
}

export default RapsTab
