import React from 'react'
import { api } from 'src/utils/api'
import { Stack } from '@mui/material';
import FeedRapCard from './FeedRapCard';
import FeedBar from './FeedBar';
import { RegionFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';

function ExplorePage() {

  const [sortByValue, setSortByValue] = React.useState<SortByValue>('NEWEST');
  const [regionFilter, setRegionFilter] = React.useState<RegionFilter>('ALL');
  const [timeFilter, setTimeFilter] = React.useState<TimeFilter>('ALL');

  const { data: raps } = api.rap.queryRaps.useQuery({
    sortBy: sortByValue,
    regionFilter,
    timeFilter
  });

  return (
    <Stack
      alignItems='center'
      sx={{
        width: [
          '100%',
          '90%',
          '80%'
        ],
        maxWidth: '45rem',
        margin: 'auto'
      }}>
      <FeedBar
        sx={{ mb: '1rem' }}
        onSortAndFilterChange={({
          sortBy,
          regionFilter,
          timeFilter
        }) => {
          setSortByValue(sortBy);
          setRegionFilter(regionFilter);
          setTimeFilter(timeFilter);
        }
        }
      />
      {raps?.map((rap) => {
        return (
          <FeedRapCard
            key={rap.id}
            rap={rap}
          />
        )
      })}
    </Stack>
  )
}

export default ExplorePage
