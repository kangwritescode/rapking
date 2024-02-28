import { Box, CircularProgress, Stack, SxProps } from '@mui/material';
import { useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import {
  LeaderboardCountryFilter,
  LeaderboardSexFilter,
  LeaderboardTimeFilter
} from 'src/server/api/routers/leaderboard';
import { api } from 'src/utils/api';
import LeaderboardUserCard from './LeaderboardUserCard';

const PAGE_SIZE = 10;

interface LeaderboardCardsProps {
  userClickHandler?: (userId: string) => void;
  selectedUserId: string | null;
  countryFilter: LeaderboardCountryFilter;
  timeFilter: LeaderboardTimeFilter;
  sexFilter: LeaderboardSexFilter;
  sx?: SxProps;
}

export default function LeaderboardCards({
  userClickHandler,
  selectedUserId,
  countryFilter,
  timeFilter,
  sexFilter,
  sx
}: LeaderboardCardsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isLoading: usersAreLoading
  } = api.leaderboard.getTopUsersByPoints.useInfiniteQuery(
    {
      countryFilter,
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
  }, [countryFilter, timeFilter, sexFilter, refetch]);

  return (
    <Box
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
        },
        ...sx
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
                mt: '.2rem',
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
