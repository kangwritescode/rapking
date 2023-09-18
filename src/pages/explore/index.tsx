import React from 'react'
import { api } from 'src/utils/api'
import { Stack } from '@mui/material';
import FeedRapCard from './FeedRapCard';

function ExplorePage() {
  const { data: raps } = api.rap.getAllRaps.useQuery();

  return (
    <Stack alignItems='center'>
      {raps?.map((rap) => {
        return (
          <FeedRapCard
            key={rap.id}
            rap={rap}
            sx={{
              width: [
                '100%',
                '90%',
                '80%'
              ],
              maxWidth: '45rem',
            }}
          />
        )
      })}
    </Stack>
  )
}

export default ExplorePage
