import { Box, CircularProgress, Stack } from '@mui/material';
import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import {
  LeaderboardRegionFilter,
  LeaderboardSexFilter,
  LeaderboardTimeFilter
} from 'src/server/api/routers/leaderboard';
import { api } from 'src/utils/api';
import LeaderboardUserCard from './LeaderboardUserCard';

const PAGE_SIZE = 10;

interface LeaderboardCardsProps {
  userClickHandler?: (userId: string) => void;
  selectedUserId: string | null;
  regionFilter: LeaderboardRegionFilter;
  timeFilter: LeaderboardTimeFilter;
  sexFilter: LeaderboardSexFilter;
}

export default function LeaderboardCards({
  userClickHandler,
  selectedUserId,
  regionFilter,
  timeFilter,
  sexFilter
}: LeaderboardCardsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading: usersAreLoading
  } = api.leaderboard.getTopUsersByPoints.useInfiniteQuery(
    {
      regionFilter,
      timeFilter,
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

  const usersData = data?.pages.flatMap(page => page.users) ?? [];

  useEffect(() => {
    refetch();
  }, [regionFilter, timeFilter, sexFilter, refetch]);

  return (
    <Box
      height='100%'
      sx={{
        "& div[data-test-id='virtuoso-scroller']": {
          // Set the width of the scrollbar
          '&::-webkit-scrollbar': {
            width: '.4rem',
            position: 'relative'
          },

          // Style the scrollbar track (the part the thumb scrolls within)
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'grey',
            borderRadius: '1rem'
          },

          // Style the scrollbar thumb (the part you drag)
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'darkgrey',
            borderRadius: '1rem'
          },

          // Firefox scrollbar styles
          scrollbarWidth: 'thin',
          scrollbarColor: 'darkgrey grey'
        }
      }}
    >
      <Virtuoso
        data={usersData}
        totalCount={usersData.length}
        endReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        overscan={200}
        width='100%'
        itemContent={(index, u) => {
          const place = index + 1;

          return (
            <LeaderboardUserCard
              key={u.id}
              selected={u.id === selectedUserId}
              userData={u}
              userClickHandler={userClickHandler}
              place={place}
              sx={{
                mb: '.74rem',
                width: 'calc(100% - .8rem)',
                mr: 'auto',
                mt: '.1rem',
                ml: '.2rem'
              }}
            />
          );
        }}
        components={{
          ...(usersAreLoading && {
            Header: () => (
              <Stack alignItems='center' justifyContent='center' height='5rem'>
                <CircularProgress color='inherit' size={20} />
              </Stack>
            )
          }),
          Footer: () => (
            <Stack
              alignItems='center'
              justifyContent='center'
              height={hasNextPage ? '5rem' : '1.75rem'}
            >
              {hasNextPage && <CircularProgress color='inherit' size={20} />}
            </Stack>
          )
        }}
      />
    </Box>
  );
}
