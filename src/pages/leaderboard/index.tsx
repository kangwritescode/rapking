import { Box, Stack, Theme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import LeaderboardBar from 'src/components/LeaderboardPage/LeaderboardBar';
import SpotlightCard from 'src/components/LeaderboardPage/SpotlightCard';
import {
  LeaderboardRegionFilter,
  LeaderboardSexFilter,
  LeaderboardTimeFilter
} from 'src/server/api/routers/leaderboard';
import LeaderboardCards from '../../components/LeaderboardPage/LeaderboardCards';

function LeaderboardPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [regionFilter, setRegionFilter] = useState<LeaderboardRegionFilter>('ALL');
  const [timeFilter, setTimeFilter] = useState<LeaderboardTimeFilter>('ALL_TIME');
  const [sexFilter, setSexFilter] = useState<LeaderboardSexFilter>('ANY');

  const isTablet = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const theme = useTheme();

  return (
    <Stack
      width={{
        xs: '100%',
        md: 'fit-content'
      }}
      height='100%'
      mx='auto'
      sx={{
        padding: theme.spacing(6),
        transition: 'padding .25s ease-in-out',
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(4),
          paddingRight: theme.spacing(4)
        }
      }}
    >
      <Typography component='h1' textAlign='left' fontSize='1.5rem' fontWeight={600} mb='1rem'>
        Leaderboard
      </Typography>
      <Stack direction='row' gap='1.5rem' height='100%' justifyContent='center' width='100%'>
        <Box
          sx={theme => ({
            p: {
              xs: 0,
              md: '1.4rem 1.6rem 2rem 2.2rem'
            },
            height: '100%',
            overflow: 'hidden',
            border: {
              xs: 'none',
              md: `1px solid ${theme.palette.grey[800]}`
            },
            borderRadius: '.5rem',
            position: 'relative'
          })}
          width={{
            xs: '100%',
            md: '40rem'
          }}
        >
          <LeaderboardBar
            sx={{
              mb: '1rem',
              position: 'relative',
              pr: '.7rem',
              justifyContent: {
                xs: 'flex-start',
                md: 'flex-end'
              }
            }}
            onSortAndFilterChange={({ regionFilter, timeFilter, sexFilter }) => {
              setRegionFilter(regionFilter);
              setTimeFilter(timeFilter);
              setSexFilter(sexFilter);
            }}
          />
          <LeaderboardCards
            selectedUserId={selectedUserId}
            userClickHandler={userId => {
              setSelectedUserId(userId);
            }}
            regionFilter={regionFilter}
            timeFilter={timeFilter}
            sexFilter={sexFilter}
          />
        </Box>
        {!isTablet ? <SpotlightCard userId={selectedUserId} /> : undefined}
      </Stack>
    </Stack>
  );
}

export default LeaderboardPage;

LeaderboardPage.contentHeightFixed = true;
