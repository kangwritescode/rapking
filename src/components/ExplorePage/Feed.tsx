import React, { useEffect } from 'react'
import { RegionFilter, SexFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';
import { api } from 'src/utils/api';
import RapCard from '../RapCard';
import { CircularProgress, Divider, Stack } from '@mui/material';
import { Virtuoso } from 'react-virtuoso';

interface FeedProps {
  sortBy: SortByValue
  regionFilter: RegionFilter
  timeFilter: TimeFilter
  followingFilter: boolean
  sexFilter: SexFilter
}

const PAGE_SIZE = 10;

function Feed({
  sortBy,
  regionFilter,
  timeFilter,
  followingFilter,
  sexFilter
}: FeedProps) {

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading: rapsAreLoading,
  } = api.feed.queryRaps.useInfiniteQuery({
    sortBy,
    regionFilter,
    timeFilter,
    followingFilter,
    sexFilter,
    limit: PAGE_SIZE
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    refetchOnReconnect: false,
  });

  const rapData = data?.pages.flatMap(page => page.raps) ?? [];

  useEffect(() => {
    refetch();
  }, [sortBy, regionFilter, timeFilter, followingFilter, sexFilter, refetch])


  return (
    <Virtuoso
      style={{
        width: '100%',
      }}
      data={rapData}
      totalCount={rapData.length}
      endReached={() => {
        if (hasNextPage) {
          fetchNextPage();
        }
      }}
      overscan={400}
      width='100%'
      itemContent={(_, rap) => (
        <>
          <RapCard
            key={rap.id}
            rap={rap}
            sx={{ mt: 7, mb: 9 }}
          />
          <Divider />
        </>
      )}
      components={{
        ...(rapsAreLoading && {
          Header: () => (
            <Stack alignItems='center' justifyContent='center' height='5rem'>
              <CircularProgress color='inherit' size={20} />
            </Stack>
          )
        }),
        ...(hasNextPage && {
          Footer: () => (<Stack alignItems='center' justifyContent='center' height='5rem'>
            <CircularProgress color='inherit' size={20} />
          </Stack>
          )
        })
      }}
    />
  )
}

export default Feed;
