import { Box, CircularProgress, Divider, Stack } from '@mui/material';
import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { CountryFilter, SexFilter, SortByValue, TimeFilter } from 'src/server/api/routers/rap';
import { api } from 'src/utils/api';
import RapCard from '../RapCard';
import VirtuosoStyles from '../VirtuosoStyles';

interface FeedProps {
  sortBy: SortByValue;
  countryFilter: CountryFilter;
  timeFilter: TimeFilter;
  followingFilter: boolean;
  sexFilter: SexFilter;
}

const PAGE_SIZE = 10;

function Feed({ sortBy, countryFilter, timeFilter, followingFilter, sexFilter }: FeedProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading: rapsAreLoading
  } = api.feed.queryRaps.useInfiniteQuery(
    {
      sortBy,
      countryFilter,
      timeFilter,
      followingFilter,
      sexFilter,
      limit: PAGE_SIZE
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      refetchOnReconnect: false
    }
  );

  const rapData = data?.pages.flatMap(page => page.raps) ?? [];

  useEffect(() => {
    refetch();
  }, [sortBy, countryFilter, timeFilter, followingFilter, sexFilter, refetch]);

  return (
    <VirtuosoStyles
      sx={{
        pl: {
          xs: 4,
          sm: 0
        }
      }}
    >
      <Virtuoso
        style={{
          width: '100%'
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
          <Box
            sx={{
              width: ['100%', '90%', '80%'],
              maxWidth: '56rem',
              mx: 'auto'
            }}
          >
            <RapCard
              key={rap.id}
              rap={rap}
              showChips
              sx={{
                mt: 7,
                mb: 9,
                pr: {
                  xs: 4,
                  sm: 0
                }
              }}
            />
            <Divider />
          </Box>
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
            Footer: () => (
              <Stack alignItems='center' justifyContent='center' height='5rem'>
                <CircularProgress color='inherit' size={20} />
              </Stack>
            )
          })
        }}
      />
    </VirtuosoStyles>
  );
}

export default Feed;
