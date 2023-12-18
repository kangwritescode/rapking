import { Box, Stack, Typography } from '@mui/material';
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

  return (
    <Stack alignItems='center' height='100%' width='100%' mx='auto'>
      <Typography
        component='h1'
        width='61.5rem'
        textAlign='left'
        fontSize='1.5rem'
        fontWeight={600}
        mb='1rem'
      >
        Leaderboard
      </Typography>
      <Stack direction='row' gap='1.5rem' height='100%'>
        <Box
          sx={theme => ({
            p: '2.5rem 2rem 2rem 2rem',
            height: 'calc(100vh - 9em)',
            overflow: 'hidden',
            border: `1px solid ${theme.palette.grey[800]}`,
            borderRadius: '1rem',
            position: 'relative'
          })}
          width='42rem'
        >
          <LeaderboardBar
            sx={{ mb: '1rem', position: 'relative' }}
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
        <SpotlightCard userId={selectedUserId} />
      </Stack>
    </Stack>
  );
}

export default LeaderboardPage;

LeaderboardPage.contentHeightFixed = true;
